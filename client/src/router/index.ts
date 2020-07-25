import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Main from '../views/Main.vue';
import Login from '../views/Login.vue';
import store from '../store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
    meta: { requiresLogin: true },
  },
  {
    path: '/net-worth',
    name: 'Net Worth',
    component: () => import(/* webpackChunkName: "net-worth" */ '../views/NetWorth.vue'),
    meta: { requiresLogin: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// loggedIn navigation guard
router.beforeEach((to, from, next) => {
  const loggedIn = store.state.user.loginStatus === 'loggedIn';
  if (to.matched.some(record => record.meta.requiresLogin) && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

// don't go to login if already logged in
router.beforeEach((to, from, next) => {
  const loggedIn = store.state.user.loginStatus === 'loggedIn';
  if (to.name === 'Login' && loggedIn) {
    next({ name: 'Main' });
  } else {
    next();
  }
});

export default router;
