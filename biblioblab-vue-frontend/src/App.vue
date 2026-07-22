<script setup>
import NavbarVue from './components/NavbarVue.vue';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore.js';

const authStore = useAuthStore()

// Mantiene la sessione dopo refresh
onMounted(async() => {
  await authStore.caricaUtente()
})

</script>

<template>
  <div id="app">
    <NavbarVue />
    <main>
      <RouterView />
    </main>
  </div>
  <!-- <ContatoreVue/>
  <ListaSpesa /> -->
  <!-- <CatalogoView />
  <SchedaLibro />
  <RicercaLibri /> -->
</template>

<style scoped>
#div {
  background-color: brown;
}
</style>
