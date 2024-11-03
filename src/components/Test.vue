
<template>
    <h1>Welcome </h1>
  <ul>
    <li 
      v-for="house in houses" 
      :key="index" 
      @click="setActiveHouse(house)"
      :class="{ active: activeHouseId === house }"
    >
      {{ house}}
    </li>
  </ul>
</template>

<script>
import { ref } from 'vue';
export default {
    name: 'HouseList',
    props: ['houses', 'activeHouse'],
    emits: ['set-active-house'], // Declare the emitted event
    methods: {
        setActiveHouse(house) {
        this.$emit('set-active-house', house); // Emit the event with the house data
      }
    }
  };

// const houses = ref([]); // Assume this is populated with your house data
// const activeHouseId = ref(null);

const setActiveHouse = (houseId) => {
  activeHouseId.value = houseId;
};
</script>

<style scoped>
.active {
  background-color: #e0e0e0;
  font-weight: bold;
}
</style>