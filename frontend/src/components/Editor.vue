<script setup>
import { EventsOn } from '../../wailsjs/runtime/runtime'
import { ref, watch } from 'vue'

const props = defineProps({
  buffer: String
})
const emit = defineEmits(['updateBuffer'])

let editing = ref(false)

function toggle() {
  editing.value = !editing.value
}

EventsOn("toggle-edit", toggle)
</script>

<template>
  <div class="container">
    <div class="pane">
      <textarea v-if="editing" :value="buffer"></textarea>
      <p v-else>{{ props.buffer }}</p>
    </div>
  </div>
</template>

<style scoped>
textarea {
  display: block;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px;
}

.pane {
  height: 100%;
}

.pane p {
  overflow-wrap: break-word;
}
</style>
