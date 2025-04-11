<script setup>
import { EventsOn } from '../../wailsjs/runtime/runtime'
import { ReadDir } from '../../wailsjs/go/main/FileSystem'
import { ref, computed, watch } from 'vue'

import FileElement from './FileElement.vue'

const emit = defineEmits(['changeFile'])

const fileList = ref([])

EventsOn("open-directory", (files) => {
  // Reset file list
  fileList.value = []

  for (let i = 0; i < files.length; i++) {
    fileList.value.push({name: files[i].name, isDir: files[i].isDir, children: [], expanded: false})
  }
})

function handleClick(filename) {
  emit('changeFile', filename)
}

function handleFolder(folder) {
  let parentDir = -1;
  for (let i = 0; i < fileList.value.length; i++) {
    if (fileList.value[i].name == folder) {
      parentDir = i
    }
  }

  if (fileList.value[parentDir].expanded === false) {
    ReadDir(folder).then((contents) => {
      fileList.value[parentDir].children = []
      
      // Insert folder contents into parent dir's children element
      for (let i = 0; i < contents.length; i++) {
        fileList.value[parentDir].children.push({name: folder + "/" + contents[i].name, isDir: contents[i].isDir, children: [], expanded: false})
      }
    })
  } 

  fileList.value[parentDir].expanded = !fileList.value[parentDir].expanded;
}
</script>

<template>
  <div id="list">
    <ul v-if="fileList.length > 0">
      <li v-for="elem in fileList">
        <FileElement :entry="elem" :fileClick="handleClick" :folderClick="handleFolder" />
      </li>
    </ul>
    <p v-else>No Folder Selected</p>
  </div>
</template>

<style scoped>
#list {
  text-align: left;
  width: 20%;
  padding: 0 1%;
  overflow: scroll;
  border-right: 1px solid black;
  margin: 0;
}

ul {
  padding: 0;
  word-break: break-word;
}

li {
  list-style: none;
}
</style>