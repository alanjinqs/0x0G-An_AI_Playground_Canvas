<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core"

defineProps({
  data: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(["freeze", "defreeze"])
</script>

<template>
  <div class="card bg-neutral">
    <div class="card-body">
      <h2 class="card-title">Global Environment</h2>
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">OpenAI API Key</span>
        </label>
        <input
          @focus="emits('freeze')"
          @blur="emits('defreeze')"
          type="password"
          v-model="data.data.openAIApiKey"
          class="input input-sm w-full max-w-xs text-xs"
        />
      </div>
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">OpenAI URL</span>
        </label>
        <input
          type="text"
          @focus="emits('freeze')"
          @blur="emits('defreeze')"
          v-model="data.data.openAIUrl"
          class="input input-sm w-full max-w-xs text-xs"
        />
      </div>
    </div>
  </div>
</template>
