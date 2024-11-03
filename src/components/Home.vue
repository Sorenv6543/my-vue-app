<template>
    <div>    
      <p v-if="!userData">Please log in to see your dashboard.</p>
      <p v-if="userData">
        <UserDashboard :user="userData" :is-loading="isLoading" :error="error" @logout="logout" />
        <AddHouseForm  :user="userData"  :is-submitting="isSubmitting" :error-message="errorMessage" />
        <HouseList  :houses="userData.houses" :activeHouse="activeHouse" @setActiveHouse="setActiveHouse" @deleteHouse="deleteHouseHandler" />
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
import { fetchUserData, deleteHouse } from './user-utils';


import FullCalendar from './FullCalendar.vue';
import AddHouseForm from './AddHouseForm.vue';
import HouseList from './HouseList.vue';
import UserDashboard from './UserDashboard.vue';

const router = useRouter();

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

const deleteHouseHandler = async (house) => {
  await deleteHouse(house, state.userData, state);
};

const fetchUserDataHandler = async (currentUser) => {
  unsubscribeUser = fetchUserData(currentUser, state);
};

onMounted(() => {
  unsubscribeAuth = onAuthStateChangedListener(async (currentUser) => {
    state.isLoading = true;
    state.error = null;
    if (currentUser) {
      await fetchUserDataHandler(currentUser);
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