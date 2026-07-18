<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore()
</script>

<template>
  <nav class="navbar">
      <RouterLink to="/" class="logo" >Bibliolab</RouterLink>
      <RouterLink :to="{name: 'catalogo'}">Libri</RouterLink>
      <RouterLink :to="{name: 'scheda-libro'}">Scheda Libro</RouterLink>
      <RouterLink :to="{name: 'ricerca'}">Ricerca Libri</RouterLink>
      <RouterLink :to="{name: 'login'}" v-if="!authStore.isLogged">Login</RouterLink>
      <RouterLink :to="{name: 'login'}" @click="authStore.logout" v-if="authStore.isLogged">Logout</RouterLink>
      <!-- <RouterLink :to="{name: 'prestiti'}">Prestiti</RouterLink> -->
    </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-evenly;
  padding: 1px;
  margin: 10px;
}
</style>
