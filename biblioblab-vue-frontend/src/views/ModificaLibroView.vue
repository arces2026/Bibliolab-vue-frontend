<script setup>
import ModalVue from '@/components/ModalVue.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composable/useApi'
import FormVue from '@/components/FormVue.vue'

const { patchUpdateItem } = useApi()
const route = useRoute()
const router = useRouter()
const libro = ref({})
const showModal = ref(false)
const id = ref(null)
const success = ref(null)
const error = ref(null)
const button1Text = ref('')
const button2Text = ref('')

onMounted(async () => {
  id.value = route.params.id
})

const handlePatch = async (data) => {
  console.log('handlePatch fired')
  try {
    libro.value = await patchUpdateItem(`/api/v1/libri/${id.value}`, data)
    showModal.value = true
    button1Text.value = 'Visualizza'
    button2Text.value = 'Esci'
    success.value = `Il libro ${libro.value.titolo} è stato aggiornato con successo`
  } catch (err) {
    console.error('HTTP', err.message)
    error.value = `Errore durante la modifica del libro ${libro.value.titolo}`
  }
}

const onNext = () => router.push(`/libri/${id.value}`)
const onExit = () => router.push(`/libri`)
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
  <h1>Modifica libro</h1>
  <FormVue :id-libro="id" :is-edit="true" @patch-libro="handlePatch" />
</template>
