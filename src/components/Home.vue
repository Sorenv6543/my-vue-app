<template>
    <div>    
    <!-- Show login message if user is not logged in -->
      <p v-if="!userData">Please log in to see your dashboard.</p>

    <!-- User dashboard content -->
    <template v-if="userData">
      <UserDashboard 
        :user="userData" 
        :is-loading="isLoading" 
        :error="error" 
        @logout="logout" 
      />

      <AddHouseButton 
        :user="userData"
        :user-id="userData.id"
        :is-submitting="isSubmitting" 
        :error-message="errorMessage"
      />
      <!-- @openModal="openHouseModal" AddHouseButton -->
      <HouseModal 
        v-if="isEditModalVisible"
        :house="selectedHouse"
        :user="userData"
        :user-id="userData.id"
        :is-edit="true"
        :is-visible="isEditModalVisible"
        @closeModal="closeEditModal"
        @houseUpdated="handleHouseUpdated" 
      />
      <HouseList 
        :houses="userData.houses" 
        :activeHouse="activeHouse" 
        @setActiveHouse="setActiveHouse" 
        @deleteHouse="deleteHouseHandler"
        @editHouse="openEditModal" 
      />

      <FullCalendar 
        :user-id="userData.id" 
        :active-house="activeHouse" 
      />
      </template>
      <p><router-link to="/Primevue">PrimeView Examples</router-link></p>
    <!-- Error Display -->
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, reactive, toRefs, ref } from 'vue'
import { onAuthStateChangedListener, logoutUser } from '../auth'
import { fetchUserData, deleteHouse } from './user-utils'
import FullCalendar from './FullCalendar.vue'
import AddHouseButton from './AddHouseButton.vue'
import HouseList from './HouseList.vue'
import UserDashboard from './UserDashboard.vue'
import HouseModal from './HouseModal.vue'

const router = useRouter()

// Reactive state
const state = reactive({
  userData: null,
  isLoading: true,
  error: null,
  isSubmitting: false,
  errorMessage: '',
  activeHouse: {}, 
  
})

// Destructure state for easier access
const { userData, isLoading, error, isSubmitting, errorMessage, activeHouse } = toRefs(state);

// Refs for modal control
const isEditModalVisible = ref(false);
const selectedHouse = ref({});

// Modal control functions
const openEditModal = (house) => {
  selectedHouse.value = { ...house }
  isEditModalVisible.value = true
}

const closeEditModal = () => {
  isEditModalVisible.value = false
  selectedHouse.value = {}
}

// House management functions
const handleHouseUpdated = (updatedHouse) => {
  const houseIndex = state.userData.houses.findIndex(h => h.houseId === updatedHouse.houseId)
  if (houseIndex !== -1) {
    state.userData.houses[houseIndex] = updatedHouse;
  }
}

const setActiveHouse = (house) => {
  if (typeof house === 'object') {
    state.activeHouse = house
  } else {
    console.warn("Expected an object for activeHouse, received:", house)
  }
}

const deleteHouseHandler = async (house) => {
  await deleteHouse(house, state.userData, state)
}

// User data management
const fetchUserDataHandler = async (currentUser) => {
  state.unsubscribeUser = fetchUserData(currentUser, state)
}

// Authentication functions
const logout = async () => {
  try {
    await logoutUser()
    state.userData = null
    router.push('/login')
  } catch (err) {
    state.error = 'Failed to logout. Please try again.'
  }
}

// Lifecycle hooks
onMounted(() => {
  state.unsubscribeAuth = onAuthStateChangedListener(async (currentUser) => {
    state.isLoading = true
    state.error = null
    if (currentUser) {
      await fetchUserDataHandler(currentUser)
    } else {
      state.userData = null
      state.isLoading = false
    }
  })
})

onUnmounted(() => {
  if (state.unsubscribeAuth) state.unsubscribeAuth()
  if (state.unsubscribeUser) state.unsubscribeUser()
})
</script>

<style scoped>
.houseSection {
  display: flex;
}
</style>