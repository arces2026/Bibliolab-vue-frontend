<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import LibroCard from './LibroCard.vue'
import CustomSelect from './CustomSelect.vue'
import { useLibri } from '@/composable/useLibri.js'
import { usePreferiti } from '@/composable/usePreferiti.js'
import { useEliminaLibro } from '@/composable/useEliminaLibro.js'
import ModalVue from './ModalVue.vue'

const libri = ref([])
const text = ref('Tutti')
const generi = ref([])
const filtro = ref('')
const genereSelezionato = ref('Tutti')
const soloDisponibili = ref(false)
const loading = ref(false)
const libroComposable = useLibri()

// Debug: Check if libroComposable has eliminaLibro method
console.log('libroComposable:', libroComposable)
console.log('eliminaLibro method:', libroComposable.eliminaLibro)

// Use the preferiti composable
const { arrayPreferiti, togglePreferito} = usePreferiti()

// Use the delete composable
const {
  showModal,
  button1Text,
  button2Text,
  loading: deleteLoading,
  removeConfirmation,
  onConferma,
  onAnnulla,
  isDeleting,
} = useEliminaLibro(libri, libroComposable)

const fetchData = async () => {
  try {
    const [libriData, generiData] = await Promise.all([
      libroComposable.getLibri('/api/v1/libri/'),
      libroComposable.getCategorie('/api/v1/categorie/'),
    ])
    libri.value = libriData
    generi.value = generiData
  } catch (err) {
    console.error('Errore recuperando i dati', err.message)
  }
}

onMounted(async () => {
  await fetchData()
})

let timeout = null

watch(filtro, (newFiltro, oldFiltro) => {
  // Clear any existing timeout
  clearTimeout(timeout)
  if (newFiltro === oldFiltro || newFiltro < 3) {
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
  if (soloDisponibili.value === true) {
    result = libri.value.filter((l) => l.disponibile)
  }
  console.log({ disponibili: soloDisponibili.value })
  if (genereSelezionato.value !== 'Tutti') {
    result = result.filter((l) => l.categorie.some((cat) => cat.nome === genereSelezionato.value))
  }

  if (!filtro.value || filtro.value.length < 3) return result
  return result.filter((l) => {
    // return result.filter((l) => {
    const titolo = (l.titolo || '').toLowerCase()
    const autore = (l.autore_oggetto.cognome || '').toLowerCase()
    const search = filtro.value.toLowerCase()
    return titolo.includes(search) || autore.includes(search)
  })
})
</script>

<template>

  <!-- <h2>Catalogo</h2>
  <ul>
    <li v-for="libro in libri" :key="libro.id">
      {{ libro.titolo }} di {{ libro.autore }} - genere: {{ libro.genere }} ({{ libro.anno }})
    </li>
  </ul> -->
  <LoadingSpinner v-if="loading || deleteLoading"/>
  <ModalVue
    v-if="showModal"
    @next="onConferma"
    @exit="onAnnulla"
    @modal-off="showModal = false"
    :button1="button1Text"
    :button2="button2Text"
    class="modal"
    />

  <h2>Ricerca libri</h2>
  <h3>Ricerca per disponibilità, titolo o autore</h3>
  <form class="form-container">
    <input type="text" v-model="filtro" placeholder="Inserisci testo..." />
    <div class="label">
      <label for="disponibile">Solo disponibili</label>

      <input id="disponibile" type="checkbox" v-model="soloDisponibili" />
      <CustomSelect v-model="genereSelezionato" :opzioni="generi" :text="text" />
    </div>
  </form>

  <h3>{{ libriFiltrati.length }} libri trovati su {{ libri.length }}</h3>
  <div class="parent">
    <LibroCard
      v-for="libro in libriFiltrati"
      :key="libro.id"
      v-bind="libro"
      @add-preferiti="togglePreferito"
      @on-delete="removeConfirmation"
      :preferito="arrayPreferiti.has(libro.id)"
      :class="[libro-card, { 'card-deleting': isDeleting(libro.id)}]" />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.modal {
  z-index: 10;
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
