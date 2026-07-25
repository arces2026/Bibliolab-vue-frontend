import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useCreaItem() {
  const { getCsrf } = useAuthStore()
  const loading = ref(false)
  const success = ref(null)
  const error = ref(null)
  const items = ref([])

const newItem = async (url, dati) => {
  loading.value = true
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrf(),
      },
      body: JSON.stringify(dati),
    })
    if (!res.ok) {
      throw new Error(`Errore nella creazione del nuovo item: ${res.status}, ${res.statusText}`)
    }
    const data = await res.json()
    console.log({data: data})
    items.value.push(data)
    success.value = 'Nuovo item creato con successo'
    return data
  } catch (err) {
    error.value = `Error caught in newLibro: ${err.message}`
    throw err
  } finally {
    loading.value = false
  }
}
return {
  newItem,
}

}