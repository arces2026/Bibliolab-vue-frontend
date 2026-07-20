import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/libri',
  },
  {
    path: '/libri',
    name: 'catalogo',
    component: () => import('@/views/CatalogoView.vue'),
    meta: { titoloPagina: 'Catalogo Libri' },
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
    meta: { titoloPagina: 'Scheda Libro' },
  },
  {
    path: '/ricerca',
    name: 'ricerca',
    component: () => import('@/views/RicercaLibriView.vue'),
    meta: { titoloPagina: 'Ricerca Libri' },
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  //torna in cima ad ogni navigazione
  scrollBehavior: () => ({top: 0})
})
export default router
