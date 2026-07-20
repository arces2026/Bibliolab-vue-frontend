<script setup>
import LibroForm from '@/components/LibroForm.vue';
import { onMounted, ref } from 'vue';
import { useRoute} from 'vue-router'
// import { useLibri } from '@/composable/useLibri';

const route = useRoute()
const libro = ref({})
// const compLibro = useLibri()
const id = ref(null)
const success = ref(null)

onMounted(async() => {
  id.value = route.params.id
  // libro.value = await compLibro.getLibro(`/api/v1/libri/${id}`)
  console.log({libro: libro.value})
})

const handleUpdated = () => {
  success.value = `Il libro ${libro.value.titolo} è stato aggiornato con successo`
}
</script>

<template>
  <h1>Modifica libro</h1>
  <LibroForm
  :id-libro="id"
  :is-edit="true"
  @updated="handleUpdated"
  />
</template>
