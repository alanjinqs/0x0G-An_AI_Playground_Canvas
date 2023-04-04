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
    <div :class="['card', 'bg-neutral']">
      <div class="card-body">
        <h2 class="card-title">Vector DB & Embedder</h2>
        <select class="select select-sm w-full max-w-xs" v-model="data.data.db">
          <option value="chroma-ada">Chroma & Ada-02 (OpenAI)</option>
        </select>
        <input
          v-model="data.data.vectorDbUrl"
          type="text"
          placeholder="Database Endpoint URL"
          class="input input-sm w-full max-w-xs"
        />
        <input
          v-model="data.data.collectionName"
          type="text"
          placeholder="Collection Name"
          class="input input-sm w-full max-w-xs"
        />
        <input
          v-model="data.data.joinBy"
          type="text"
          placeholder="Join By (e.g. \n))"
          class="input input-sm w-full max-w-xs"
        />
        <input
          v-model="data.data.numberOfResults"
          type="number"
          placeholder="Number of Results"
          class="input input-sm w-full max-w-xs"
        />
      </div>
    </div>
  </div>
  <Handle
    id="in"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
  />

  <Handle
    id="out"
    :connectable="true"
    :connectable-end="false"
    type="source"
    :position="Position.Right"
  />
</template>
