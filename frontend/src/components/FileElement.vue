<script setup>
const props = defineProps({
  entry: Object,
  fileClick: Function,
  folderClick: Function,
})
</script>

<template>
  <div v-if="entry.isDir === 'true'">
    <p @click="() => folderClick(entry.name)">> {{ entry.name }}</p>
    <ul v-if="entry.children.length > 0 && entry.expanded">
      <li v-for="elem in entry.children">
        <FileElement :entry="elem" :fileClick="fileClick" :folderClick="folderClick"/>
      </li>
    </ul>
  </div>
  <p v-else @click="fileClick(entry.name)">{{ entry.name }}</p>
</template>