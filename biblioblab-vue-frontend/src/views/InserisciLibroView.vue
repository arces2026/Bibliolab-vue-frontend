<script setup>
import { useRouter } from 'vue-router'
import LibroForm from '@/components/LibroForm.vue'
import ModalVue from '@/components/ModalVue.vue'
import { ref } from 'vue'


const router = useRouter()
const successMessage = ref('')
const showModal = ref(false)
const button1Text = ref('')
const button2Text = ref('')

const onSuccess = (libro) => {
  button1Text.value = 'Inserisci altro libro'
  button2Text.value = 'Esci'
  showModal.value = true
  successMessage.value = `Il libro "${libro.titolo}" è stato salvato con successo`
  // setTimeout(() => {
  //   router.push('/libri')
  // }, 1500)
}

const onExit = () => {
  showModal.value = false
  router.push('/libri')
}
const onNext = () => showModal.value = false
</script>

<template>
  <ModalVue v-if="showModal"
  :success="successMessage"
  :button1="button1Text"
  :button2="button2Text"
  @exit="onExit"
  @next="onNext"
  @modal-off="showModal=false"
  />
  <LibroForm @saved="onSuccess" />
</template>

<style scoped>

</style>
