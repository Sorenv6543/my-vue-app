/**
 * The `AddHouseButton` component provides a button to open a modal for adding a new house.
 * When the button is clicked, the `HouseModal` component is displayed, allowing the user to input
 * details about the new house. When the house is added, the `handleHouseAdded` function is called
 * to handle the new house data.
 *
 * @param {Object} user - The user object associated with the new house.
 * @param {string} userId - The ID of the user associated with the new house.
 */
<template>
  <div>
    <button @click="showModal = true">Add House</button>
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
import { ref } from "vue";
import HouseModal from "./HouseModal.vue";


const showModal = ref(false);



</script>

<style scoped>
button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #36b5f4;
  color: white;
  border-width: 0.3rem;
  border-color: rgb(220, 223, 222);
  border-radius: 10px;
  cursor: pointer;
}
button:hover {
  background-color: #41a8e4;
}
</style>
