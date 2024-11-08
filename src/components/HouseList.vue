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
        <span class="house-name">{{ house.name }}</span>
        <button class="edit-button" @click.stop="editHouse(house)">Edit</button>
        <span class="delete-button" @click.stop="confirmDelete(house)">Delete</span>
      </li>
    </ul>
  </div>
</template>

<!-- House Modal -->

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  houses: {
    type: Array,
    required: true,
  },
  activeHouse: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["setActiveHouse", "deleteHouse", "editHouse"]);

const selectedHouse = ref(props.activeHouse);

const selectHouse = (house) => {
  selectedHouse.value = house;
  emit("setActiveHouse", house);
};

const confirmDelete = (house) => {
  if (confirm(`Are you sure you want to delete ${house.name}?`)) {
    emit("deleteHouse", house);
  }
};

const editHouse = (house) => {
  emit("editHouse", house);
};

watch(
  () => props.activeHouse,
  (newActiveHouse) => {
    selectedHouse.value = newActiveHouse;
  },
  { immediate: true }
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
  border: 1px solid #7e3939;
  margin-bottom: 5px;
  transition: background-color 0.3s;
}

.house-list li.active {
  background-color: #36b5f4;
  color: rgb(100, 29, 29);
}

.delete-button {
  margin-left: 10px;
  color: #ff6b6b;
  cursor: pointer;
}

.delete-button:hover {
  color: #ff3333;
}

.edit-button {
  margin-left: 10px;
}
</style>
