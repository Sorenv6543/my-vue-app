// src/router.js

import { createRouter, createWebHistory } from 'vue-router';
import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';



const routes = [
  { path: '/', component: Dashboard },
  { path: '/login', component: Login },
  { path: '/Register', component: Register },
  { path: '/dashboard', component: Dashboard },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
