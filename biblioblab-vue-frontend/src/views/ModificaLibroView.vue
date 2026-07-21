<script setup>
import LibroForm from '@/components/LibroForm.vue'
import ModalVue from '@/components/ModalVue.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const libro = ref({})
const showModal = ref(false)
const id = ref(null)
const success = ref(null)
const button1Text = ref('')
const button2Text = ref('')

onMounted(async () => {
  id.value = route.params.id
  console.log({ libro: libro.value })
})

const handleUpdated = () => {
  showModal.value = true
  button1Text.value = 'Visualizza'
  button2Text.value = 'Esci'
  success.value = `Il libro ${libro.value.titolo} è stato aggiornato con successo`
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
  <LibroForm :id-libro="id" :is-edit="true" @updated="handleUpdated" />
</template>
