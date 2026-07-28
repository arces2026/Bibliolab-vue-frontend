<script setup>
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

// Utente is a ref from the authStore so we can use it directly in the template
const { caricaUtente, utente } = useAuthStore()


onMounted(async () => {
  const user = await caricaUtente()
  console.log({ user: user })
})

const date = new Date(utente.iscritto_dal)
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
    <p>Utente: {{ utente.nome }} {{ utente.cognome }}</p>
    <p>Admin: {{ utente.is_superuser ? 'Sì' : 'No' }}</p>
    <p>Staff: {{ utente.is_staff ? 'Sì' : 'No' }}</p>
    <p>Email: {{ utente.email }}</p>
    <p>Username: {{ utente.username }}</p>
    <p>Iscritto dal: {{ formattedDate }}</p>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.container {
  padding: 40px;
}

p {
  margin-bottom: 20px;
  font-size: 1.2rem;
}
</style>
