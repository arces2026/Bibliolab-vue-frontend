<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import LibroCard from './LibroCard.vue'
import CampoSelect from './CampoSelect.vue'

const libri = ref([])
// const generi = ref(['Romanzo', 'Saggio', 'Racconti', 'Classico', 'Contemporaneo'])
const filtro = ref('')
const genereSelezionato = ref('Tutti')
const soloDisponibili = ref(false)
const loading = ref(false)

onMounted(async() => {
  try {
    const res = await fetch(`http://localhost:8000/api/libri/`)
    if (!res.ok){
      throw new Error('Error during the fetch for genres', Error.message)
    }
    const data = await res.json()
    libri.value = data.results
    console.log({libriData: libri.value})
  }catch(err){
    console.error('Error fetching onMounted', err)
  }
})
// const generi = computed(() => {
//   const gen = new Set();
//    for (const libro of libri.value) {
//     for (const genere of libro.categorie){
//       gen.add(genere)
//     }
//    }
//    return [...gen]
// })

// Get all genres from the first onMounted fetch
// cleaner using flatMap() to flatten all categories in one Array
// then returning objects since the template expects {value, label}
const generi = computed(() => {
  const unique = [...new Set(libri.value.flatMap(l => l.categorie))];
  return  [{ value: 'Tutti', label: 'Tutti' }, ...unique.map(g => ({ value: g, label: g }))];
});

let timeout = null
watch(filtro, (newFiltro, oldFiltro) => {
  clearTimeout(timeout)
  if (filtro.value.length < 3) return
  loading.value = true
  timeout = setTimeout(async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/libri/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) {
        throw new Error('Error in setTimeout fetch', Error.message)
      }
      const data = await res.json()
      libri.value = data.results
      console.log({ libri: libri.value, results: data.results })
    } catch (err) {
      console.error('Error while fetching libri', err)
    } finally {
      console.log({ newFiltro: newFiltro, oldFiltro: oldFiltro })
    }
    loading.value = false
  }, 300)
})

const libriFiltrati = computed(() => {
  let result = libri.value
  if (soloDisponibili.value) {
    result = libri.value.filter((l) => l.disponibile)
  }
  if (genereSelezionato.value !== 'Tutti') {
    result = result.filter((l) => l.categorie?.includes(genereSelezionato.value))
  }

  if (!filtro.value) return result



  // return result.filter((l) => {
  return result.filter((l) => {
    const titolo = (l.titolo || '').toLowerCase()
    const autore = (l.autore.nome || '').toLowerCase()
    const search = filtro.value.toLowerCase()
    console.log({ resultfiler: titolo.includes(search) || autore.includes(search)})
    return titolo.includes(search) || autore.includes(search)
  })
})

// const seleziona = () => {
//   if (genereSelezionato.value !== 'Tutti') {
//    return libri.value.filter((l) => l.categorie?.includes(genereSelezionato.value))
//   }
// }
</script>
<template>
  <h2>Ricerca libri</h2>
  <!-- <h2>Catalogo</h2>
  <ul>
    <li v-for="libro in libri" :key="libro.id">
      {{ libro.titolo }} di {{ libro.autore }} - genere: {{ libro.genere }} ({{ libro.anno }})
    </li>
  </ul> -->
  <LoadingSpinner v-if="loading" />
  <h3>Ricerca per genere, disponibilità, titolo o autore</h3>
  <form class="form-container">
    <input type="text" v-model="filtro" placeholder="Inserisci testo..." />
    <div class="label">
      <label for="disponibile">Solo disponibili</label>

      <input id="disponibile" type="checkbox" v-model="soloDisponibili" />
    </div>
    <!-- <select v-model="genereSelezionato">
      <option selected>Tutti</option>
      <option v-for="genere in generi" :key="genere" :value="genere">{{ genere }}</option>
    </select> -->
    <CampoSelect
    v-model="genereSelezionato"
    :opzioni="generi"
    />
    <!-- <CampoSelect
    v-model="genereSelezionato"
    @change="seleziona"
    :opzioni="generi"
    /> -->
  </form>
  <!-- <ul>
      <li v-for="libro in libriFiltrati" :key="libro.id">
        {{ libro.titolo }} di {{ libro.autore }} ({{ libro.anno }})
      </li>
    </ul> -->
  <h3>{{ libriFiltrati.length }} libri trovati su {{ libri.length }}</h3>
  <div class="parent">
    <LibroCard v-for="libro in libriFiltrati" :key="libro.id" v-bind="libro"  class="libro-card"/>
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
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
input,
select {
  padding: 5px;
  border-radius: 5px;
}
.label {
  display: flex;
  justify-content: space-between;
  width: 130px;
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
</style>
