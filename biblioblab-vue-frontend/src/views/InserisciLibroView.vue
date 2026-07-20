<script setup>
import { useRouter} from 'vue-router'
import LibroForm from '@/components/LibroForm.vue';
import { ref } from 'vue'

const success = ref(null)

const onSuccess = (libro) => {
  // alert(`Libro ${libro.titolo} salvato con successo`)
  // router.push('/libri')
  success.value = `${libro.titolo} salvato con successo!`
}

</script>

<template>
<LibroForm @saved="onSuccess"/>
<p v-if="success">{{ success }}</p>
</template>
