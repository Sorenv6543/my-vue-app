<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { registerUser } from '../auth';  // Adjust the path as necessary
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const register = async () => {
  try {
    await registerUser(email.value, password.value);
    router.push('/dashboard');  // Redirect to dashboard
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style>
/* Add your styles here */
</style>
