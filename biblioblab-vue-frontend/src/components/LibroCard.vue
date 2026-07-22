<script setup>
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

const authStore = useAuthStore()
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
  cover_url: String,
  descrizione: {
    type: String,
    default: `Lorem ipsum dolor sit amet,
     ameconsectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua. Ut enim ad
     minim veniam, quis nostrud exercitation ullamco laboris nisi
     ut aliquip ex ea commodo consequat. Duis aute irure dolor in
     .`,
  },
  preferito: {
    type: Boolean,
    default: false,
  },
})


// Create a computed property for the cover URL
const coverUrl = computed(() => {
  return (
    props.cover_url ||
    `https://placehold.co/300x450/e2e8f0/1e293b?text=${encodeURIComponent(props.titolo || 'Book')}`
  )
})

const emit = defineEmits(['addPreferiti', 'onDelete'])

const onDelete = () => emit('onDelete', props.id)

const addPreferiti = () => emit('addPreferiti', props.id)
</script>

<template>
  <div class="container">
    <section class="cover">
      <RouterLink class="link-to-dettaglio" :to="{ name: 'libro', params: { id: id } }">
        <img :src="coverUrl" :alt="titolo" class="image" />
      </RouterLink>
      <span class="isbn">isbn: {{ isbn }} </span>
    </section>

    <section class="header">
      <h3>{{ titolo }} <span v-if="preferito">⭐</span></h3>
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
      <button @click="addPreferiti(id)" class="add-preferiti">{{ preferito ? 'Rimuovi' :'Aggiungi'}} ⭐</button>
    </section>

    <button v-if="authStore.isStaff" class="elimina" @click="onDelete">Elimina libro</button>
    <!-- <button v-if="authStore.isStaff" class="elimina" @click="onDelete">Elimina libro</button> -->
  </div>
</template>

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
  grid-template-columns: 120px minmax(120px, 1fr); /* Fixed width for cover, fluid for content */
  /* grid-template-columns: 120px 1fr; Fixed width for cover, fluid for content */
  grid-template-rows: auto auto auto auto; /* Let rows adjust based on content size */
  gap: 16px;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 1px 1px 12px;
  background-color: rgb(225, 225, 236);
  transition: all 0.2s ease;
}

.container:hover {
  scale: 1.01;
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
  box-shadow: 1px 1px 24px gray;
  transition: all 0.2s ease;
}

.image:hover {
  scale: 1.05;
  border: 1px solid blue;
  box-shadow: 3px 3px 6px black;
}

h3 {
  margin: 10px;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
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

.add-preferiti {
  padding: 5px;
  width: 80%;
  margin: auto;
  border-radius: 5px;
  background-color: rgb(120, 120, 180);
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-preferiti:hover {
  background-color: rgb(143, 143, 173);
  scale: 1.05;
  border: 1px solid blue;
  box-shadow: 3px 3px 6px black;
}

.add-preferiti:active {
  scale: 0.9;
}
</style>
