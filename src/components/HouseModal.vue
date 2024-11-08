<template>
  <div class="modal-overlay" v-if="props.isVisible">
    <div class="modal-content">
      <h4>Add New House</h4>
      <form @submit.prevent="createHouse">
        <label>
          House Name:
          <input type="text" v-model.trim="formData.houseName" required />
        </label>

        <label>
          Address:
          <input type="text" v-model.trim="formData.address" required />
        </label>

        <label>
          Gate Code / Door Codes
          <input type="text" v-model.trim="formData.gateCode" />
        </label>

        <label>
          Contact Number:
          <input type="tel" v-model.trim="formData.contactNumber" />
        </label>

        <label>
          Calendar Event Color:
          <input type="color" v-model="formData.calEventColor" />
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
import { ref, watch, onBeforeUnmount, reactive } from "vue";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  houseName: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  user: {
    type: Object,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeModal", "houseAdded"]);

// Form states using reactive for better performance
const formData = reactive({
  houseName: "",
  address: "",
  gateCode: "",
  contactNumber: "",
  calEventColor: "#36b5f4",
});

const errorMessage = ref("");
const isSubmitting = ref(false);

// Optimized watch with cleanup
const unwatch = watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) resetForm();
  }
);

// Cleanup on component unmount
onBeforeUnmount(() => {
  unwatch();
});

const resetForm = () => {
  Object.assign(formData, {
    houseName: "",
    address: "",
    gateCode: "",
    contactNumber: "",
    calEventColor: "#36b5f4",
  });
  errorMessage.value = "";
};

const createHouse = async () => {
  if (!formData.houseName) {
    errorMessage.value = "House name is required";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  const newHouse = {
    housename: formData.houseName,
    address: formData.address,
    doorandgatecodes: formData.gateCode,
    contactnumber: formData.contactNumber,
    caleventcolor: formData.calEventColor,
    userfullname: props.user.fullName || "Unknown User",
  };

  try {
    await updateDoc(doc(db, "users", props.user.id), {
      houses: arrayUnion(newHouse),
    });
    emit("houseAdded", newHouse);
    close();
  } catch (error) {
    console.error("Error adding house:", error);
    errorMessage.value = "Failed to add house. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  close();
};

const close = () => {
  emit("closeModal");
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
