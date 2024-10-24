<template>
  <div>
    <h2>Dashboard</h2>
    <p v-if="isLoading">Loading...</p>
    <template v-else-if="userData">
      <FullCalendar />
      <p>Welcome, {{ userData.fullName }}!</p>
      <p>User ID: {{ userData.id }}</p>
      <p>Email: {{ userData.email }}</p>
      <h3>Your Houses:</h3>
      <ul>
        <li v-for="house in userData.houses" :key="house">{{ house }}</li>
      </ul>
      <div>
        <h3>Add a New House</h3>
        <form @submit.prevent="addHouse">
          <input
            v-model="houseName"
            type="text"
            placeholder="House Name"
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
      <button @click="logout">Logout</button>
    </template>
    <p v-else>Please log in to see your dashboard.</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import { onAuthStateChangedListener, logoutUser } from '../auth';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot} from 'firebase/firestore';
import { db } from '../firebaseConfig';
// import Calendar from './Calendar.vue';
import FullCalendar  from './DemoApp.vue';

const userData = shallowRef(null);
const isLoading = ref(true);
const error = ref(null);
const router = useRouter();
const houseName = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

let unsubscribeAuth = null;
let unsubscribeUser = null;

const fetchUserData = async (currentUser) => {
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    unsubscribeUser = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        userData.value = {
          id: currentUser.uid,
          email: currentUser.email,
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

const addHouse = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    await updateDoc(doc(db, 'users', userData.value.id), {
      houses: arrayUnion(houseName.value)
    });
    houseName.value = '';
  } catch (error) {
    console.error("Error adding house: ", error);
    errorMessage.value = 'Failed to add house. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>