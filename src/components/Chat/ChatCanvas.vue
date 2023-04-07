<script setup lang="ts">
import { useFlowStore } from "@/stores/flow"
import { reactive, ref } from "vue"
import { isDag, topologySort } from "@/utils/graph"
import { processFlow } from "@/utils/processFlow"
import dayjs from "dayjs"
import fileDownload from "js-file-download"

const inputQuestion = ref("")

const flowStore = useFlowStore()

interface OutputItem {
  label: string
  content: string
  time: string
  isMarkdown: boolean
}

const chatHistory = reactive({ list: [] as OutputItem[] })

const logTestMessage = () => {
  console.log(isDag(flowStore.adjacentList))
  console.log(topologySort(flowStore.adjacentList))
}

const addToList = (label: string, content: string) => {
  chatHistory.list.push({ label, content, time: dayjs().format("HH:mm:ss"), isMarkdown: false })
}

const send = () => {
  processFlow(inputQuestion.value, addToList)
}

const downloadChat = () => {
  fileDownload(JSON.stringify(chatHistory.list), "chat.json")
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
      <div class="w-full flex justify-end">
        <button v-if="chatHistory.list.length !== 0" class="btn btn-link" @click="downloadChat">
          Download
        </button>
      </div>
      <div v-for="(item, i) in chatHistory.list" :key="i">
        <div class="divider">{{ item.time }}</div>
        <div class="flex gap-5">
          <div class="flex flex-col items-end">
            <span class="badge" v-if="item.label">{{ item.label }} </span>
            <button class="btn btn-xs mt-2 btn-accent" @click="item.isMarkdown = !item.isMarkdown">
              md
            </button>
          </div>
          <article class="flex-1 prose max-w-none prose-pre:mt-0.5 prose-pre:mb-0.5" v-if="item.isMarkdown" >
            <v-md-preview :text="item.content"/>
          </article>
          <article v-else class="flex-1 prose max-w-none prose-pre:mt-0.5 prose-pre:mb-0.5 whitespace-pre-line">{{ item.content }}</article>
        </div>
      </div>
    </div>
    <div class="text-center">
      By <a href="https://alanj.in" class="underline">Alan Jin</a>, Github
      <a href="https://github.com/AlanJinqs/0x0G-An_AI_Playground_Canvas" class="underline">
        Link
      </a>
    </div>
  </div>
</template>
