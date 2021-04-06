import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import './assets/styles/index.css';

import useBase from '@/composables/base';
import useYnab from '@/composables/ynab';
import useSession from '@/composables/session';
import useSettings from '@/composables/settings';
const { hydrate } = useBase();
const { reset: resetYnab } = useYnab();
const { reset: resetSession } = useSession();
const { reset: resetSettings } = useSettings();

hydrate();
resetYnab();
resetSession();
resetSettings();

createApp(App)
  .use(router)
  .mount('#app');
