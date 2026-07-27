import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useApi() {
  const { getCsrf } = useAuthStore()
  const loading = ref(false)

  const getItems = async (url) => {
    loading.value = true
    try {
      const res = await fetch(url)

      if (!res.ok)
        throw new Error(`Errore nel recupero degli autori, ${res.status}, ${res.statusText}`)
      const data = await res.json()

      // Check if it's a list or a single item
      if (Array.isArray(data)) {

        return data
      } else if (data.results && Array.isArray(data.results)) {

        return data.results
      } else {
        // It's a single object (detail endpoint)
        // Store it as a single item
        // autori.value = [data] // Store as array for consistency
        return data // Return the object directly
      }
    } catch (err) {
      console.error('Errore catturato recuperando gli autori', err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createItem = async (url, data) => {
    loading.value = true

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrf(),
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      return await res.json()
    } finally {
      loading.value = false
    }
  }

  return {
    createItem,
    getItems,
    loading,
  }
}
