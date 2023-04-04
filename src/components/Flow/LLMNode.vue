<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core"
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="indicator">
    <span
      v-if="status"
      :class="[
        'indicator-item',
        'badge',
        status == 'running'
          ? 'badge-primary'
          : status == 'finished'
          ? 'badge-success'
          : 'badge-warning'
      ]"
    ></span>

    <div class="card bg-neutral">
      <div class="card-body">
        <h2 class="card-title">LLM</h2>
        <div class="flex gap-1">
          <div class="badge badge-secondary badge-xs" style="font-size: 0.5rem">System Message</div>
          <div class="badge badge-primary badge-xs" style="font-size: 0.5rem">Question</div>
          <div class="badge badge-accent badge-xs" style="font-size: 0.5rem">Output</div>
        </div>

        <select class="select select-sm w-full max-w-xs" v-model="data.data.model">
          <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
          <option value="gpt-4">GPT 4</option>
        </select>
      </div>
    </div>
  </div>
  <Handle
    id="llm-system"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Top"
    class="bg-secondary"
  />

  <Handle
    id="llm-prompt"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
    class="bg-primary"
  />

  <Handle
    id="llm-out"
    :connectable="true"
    :connectable-end="false"
    type="source"
    :position="Position.Right"
    class="bg-accent"
  />
</template>
