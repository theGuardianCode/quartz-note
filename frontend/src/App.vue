<script setup>
import { ref } from 'vue'
import { EventsOn, EventsEmit } from '../wailsjs/runtime/runtime'
import Editor from './components/Editor.vue'
import FileExplorer from './components/FileExplorer.vue'
import { OpenFile } from '../wailsjs/go/main/FileSystem'

let fileList = ref([])

let buffer = ref('')
let currentFile = ref('')

EventsOn("open-directory", (files) => {
  fileList.value = files
})

function handleChange(filename) {
  currentFile.value = filename
  OpenFile(filename).then((data) => {
    buffer.value = data
  })
}

function handleInput(updatedBuffer) {
  buffer.value = updatedBuffer
}

function saveFile() {
  // Tell wails to write to file
  EventsEmit("writeFile", currentFile.value, buffer.value)
}

// Wails event handler for saving file
EventsOn("save-file", saveFile)
</script>

<template>
  <div class="window">
    <FileExplorer :files="fileList" @changeFile="handleChange"/>
    <Editor :buffer="buffer" @updateBuffer="handleInput"/>
  </div>
</template>

<style>
.window {
  display: flex;
  flex-direction: row;
  height: 100%;
}
</style>
