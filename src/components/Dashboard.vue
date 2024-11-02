<template>
  <div>
    <h2>Dashboard</h2>
    <p v-if="isLoading">Loading...</p>
    <template v-else-if="userData">
      
      <FullCalendar id="cal" :user-id="userData.id" />




       <!-- addnewhouseForm -->
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
        <!-- addnewhouseForm -->





      <!-- List currnet houses -->
      <h3>Your Houses:</h3>
      <ul class="houses">
        <li id="houses" v-for="house in userData.houses" :key="house"
        @click="setActiveHouse(house)"
        :class="{ active: activeHouse === house }"
        >{{ house.name }}</li>  
      </ul>
      <!-- List currnet houses -->
     
     
     
     <p>Welcome, {{ userData }}!</p>
      <p>{{ userData.email }}</p>
      <p>{{ userData.currentUser }}</p>
      <p>{{ userData.houses }}</p>
      <button @click="logout">Logout</button>
      

    </template>
    <p v-else>Please log in to see your dashboard.</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import { onAuthStateChangedListener, logoutUser, auth } from '../auth';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import FullCalendar  from './FullCalendar.vue';

const newHouseName = ref(''); // Use a reactive ref for two-way binding
// const houseName = ref(''); // Keep this if you need it for other purposes
const activeHouse = ref(null);
const userData = shallowRef(null);
const isLoading = ref(true);
const error = ref(null);
const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref('');

let unsubscribeAuth = null;
let unsubscribeUser = null;

// ADD HOUSE FUNCTION
const addHouse = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';

  const house = { name: newHouseName.value }; // Define the house object here

  try {
    await updateDoc(doc(db, 'users', userData.value.id), {
      houses: arrayUnion(house)
    });
    newHouseName.value = ''; // Clear the input field
  } catch (error) {
    console.error("Error adding house: ", error);
    errorMessage.value = 'Failed to add house. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
// ADD HOUSE FUNCTION


const fetchUserData = async (currentUser) => {
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    unsubscribeUser = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        userData.value = {
          currentUser: doc.data().currentUser,
          id: auth.currentUser.uid,
          email: doc.data().email,
          fullName: doc.data().fullName,
          houses: doc.data().houses || []
        };
      } else {
        error.value = 'User document does not exist';
      }
      isLoading.value = false;
    }, (err) => {
      error.value = 'Failed to load user data. Please try again.';
      isLoading.value = false;
    });
  } catch (err) {
    console.error('Error setting up user data listener:', err);
    isLoading.value = false;
  }
};


onMounted(() => {
  unsubscribeAuth = onAuthStateChangedListener(async (currentUser) => {
    isLoading.value = true;
    error.value = null;
    if (currentUser) {
      await fetchUserData(currentUser);
    } else {
      userData.value = null;
      isLoading.value = false;
    }
  });
});

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth();
  if (unsubscribeUser) unsubscribeUser();
});

const logout = async () => {
  try {
    await logoutUser();
    userData.value = null;
    router.push('/login');
  } catch (err) {
    console.error('Logout error:', err);
    error.value = 'Failed to logout. Please try again.';
  }
};





const setActiveHouse = (house) => {
  activeHouse.value = house;
};


</script>
<style>
  .houses li {
    cursor: pointer;
  }
  .houses li.active {
    background-color: #b9dd1b;
    color: white;
  }
#houses {
  font-size: 2rem;
list-style: none;

    color: #f8f8f8;
    font-size: 1.2rem;

align-items: center;
justify-content: center;

}
.houses{
  background-color: #00a4ff;
background-color: rgb(23, 56, 201);
list-style-type: square;
}
#cal{
  display: inline;
  padding: 100px;
  margin: 10px;
  

}
</style>