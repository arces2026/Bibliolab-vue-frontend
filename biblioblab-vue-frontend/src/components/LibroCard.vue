<template>
  <div class="container">
    <section class="cover">
      <img :src="cover_url" :alt="titolo" />
      <span class='isbn'>isbn: {{ isbn }} </span>
    </section>

    <section class="header">
      <h3>{{ titolo }} <span v-if="inEvidenza">⭐</span></h3>
      <p><strong>Autore</strong>: {{ autore.nome }} {{ autore.cognome }}</p>
    </section>

    <section class="description">
      <p><strong>Descrizione</strong>: {{ descrizione.slice(0, 200) }}...</p>
    </section>
    <section class="anno">
      <span><strong>pubblicato nel</strong>: {{ anno_pubblicazione }}</span
      ><span :class="disponibile ? 'green' : 'red'">{{
        disponibile ? 'disponibile' : 'non disponibile'
      }}</span>
      <button @click="onEvidenzia(id)" class="evidenzia">Evidenzia ⭐</button>
    </section>

    <section class="footer">
      <!-- <span>isbn: {{ isbn }} </span> -->
    </section>
  </div>
</template>

<script setup>
// import { emit } from 'vue'
// import defaultCover from '@/assets/libro_default.png'

const props = defineProps({
  id: Number,
  titolo: String,
  autore: {
    type: Object,
    required: true,
  },
  isbn: {
    type: String,
    default: '000-0-0000-0000-0',
  },
  anno_pubblicazione: Number,
  genere: String,
  disponibile: {
    type: Boolean,
    default: true,
  },
  cover_url: {
    type: String,
    default: (props) =>
      // `https://www.googleapis.com/books/v1/volumes?q=${props.titolo}`
      `https://placehold.co/300x450/e2e8f0/1e293b?text=${encodeURIComponent(props.titolo || 'Book')}`,
    // default: defaultCover,
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
  inEvidenza: {
    type: Boolean,
    default: false
  }
})


const emit = defineEmits(['evidenzia'])

const onEvidenzia = () => emit('evidenzia', props.id)
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  /* border: 1px solid; */
}

.container {
  width: 100%;
  max-width: 500px;
  min-width: 200px;
  height: 100%;
  min-height: 250px;
  display: grid;
  /* grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr, 2fr, 1fr, 1fr; */
  grid-template-columns: 120px 1fr; /* Fixed width for cover, fluid for content */
  grid-template-rows: auto auto auto auto; /* Let rows adjust based on content size */
  gap: 8px;
  transition: scale 0.2s ease;
  /* border: 1px solid blue; */
  padding: 12px;
  border-radius: 10px;
  box-shadow: 1px 1px 12px;
  background-color: #ffffff;
}
.container:hover {
  scale: 1.02;
}

.cover {
  grid-row: span 4;
  /* height: 100%; */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
}

.isbn {
    font-size: 0.75rem;
  color: #94a3b8;

}
img {
  height: 100%;
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 2px 5px 5px 2px;
  /* border: 1px solid blue; */
  box-shadow: 1px 1px 24px gray;
}
h3 {
  margin: 10px;
}
/* .content {
  grid-column-start: 2;
  grid-row-start: 1;
} */

.header {
  grid-column: 2;
  grid-row: 1;
}

/* .description {
  grid-column-start: 2;
  grid-row-start: 2;
} */

.description {
  grid-column: 2;
  grid-row: 2;
  font-size: 0.85rem;
  color: #475569;
}

.anno {
  grid-column: 2;
  grid-row: 3;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  gap: 16px;
  font-size: 0.8rem;
}

.green {
  color: green;
}
.red {
  color: red;
}

.evidenzia {
  padding: 5px;
  width: 80%;
  margin: auto;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;
}

.evidenzia:hover {
  background-color: rgb(202, 211, 211);
}
</style>
