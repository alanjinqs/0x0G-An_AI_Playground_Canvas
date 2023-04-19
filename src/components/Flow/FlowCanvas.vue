<script setup lang="ts">
import {
  useVueFlow,
  VueFlow,
  type Connection,
  type Edge,
  type EdgeMouseEvent,
  type EdgeUpdateEvent
} from "@vue-flow/core"
import { Background } from "@vue-flow/background"
import { useFlowStore } from "@/stores/flow"
import LLMNode from "./LLMNode.vue"
import VectorDBNode from "./VectorDBNode.vue"
import ConcatStringNode from "./ConcatStringNode.vue"
import { v4 as uuidv4 } from "uuid"
import fileDownload from "js-file-download"
import GlobalEnvironmentNode from "./GlobalEnvironmentNode.vue"
import { isDag } from "@/utils/graph"
import { ref } from "vue"
import CustomOutNode from "./CustomOutNode.vue"
import CustomInNode from "./CustomInNode.vue"
import HTTPNode from "./HTTPNode.vue"

import * as htmlToImage from "html-to-image"
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image"

const flowStore = useFlowStore()
const {
  updateEdge,
  addEdges,
  addNodes,
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  zoomOnScroll,
  zoomOnDoubleClick,
  zoomOnPinch,
  panOnScroll,
  panOnDrag,
  getTransform,
  fitView
} = useVueFlow()

const emits = defineEmits(["hideFlow"])

const freeze = () => {
  nodesDraggable.value = false
  nodesConnectable.value = false
  zoomOnScroll.value = false
  zoomOnDoubleClick.value = false
  zoomOnPinch.value = false
  panOnDrag.value = false
}

const defreeze = () => {
  nodesDraggable.value = true
  nodesConnectable.value = true
  zoomOnScroll.value = true
  zoomOnDoubleClick.value = true
  zoomOnPinch.value = true
  panOnDrag.value = true
}

const isShowingDagAlert = ref(false)

const detectDag = () => {
  isShowingDagAlert.value = !isDag(flowStore.adjacentList)
}

const onEdgeUpdate = ({ edge, connection }: EdgeUpdateEvent) => {
  return updateEdge(edge, connection)
}

const onConnect = (params: Connection) => {
  if (params.source == params.target) return
  setTimeout(() => {
    isShowingDagAlert.value = !isDag(flowStore.adjacentList)
  }, 100)
  return addEdges([params])
}

const addCustomNodes = (type: string) => {
  addNodes([
    {
      id: `${type}-${uuidv4()}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type
    }
  ])
}

const canvas = ref<HTMLElement>()

const exportJson = () => {
  fileDownload(flowStore.exportAsJSON(), "flow.json")
}

const exportImage = () => {
  fitView()
  setTimeout(() => {
    if (canvas.value) {
      htmlToImage.toJpeg(canvas.value).then(function (dataUrl) {
        var link = document.createElement("a")
        link.download = "0x0g-export.jpeg"
        link.href = dataUrl
        link.click()
      })
    }
  }, 1000)
}

const uploadFile = (event: any) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = (e: any) => {
    flowStore.importFromJSON(e.target.result)
  }
  reader.readAsText(file)
  setTimeout(() => {
    isShowingDagAlert.value = !isDag(flowStore.adjacentList)
    fitView({ padding: 0.1 })
    console.log("FIT VIEW")
  }, 200)
}
</script>
<template>
  <div class="w-full relative">
    <div class=" absolute bottom-4 left-4 z-40">
      <div
        class="alert alert-error shadow-lg"
        v-if="isShowingDagAlert"
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: The graph is not a DAG!</span>
        </div>
        <div className="flex-none">
          <button @click="detectDag" className="btn btn-sm btn-ghost">Retry</button>
        </div>
      </div>
      <div v-else>
        <button class="btn m-1 btn-sm text-xs" @click="emits('hideFlow')">Hide canvas</button>

      </div>
    </div>
    <div class="dropdown absolute top-4 left-4 z-40">
      <label tabindex="0" class="btn m-1">Add Node</label>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-neutral rounded-box w-64">
        <li><a @click="addCustomNodes('llm')">LLM</a></li>
        <li><a @click="addCustomNodes('vector-db')">Vector DB & Embedder</a></li>
        <li><a @click="addCustomNodes('concat')">String</a></li>
        <li><a @click="addCustomNodes('custom-out')">Output</a></li>
        <li><a @click="addCustomNodes('http')">HTTP(s)</a></li>
      </ul>
    </div>
    <div class="dropdown dropdown-end absolute top-4 right-4 z-40">
      <label tabindex="0" class="btn m-1">Export/Import</label>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-neutral rounded-box w-72">
        <li><a @click="exportJson">Save JSON</a></li>
        <li><a @click="exportImage">Download Canvas as Image</a></li>
        <li>
          <input
            type="file"
            class="h-14 file-input w-full max-w-xs file-input-sm"
            @change="uploadFile"
          />
        </li>
      </ul>
    </div>
    <div
      v-if="!nodesDraggable"
      class="tooltip absolute bottom-4 right-4 z-40"
      data-tip="The graph will freeze when you focus on any input. Click anywhere to de-focus"
    >
      <button>
        <img src="@/assets/icon/freeze.svg" class="h-6 w-6 invert" />
      </button>
    </div>
    <div ref="canvas">
      <VueFlow
        v-model="flowStore.elements"
        :min-zoom="0.1"
        class="h-screen bg-base-100"
        fit-view-on-init
        @edge-update="onEdgeUpdate"
        @connect="onConnect"
      >
        <Background />

        <template #node-vector-db="data">
          <VectorDBNode
            :data="data"
            :status="flowStore.currentProcess[data.id]"
            @freeze="freeze"
            @defreeze="defreeze"
          />
        </template>
        <template #node-llm="data">
          <LLMNode
            :data="data"
            :status="flowStore.currentProcess[data.id]"
            @freeze="freeze"
            @defreeze="defreeze"
          />
        </template>
        <template #node-concat="data">
          <ConcatStringNode
            :data="data"
            :status="flowStore.currentProcess[data.id]"
            @freeze="freeze"
            @defreeze="defreeze"
          />
        </template>
        <template #node-environment="data">
          <GlobalEnvironmentNode
            :data="data"
            :status="flowStore.currentProcess[data.id]"
            @freeze="freeze"
            @defreeze="defreeze"
          />
        </template>
        <template #node-custom-in="data">
          <CustomInNode :data="data" :status="flowStore.currentProcess[data.id]" />
        </template>
        <template #node-custom-out="data">
          <CustomOutNode
            :data="data"
            :status="flowStore.currentProcess[data.id]"
            @freeze="freeze"
            @defreeze="defreeze"
          />
        </template>
        <template #node-http="data">
          <HTTPNode
            :data="data"
            :status="flowStore.currentProcess[data.id]"
            @freeze="freeze"
            @defreeze="defreeze"
          />
        </template>
      </VueFlow>
    </div>
  </div>
</template>
