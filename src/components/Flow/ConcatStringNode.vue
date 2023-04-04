<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core"

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
          : 'badge-warning'
      ]"
    ></span>

    <div class="card bg-neutral">
      <div class="card-body">
        <h2 class="card-title">Concat String</h2>
        <textarea
          @focus="emits('freeze')"
          @blur="emits('defreeze')"
          v-model="data.data.stringTemplate"
          class="textarea resize-none hover:resize-y textarea-sm w-80 h-60 leading-tight"
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
