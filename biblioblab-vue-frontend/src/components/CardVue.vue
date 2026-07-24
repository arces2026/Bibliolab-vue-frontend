<script setup>
import { useAuthStore } from '@/stores/authStore';


const authStore = useAuthStore()

//Generic props - just accept an item with any structure
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  picture: String,
  picAlt: String,
  titolo: String,
  relatedArray: Array, //generi o libri
  disponibile: {
    type: Boolean,
    default: true
  },
  anno_pubblicazione: String,
  detailLink: String,
  preferito: String
})

// console.log({item: props.item})
</script>

<template>
  <div class="container">
    <section class="cover">
      <RouterLink class="link-to-dettaglio" :to="{ name: detailLink, params: { id: item.id } }">
        <img :src="picture" :alt="`${item.nome} ${item.cognome}`" class="image" />
      </RouterLink>
      <span v-if='item.isbn' class="isbn">isbn: {{ item.isbn }} </span>
    </section>

    <section class="header">
      <h3 v-if="titolo">{{ titolo }} <span v-if="preferito">⭐</span></h3>
      <p v-if="item.autore_oggetto"><strong>Autore</strong>: {{ item.autore_oggetto.nome }} {{ item.autore_oggetto.cognome }}</p>
      <h3 v-if="item.cognome">{{ item.nome }} {{ item.cognome }}</h3>
      <hr />
    </section>

    <section class="genere">
      <ul class="genere">
        <strong>{{item.categorie ? 'Genere' : 'Libri'}}</strong
        >:
        <li v-for="oggetto in relatedArray" :key="oggetto.id">{{ oggetto }}</li>
      </ul>

      <hr />
    </section>

    <section class="description">
      <p v-if="item.descrizione"><strong>Descrizione</strong>: {{ item.descrizione.slice(0, 200) }}...</p>
      <p v-if="item.biografia"><strong>Biografia</strong>: {{ item.biografia.slice(0, 200) }}...</p>
      <hr />
    </section>
    <section class="anno">
      <span v-if="item.anno_pubblicazione"><strong>pubblicato nel</strong>: {{ item.anno_pubblicazione }}</span
      ><span v-if="item.anno_pubblicazione" :class="disponibile ? 'green' : 'red'">{{
        disponibile ? 'disponibile' : 'non disponibile'
      }}</span>
      <span v-if="item.data_nascita"><strong>Nato nel</strong> {{ item.data_nascita }}</span>
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
