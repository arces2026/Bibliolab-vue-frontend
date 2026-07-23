<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import LibroCard from './LibroCard.vue'
import CustomSelect from './CustomSelect.vue'
import { useLibri } from '@/composable/useLibri.js'

const libri = ref([])
const generi = ref([])
const filtro = ref('')
const genereSelezionato = ref('Tutti')
const libriFiltratiPerGenere = ref([])
const soloDisponibili = ref(false)
const loading = ref(false)
const libroComposable = useLibri()

onMounted(async () => {
  try {
    libri.value = await libroComposable.getLibri('/api/v1/libri/')
    generi.value = await libroComposable.getCategorie('/api/v1/categorie/')
    console.log({generi: generi.value})
  } catch (err) {
    console.error('Error fetching onMounted', err)
  }
})


let timeout = null

watch(filtro, (newFiltro, oldFiltro) => {
  // Clear any existing timeout
  clearTimeout(timeout)
  if (newFiltro === oldFiltro) {
    loading.value = false
    return
  }
  if (newFiltro.length < 3) {
    loading.value = false
    return
  }
  loading.value = true

  timeout = setTimeout(async () => {
    try {
      libri.value = await libroComposable.getLibri('/api/v1/libri/')
    } catch (err) {
      console.error('Error while fetching libri', err)
    } finally {
      loading.value = false
    }
  }, 300)
})

//Clean up on component unmount
onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})

const libriFiltrati = computed(() => {
  let result = libri.value
  if (soloDisponibili.value) {
    result = libri.value.filter((l) => l.disponibile)
  }
  // if (genereSelezionato.value !== 'Tutti') {
  //   result = result.filter((l) => l.categorie?.includes(genereSelezionato.value))
  // }

  if (!filtro.value || filtro.value.length < 3) return result
  console.log({result : result})
  const filterTest = result.filter((l) => {
  // return result.filter((l) => {
    const titolo = (l.titolo || '').toLowerCase()
    const autore = (l.autore_oggetto.cognome || '').toLowerCase()
    const search = filtro.value.toLowerCase()
    return titolo.includes(search) || autore.includes(search)
  })
  console.log({filterTest: filterTest})
  return filterTest
})

const getLibriByGenere = async () => {
  try {
    libri.value = await libroComposable.getLibri('/api/v1/libri/')
    console.log({libri: libri.value})
    if (genereSelezionato.value !== 'Tutti') {
      libriFiltratiPerGenere.value = libri.value.filter((l) =>
        l.categorie.some(cat => cat.nome === genereSelezionato.value)
        // l.categorie.nome.includes(genereSelezionato.value),
      )
      console.log({libriPerGen: libriFiltratiPerGenere.value, selezionato: genereSelezionato.value})

    } else {
      libriFiltratiPerGenere.value = libri.value
    }
  } catch (err) {
    console.error('Error catch in search by genre', err)
  }
}
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
  <h3>Ricerca per disponibilità, titolo o autore</h3>
  <form class="form-container">
    <input type="text" v-model="filtro" placeholder="Inserisci testo..." />
    <div class="label">
      <label for="disponibile">Solo disponibili</label>

      <input id="disponibile" type="checkbox" v-model="soloDisponibili" />
    </div>
  </form>

  <h3>{{ libriFiltrati.length }} libri trovati su {{ libri.length }}</h3>
  <div class="parent">
    <LibroCard v-for="libro in libriFiltrati" :key="libro.id" v-bind="libro" class="libro-card" />
  </div>
  <h3>Libri filtrati per genere</h3>
  <h4>{{ libriFiltratiPerGenere.length }} libri trovati su {{ libri.length }}</h4>
  <CustomSelect v-model="genereSelezionato" :opzioni="generi" @change="getLibriByGenere" />
  <div class="parent">
    <LibroCard
      v-for="libro in libriFiltratiPerGenere"
      :key="libro.id"
      v-bind="libro"
      class="libro-card"
    />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.filtro-genere {
  width: 200px;
  margin: auto;
}

h2,
h3,
h4 {
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
