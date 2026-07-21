<script setup>
import { useRouter } from 'vue-router'
import LibroForm from '@/components/LibroForm.vue'


const router = useRouter()

const onSuccess = () => {
  setTimeout(() => {
    router.push('/libri')
  }, 1500)
}
</script>

<template>
  <LibroForm @saved="onSuccess" />
</template>

<style scoped>

</style>
