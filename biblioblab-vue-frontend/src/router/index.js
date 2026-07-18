import { createRouter, createWebHistory } from 'vue-router'


const routes = [
{
  path: '/',
  redirect: '/libri'
},
{
  path: '/libri',
  name: 'catalogo',
  component: () => import('@/views/CatalogoView.vue'),
  meta: {titoloPagina: 'Catalogo Libri'}
},
{
  path: '/scheda-libro',
  name: 'scheda-libro',
  component: () => import('@/views/SchedaLibroView.vue'),
  meta: {titoloPagina: 'Scheda Libro'}
},
{
  path: '/ricerca',
  name: 'ricerca',
  component: () => import('@/views/RicercaLibriView.vue'),
  meta: {titoloPagina: 'Ricerca Libri'}
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/LoginView.vue'),
  meta: {titoloPagina: 'Login'}
},
{
  path: '/register',
  name: 'register',
  component: () => import('@/views/RegisterView.vue'),
  meta: {titoloPagina: 'Register'}
}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  //torna in cima ad ogni navigazione
  scrollBehavior: () => ({top: 0})
})
export default router
