<template>
    <div>
      <h2>Dashboard</h2>
      <p v-if="user">Welcome, {{ user.email }}!</p>
      <p v-else>Please log in to see your dashboard.</p>
      <button v-if="user" @click="logout">Logout</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { onAuthStateChangedListener, logoutUser } from '../auth';  // Adjust the path as necessary
  
  const user = ref(null);
  
  onMounted(() => {
    onAuthStateChangedListener((currentUser) => {
      user.value = currentUser;
    });
  });
  
  const logout = async () => {
    try {
      await logoutUser();
      user.value = null;  // Reset user data on logout
    } catch (err) {
      console.error(err);
    }
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  