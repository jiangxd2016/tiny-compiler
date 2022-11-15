import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

import '@unocss/reset/tailwind.css';
import './styles/main.css';
import 'uno.css';
import routes from './router';
const app = createApp(App);

const router = createRouter({
  history: createWebHistory('/'),
  routes
});
app.use(router);
app.mount('#app');
