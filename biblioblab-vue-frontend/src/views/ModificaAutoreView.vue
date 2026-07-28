<script setup>
import FormVue from '@/components/FormVue.vue'
import ModalVue from '@/components/ModalVue.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composable/useApi'

const { patchUpdateItem } = useApi()
const route = useRoute()
const router = useRouter()
const id = ref(null)
const showModal = ref(false)
const button1Text = ref('Visualizza')
const button2Text = ref('Esci')
const success = ref(null)
const autore = ref({})
const error = ref(null)

onMounted(() => {
  id.value = route.params.id
})

const handlePatch = async (data) => {
  error.value = null
  try {
    autore.value = await patchUpdateItem(`/api/v1/autori/${id.value}`, data)
    console.log({autore: autore.value})
    showModal.value = true
    button1Text.value = 'Visualizza'
    button2Text.value = 'Esci'
    success.value = `L'autore ${autore.value.cognome} è stato aggiornato con successo`
  } catch (err) {
    console.error('HTTP', err.message)
    error.value = "Errore tentando di modificare l'autore"
  }
}

const onNext = () => router.push(`/autori/${id.value}`)
const onExit = () => router.push(`/autori`)
</script>

<template>
  <ModalVue
    v-if="showModal"
    @next="onNext"
    @exit="onExit"
    @modal-off="showModal = false"
    :success="success"
    :button1="button1Text"
    :button2="button2Text"
  />
  <h1>Modifica autore</h1>
  <FormVue :id-autore="id" :is-edit="true" @patch-autore="handlePatch" />
</template>
