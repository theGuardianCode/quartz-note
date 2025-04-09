<script setup>
import { EventsOn } from '../../wailsjs/runtime/runtime';

import { ref } from 'vue'

let editing = ref(false);
let input = ref("");

function toggle() {
  editing.value = !editing.value;
}

EventsOn("toggle-edit", toggle);
</script>

<template>
  <div class="container">
    <div class="pane">
      <textarea v-if="editing" v-model="input"></textarea>
      <p v-else>{{ input }}</p>
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
  height: 98%;
  padding: 5px;
}

.pane {
  height: 100%;
}

.pane p {
  overflow-wrap: break-word;
}
</style>
