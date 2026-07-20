<template>
  <div class="container">

    <section class="cover">
      <RouterLink class="link-to-dettaglio" :to="{ name: 'libro', params: { id: id } }">
        <img :src="cover_url" :alt="titolo" class="image"/>
      </RouterLink>
      <span class="isbn">isbn: {{ isbn }} </span>

    </section>

    <section class="header">
      <h3>{{ titolo }} <span v-if="inEvidenza">⭐</span></h3>
      <p><strong>Autore</strong>: {{ autore_oggetto.nome }} {{ autore_oggetto.cognome }}</p>
      <hr />
    </section>

    <section class="genere">
      <ul class="genere">
        <strong>Genere</strong
        >:
        <li v-for="genere in categorie" :key="genere.id">{{ genere.nome }}</li>
      </ul>
      <hr />
    </section>

    <section class="description">
      <p><strong>Descrizione</strong>: {{ descrizione.slice(0, 200) }}...</p>
      <hr />
    </section>
    <section class="anno">
      <span><strong>pubblicato nel</strong>: {{ anno_pubblicazione }}</span
      ><span :class="disponibile ? 'green' : 'red'">{{
        disponibile ? 'disponibile' : 'non disponibile'
      }}</span>
      <button v-if="authStore.isStaff" @click="onEvidenzia(id)" class="evidenzia">Evidenzia ⭐</button>
    </section>

    <section class="footer">
      <!-- <span>isbn: {{ isbn }} </span> -->
    </section>

     <!-- Debug info -->
  <pre>isStaff: {{ authStore.isStaff }}</pre>
  <pre>utente: {{ authStore.utente }}</pre>
  <pre>isAuthenticated: {{ authStore.isAuthenticated }}</pre>
    <button v-if="authStore.isStaff" class="elimina" @click="onDelete">Elimina libro</button>
    <!-- <p v-if="error">{{ error }}</p> -->
  </div>
</template>

<script setup>
import { useLibri } from '@/composable/useLibri.js'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const compoLibro = useLibri()
// const error = ref(null)

const props = defineProps({
  id: Number,
  titolo: String,
  autore_oggetto: {
    type: Object,
    required: true,
  },
  isbn: {
    type: String,
    default: '000-0-0000-0000-0',
  },
  anno_pubblicazione: Number,
  categorie: Array,
  // genere: String,
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
    default: false,
  },
})

const onDelete = async() => {
  try {
  const result = await compoLibro.eliminaLibro(`/api/v1/libri/${props.id}/`)
  emit('delete', props.id)
  console.log('Libro eliminato con successo', result)
  }catch(err){
    console.error('Errore durante l\'eliminazione', err.message)
    alert('Errore durante l\'eliminazione:' + err.message)
  }
}

const emit = defineEmits(['evidenzia', 'delete'])

const onEvidenzia = () => emit('evidenzia', props.id)
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  /* border: 1px solid; */
}

.elimina {
  position: absolute;
  left: 20px;
  bottom: 20px;
  background-color: red;
  color: white;
  padding: 5px;
  cursor: pointer;
}

hr {
  width: 70%;
  margin: 5px auto;
  border-color: rgba(245, 242, 242, 0.021);
  box-shadow: 1px 1px 10px;
}
.container {
  position: relative;
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

  /* border: 1px solid blue; */
  padding: 12px;
  border-radius: 10px;
  box-shadow: 1px 1px 12px;
  background-color: #ffffff;
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
.image {
  height: 100%;
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 2px 5px 5px 2px;
  /* border: 1px solid blue; */
  box-shadow: 1px 1px 24px gray;
  transition: all 0.2s ease;
}

.image:hover {
  scale: 1.05;
  border: 1px solid blue;
}

h3 {
  margin: 10px;
  text-align: center;
}

.header {
  grid-column: 2;
  grid-row: 1;
}

.genere {
  list-style: none;
  grid-column: 2;
  grid-row: 2;
}

.description {
  grid-column: 2;
  grid-row: 3;
  font-size: 0.85rem;
  color: #475569;
}

.anno {
  grid-column: 2;
  grid-row: 4;
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
  cursor: pointer;
  transition: all 0.2s ease;
}

.evidenzia:hover {
  background-color: rgb(115, 138, 189);
  scale: 1.05;
  border: 1px solid blue;
}
</style>
