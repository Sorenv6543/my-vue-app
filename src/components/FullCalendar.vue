<!-- HTML -->
<template>
  <div class='demo-app'>
    <div class='demo-app-main'>
      <FullCalendar
        class='demo-app-calendar'
        :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>



<!-- JAVASCRIPT -->
<script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc,  query, where, getDocs } from 'firebase/firestore';
import { auth } from "../auth"; // Import your Firebase auth instance


export default defineComponent({
  components: {
    FullCalendar,
  },
  props:{
  userId: String,
  activeHouse: Object 
},
  data() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        initialEvents: INITIAL_EVENTS,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        events: this.fetchEvents,
       
      },
      currentEvents: [],
    }
  },

  methods: {
    
    async fetchEvents(fetchInfo, successCallback, failureCallback) {
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
        ...doc.data()
      }));

      successCallback(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      failureCallback(error);
    }
  },
  // ...

    async handleDateSelect(selectInfo) {
      let title = prompt('Please enter a new title for your event')
      let calendarApi = selectInfo.view.calendar
      calendarApi.unselect()
      if (title && typeof title === 'string' && title.trim() !== '') {
        const newEvent = {
          id: createEventId(),
          title: title.trim(),
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
          userId: auth.currentUser.uid
        }
        try {
          const docRef = await addDoc(collection(db, 'events'), newEvent);
          await updateDoc(doc(db, 'events', docRef.id), { id: docRef.id });
          calendarApi.addEvent(newEvent)
        } catch (error) {
          console.error('Error adding event: ', error);
          // Handle error (e.g., show user-friendly message)
        }
      }
    },
    async handleEventClick(clickInfo) {
      if (await this.$confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        try {
          await deleteDoc(doc(db, 'events', clickInfo.event.id));
          clickInfo.event.remove()
        } catch (error) {
          console.error('Error deleting event: ', error);
          // Handle error (e.g., show user-friendly message)
        }
      }
    },
    handleEvents(events) {
      this.currentEvents = events
    },
    beforeUnmount() {
    // Clean up any Firestore listeners if you have any
  },
},




})
</script>



<style lang='css'>

h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}
b {
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 80%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  border-color: aquamarine;
}

.demo-app-sidebar {
  width: 150px;
  line-height: 1.2;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: .2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 1em;
}

.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

</style>