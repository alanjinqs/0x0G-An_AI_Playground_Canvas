import { defineStore } from "pinia"
import { isNode, isEdge } from "@vue-flow/core"

export const useFlowStore = defineStore("flowStore", {
  state() {
    return {
      elements: [
        {
          id: "input",
          deletable: false,
          type: "custom-in",
          label: "Input Question",
          position: { x: 250, y: 5 }
        },

        { id: "print", type: "custom-out", label: "Output", position: { x: 600, y: 500 } },
        {
          id: "environment",
          deletable: false,
          type: "environment",
          label: "environment",
          data: { openAIUrl: "https://api.openai.com" },
          position: { x: 600, y: 0 }
        }
      ],
      currentProcess: {} as Record<string, string>
    }
  },
  actions: {
    getNodeById(id: string) {
      const { elements } = this
      return elements.find((element) => {
        return isNode(element) && element.id === id
      })
    },
    getEdgesByTargetId(id: string) {
      const { elements } = this
      return elements.filter((element) => {
        return isEdge(element) && element.target === id
      })
    },
    getEdgesBySourceId(id: string) {
      const { elements } = this
      return elements.filter((element) => {
        return isEdge(element) && element.source === id
      })
    },
    exportAsJSON() {
      const { elements } = this
      return JSON.stringify(elements, null, 2)
    },
    importFromJSON(json: string) {
      this.elements = []
      setTimeout(() => {
        this.elements = JSON.parse(json)
      }, 100)
    }
  },
  getters: {
    adjacentList() {
      const { elements } = this
      const adjacentList = new Map<string, string[]>()
      elements.forEach((element) => {
        if (isNode(element)) {
          //find all the nodes that are connected to this node
          const connectedNodes = elements
            .filter((e) => {
              if (isEdge(e)) {
                return e.source === element.id
              }
              return false
            })
            .map((e) => {
              if (isEdge(e)) {
                return e.target
              }
              return ""
            })
          //add the connected nodes to the adjacent list
          adjacentList.set(element.id, connectedNodes)
        }
      })
      return adjacentList
    }
  }
})
