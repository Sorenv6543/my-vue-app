// useUserData.js
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import { onAuthStateChangedListener, logoutUser, auth } from '../auth';
import { doc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function useUserData() {
  const userData = ref(null);
  const error = ref(null);

  let unsubscribe = null;

  onMounted(() => {
    unsubscribe = onAuthStateChangedListener(async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            userData.value = { id: user.uid, ...doc.data() };
          } else {
            error.value = 'User document does not exist';
          }
        });
      } else {
        userData.value = null;
      }
    });
  });

  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });

  return { userData, error };
}