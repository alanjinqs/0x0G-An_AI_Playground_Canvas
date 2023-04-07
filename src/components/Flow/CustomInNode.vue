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
          : status == 'error'
          ? 'badge-error'
          :'badge-warning'
      ]"
    ></span>

    <div class="card bg-neutral">
      <div class="card-body">
        <h2 class="card-title">Question Input</h2>
      </div>
    </div>
  </div>
  <Handle
    id="out"
    :connectable="true"
    :connectable-end="false"
    type="source"
    :position="Position.Bottom"
  />
</template>
