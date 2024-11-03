<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onBeforeUnmount } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from "../auth";

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
  initialEvents: INITIAL_EVENTS,
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

async function handleEventClick(clickInfo) {
  if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
    try {
      await deleteDoc(doc(db, 'events', clickInfo.event.id));
      clickInfo.event.remove();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
}

function handleEvents(events) {
  // You could manage current events here if needed
}

onBeforeUnmount(() => {
  // Clean up any Firestore listeners if you have any
});

</script>

<style scoped>
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
