import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { titoloPagina: 'About' },
  },
  {
    path: `/libri/:id`,
    name: 'libro',
    component: () => import('@/views/DettaglioLibroView.vue'),
    meta: { titoloPagina: 'Libro' },
  },
  {
    path: `/modifica-libro/:id`,
    name: 'modifica-libro',
    component: () => import('@/views/ModificaLibroView.vue'),
    meta: { titoloPagina: 'ModificaLibro' },
  },
  {
    path: '/inserisci-libro',
    name: 'inserisci-libro',
    component: () => import('@/views/InserisciLibroView.vue'),
    meta: { titoloPagina: 'Inserisci Libro' },
  },
  {
    path: '/ricerca',
    name: 'ricerca',
    component: () => import('@/views/RicercaLibriView.vue'),
    meta: { titoloPagina: 'Ricerca Libri' },
  },
  {
    path: '/autori',
    name: 'autori',
    component: () => import('@/views/AutoriView.vue'),
    meta: { titoloPagina: 'Autori' },
  },
  {
    path: '/inserisci-autore',
    name: 'inserisci-autore',
    component: () => import('@/views/InserisciAutoreView.vue'),
    meta: { titoloPagina: 'Inserisci Autore' },
  },
  {
    path: '/autori/:id',
    name: 'autore',
    component: () => import('@/views/DettaglioAutoreView.vue'),
    meta: { titoloPagina: 'Autore' },
  },
  {
    path: '/modifica-autore/:id',
    name: 'modifica-autore',
    component: () => import('@/views/ModificaAutoreView.vue'),
    meta: { titoloPagina: 'Modifica autore' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { titoloPagina: 'Login' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { titoloPagina: 'Register' },
  },
  {
    path: '/profilo',
    name: 'profilo',
    component: () => import('@/views/ProfileView.vue'),
    meta: { titoloPagina: 'Profilo'}
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  //torna in cima ad ogni navigazione
  scrollBehavior: () => ({top: 0})
})
export default router
