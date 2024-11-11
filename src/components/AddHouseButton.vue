/**
 * The `AddHouseButton` component provides a button to open a modal for adding a new house.
 * When the button is clicked, the `HouseModal` component is displayed, allowing the user to input
 * details about the new house. When the house is added, the `handleHouseAdded` function is called
 * to handle the new house data.
 *
 * @param {Object} user - The user object associated with the new house.
 * @param {string} userId - The ID of the user associated with the new house.
 */
vue
<template>
  <div>
    <button @click="showModal = true">Add House</button>
    <HouseModal
      v-if="showModal"
  
      :is-visible="showModal"
      @closeModal="closeModal"
      @houseAdded="handleHouseAdded"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import HouseModal from "./HouseModal.vue";

const showModal = ref(false);
const userData = ref({ houses: [] }); // Ensure userData is reactive

const closeModal = () => {
  showModal.value = false;
};
const emit = defineEmits(['houseAdded']);

const houseAdded = () => {
  emit('houseAdded');
};

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
