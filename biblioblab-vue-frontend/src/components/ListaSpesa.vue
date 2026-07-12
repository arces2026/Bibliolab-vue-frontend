<script setup>
import { ref } from 'vue'

const prodotto = ref('')
const lista = ref([])

const aggiungi = () => {
  if (prodotto.value.trim() === '') return
  lista.value.push({
    id: Date.now,
    nome: prodotto.value.trim(),
  })
  prodotto.value = ''
}
</script>
<template>
  <h2>Lista della Spesa</h2>
  <div class="contenitore">
  <input
    type="text"
    v-model="prodotto"
    placeholder="inserisci prodotto..."
    @keyup.enter="aggiungi"
  />
  <button @click="aggiungi">Aggiungi</button>
  <ul>
    <li v-for="(item, indice) in lista" :key="item.id">
      {{ item.nome }} <button @click="lista.splice(indice, 1)" class="rimuovi">🗑️</button>
    </li>
  </ul>
  <p v-if="lista.length > 0">Totale prodotti: {{ lista.length }}</p>
  <p v-else>Nessun articolo - aggiungi qualcosa!</p>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
h2 {
  text-align: center;
}
.contenitore {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
input {
  display: block;
  margin-top: 40px;
  width: 300px;
  padding: 4px;
  border-radius: 4px;
}
button {
  width: 150px;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
}

.rimuovi {
  border: none;
  background-color: transparent;
  width: 30px;
  transition: scale 0.3s ease-in-out;
}

.rimuovi:hover {
  scale: 1.2;
}

</style>
