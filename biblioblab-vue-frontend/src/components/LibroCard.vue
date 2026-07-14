<template>
  <div class="container">
    <section class="cover">
      <img :src="copertina" :alt="titolo" />
    </section>

    <section class="content">
      <h3>{{ titolo }}title</h3>
      <p><strong>Autore</strong>: {{ autore.nome }} {{ autore.cognome }}</p>
    </section>

    <section class="description">
      <p><strong>Descrizione</strong>: {{ descrizione.slice(0, 200) }}...</p>
    </section>
    <section class="anno">
      <span><strong>anno</strong>: {{ anno }}</span
      ><span :class="disponibile ? 'green' : 'red'">{{
        disponibile ? 'disponibile' : 'non disponibile'
      }}</span>
    </section>

    <section class="footer">
      <span>isbn: {{ isbn }} </span>
    </section>
  </div>
</template>

<script setup>
import defaultCover from '@/assets/libro_default.png'

defineProps({
  titolo: String,
  autore: {
    type: Object,
    required: true,
  },
  isbn: {
    type: String,
    default: '000-0-0000-0000-0',
  },
  anno: Number,
  genere: String,
  disponibile: {
    type: Boolean,
    default: true,
  },
  copertina: {
    type: String,
    default: defaultCover,
  },
  descrizione: {
    type: String,
    default: `Lorem ipsum dolor sit amet,
     ameconsectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua. Ut enim ad
     minim veniam, quis nostrud exercitation ullamco laboris nisi
     ut aliquip ex ea commodo consequat. Duis aute irure dolor in
     .`,
  },
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  /* border: 1px solid; */
}

.container {
  width: 40vw;
  min-width: 200px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr, 2fr, 1fr, 1fr;
  gap: 8px;
  transition: scale 0.3s ease;
}
.container:hover {
  scale: 1.1;
}

.cover {
  grid-row: span 4 / span 4;
}
img {
  width: 100%;
  object-fit: contain;
}
.content {
  grid-column-start: 2;
  grid-row-start: 1;
}
.description {
  grid-column-start: 2;
  grid-row-start: 2;
}
.green {
  color: green;
}
.red {
  color: red;
}
.anno {
  grid-column-start: 2;
  grid-row-start: 3;
}

.footer {
  grid-column-start: 2;
  grid-row-start: 4;
}
</style>
