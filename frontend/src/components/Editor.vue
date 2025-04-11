<script setup>
import { Marked } from 'marked'
import { markedHighlight }  from 'marked-highlight'
import hljs from 'highlight.js'
import { EventsOn } from '../../wailsjs/runtime/runtime'
import { ref, watch } from 'vue'

// Markdown parser config
const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const result = hljs.highlight(code, { language }).value;
      console.log(result)
      return result
    }
  })
)

marked.use({
  gfm: true,
  breaks: true,
})

// Props and emits
const props = defineProps({
  buffer: String
})
const emit = defineEmits(['updateBuffer'])

// State and Handlers
let editing = ref(false)
let htmlContents = ref('')

function toggle() {
  editing.value = !editing.value
}

function handleInput(e) {
  emit('updateBuffer', e.target.value)
}

function renderHtml(html) {
  console.log(`html: ${html}`)
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
    <textarea v-if="editing" @input="handleInput">{{ buffer }}</textarea>
    <p v-else v-html="htmlContents"></p>
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
  overflow: scroll;
}

.pane {
  height: 97vh;
}

p {
  overflow-wrap: break-word;
}
</style>
