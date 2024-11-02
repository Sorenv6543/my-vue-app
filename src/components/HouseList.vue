<template>
    <div v-for="(house, index) in houses" :key="index" @click="handleClick(house)">
      {{ house }}
    </div>
  </template>

  <script>
  export default {
    name: 'HouseList',
    props: ['houses', 'activeHouse'],
    emits: ['set-active-house'], // Declare the emitted event
    methods: {
      handleClick(house) {
        this.$emit('set-active-house', house); // Emit the event with the house data
      }
    }
  };
  </script>