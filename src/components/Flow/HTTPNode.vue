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

const emits = defineEmits(["freeze", "defreeze"])
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
        <h2 class="card-title">HTTP(s)</h2>
        <div class="flex gap-1">
          <div class="badge badge-primary badge-xs" style="font-size: 0.5rem">Body</div>
          <div class="badge badge-secondary badge-xs" style="font-size: 0.5rem">Query</div>
          <div class="badge badge-warning badge-xs" style="font-size: 0.5rem">Header</div>
          <div class="badge badge-accent badge-xs" style="font-size: 0.5rem">Output</div>
        </div>

        <input
          type="text"
          @focus="emits('freeze')"
          @blur="emits('defreeze')"
          v-model="data.data.url"
          placeholder="URL"
          class="input input-sm w-full max-w-xs text-xs"
        />
        
        <select class="select select-sm w-full max-w-xs" v-model="data.data.method">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>
    </div>
  </div>
  

  <Handle
    id="http-body"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
    class="bg-primary border-primary top-8 bottom-auto"
  />

  <Handle
    id="http-query"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
    class="bg-secondary border-primary top-16 bottom-auto"
  />

  <Handle
    id="http-headers"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
    class="bg-warning border-warning top-24 bottom-auto"
  />

  <Handle
    id="http-out"
    :connectable="true"
    :connectable-end="false"
    type="source"
    :position="Position.Right"
    class="bg-accent border-accent"
  />
</template>
