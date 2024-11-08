<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>

           <!-- Event Edit Modal -->
           <div v-if="isEventModalVisible" class="modal-overlay">
        <div class="modal-content">
          <h4>Edit Event</h4>
          <form @submit.prevent="updateEvent">
            <label>
              Start Date:
              <input type="date" v-model="eventStartDate" required />
            </label>
            <label>
              Start Time:
              <input type="time" v-model="eventStartTime"  />
            </label>
            <label>
              End Date:
              <input type="date" v-model="eventEndDate" required />
            </label>
            <label>
              End Time:
              <input type="time" v-model="eventEndTime"  />
            </label>
            <label>
              Event Notes:
              <textarea v-model="eventNotes"></textarea>
            </label>

            <div class="modal-actions">
              <button type="button" @click="closeEventModal">Cancel</button>
              <button type="submit">Save Changes</button>
              <button type="button" @click="deleteEvent" class="delete-button">Delete</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { defineProps, onBeforeUnmount,ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createEventId } from './event-utils';
import { auth } from "../auth";
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  activeHouse: {
    type: Object,
    default: () => ({}),
  },
});

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  initialView: 'dayGridMonth',
  initialEvents: '',
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect, 
  eventClick: handleEventClick, 
  eventsSet: handleEvents, 
  events: fetchEvents, 
};

// Modal state and event details
const isEventModalVisible = ref(false);
const selectedEventId = ref(null);
const eventStartDate = ref('');
const eventStartTime = ref('');
const eventEndDate = ref('');
const eventEndTime = ref('');
const eventNotes = ref('');

// Event click handler to open modal with event details
function handleEventClick(clickInfo) {
  isEventModalVisible.value = true;
  selectedEventId.value = clickInfo.event.id;
  eventStartDate.value = clickInfo.event.startStr.split('T')[0];
  eventStartTime.value = clickInfo.event.startStr.split('T')[1]?.slice(0, 5) || '';
  eventEndDate.value = clickInfo.event.endStr?.split('T')[0] || eventStartDate.value;
  eventEndTime.value = clickInfo.event.endStr?.split('T')[1]?.slice(0, 5) || eventStartTime.value;
  eventNotes.value = clickInfo.event.extendedProps.notes || '';
}

const closeEventModal = () => {
  isEventModalVisible.value = false;
};

// Update event in Firebase and FullCalendar
const updateEvent = async () => {
  try {
    const updatedEvent = {
      start: `${eventStartDate.value}T${eventStartTime.value}:00`,
      end: `${eventEndDate.value}T${eventEndTime.value}:00`,
      notes: eventNotes.value,
    };

    // Update in Firebase
    const eventRef = doc(db, 'events', selectedEventId.value);
    await updateDoc(eventRef, updatedEvent);

    // Update in FullCalendar
    const calendarApi = calendarOptions.plugins[0].calendar;
    const event = calendarApi.getEventById(selectedEventId.value);
    if (event) {
      event.setEventStart(updatedEvent.start);
      event.setEventEnd(updatedEvent.end);
      event.setExtendedProp('notes', updatedEvent.notes);
    }

    closeEventModal();
  } catch (error) {
    console.error('Error updating event:', error);
  }
};
async function fetchEvents(fetchInfo, successCallback, failureCallback) {
  try {
    const currentUser = auth.currentUser.uid;
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('userId', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    successCallback(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    failureCallback(error);
  }
}

async function handleDateSelect(selectInfo) {
  const title = props.activeHouse.name ; // Use active house as the title
  let calendarApi = selectInfo.view.calendar;
  calendarApi.unselect();
  
  if (title && typeof title === 'string' && title.trim() !== '') {
    const newEvent = {
      id: createEventId(),
      title: title.trim(),
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      userId: auth.currentUser.uid,
      houseDetails: { ...props.activeHouse }, // Include all properties of activeHouse
      backgroundColor: props.activeHouse.calEventColor || '#36b5f4', // Default color if calEventColor is not set
      borderColor: props.activeHouse.calEventColor || '#36b5f4'      // Set border color to match
    };
    try {
      const docRef = await addDoc(collection(db, 'events'), newEvent);
      await updateDoc(doc(db, 'events', docRef.id), { id: docRef.id });
      calendarApi.addEvent(newEvent);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  }
}

const deleteEvent = async () => {
  if (confirm("Are you sure you want to delete this event?")) {
    try {
      // Delete from Firebase
      const eventRef = doc(db, 'events', selectedEventId.value);
      await deleteDoc(eventRef);

      // Remove from FullCalendar
      const calendarApi = calendarRef.value.getApi();
      const event = calendarApi.getEventById(selectedEventId.value);
      if (event) {
        event.remove();
      }

      closeEventModal();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
};
// async function handleEventClick(clickInfo) {
//   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
//     try {
//       await deleteDoc(doc(db, 'events', clickInfo.event.id));
//       clickInfo.event.remove();
//     } catch (error) {
//       console.error('Error deleting event:', error);
//     }
//   }
// }

function handleEvents(events) {
  // You could manage current events here if needed
}

onBeforeUnmount(() => {
  // Clean up any Firestore listeners if you have any
});

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
.demo-app {
  display: flex;
  min-height: 80%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  border-color: aquamarine;
}

.demo-app-main {
  flex-grow: 1;
  padding: 1em;
}

.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
  --fc-button-active-bg-color: #60a2df;
  background-color: #eaf9fc;
}
.fc .fc-button-primary {
    background-color: #66b8ca;
    color: var(--fc-button-text-color);
}
.fc .fc-button {
    background-color:#5e91c1;
    border: 1px solid transparent;
    border-radius: 0.25em;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5;
    padding: 0.4em 0.65em;
}
.fc .fc-toolbar.fc-header-toolbar {
    margin-bottom: 1.5em;
    background-color: #5e91c1;
    color: #eaf9fc;
}
</style>
