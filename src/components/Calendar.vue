vue
   <template>
     <div>
       <h3>Calendar</h3>
       <DemoApp />
       <h3>Houses</h3>
       <ul>
         <li v-for="house in houses" :key="house">{{ house }}</li>
       </ul>
     </div>
   </template>

   <script setup>
   import { ref, onMounted } from 'vue';
   import { db } from '../firebaseConfig';
   import { auth } from '../auth';
   import { doc, getDoc } from 'firebase/firestore';
   import DemoApp from './DemoApp.vue';

   const houses = ref([]);

   onMounted(async () => {
     if (auth.currentUser) {
       const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
       if (userDoc.exists()) {
         houses.value = userDoc.data().houses || [];
       }
     }
   });
   </script>