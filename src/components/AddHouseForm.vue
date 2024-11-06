<template>
  <div id="addnewhouseForm">
        <h3>Add a New House</h3>
        <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <form @submit.prevent="addHouse">
      <input type="text" v-model="newHouseName" placeholder="House Name">
      <button type="submit" :disabled="isSubmitting">Add House</button>
      <div v-if="errorMessage">{{ errorMessage }}</div>
    </form>
       </div>
      </div>
</template>

<script setup>
import { ref } from 'vue';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the import path as needed
import { userData } from './userData'; // Adjust the import path as needed

const { userData: userDataRef, error: userDataError } = userData(); // Use userData function

const newHouseName = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);
const error = ref(null);

const addHouse = async () => {
  if (!newHouseName.value.trim()) {
    errorMessage.value = 'House name cannot be empty';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  const house = { name: newHouseName.value };
  try {
    if (userDataRef.value && userDataRef.value.id) {
      await updateDoc(doc(db, 'users', userDataRef.value.id), {
        houses: arrayUnion(house)
      });
      newHouseName.value = '';
    } else {
      throw new Error('User data not available');
    }
  } catch (err) {
    console.error("Error adding house: ", err);
    errorMessage.value = 'Failed to add house. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

</script>
