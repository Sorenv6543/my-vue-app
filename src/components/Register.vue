<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="fullName" type="text" placeholder="FullName" required />
      <button type="submit">Register</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { db } from '../firebaseConfig';
import {doc, setDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { registerUser } from '../auth';  // Adjust the path as necessary
import { useRouter } from 'vue-router';


const email = ref('');
const password = ref('');
const fullName = ref('');
const error = ref('');
const router = useRouter();

const register = async () => {
  try {
    const userCredential = await registerUser(email.value, password.value);
    const userId = userCredential.user.uid;

    // Generate a unique calendar ID
    const calendarId = `cal_${userId}_${Date.now()}`;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', userId), {
      fullName: fullName.value,
      email: email.value,
      calendarId: calendarId,
      houses: []
    });

    // Create a calendar document
    await setDoc(doc(db, 'calendars', calendarId), {
      userId: userId,
      events: []
    });

    router.push('/dashboard');
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style>
/* Add your styles here */
</style>
