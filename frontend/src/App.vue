<script setup>
import { ref } from 'vue'
import { EventsOn } from '../wailsjs/runtime/runtime'
import Editor from './components/Editor.vue'
import FileExplorer from './components/FileExplorer.vue'
import { OpenFile } from '../wailsjs/go/main/FileSystem'

let fileList = ref([])

let buffer = ref('')

EventsOn("open-directory", (files) => {
  fileList.value = files
})

function handleChange(filename) {
  OpenFile(filename).then((data) => {
    buffer.value = data
  })
}
</script>

<template>
  <div class="window">
    <FileExplorer :files="fileList" @changeFile="handleChange"/>
    <Editor :buffer="buffer" @updateBuffer="(updatedBuffer) => buffer.value = updatedBuffer"/>
  </div>
</template>

<style>
.window {
  display: flex;
  flex-direction: row;
  height: 100%;
}
</style>
