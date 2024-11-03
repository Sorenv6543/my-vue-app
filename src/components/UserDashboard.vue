<template>
<div class="user-info">
    
    <p><strong>Houses:</strong> {{ user.houses.length }}</p>
    <p><strong> Welcome {{ user.fullName }}</strong></p>
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
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  padding: 20px;
  height: 1rem;

  border-radius: 5px;
  margin-top: 0px;
  background-color: #3e7bc1;
  color: white;
}




button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #36b5f4;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #d32f2f;
}
</style>