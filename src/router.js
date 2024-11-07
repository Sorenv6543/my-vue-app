// src/router.js

import { createRouter, createWebHistory } from 'vue-router';
import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Home from './components/Home.vue';



const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { path: '/Register', component: Register },
  { path: '/Home', component: Home }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
