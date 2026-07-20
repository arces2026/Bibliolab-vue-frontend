<script setup>
import { ref, onMounted, computed } from 'vue'
import LibroCard from '@/components/LibroCard.vue'
import { useLibri } from '@/composable/useLibri'

const libriComp = useLibri()
const libri = ref([])
const arrayPreferiti = ref(new Set())

const preferiti = (id) => {
  localStorage.getItem('preferiti')
  if (arrayPreferiti.value.has(id)) {
    arrayPreferiti.value.delete(id)
  } else {
    arrayPreferiti.value.add(id)
  }
  // Ricrea il Set per reattività Vue
  arrayPreferiti.value = new Set(arrayPreferiti.value)
  console.log({ preferito: preferito.value(id) })
  localStorage.setItem('preferiti', JSON.stringify(Array.from(arrayPreferiti.value)))
}

const preferito = computed(() => {
  //has() for set includes() for array
  return (id) => arrayPreferiti.value.has(id)
})

const libriDisponibili = computed(() => {
  return libri.value.filter(l => l.disponibile).length
})

const totaleLibri = computed(() => libri.value.length)

onMounted(async () => {
  //First load from localStorage
    const stored = localStorage.getItem('preferiti')
  if (stored) {
  try{
    const parsed = JSON.parse(stored)
    arrayPreferiti.value = new Set(parsed)
  } catch(err){
    console.error('Error getting preferiti from localStorage', err.message)
  }
}
// Then fetch the book
libri.value = await libriComp.getLibri(`/api/v1/libri/`) //using proxy server (vite.config.js)
  // libri.value = await libriComp.getLibri(`http://localhost:8000/api/libri/`)
  console.log({libriComp: libri.value})
})


const rimuoviLibro = (id) => libri.value = libri.value.filter(l => l.id !== id)
</script>

<template>
  <div class="container">
    <h1>Catalogo</h1>
    <h2>{{ libriDisponibili }} libri disponibili su {{ totaleLibri }}</h2>
    <div class="parent">
      <LibroCard
        v-for="libro in libri"
        :key="libro.id"
        v-bind="libro"
        @addPreferiti="preferiti"
        @delete="rimuoviLibro"
        :preferito="arrayPreferiti.has(libro.id)"
        class="libro-card"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: #f5f5f4;
}

h1 {
  text-align: center;
}
.parent {
  display: grid;
  /* grid-template-columns: repeat(6, 1fr); */
  /* Automatically fits as many cards as possible, minimum width 280px */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  /* grid-template-rows: repeat(4, 1fr); */
  gap: 32px;
}

.libro-card {
  /* grid-column: span 2 / span 2;
  grid-row: span 4 / span 4; */
  /* Remove explicit grid spans so they naturally flow into the auto columns */
  grid-column: auto;
  grid-row: auto;
}

/* @media screen and (max-width: 1200px) {
 .parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 32px;
}
} */
</style>
