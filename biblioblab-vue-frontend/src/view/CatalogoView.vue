<script setup>
import { ref, onMounted } from 'vue'
import LibroCard from '@/components/LibroCard.vue'

const libri = ref([])
//Api call temporanea, da spostare nel file adatto
onMounted(async() => {
  try {
    const res = await fetch(`http://localhost:8000/api/libri/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) {
      throw new Error(`Error in setTimeout fetch  ${res.statusText}`)
    }
    const data = await res.json()
    libri.value = data.results
    console.log({libri: libri.value})
  } catch(err) {
    console.error('Errore nel recupero libri', err)
  }
})
</script>

<template>
  <div class="parent">
    <LibroCard
    v-for="libro in libri" :key="libro.id" v-bind="libro"
    class="libro-card" />
  </div>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
}

.libro-card {
  grid-column: span 2 / span 2;
  grid-row: span 4 / span 4;
}
</style>
