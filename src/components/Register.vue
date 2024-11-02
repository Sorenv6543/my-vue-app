<template>
  <div id="reg">
    <h1>Register</h1>
    <form id="col" @submit.prevent="register">
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

    // Create user document in Firestore
    await setDoc(doc(db, 'users', userId), {
      fullName: fullName.value,
      email: email.value,
      houses: [],
      id: userId
    });
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style>
#reg{
  display: flex;
    /* margin-bottom: 28rem; */
    /* display: block; */
    /* border-block: initial; */
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
    padding-top: 3rem;
}
#col>input{

  padding: .6rem;
  display: flex;
  
  
}
/* Add your styles here */
</style>
