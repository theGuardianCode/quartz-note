<script setup>
const props = defineProps({
  files: Array
})
const emit = defineEmits(['changeFile'])

function handleClick(filename) {
  emit('changeFile', filename)
}
</script>

<template>
  <ul>
    <li v-for="file in files">
      <p v-if="file.isDir === 'true'">> {{ file.name }}</p>
      <p v-else @click="() => handleClick(file.name)"> {{ file.name }} </p>
    </li>
  </ul>
</template>

<style scoped>
ul {
  text-align: left;
  padding: 0 15px;
}

li {
  list-style: none;
}
</style>