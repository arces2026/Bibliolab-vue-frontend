import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useApi() {
  const { getCsrf } = useAuthStore()
  const loading = ref(false)

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
    loading,
  }
}
