import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => ({ name: 'profile' })
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        name: 'login',
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
        name: 'register',
        meta: { guestOnly: true }
      }
    ]
  },
  {
    path: '/profile',
    meta: { requiresAuth: true },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ProfilePage.vue'),
        name: 'profile',
        meta: { title: null }
      },
      {
        path: 'measurments',
        component: () => import('pages/MeasurmentsPage.vue'),
        name: 'measurments'
      },
      {
        path: 'methods',
        component: () => import('pages/MethodsPage.vue'),
        name: 'methods'
      },
      {
        path: 'admin',
        component: () => import('pages/AdminPage.vue'),
        name: 'admin'
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'not_found',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
