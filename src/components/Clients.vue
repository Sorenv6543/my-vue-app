<template>
  <div>
    <h1>Client List</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="clients.length === 0">No clients found.</div>
      <div v-for="client in clients" :key="client.id" class="client">
        <h3>{{ client.name }}</h3>
        <p>Email: {{ client.email }}</p>
        <p>Password: {{ client.password }}</p>
        <p>Number of Houses: {{ client.numberOfHouse }}</p>
        <div v-if="client.houses && client.houses.length > 0">
          <h4>Houses:</h4>
          <ul>
            <li v-for="house in client.houses" :key="house">{{ house }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

export default {
  setup() {
    const clients = ref([]);
    const loading = ref(true);

    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        clients.value = []; // Clear existing clients
        querySnapshot.forEach((doc) => {
          clients.value.push({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.error("Error fetching clients: ", error);
      } finally {
        loading.value = false; // Ensure loading is false in either case
      }
    };

    onMounted(fetchClients);

    return { clients, loading };
  }
};
</script>

<style>
/* Add your styles here */
</style>
