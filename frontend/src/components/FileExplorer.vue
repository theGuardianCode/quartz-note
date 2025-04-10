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
  width: 20%;
  height: 100%;
  position: fixed;
  padding: 0 1% 0 1%;
}

li {
  list-style: none;
}
</style>