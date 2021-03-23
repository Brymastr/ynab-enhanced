import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Landing from '../views/Landing.vue';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/app',
    component: Main,
    meta: { requiresLogin: true },
    children: [
      {
        path: '/app',
        name: 'Net Worth',
        component: () => import(/* webpackChunkName: "net-worth" */ '../views/NetWorth.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
