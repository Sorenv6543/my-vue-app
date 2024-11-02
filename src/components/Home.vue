<template>
    <div>
      <h2>Home</h2>
      <p v-if="!userData">Please log in to see your dashboard.</p>
      
        
     
      <p v-if="userData">
        <UserDashboard :user="userData" :is-loading="isLoading" :error="error" />
        <FullCalendar :id="calendarId" :user-id="userData.id" />
        <AddHouseForm @add-house="addHouse" :is-submitting="isSubmitting" :error-message="errorMessage" />
        <HouseList :houses="userData.houses" :activeHouse="activeHouse" @setActiveHouse="activeHouse" />
        <UserInfo :user="userData" @logout="logout" />
      </p>
      <template v-else>
        <p>Please log in to see your dashboard.</p>
      </template>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>



  <!-- JAVASCRIPT -->
<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, reactive, toRefs } from 'vue';
import { onAuthStateChangedListener, logoutUser, auth } from '../auth';
import { doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import FullCalendar from './FullCalendar.vue';
import AddHouseForm from './AddHouseForm.vue';
import HouseList from './HouseList.vue';
import UserInfo from './UserInfo.vue';
import UserDashboard from './UserDashboard.vue';

const router = useRouter();

// addhouse not reactive because
const state = reactive({
  userData: null,
  isLoading: true,
  error: null,
  isSubmitting: false,
  errorMessage: '',
  activeHouse: null
});

const { userData, isLoading, error, isSubmitting, errorMessage, activeHouse } = toRefs(state);

let unsubscribeAuth = null;
let unsubscribeUser = null;



const fetchUserData = async (currentUser) => {
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    unsubscribeUser = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        state.userData = {
          id: auth.currentUser.uid,
          email: doc.data().email,
          fullName: doc.data().fullName,
          houses: doc.data().houses || []
        };
      } else {
        state.error = 'User document does not exist';
      }
      state.isLoading = false;
    }, (err) => {
      state.error = 'Failed to load user data. Please try again.';
      state.isLoading = false;
    });
  } catch (err) {
    state.isLoading = false;
  }
};

onMounted(() => {
  unsubscribeAuth = onAuthStateChangedListener(async (currentUser) => {
    state.isLoading = true;
    state.error = null;
    if (currentUser) {
      await fetchUserData(currentUser);
    } else {
      state.userData = null;
      state.isLoading = false;
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
    state.userData = null;
    router.push('/login');
  } catch (err) {
    state.error = 'Failed to logout. Please try again.';
  }
};


</script>