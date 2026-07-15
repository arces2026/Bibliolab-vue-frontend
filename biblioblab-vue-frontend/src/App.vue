<script setup>
// import RicercaLibri from './components/RicercaLibri.vue';
// import SchedaLibro from './components/SchedaLibro.vue';
// import CatalogoView from './views/CatalogoView.vue';


</script>

<template>
  <div id="app">
    <nav class="navbar">
      <RouterLink to="/" class="logo" >Bibliolab</RouterLink>
      <RouterLink :to="{name: 'catalogo'}">Libri</RouterLink>
      <RouterLink :to="{name: 'scheda-libro'}">Scheda Libro</RouterLink>
      <RouterLink :to="{name: 'ricerca'}">Ricerca Libri</RouterLink>
      <!-- <RouterLink :to="{name: 'prestiti'}">Prestiti</RouterLink> -->
    </nav>
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

<style scoped></style>
