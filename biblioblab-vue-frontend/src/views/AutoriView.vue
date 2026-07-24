<script setup>
import CardVue from '@/components/CardVue.vue';
import { useLibri } from '@/composable/useLibri';
import { onMounted, ref } from 'vue';


const { getAutori } = useLibri()
const autori = ref([])
const libri = ref([])


onMounted(async() => {
  try{
 autori.value = await getAutori('/api/v1/autori/')
 console.log({autori: autori.value})
  }catch(err){
    console.error('Errore recuperando gli autori', err.message)
  }
})

</script>

<template>
  <h1>Autori</h1>

  <div class="parent"  v-for="autore in autori"
      :key="autore.id">
    <CardVue
      :item="autore"
      :picture="autore.foto_url"
      :pic-alt="autore.nome + autore.cognome"
      :related-array="autore.libri_titles"
      :data_nascita="autore.data_nascita"
      :biografia="autore.biografia"
     />
  </div>

</template>

<style scoped>
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
.modal {
  z-index: 10;
}

</style>
