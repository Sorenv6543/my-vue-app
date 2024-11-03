<template>
    <div>    
      <p v-if="!userData">Please log in to see your dashboard.</p>
      <p v-if="userData">
        <UserDashboard :user="userData" :is-loading="isLoading" :error="error" @logout="logout" />
        <div class="houseSection">
        <AddHouseForm  :user="userData"  :is-submitting="isSubmitting" :error-message="errorMessage" />
        <HouseList  :houses="userData.houses" :activeHouse="activeHouse" @setActiveHouse="setActiveHouse" @deleteHouse="deleteHouse" />
      </div>
        <FullCalendar :user-id="userData.id" :active-house="activeHouse" />
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
import { onMounted, onUnmounted } from 'vue';
import { reactive, toRefs } from 'vue';
import { onAuthStateChangedListener, logoutUser, auth } from '../auth';
import { doc, onSnapshot,updateDoc, arrayRemove} from 'firebase/firestore';
import { db } from '../firebaseConfig';

import FullCalendar from './FullCalendar.vue';
import AddHouseForm from './AddHouseForm.vue';
import HouseList from './HouseList.vue';
import UserDashboard from './UserDashboard.vue';

const router = useRouter();

// addhouse not reactive because
const state = reactive({
  userData: null,
  isLoading: true,
  error: null,
  isSubmitting: false,
  errorMessage: '',
  activeHouse: {},
  
});

const { userData, isLoading, error, isSubmitting, errorMessage, activeHouse } = toRefs(state);

const setActiveHouse = (house) => {
  // Ensure house is an object before assigning
  if (typeof house === 'object') {
    state.activeHouse = house;
  } else {
    console.warn("Expected an object for activeHouse, received:", house);
  }
};

let unsubscribeAuth = null;
let unsubscribeUser = null;

// Method to delete the house from Firebase
const deleteHouse = async (house) => {
  try {
    if (!state.userData || !state.userData.id) return;
    
    // Reference the user document in Firestore
    const userDocRef = doc(db, 'users', state.userData.id);

    // Remove the house from the houses array in Firestore
    await updateDoc(userDocRef, {
      houses: arrayRemove(house) // Use arrayRemove to delete the specific house
    });

    // Also update the local state to reflect the deletion
    state.userData.houses = state.userData.houses.filter((h) => h.name !== house.name);

    // Reset activeHouse if it was deleted
    if (state.activeHouse.name === house.name) {
      state.activeHouse = {};
    }
  } catch (err) {
    console.error("Error deleting house: ", err);
    state.errorMessage = 'Failed to delete house. Please try again.';
  }
};
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
<style scoped>

.houseSection{
  display: flex;
}
</style>