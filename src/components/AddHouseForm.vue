<template>
  <div id="addnewhouseForm">
    <h4>Add Your Houses to Book Cleanings</h4>
    <button @click="showModal = true">Add House</button>
    
    <!-- House Modal -->
    <HouseModal
      v-if="showModal"
      :user="user"
      :is-visible="showModal"
      @closeModal="showModal = false"
      @houseAdded="handleHouseAdded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HouseModal from './HouseModal.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const showModal = ref(false);

const handleHouseAdded = (newHouse) => {
  console.log("New house added:", newHouse);
  // Optionally refresh the house list or show success feedback
};
</script>

<style scoped>
/* Add styling as needed */
</style>
