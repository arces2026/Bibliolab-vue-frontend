<script setup>
import { useRouter } from 'vue-router'
import FormVue from '@/components/FormVue.vue'
import { useApi } from '@/composable/useApi'
import ModalVue from '@/components/ModalVue.vue'
import { ref } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { createItem, loading } = useApi()
const router = useRouter()
const success = ref(null)
const error = ref(null)
const showModal = ref(false)
const button1Text = ref('')
const button2Text = ref('')
const titolo = ref(null) // I need this because the form is cleaned soon after saving

const handleCreaLibro = async (libro) => {
  console.log('handleCreaLibro fired')
  success.value = null
  error.value = null
  titolo.value = libro.titolo
  try {
    const nuovoLibro = await createItem('/api/v1/libri/', libro)
    // arrayLibri.value.push(nuovoLibro)
    console.log({ nuovoLibro: nuovoLibro })
    button1Text.value = 'Inserisci altro libro'
    button2Text.value = 'Esci'
    showModal.value = true
    success.value = `Il libro "${titolo.value}" è stato salvato con successo`
  } catch (err) {
    console.error('Error caught: ', err.message)
    error.value = 'Errore nella creazione del libro: '+ titolo.value
  }
}

const onExit = () => {
  showModal.value = false
  router.push('/ricerca')
}
const onNext = () => (showModal.value = false)
</script>

<template>
  <LoadingSpinner v-if="loading"/>
  <ModalVue
    v-if="showModal"
    :success="success"
    :button1="button1Text"
    :button2="button2Text"
    @exit="onExit"
    @next="onNext"
    @modal-off="showModal = false"
  />
  <h1>Inserisci libro</h1>
  <FormVue @crea-libro="handleCreaLibro" />
  <p v-if="success" class="para success">{{ success }}</p>
  <p v-else class="para error">{{ error }}</p>
</template>

<style scoped>
h1 {
  text-align: center;
  margin: 30px;
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
