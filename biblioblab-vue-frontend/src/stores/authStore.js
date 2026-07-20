import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const utente = ref(null) //{id, username, email, isStaff}
  const isAuthenticated = ref(false)
  const isLogged = computed(() => utente.value !== null)
  const isStaff = computed(() => utente.value?.isStaff === true)
  const error = ref(null)
  const success = ref(null)
  const loading = ref(false)
  const API_BASE = '/api/vue/auth/'
  const route = useRoute()
  const router = useRouter()

  async function register(userData) {
    loading.value = true
    error.value = null

    try {
      console.log('📝 Registering with data:', userData)
      console.log('🔑 CSRF Token being sent:', getCsrf())

      const res = await fetch(`${API_BASE}register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrf(),
        },
        credentials: 'include', //for cookie session
        body: JSON.stringify(userData),
      })

       if (!res.ok) {
           throw new Error(`Validation failed: ${Error.message}`)
         }

      const data = await res.json()
      console.log('📦 Response:', { status: res.status, data: res.statusText})
      success.value = 'Registrazione avvenuta con successo. Redirecting...'
      // Auto-login after Registration
      await login(userData.username, userData.password)
      isAuthenticated.value = true
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(username, password) {
    try {
      //1. Ottieni CSRF token
      // const csrfRes = await fetch('/api/auth/csrf/', { credentials: 'include' })
      // const { csrftoken } = await csrfRes.json() //Check what the backend returns
      // console.log({ csrftoken: csrftoken })

      //2. login with with the extracted csrftoken
      const res = await fetch(`${API_BASE}login/`, {
        // const res = await fetch('accounts/api/auth/login/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // 'X-CSRFToken': csrftoken, //use the token from the response, not cookie
          'X-CSRFToken': getCsrf(), // get token from cookie
        },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) throw new Error(`Credenziali non valide: ${res.status} ${res.statusText}`)

      utente.value = await res.json()
      console.log({ utente: utente.value })
      isAuthenticated.value = true
      //  const redirect = route.query.redirect || '/libri'
      //  router.push(redirect)

    } catch (err) {
      console.error('Error trying to login:', err)
      throw err
    }
  }

  async function logout() {
    await fetch(`${API_BASE}logout/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrf(),
      },
    })
    utente.value = null
    isAuthenticated.value = false
  }

  async function caricaUtente() {
    try {
      const res = await fetch(`${API_BASE}me/`, {
        credentials: 'include',
      })

      if (res.status === 401 || res.status === 403) {
        // User is not authenticated, clear the store
        utente.value = null
        isAuthenticated.value = false
        return null
      }

      if (!res.ok) throw new Error(`Errore: ${res.status} ${res.statusText}`)

      const userData = await res.json()
      utente.value = userData
      isAuthenticated.value = true
      console.log('✅ User session restored:', userData)
      return userData
    } catch (err) {
      console.error('❌ Errore caricando utente:', err)
      utente.value = null
      isAuthenticated.value = false
      return null
    }
  }

  //ottiene il token dal session cookie
  function getCsrf() {
    return (
      document.cookie
        .split(';')
        .find((c) => c.trim().startsWith('csrftoken='))
        ?.split('=')[1] || ''
    )
  }

  return { isAuthenticated, utente, isLogged, isStaff, loading, success, error, register, login, logout, caricaUtente, getCsrf }
})
