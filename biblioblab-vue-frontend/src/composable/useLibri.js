import { ref } from 'vue'

export function useLibri() {
  const libri = ref([])
  const loading = ref(false)
  const error = ref(null)

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

  const newLibro = async (url, dati) => {
    loading.value = true
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          body: JSON.stringify(dati),
        },
      })
      if (!res.ok) {
        throw new Error(`Error creating a book: ${res.status}, ${res.statusText}`)
      }
      const data = await res.json()
      libri.value.push(data)
      return data
    } catch (err) {
      error.value = `Error caught in newLibro: ${err.message}`
      throw err
    } finally {
      loading.value = false
    }
  }

  return { libri, loading, error, getLibri, newLibro }
}
