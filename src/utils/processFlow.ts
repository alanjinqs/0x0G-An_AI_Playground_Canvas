import { useFlowStore } from "@/stores/flow"
import { isNode } from "@vue-flow/core"
import { isDag, topologySort } from "./graph"
import axios from "axios"

export const processFlow = async (
  questionIn: string,
  outputFunc: (label: string, content: string) => void
) => {
  const flowStore = useFlowStore()

  flowStore.currentProcess = {}
  if (!isDag(flowStore.adjacentList)) {
    throw new Error("Flow is not a DAG")
  }
  const { elements } = flowStore
  const runningSequence = topologySort(flowStore.adjacentList)

  const runningSequenceElements = runningSequence.map((id) => {
    return elements.find((element) => {
      return element.id === id
    })
  })

  const resultForEachStep: Map<string, string> = new Map()

  const environment = (flowStore.getNodeById("environment") as any).data

  for (const element of runningSequenceElements) {
    if (!element || !isNode(element) || element.type == "environment") continue
    const node = element as any //TODO: fix this
    console.log(node)
    flowStore.currentProcess[node.id] = "running"
    switch (element.type) {
      case "custom-in":
        resultForEachStep.set(element.id, questionIn)
        break
      case "custom-out":
        const edge: any = flowStore.getEdgesByTargetId(element.id)[0]
        console.log(`[OUTPUT] ${node.data.label} ${resultForEachStep.get(edge.source)}`)
        outputFunc(node.data.label, resultForEachStep.get(edge.source) || "")
        break
      case "concat":
        const edges: any[] = flowStore.getEdgesByTargetId(element.id)
        let res = node.data.stringTemplate
        for (const edge of edges) {
          const sourceValue = resultForEachStep.get(edge.source)
          const handelId = edge.targetHandle.split("-").pop()
          res = res.replace(`{{${handelId}}}`, sourceValue)
        }
        resultForEachStep.set(element.id, res)
        break
      case "llm":
        const llmInEdges: any[] = flowStore.getEdgesByTargetId(node.id)
        const systemMessage = resultForEachStep.get(
          llmInEdges.find((edge) => {
            return edge.targetHandle === "llm-system"
          }).source
        )
        const promptMessage = resultForEachStep.get(
          llmInEdges.find((edge) => {
            return edge.targetHandle === "llm-prompt"
          }).source
        )
        resultForEachStep.set(
          element.id,
          await processLLM(
            environment.openAIUrl,
            environment.openAIApiKey,
            node.data.model,
            systemMessage || "",
            promptMessage || ""
          )
        )
        break

      case "vector-db":
        const vectorDbInEdge: any = flowStore.getEdgesByTargetId(element.id)[0]
        const vectorDbIn = resultForEachStep.get(vectorDbInEdge.source)
        const collectionName = node.data.collectionName
        const joinBy = node.data.joinBy
        const numberOfResults = node.data.numberOfResults
        const vectorDbUrl =  node.data.vectorDbUrl
        const vectorDbRes = await axios.post(vectorDbUrl, {
          apiKey: environment.openAIApiKey,
          text: vectorDbIn,
          collectionName,
          joinBy,
          numberOfResults
        })
        resultForEachStep.set(element.id, vectorDbRes.data)
        break
    }
    flowStore.currentProcess[node.id] = "finished"
  }
}

const processLLM = async (
  url: string,
  apiKey: string,
  model: string,
  systemMessage: string,
  promptMessage: string
) => {
  const llmUrl = `${url}/v1/chat/completions`
  const llmRes = await axios.post(
    llmUrl,
    {
      model,
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: promptMessage
        }
      ]
    },
    {
      timeout: 100000000,
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  )
  return llmRes.data.choices[0].message.content
}
