<script setup>
import FormVue from '@/components/FormVue.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useApi } from '@/composable/useApi'
import { ref } from 'vue'

const { createItem, loading } = useApi()
const arrayAutori = ref([]) // On createItem, in useApi, itemsArray is a ref as well, because arrayAutori is !!!
const success = ref(null)
const error = ref(null)

const handleCreaAutore = async(autore) => {
  success.value = null
  error.value = null

  try {
    
    const nuovoAutore = await createItem('/api/v1/autori/', autore)
    arrayAutori.value.push(nuovoAutore)
  
    success.value = `L'autore ${autore.cognome} è stato creato con successo`
  } catch (err) {
    console.error('Errore creazione autore',err.message)
    error.value = 'Errore nella creazione del nuovo autore'
  }
}
</script>

<template>
  <h1>Inserisci Autore</h1>
  <LoadingSpinner v-if="loading"/>
  <FormVue @saved="handleCreaAutore" />
  <p v-if="success" class="para success">{{ success }}</p>
  <p v-else class="para error">{{ error }}</p>
</template>

<style scoped>
h1 {
  text-align: center;
}

.para {
  font-size: 1.5rem;
  text-align: center;
}

.para.success {
  color: green;
}

.para.error {
  color: red;
}
</style>
