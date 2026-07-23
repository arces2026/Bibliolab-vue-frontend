<script setup>
import { ref, onMounted, computed } from 'vue'
import LibroCard from '@/components/LibroCard.vue'
import { useLibri } from '@/composable/useLibri'
import { usePreferiti } from '@/composable/usePreferiti'
import { useEliminaLibro } from '@/composable/useEliminaLibro'
import ModalVue from '@/components/ModalVue.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import RicercaLibri from '@/components/RicercaLibri.vue'


const { getLibri} = useLibri()
const libri = ref([])

// Use the preferiti composable
const { arrayPreferiti, togglePreferito } = usePreferiti()

//Use the delete composable
const {
  showModal,
  button1Text,
  button2Text,
  loading,
  removeConfirmation,
  onConferma,
  onAnnulla,
  isDeleting,
} = useEliminaLibro(libri)


const libriDisponibili = computed(() => {
  return libri.value.filter((l) => l.disponibile).length
})

const totaleLibri = computed(() => libri.value.length)

onMounted(async () => (libri.value = await getLibri('/api/v1/libri/')))
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <ModalVue
    v-if="showModal"
    @next="onConferma"
    @exit="onAnnulla"
    @modal-off="showModal = false"
    :success="success"
    :button1="button1Text"
    :button2="button2Text"
    class="modal"
  />

  <div class="container">
    <RicercaLibri />
    <h1>Catalogo</h1>
    <h2>{{ libriDisponibili }} libri disponibili su {{ totaleLibri }}</h2>

    <TransitionGroup name="card" tag="div" class="parent">
      <div class="parent" v-for="libro in libri" :key="libro.id">
        <!-- <LibroCard
          v-bind="libro"
          @addPreferiti="togglePreferito"
          @onDelete="removeConfirmation"
          :preferito="arrayPreferiti.has(libro.id)"
          :class="['libro-card', { 'card-deleting': isDeleting(libro.id) }]"
        /> -->
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  margin: 20px;
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

.modal {
  z-index: 10;
}

.container {
  background-color: rgb(120, 120, 180);
  padding: 20px;
}

h1 {
  text-align: center;
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
</style>
