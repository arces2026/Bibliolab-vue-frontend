<script setup>
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';


// Utente is a ref from the authStore so we can use it directly in the template
const { caricaUtente, utente } = useAuthStore() 

onMounted(async() => {
  const user = await caricaUtente()
  console.log({user: user})
} )
</script>

<template>
  <h1>Profile</h1>
  <p>Utente: {{ utente.nome }} {{ utente.cognome }}</p>
  <p>Admin: {{ utente.is_superuser ? 'Sì': 'No' }}</p>
  <p>Staff: {{ utente.is_staff ? 'Sì' : 'No' }}</p>
  <p>Email: {{ utente.email }}</p>
  <p>Username: {{ utente.username }}</p>
  <p>Iscritto dal: {{ utente.iscritto_dal }}</p>
</template>