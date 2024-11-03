<template>
  <div id="addnewhouseForm">
        <h4>Add Your Houses to Book Cleanings</h4>
        <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <form @submit.prevent="addHouse">
      <input type="text" v-model="newHouseName" placeholder="House Name">
      <br>
      <button id="houseBtn" type="submit" :disabled="isSubmitting">Add House</button>
      <div v-if="errorMessage">{{ errorMessage }}</div>
    </form>
       </div>
      </div>
</template>

<script setup>
import { ref } from 'vue';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the import path as needed
// import { userData } from './userData'; // Adjust the import path as needed

import { defineProps} from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});


const user = props.user;
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

  const house = { name: newHouseName.value.trim() };
  try {
    if (user && user.id) {
      await updateDoc(doc(db, 'users', user.id), {
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

<style scoped>

#addnewhouseForm {
  display: flex;
  justify-content: flex-start;
    flex-direction: column;
    align-content: flex-start;
    flex-wrap: wrap;
    align-items: baseline;
  margin: 0 auto;
  
}

</style>