<script setup>
import CardVue from '@/components/CardVue.vue'
import { useLibri } from '@/composable/useLibri'
import { useEliminaItem } from '@/composable/useEliminaItem'
import { usePreferiti } from '@/composable/usePreferiti.js'
import { onMounted, ref } from 'vue'
import ModalVue from './ModalVue.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const { getAutori } = useLibri()
const autori = ref([])
const loading = ref(false)
const success = ref('Sicuro di voler eliminare l\'autore?')

// Use the preferiti composable
const { arrayPreferiti, togglePreferito } = usePreferiti()

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
} = useEliminaItem(autori, {
  baseUrl: '/api/v1/autori/',
  itemName: 'autore',
})

onMounted(async () => {
  try {
    autori.value = await getAutori('/api/v1/autori/')
    console.log({ autori: autori.value })
  } catch (err) {
    console.error('Errore recuperando gli autori', err.message)
  }
})
</script>

<template>
  <LoadingSpinner v-if="loading || deleteLoading" />
  <ModalVue
    v-if="showModal"
    @next="onConferma"
    @exit="onAnnulla"
    @modal-off="showModal = false"
    :button1="button1Text"
    :button2="button2Text"
    :success="success"
    class="modal"
  />
  <TransitionGroup name="card" tag="div" class="parent">
    <div class="parent" v-for="autore in autori" :key="autore.id">
      <CardVue
        :item="autore"
        :picture="autore.foto_url"
        :related-array="autore.libri_objects"
        @on-delete="removeConfirmation(autore.id)"
        @add-preferiti="togglePreferito(autore.id)"
        :preferito="arrayPreferiti.has(autore.id)"
        :detail-link="'autore'"
        :class="['libro-card', { 'card-deleting': isDeleting(autore.id) }]"
      />
    </div>
  </TransitionGroup>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1 {
  text-align: center;
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
</style>
