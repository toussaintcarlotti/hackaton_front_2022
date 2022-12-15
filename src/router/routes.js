
const routes = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue'),
    name: 'Home'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
