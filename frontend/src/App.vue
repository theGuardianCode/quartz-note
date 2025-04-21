<script setup>
import { ref } from 'vue'
import { EventsOn, EventsEmit } from '../wailsjs/runtime/runtime'
import Editor from './components/Editor.vue'
import FileExplorer from './components/FileExplorer.vue'
import { OpenFile, CreateFile } from '../wailsjs/go/main/FileSystem'

const buffer = ref('')
const currentFile = ref('')
const dirName = ref('')

const showModal = ref(false)
const modalInput = ref('')

const leftBar = ref(false)

// Indicate whether the file is saved
const saved = ref(true)

function handleChange(filename) {
  currentFile.value = filename
  OpenFile(filename).then((data) => {
    buffer.value = data
  })
}

function handleInput(updatedBuffer) {
  buffer.value = updatedBuffer
  saved.value = false
}

function saveFile() {
  // Tell wails to write to file
  EventsEmit("writeFile", currentFile.value, buffer.value)
  saved.value = true
}

// Wails event handler for saving file
EventsOn("save-file", saveFile)

// Wails event handler for creating file
EventsOn("prompt-filename", () => {
  if (dirName.value != '') {
    showModal.value = true
  }
})

// Wails event handler for toggling file explorer
EventsOn("toggle-explorer", () => {
  leftBar.value = !leftBar.value
})

// Wails event handler for setting working directory
EventsOn("open-directory", (directory, _) => {
  dirName.value = directory
})

// Modal button create file
function modalButton() {
  const created = CreateFile(modalInput.value)
  if (created) {
    showModal.value = false
    modalInput.value = ""
    EventsEmit("reload-files")
  }
}

function closeModal() {
  showModal.value = false
  modalInput.value = ""
}
</script>

<template>
  <div v-if="showModal" id="modal-background">
    <div id="modal-content">
      <span id="modal-header">Create new note:</span> <span @click="closeModal" id="close-modal">X</span>
      <hr>
      <input v-model="modalInput"/> <button @click="modalButton">Create</button>
    </div>
  </div>
  <div id="outer-container">
    <h3 id="file-header">{{ currentFile ? currentFile : 'No File Selected'}} {{ !saved ? '*' : '' }}</h3>
    <div class="window">
      <FileExplorer 
        v-if="leftBar" 
        :workingDir="dirName"
        :saveFunc="saveFile" 
        @changeFile="handleChange"/>
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

#modal-background {
  z-index: 1;
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

#modal-content {
  background-color: white;
  margin: 15% auto;
  padding: 20px;
  width: 60%;
  border-radius: 15px;
  text-align: left;
}

#modal-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0;
}

#close-modal {
  cursor: pointer;
  float: right;
}
</style>
