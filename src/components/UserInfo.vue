vue
<template>
  <div class="user-info">
    <h2>User Information</h2>
    <p><strong>Name:</strong> {{ user.fullName }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Number of Houses:</strong> {{ user.houses.length }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['logout']);

const logout = () => {
  emit('logout');
};
</script>

<style scoped>
.user-info {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 20px;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #d32f2f;
}
</style>