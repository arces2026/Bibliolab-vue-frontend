<template>
  <h1 :class="{'rosso':count <= 0, 'verde': count > 5}">Contatore: {{ count }}</h1>
  <button @click="count++"> + </button>
  <button @click="count--" :disabled="count <= 0"> - </button>
  <button @click="count = 0">Reset</button>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<style scoped>
.rosso {
  color: red;
}

.verde {
  color: green;
}
</style>
