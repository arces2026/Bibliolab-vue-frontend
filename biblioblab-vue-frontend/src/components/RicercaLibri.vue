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

const { getLibri, getCategorie} = useLibri()


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
} = useEliminaLibro(libri)

const fetchData = async () => {
  try {
    const [libriData, generiData] = await Promise.all([
      getLibri('/api/v1/libri/'),
      getCategorie('/api/v1/categorie/'),
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
      libri.value = await getLibri('/api/v1/libri/')
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

  <h1>Catalogo</h1>
  <h3>Ricerca per titolo o autore</h3>
  <form class="form-container">
    <input type="text" v-model="filtro" placeholder="Inserisci testo..." />
    <div class="label">
      <label for="disponibile">Mostra solo disponibili</label>

      <input id="disponibile" type="checkbox" v-model="soloDisponibili" />
      </div>
      <CustomSelect v-model="genereSelezionato" :opzioni="generi" :text="text" />

  </form>

  <h3>{{ libriFiltrati.length }} libri trovati su {{ libri.length }}</h3>
  <TransitionGroup name="card" tag="div" class="parent">
  <div class="parent"  v-for="libro in libriFiltrati"
      :key="libro.id">
    <LibroCard
      v-bind="libro"
      @add-preferiti="togglePreferito"
      @on-delete="removeConfirmation"
      :preferito="arrayPreferiti.has(libro.id)"
      :class="['libro-card', { 'card-deleting': isDeleting(libro.id)}]" />
  </div>
  </TransitionGroup>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.card-enter-active, /*Not used, it's for added cards */
.card-leave-active {
  transition: all 0.4s ease;
}

 /*  Not needed in this case*/
.card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.card-leave-active {
  position: absolute;
  width: 100%;
}

.card-deleting {
  opacity: 0 !important;
  transform: scale(0.5) !important;
  /* transform: translateX(-100px) scale(0.5) !important; */
  transition: all 0.4s ease !important;
}

.parent {
  position: relative; /* Needed for deletion animation (absolute children) */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.libro-card {
  grid-column: auto;
  grid-row: auto;
  transition: all 0.3s ease;
  background-color: rgb(152, 152, 177);
}
.modal {
  z-index: 10;
}

.filtro-genere {
  width: 200px;
  margin: auto;
}

h1,
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
