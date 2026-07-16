<script setup>
import NavbarVue from './components/NavbarVue.vue';

// import RicercaLibri from './components/RicercaLibri.vue';
// import SchedaLibro from './components/SchedaLibro.vue';
// import CatalogoView from './views/CatalogoView.vue';


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

</style>
