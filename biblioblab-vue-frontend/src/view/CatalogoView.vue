<script setup>
import { ref, onMounted, computed } from 'vue'
import LibroCard from '@/components/LibroCard.vue'

const libri = ref([])
const idInEvidenza = ref([])

const evidenzia = (id) => {
  const index = idInEvidenza.value.indexOf(id)
  if (index !== -1) {
    idInEvidenza.value.splice(index, 1)
    console.log({ idInEvidenza: idInEvidenza.value })
  } else {
    idInEvidenza.value.push(id)
    console.log({ idInEvidenza: idInEvidenza.value })
  }
}

const inEvidenza = computed(() => {
  console.log({ inEvidenza: inEvidenza })
  return (id) => idInEvidenza.value.has(id)
})

//Api call temporanea, da spostare nel file adatto
onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:8000/api/libri/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      throw new Error(`Error in setTimeout fetch  ${res.statusText}`)
    }
    const data = await res.json()
    libri.value = data.results
    console.log({ libri: libri.value })
  } catch (err) {
    console.error('Errore nel recupero libri', err)
  }
})
</script>

<template>
  <div class="container">
    <h1>Catalogo</h1>
    <div class="parent">
      <LibroCard
        v-for="libro in libri"
        :key="libro.id"
        v-bind="libro"
        @evidenzia="evidenzia"
        :inEvidenza="idInEvidenza.includes(libro.id)"
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
