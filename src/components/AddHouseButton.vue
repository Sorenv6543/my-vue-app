<template>
  <div >
    <button @click="showModal = true">Add House</button>
    
    <!-- House Modal -->
    <HouseModal
      v-if="showModal"
      :user="user"
      :userId="userId"
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
  },
  userId: {
    type: String,
    required: true,
  },
});

const showModal = ref(false);

const handleHouseAdded = (newHouse) => {
  console.log("New house added:", newHouse);
  // Optionally refresh the house list or show success feedback
};
</script>

<style scoped>
button{
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #36b5f4;
  color: white;
  border-width: .3rem;
  border-color: rgb(220, 223, 222);
  border-radius: 10px;
  cursor: pointer;
}
button:hover {
  background-color: #41a8e4;
}
</style>
