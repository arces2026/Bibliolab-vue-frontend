<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore()
console.log({utente: authStore.utente, isAuthenticated: authStore.isAuthenticated})
</script>

<template>
  <nav class="navbar">
      <RouterLink to="/about" class="logo" >Bibliolab</RouterLink>
      <!-- <RouterLink :to="{name: 'catalogo'}" class="navbar-link">Libri</RouterLink> -->
      <RouterLink v-if="authStore.utente && authStore.isStaff" :to="{name: 'inserisci-libro'}" class="navbar-link">Inserisci libro</RouterLink>
      <RouterLink :to="{name: 'ricerca'}" class="navbar-link">Ricerca Libri</RouterLink>
      <RouterLink  v-if="authStore.utente && authStore.isStaff" :to="{name: 'inserisci-autore'}" class="navbar-link">Inserisci autore</RouterLink>
      <RouterLink :to="{name: 'autori'}" class="navbar-link">Autori</RouterLink>
      <RouterLink v-if="authStore.isAuthenticated" class="navbar-link" :to="{name: 'profilo'}">Profilo</RouterLink>
      <RouterLink :to="{name: 'login'}" v-if="!authStore.isLogged" class="navbar-link">Login</RouterLink>
      <RouterLink :to="{name: 'register'}" v-if="!authStore.isLogged" class="navbar-link">Registrati</RouterLink>
      <RouterLink :to="{name: 'login'}" @click="authStore.logout" v-if="authStore.isLogged" class="navbar-link">Logout</RouterLink>
      <!-- <RouterLink :to="{name: 'prestiti'}">Prestiti</RouterLink> -->
    </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-evenly;
  padding: 20px;
  background-color: rgb(37, 33, 33);
  color: white;
  z-index: 5;
}

.navbar-link {
  color: white;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.navbar-link:hover {
  scale: 1.1;
  color: rgb(120, 120, 180);
}

.logo {
  font-weight: bolder;
  font-size: 1.5rem;
  color: rgb(120, 120, 180);
  text-decoration: none;
}
</style>
