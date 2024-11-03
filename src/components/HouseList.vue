<template>
  <div class="house-list">
    <h4>Your Houses</h4>
    <ul>
      <li
        v-for="house in houses"
        :key="house.name" 
        :class="{ active: house === selectedHouse }" 
        @click="selectHouse(house)"
      >
        {{ house.name }}
         <!-- Delete button -->
         <span class="delete-button" @click.stop="confirmDelete(house)">✖</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  houses: {
    type: Object,
    required: true,
  },
  activeHouse: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['setActiveHouse', 'deleteHouse']); // Add deleteHouse to emit events

// Use the entire object for comparison
const selectedHouse = ref(props.activeHouse);

const selectHouse = (house) => {
  selectedHouse.value = house; // Set selectedHouse to the entire house object
  emit('setActiveHouse', house); // Emit the full house object to parent
};

// Confirm deletion before emitting the event to the parent
const confirmDelete = (house) => {
  if (confirm(`Are you sure you want to delete ${house.name}?`)) {
    emit('deleteHouse', house); // Emit the delete event with the house object
  }
};
// Sync selectedHouse with any changes to activeHouse prop
watch(
  () => props.activeHouse,
  (newActiveHouse) => {
    selectedHouse.value = newActiveHouse;
  },
  { immediate: true } // Trigger the watcher immediately on mount
);
</script>

<style scoped>
.house-list ul {
  list-style-type: none;
  padding: 0;
}

.house-list li {
  padding: 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  transition: background-color 0.3s;
}

.house-list li.active {
  background-color: #36b5f4;
  color: white;
}
</style>
