import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import './assets/styles/index.css';
// import store from './store'
import session from '@/composables/session';

createApp(App)
  .provide('session', session)
  // .use(store)
  .use(router)
  .mount('#app');
