<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { loginUser } from '../auth';  // Adjust the path as necessary
import { useRouter } from 'vue-router';
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');


const login = async () => {
  try {
    await loginUser(email.value, password.value);
    router.push('/dashboard');  // Redirect to dashboard
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style>
/* Add your styles here */
</style>
