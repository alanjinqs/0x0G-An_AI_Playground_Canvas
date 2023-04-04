<script setup lang="ts">
import ChatCanvas from "@/components/Chat/ChatCanvas.vue";
import FlowCanvas from "@/components/Flow/FlowCanvas.vue"
import { useFlowStore } from "@/stores/flow"
import VueJsonPretty from "vue-json-pretty"
import "vue-json-pretty/lib/styles.css"
const flowStore = useFlowStore()
</script>

<template>
  <div class="flex">
    <div class="w-1/2 h-screen">
      <FlowCanvas />
    </div>
    <div class="w-1/2 h-screen overflow-y-auto">
      <ChatCanvas />
    </div>
  </div>
</template>

<style scoped></style>
