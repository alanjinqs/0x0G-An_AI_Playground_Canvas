<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core"
import { ref } from "vue"

defineProps({
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
          : status == 'error'
          ? 'badge-error'
          :'badge-warning'
      ]"
    ></span>

    <div class="card bg-neutral">
      <div class="card-body">
        <h2 class="card-title">String</h2>
        <div class="flex items-center">
          <span class="mb-0.5">Size: </span>
          <button @click="data.data.size = 'xs'" class="btn btn-xs">xs</button>
          <button @click="data.data.size = 'sm'" class="btn btn-xs">sm</button>
          <button @click="data.data.size = 'md'" class="btn btn-xs">md</button>
          <button @click="data.data.size = 'lg'" class="btn btn-xs">lg</button>
        </div>
        <textarea
          @focus="emits('freeze')"
          @blur="emits('defreeze')"
          v-model="data.data.stringTemplate"
          :class="[
            'textarea resize-none textarea-sm leading-tight',
            data.data.size == 'xs'
              ? 'w-full h-8'
              : data.data.size == 'sm'
              ? 'w-full h-16'
              : data.data.size == 'lg'
              ? 'w-80 h-60 hover:resize-y '
              : 'w-full h-32'
          ]"
        ></textarea>
      </div>
    </div>
  </div>
  <Handle
    id="str-in-1"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
    style="top: 50px; bottom: auto"
  />
  <Handle
    id="str-in-2"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
    style="top: 100px; bottom: auto"
  />
  <Handle
    id="str-in-3"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
    style="top: 150px; bottom: auto"
  />
  <Handle
  v-if="data.data.size == 'lg'"
    id="str-in-4"
    :connectable="true"
    :connectable-start="false"
    type="target"
    :position="Position.Left"
    style="top: 200px; bottom: auto"
  />

  <Handle
    id="str-out"
    :connectable="true"
    :connectable-end="false"
    type="source"
    :position="Position.Right"
  />
</template>
