// src/router.js

import { createRouter, createWebHistory } from 'vue-router';
import Register from './components/RegisterPage.vue';
import LoginPage from './components/LoginPage.vue';
import HomeApp from './components/HomeApp.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/LoginPage', component: LoginPage },
  { path: '/Register', component: Register },
  { path: '/HomeApp', component: HomeApp },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
