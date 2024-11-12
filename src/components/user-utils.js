import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { auth } from '../auth';

// Function to fetch user data
export const fetchUserData = (currentUser, state) => {
  const userDocRef = doc(db, 'users', currentUser.uid);

  // Listen to real-time updates in Firestore for the user's document
  return onSnapshot(
      userDocRef,
      (doc) => {
        if (doc.exists()) {
          state.userData = {
            id: auth.currentUser.uid,
            email: doc.data().email,
            fullName: doc.data().fullName,
            houses: doc.data().houses || [],
          };
        } else {
          state.error = 'User document does not exist';
        }
        state.isLoading = false;
      },
      (err) => {
        console.error("Error fetching user data: ", err);
        state.error = 'Failed to load user data. Please try again.';
        state.isLoading = false;
      }
    ); // Return the unsubscribe function to allow cleanup in Home.vue

};

// Function to delete a house
export const deleteHouse = async (house, userData, state) => {
  try {
    if (!userData || !userData.id) {

    const userDocRef = doc(db, 'users', userData.id);

    // Remove the house from Firestore
    await updateDoc(userDocRef, {
      houses: arrayRemove(house),
    });

    // Update the local state to reflect the deletion
    state.userData.houses = state.userData.houses.filter((h) => h.name !== house.name);

    // Reset activeHouse if it was the deleted house
    if (state.activeHouse.name === house.name) {
      state.activeHouse = {};
    }
  } catch (err) {
    console.error("Error deleting house: ", err);
    state.errorMessage = 'Failed to delete house. Please try again.';
  }
};
