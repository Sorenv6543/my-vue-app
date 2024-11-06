// src/router.js

import { createRouter, createWebHistory } from 'vue-router';
import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import Primevue from './components/Primevietemplates/Primevue.vue';
import Forms from './components/Primevietemplates/Forms.vue';
import VueLoaderPlugin from 'vue-loader';
VueLoaderPlugin


const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { path: '/Register', component: Register },
  { path: '/Home', component: Home },
  { path: '/Primevue', component: Primevue },
  { path: '/Forms', component: Forms }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
