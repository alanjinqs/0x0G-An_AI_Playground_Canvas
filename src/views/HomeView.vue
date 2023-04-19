<script setup lang="ts">
import ChatCanvas from "@/components/Chat/ChatCanvas.vue";
import FlowCanvas from "@/components/Flow/FlowCanvas.vue"
import { useFlowStore } from "@/stores/flow"
import { ref } from "vue";
import VueJsonPretty from "vue-json-pretty"
import "vue-json-pretty/lib/styles.css"
const flowStore = useFlowStore()

const isShowingFlow = ref(true)
</script>

<template>
  <div class="flex">
    <div class="w-1/2 h-screen" v-if="isShowingFlow">
      <FlowCanvas @hide-flow="isShowingFlow = false" />
    </div>
    <div :class="[isShowingFlow ? 'w-1/2' : 'w-screen', 'h-screen overflow-y-auto']">
      <div v-if="!isShowingFlow"><button class="absolute btn btn-sm text-xs top-4 left-2 btn-link text-gray-200" @click="isShowingFlow = true">Show Canvas</button></div>
      <ChatCanvas :class="isShowingFlow ? '' : 'mt-4'" />
    </div>
  </div>
</template>

<style scoped></style>
