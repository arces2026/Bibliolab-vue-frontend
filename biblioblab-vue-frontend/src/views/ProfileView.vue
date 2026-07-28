<script setup>
import { useAuthStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
import { useApi } from '@/composable/useApi'
import { RouterLink } from 'vue-router'

// Utente is a ref from the authStore so we can use it directly in the template
const { caricaUtente } = useAuthStore()
const { getItems } = useApi()
const utente = ref({})
const arrayPreferiti = ref([])
const libri = ref([])
const libriPreferiti = ref([])


onMounted(async () => {
  utente.value = await caricaUtente()
 
  const preferitiString = localStorage.getItem('preferiti')
  arrayPreferiti.value = preferitiString ? JSON.parse(preferitiString) : []

  libri.value = await getItems('/api/v1/libri/')
  console.log({libri: libri.value})

  libriPreferiti.value = libri.value.filter(libro => arrayPreferiti.value.includes(libro.id))
  console.log({libriPreferiti : libriPreferiti.value})
})

const date = new Date(utente.value.iscritto_dal)
console.log({date: date})

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}
const formattedDate = date.toLocaleDateString('it-IT', options)
</script>

<template>
  <h1>Profile</h1>
  <div class="container">
    <div class="utente">
    <p>Utente: {{ utente.nome }} {{ utente.cognome }}</p>
    <p>Admin: {{ utente.is_superuser ? 'Sì' : 'No' }}</p>
    <p>Staff: {{ utente.is_staff ? 'Sì' : 'No' }}</p>
    <p>Email: {{ utente.email }}</p>
    <p>Username: {{ utente.username }}</p>
    <p>Iscritto dal: {{ formattedDate }}</p>
    </div>
    <div class="preferiti">
      <ul>Libri preferiti
        <li v-for="libro in libriPreferiti" :key="libro.id"><RouterLink :to="{name : 'libro', params: {id : libro.id}}">{{ libro.titolo }}</RouterLink></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.container {
  padding: 40px;
  display: flex;
  justify-content: space-evenly;
}

p {
  margin-bottom: 20px;
  font-size: 1.2rem;
}
</style>
