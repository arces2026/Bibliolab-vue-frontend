import { defineStore } from "pinia";
import { ref, computed } from 'vue';
// import { useRouter } from 'vue-router'

export const useAutStore = defineStore('auth', () => {
  const utente = ref(null)//{id, username, email, isStaff}
  const loading = ref(false)

  const isLogged = computed(() => utente.value !== null)
  const isStaff = computed(() => utente.value?.is_staff === true)

  async function login(username, password) {
    loading.value = true
    try {
      //1. Ottieni CSRF token
      const csrfRes = await fetch('/accounts/api/auth/csrf/', {credentials: 'include'})
      console.log({csrftoken: csrftoken})

      const {csrftoken} = await csrfRes.json() //Check what the backend returns
      //2. login with with the extracted csrftoken
      const res = await fetch('accounts/api/auth/login/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken, //use the token from the response, not cookie
          // 'X-CSRFToken': getCsrf(),
        },
        body: JSON.stringify({username, password})
      })

      if (!res.ok) throw new Error(`Credenziali non valide: ${res.status} ${res.statusText}`)

        utente.value = await res.json()
        console.log({utente: utente.value})
    }catch(err){
      console.error('Error trying to login:', err)
      throw err('Error logging', err)
    } finally{
      loading.value = false
    }
  }

  async function logout() {
    await fetch('/api/auth/logout/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrf()
      }
    })
    utente.value = null
  }

  async function caricaUtente () {
    loading.value = true
    try{
      const res = await fetch('/api/auth/me/', {credentials: 'include'})

      if (!res.ok) throw new Error(`Utente non loggato: ${res.status} ${res.statusText}`)
        utente.value = await res.json()
    }catch(err){
      console.error('Errore caricando utente', err)
    } finally {
      loading.value = false
    }
  }

  function getCsrf(){
    return document.cookie.split(';')
    .find(c => c.trim().startsWith('csrftoken='))
    ?.split('=')[1] || ''
  }

  return { utente, loading, isLogged, isStaff, login, logout, caricaUtente}
})
