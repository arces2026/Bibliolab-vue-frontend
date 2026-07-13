<script setup>
import { ref, computed, watch } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const libri = ref([
  {
    id: 1,
    titolo: 'Il Nome della Rosa',
    autore: 'Umberto Eco',
    anno: 1980,
    genere: 'Giallo storico',
    disponibile: true,
  },
  {
    id: 2,
    titolo: '1984',
    autore: 'George Orwell',
    anno: 1949,
    genere: 'Fantascienza distopica',
    disponibile: false,
  },
  {
    id: 3,
    titolo: 'Il Signore degli Anelli',
    autore: 'J.R.R. Tolkien',
    anno: 1954,
    genere: 'Fantasy',
    disponibile: true,
  },
  {
    id: 4,
    titolo: 'Orgoglio e Pregiudizio',
    autore: 'Jane Austen',
    anno: 1813,
    genere: 'Romanzo rosa',
    disponibile: true,
  },
  {
    id: 5,
    titolo: 'Il Giovane Holden',
    autore: 'J.D. Salinger',
    anno: 1951,
    genere: 'Romanzo di formazione',
    disponibile: false,
  },
  {
    id: 6,
    titolo: "Cent'anni di Solitudine",
    autore: 'Gabriel García Márquez',
    anno: 1967,
    genere: 'Realismo magico',
    disponibile: true,
  },
])

const libriApi = ref([])

const filtro = ref('')
const genereSelezionato = ref('Tutti')
const soloDisponibili = ref(false)
const loading = ref(false)

let timeout = null
watch(filtro,(newFiltro, oldFiltro) => {
  clearTimeout(timeout)
  if (filtro.value.length < 3) return
  loading.value = true
  timeout = setTimeout(async() => {
    try {
    const res = await fetch(`http://localhost:8000/api/libri/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) {
      throw new Error('Error in setTimeout fetch', Error.message)
    }
    libriApi.value = await res.json()
    console.log({libriApi: libriApi.value})
  } catch(err) {
    console.error('Error while fetching libri', err)
  } finally {
    console.log({newFiltro: newFiltro, oldFiltro: oldFiltro})
  }
    loading.value = false
  }, 3000)

})

const libriFiltrati = computed(() => {
  let result = libri.value
  if (soloDisponibili.value) {
    result = libri.value.filter((l) => l.disponibile)
  }
  if (genereSelezionato.value !== 'Tutti') {
    result = result.filter((l) => l.genere === genereSelezionato.value)
  }

  if (!filtro.value) return result
  return result.filter(
    (l) =>
      l.titolo.toLowerCase().includes(filtro.value) ||
      l.autore.toLowerCase().includes(filtro.value),
  )
})
</script>
<template>
  <h2>Ricerca libri</h2>
  <!-- <h2>Catalogo</h2>
  <ul>
    <li v-for="libro in libri" :key="libro.id">
      {{ libro.titolo }} di {{ libro.autore }} - genere: {{ libro.genere }} ({{ libro.anno }})
    </li>
  </ul> -->
  <LoadingSpinner v-if="loading"/>
  <h3>Ricerca per genere, disponibilità, titolo o autore</h3>
  <div class="container">
    <input type="text" v-model="filtro" placeholder="Inserisci testo..." />
    <div class="label">
      <label for="disponibile">Solo disponibili</label>

      <input id="disponibile" type="checkbox" v-model="soloDisponibili" />
    </div>
    <select v-model="genereSelezionato">
      <option selected>Tutti</option>
      <option v-for="libro in libri" :key="libro.id">{{ libro.genere }}</option>
    </select>
    <ul>
      <li v-for="libro in libriFiltrati" :key="libro.id">
        {{ libro.titolo }} di {{ libro.autore }} ({{ libro.anno }})
      </li>
    </ul>

    <h3>{{ libriFiltrati.length }} libri trovati su {{ libri.length }}</h3>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
h2 {
  text-align: center;
  margin: 60px auto 30px;
}
h3 {
  text-align: center;
  margin-bottom: 15px;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
input, select {
  padding: 5px;
  border-radius: 5px;
}
.label {
  display: flex;
  justify-content: space-between;
  width: 130px;
}
</style>
