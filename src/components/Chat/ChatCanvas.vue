<script setup lang="ts">
import { useFlowStore } from "@/stores/flow"
import { reactive, ref } from "vue"
import { isDag, topologySort } from "@/utils/graph"
import { processFlow } from "@/utils/processFlow"
import dayjs from "dayjs"

const inputQuestion = ref("")

const flowStore = useFlowStore()

interface OutputItem {
  label: string
  content: string
  time: string  
}

const chatHistory = reactive({ list: [] as OutputItem[] })

const logTestMessage = () => {
  console.log(isDag(flowStore.adjacentList))
  console.log(topologySort(flowStore.adjacentList))
}

const addToList = (label: string, content: string) => {
  chatHistory.list.push({ label, content, time: dayjs().format("HH:mm:ss") })
}

const send = () => {
  processFlow(inputQuestion.value, addToList)
}
</script>

<template>
  <div class="w-full h-full p-8 flex flex-col gap-4">
    <textarea
      v-model="inputQuestion"
      placeholder="Question"
      class="textarea bg-neutral textarea-sm w-full resize-none hover:resize-y min-h-[5rem] leading-tight scrollbar-thin scrollbar-rounded-full scrollbar-thumb-gray-400"
    ></textarea>
    <div class="w-full text-center">
      <div class="btn-group">
        <button class="btn btn-active" @click="send">Send</button>
        <!-- <button class="btn" @click="logTestMessage">test</button> -->
      </div>
    </div>
    <div
      class="flex-1 overflow-y-auto scrollbar-thin scrollbar-rounded-full scrollbar-thumb-gray-400"
    >
      <div v-for="(item, i) in chatHistory.list" :key="i">
        <div class="divider">{{ item.time }}</div>
        <div class="flex gap-5">
          <span class="badge" v-if="item.label">{{ item.label }}</span>
          <p class="flex-1 whitespace-pre-line">
            {{ item.content }}
          </p>          
        </div>
      </div>
    </div>
  </div>
</template>
