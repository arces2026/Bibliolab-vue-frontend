<script setup>
import FormVue from '@/components/FormVue.vue';
import { useCreaItem } from '@/composable/useCreaItem';
import { ref } from 'vue'


const { newItem } = useCreaItem()
const itemData = ref({})

const postItem = async() => {
  await newItem('/api/v1/autori/', itemData)
}
</script>

<template>
  <h1>Inserisci Autore</h1>
  <FormVue />
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>