<template>
    <div class="modal-overlay" v-if="isVisible">
      <div class="modal-content">
        <h4>Add New House</h4>
        <form @submit.prevent="createHouse">
          <label>
            House Name:
            <input type="text" v-model="houseName" required />
          </label>
          
          <label>
            Address:
            <input type="text" v-model="address" required />
          </label>
          
          <label>
            Gate Code:
            <input type="text" v-model="gateCode" />
          </label>
          
          <label>
            Door Code:
            <input type="text" v-model="doorCode" />
          </label>
          
          <label>
            Contact Number:
            <input type="tel" v-model="contactNumber" />
          </label>
          
          <label>
            House Notes:
            <textarea v-model="houseNotes"></textarea>
          </label>
          
          <label>
            Calendar Event Color:
            <input type="color" v-model="calEventColor" />
          </label>
          
          <div class="modal-actions">
            <button type="button" @click="cancel">Cancel</button>
            <button type="submit" :disabled="isSubmitting">Create</button>
          </div>
          
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
  import { db } from '../firebaseConfig';
  import { defineProps, defineEmits } from 'vue';
  import { v4 as uuidv4 } from 'uuid'; // for unique houseId
  
  const props = defineProps({
  house: {
    type: Object,
    default: () => ({}),
  },
  user: { // Define the user prop
    type: Object,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  isVisible: { // Define the isVisible prop
    type: Boolean,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});
  // Use the props as needed, for example:
  const isVisible = ref({ ...props.isVisible });
  const emit = defineEmits(['closeModal', 'houseAdded']); // closeModal to close the modal, houseAdded to notify parent
  
  // Form fields
  const houseName = ref('');
  const address = ref('');
  const gateCode = ref('');
  const doorCode = ref('');
  const contactNumber = ref('');
  const houseNotes = ref('');
  const calEventColor = ref('#36b5f4'); // default color
  
const isSubmitting = ref(false);
const errorMessage = ref('');
  
  // Reset form when modal visibility changes
  watch(() => props.isVisible, (newVal) => {
    if (newVal) resetForm();
  });
  
  const resetForm = () => {
    houseName.value = '';
    address.value = '';
    gateCode.value = '';
    doorCode.value = '';
    contactNumber.value = '';
    houseNotes.value = '';
    calEventColor.value = '#36b5f4';
    errorMessage.value = '';
  };
  
  // Create house in Firebase
  const createHouse = async () => {
    if (!houseName.value.trim()) {
      errorMessage.value = 'House name is required';
      return;
    }
  
    isSubmitting.value = true;
    errorMessage.value = '';
  
    const newHouse = {
      houseId: uuidv4(),
      name: houseName.value.trim(),
      address: address.value.trim(),
      gateCode: gateCode.value,
      doorCode: doorCode.value,
      contactNumber: contactNumber.value,
      houseNotes: houseNotes.value,
      calEventColor: calEventColor.value,
      userFullname: props.user.fullName || 'Unknown User'
    };
  
    try {
      // Update Firestore `users.houses` array
      await updateDoc(doc(db, 'users', props.user.id), {
        houses: arrayUnion(newHouse)
      });
      emit('houseAdded', newHouse); // Notify parent of the new house
      close(); // Close modal
    } catch (error) {
      console.error("Error adding house:", error);
      errorMessage.value = 'Failed to add house. Please try again.';
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Close modal and reset form
  const cancel = () => {
    close();
  };
  
  const close = () => {
    emit('closeModal');
    resetForm();
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .modal-content h4 {
    margin-bottom: 20px;
  }
  
  .modal-content label {
    display: block;
    margin-bottom: 10px;
  }
  
  .modal-content input,
  .modal-content textarea {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .modal-actions button {
    padding: 8px 16px;
    margin-left: 10px;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  