<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLibri } from '@/composable/useLibri'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()
const libro = ref({})
const compLibro = useLibri()
const id = ref(null)

onMounted(async () => {
  const id = route.params.id //get id from route parameters
  libro.value = await compLibro.getLibro(`/api/v1/libri/${id}`)
})
</script>

<template>
  <div class="card-container">
    <div class="libro-card">
      <div class="libro-cover">
        <img :src="libro.cover_url" :alt="libro.titolo" />
      </div>

      <div class="libro-content">
        <div class="libro-header">
          <h2>{{ libro.titolo }}</h2>
          <RouterLink v-if="authStore.utente && authStore.isStaff" :to="{ name: 'modifica-libro', params: { id: id } }">Modifica</RouterLink>
          <span
            class="status"
            :class="{ available: libro.disponibile, unavailable: !libro.disponibile }"
          >
            {{ libro.disponibile ? 'Disponibile' : 'Non disponibile' }}
          </span>
        </div>

        <p class="author">
          {{ libro.autore_oggetto?.nome }}
          {{ libro.autore_oggetto?.cognome }}
        </p>

        <div class="categories">
          <span v-for="categoria in libro.categorie" :key="categoria.id" class="category">
            {{ categoria.nome }}
          </span>
        </div>

        <p class="description">
          {{ libro.descrizione }}
        </p>

        <div class="details">
          <div>
            <strong>Pubblicato</strong>
            <span>{{ libro.anno_pubblicazione }}</span>
          </div>

          <div>
            <strong>ISBN</strong>
            <span>{{ libro.isbn }}</span>
          </div>

          <div>
            <strong>Aggiunto</strong>
            <span>{{ new Date(libro.data_aggiunta).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.libro-card {
  display: flex;
  gap: 2rem;
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  transition: 0.3s;
}

.libro-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
}

.libro-cover img {
  width: 220px;
  border-radius: 12px;
  object-fit: cover;
}

.libro-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.libro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.libro-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #222;
}

.author {
  margin: 0.4rem 0 1rem;
  color: #666;
  font-size: 1.1rem;
  font-style: italic;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.3rem;
}

.category {
  background: #edf2ff;
  color: #3559d6;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.description {
  line-height: 1.7;
  color: #444;
  margin-bottom: 2rem;
}

.details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: auto;
}

.details div {
  background: #f8f8f8;
  padding: 0.9rem;
  border-radius: 10px;
}

.details strong {
  display: block;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.details span {
  font-weight: 600;
  color: #222;
}

.status {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  color: white;
  font-size: 0.85rem;
  font-weight: bold;
}

.available {
  background: #2e9d45;
}

.unavailable {
  background: #d63c3c;
}

@media (max-width: 700px) {
  .libro-card {
    flex-direction: column;
  }

  .libro-cover img {
    width: 100%;
    max-width: 300px;
    margin: auto;
    display: block;
  }

  .details {
    grid-template-columns: 1fr;
  }
}
</style>
