<script setup>
import CardVue from '@/components/CardVue.vue'
import { useLibri } from '@/composable/useLibri'
import { onMounted, ref } from 'vue'

const { getAutori } = useLibri()
const autori = ref([])

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
<TransitionGroup name="card" tag="div" class="parent">
  <div class="parent" v-for="autore in autori" :key="autore.id">
    <CardVue
      :item="autore"
      :picture="autore.foto_url"
      :pic-alt="autore.nome + autore.cognome"
      :related-array="autore.libri_titles"
      :data_nascita="autore.data_nascita"
      :biografia="autore.biografia"
      :detail-link="'autore'"
      class="libro-card"
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
