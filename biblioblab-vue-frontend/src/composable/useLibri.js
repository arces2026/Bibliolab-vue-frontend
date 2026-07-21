import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useLibri() {
  const libri = ref([])
  const libro = ref({})
  const loading = ref(false)
  const error = ref(null)
  const autori = ref([])
  const categorie = ref([])
  const authStore = useAuthStore()


  const getLibri = async (url) => {
    loading.value = true
    try {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Error in getLibri: ${res.status} ${res.statusText}`)
      }
      const data = await res.json()
      libri.value = data.results
      return data.results
    } catch (err) {
      console.error('Error caught in getLibri', err)
      error.value = err.message || 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const getLibro = async (url) => {
    try {
      const res = await fetch(url)
      if (!res.ok)
        throw new Error(`Errore recuperando il libro ${libro.value.titolo}: ${res.status} ${res.statusText}`)
      const data = await res.json()
      libro.value = data
      console.log({ data: libro.value })
      return data
    } catch (err) {
      console.error('Errore nel recupero del libro', err.message)
    }
  }

  const getAutori = async (url) => {
    loading.value = true
    try {
      const res = await fetch(url)

      if (!res.ok) throw new Error('Errore nel recupero degli autori', res.status, res.statusText)

      const data = await res.json()
      autori.value = data.results || data
      console.log({ autori: autori.value })
      return autori.value
    } catch (err) {
      console.error('Errore catturato recuperando gli autori', err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategorie = async (url) => {
    loading.value = true
    try {
      const res = await fetch(url)

      if (!res.ok)
        throw new Error('Errore nel recupero delle categorie', res.status, res.statusText)
      const data = await res.json()
      categorie.value = data.results
      console.log({ categorie: categorie.value })
      return categorie.value
    } catch (err) {
      console.error('Errore catturato recuperando le categorie', err.message)
    } finally {
      loading.value = false
    }
  }

  const newLibro = async (url, dati) => {
    loading.value = true
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': authStore.getCsrf(),
        },
        body: JSON.stringify(dati),
      })
      if (!res.ok) {
        throw new Error(`Error creating a book: ${res.status}, ${res.statusText}`)
      }
      const data = await res.json()
      console.log({ nuovoLibro: data })
      libri.value.push(data)
      return data
    } catch (err) {
      error.value = `Error caught in newLibro: ${err.message}`
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateLibro = async (url, libroData) => {
    try {
      const response = await fetch(url, {
        method: 'PATCH', // or 'PATCH' if you want partial updates
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': authStore.getCsrf(),
        },
        body: JSON.stringify(libroData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating book:', error)
      throw error
    }
  }

  const eliminaLibro = async(url) => {
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': authStore.getCsrf(),
        },
      })
      if (!res.ok)
        throw new Error(
          `Errore eliminando il libro ${libro.value.titolo}: ${res.status} ${res.statusText}`,
        )
     return { success: true, status: res.status }
    } catch (err) {
      console.error('Errore catturato eliminando il libro ', libro.value.titolo, err.message)
      throw err
    }
  }

  return {
    libri,
    loading,
    error,
    getLibri,
    getLibro,
    newLibro,
    updateLibro,
    eliminaLibro,
    getAutori,
    getCategorie,
  }
}
