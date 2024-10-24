  
<template>
  <div>
    <h3>Add a New House</h3>
    <form @submit.prevent="addHouse">
      <input
        v-model="houseName"
        type="text"
        placeholder="Hou
        se Name"
        required
        minlength="2"
        maxlength="50"
      />
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Adding...' : 'Add House' }}
      </button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const houseName = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const emit = defineEmits(['houseAdded']);


const addHouse = async () => {
  if (!auth.currentUser) {
    errorMessage.value = 'You must be logged in to add a house.';
    return;
  }

  const userId = auth.currentUser.uid;

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await updateDoc(doc(db, 'users', userId), {
      houses: arrayUnion(houseName.value)
    });
    emit('houseAdded');
    houseName.value = '';
  } catch (error) {
    console.error("Error adding house: ", error);
    errorMessage.value = 'Failed to add house. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

</script>


<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
