<script setup>
import { ref } from 'vue'
import { EventsOn, EventsEmit } from '../wailsjs/runtime/runtime'
import Editor from './components/Editor.vue'
import FileExplorer from './components/FileExplorer.vue'
import { OpenFile } from '../wailsjs/go/main/FileSystem'

let buffer = ref('')
let currentFile = ref('')

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
  <div id="outer-container">
    <h3 id="file-header">{{ currentFile ? currentFile : 'No File Selected'}}</h3>
    <div class="window">
      <FileExplorer @changeFile="handleChange"/>
      <Editor :buffer="buffer" @updateBuffer="handleInput"/>
    </div>
  </div>
</template>

<style>
.window {
  display: flex;
  flex-direction: row;
  height: 100%;
}

#file-header {
  margin: 0;
  padding: 5px 0;
  border-bottom: 1px black solid;
}

#outer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: fixed;
}
</style>
