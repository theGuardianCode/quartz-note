<script setup>
import { marked } from 'marked'
import { EventsOn } from '../../wailsjs/runtime/runtime'
import { ref, watch } from 'vue'

marked.use({
  gfm: true,
  breaks: true,
})

const props = defineProps({
  buffer: String
})
const emit = defineEmits(['updateBuffer'])

let editing = ref(false)
let htmlContents = ref('')

function toggle() {
  editing.value = !editing.value

  // if (!editing.value) {
  //   renderHtml(props.buffer)
  // }
}

function handleInput(e) {
  emit('updateBuffer', e.target.value)
}

function renderHtml(html) {
  htmlContents.value = marked.parse(html)
}

watch(() => props.buffer, (newBuffer) => {
  renderHtml(newBuffer)
})

// Wails event handler
EventsOn("toggle-edit", toggle)
</script>

<template>
  <div class="container">
    <div class="pane">
      <textarea v-if="editing" @input="handleInput">{{ buffer }}</textarea>
      <p v-else v-html="htmlContents"></p>
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
  width: 80%;
  padding: 5px;
  text-align: left;
  margin-left: 22%;
}

.pane {
  height: 100%;
}

.pane p {
  overflow-wrap: break-word;
}
</style>
