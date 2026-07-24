<script setup>
import { useLibri } from '@/composable/useLibri.js'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const { getAutori } = useLibri()
const route = useRoute()
const autore = ref({})

onMounted(async() => {
   const id = route.params.id
  console.log('Route params:', route.params)
  console.log('ID:', id)
  console.log('Full URL:', `/api/v1/autori/${id}`)
  try{
  autore.value = await getAutori(`/api/v1/autori/${id}`)
  console.log({autore: autore.value})
  } catch(err){
    console.error('Errore in dettaglio autore', err.message)
  }
})
</script>

<template>
  <h1>Dettaglio autore</h1>
</template>
