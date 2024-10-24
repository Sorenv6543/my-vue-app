vue
<template>
  <div id="app">
    <!-- Header with navigation links -->
    <header>
      <nav>
        <div class="logo">
          <h1>CleanBooking</h1>
        </div>
        <ul class="nav-links" :class="{ open: menuOpen, closed: !menuOpen }">
          <li><router-link to="/">Login</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/register">Register</router-link></li>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
        </ul>
        <!-- Hamburger Menu for mobile view -->
        <div class="hamburger" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>

    <!-- Main content area -->
    <router-view></router-view>

    <!-- Footer -->
    <footer>
      <p>&copy; 2024 My Vue App</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menuOpen = ref(false);

// Function to toggle mobile menu
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style scoped>
/* Global styles */
#app {
  max-width: 1200px;
  font-family: "Arial", sans-serif;
  color: #2c3e50;
  text-align: center;
}

/* Header and Navigation */
header {
  background-color: #003366;
  padding: 1rem 0;
  position: relative;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo h1 {
  color: white;
  font-size: 1.5rem;
}

/* Navigation links */
.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: max-height 0.3s ease;
}

.nav-links li {
  margin: 0 15px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
}

.nav-links a:hover {
  text-decoration: underline;
}

.nav-links a.router-link-active {
  font-weight: bold;
}

/* Hamburger Menu */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
}

/* Mobile menu states */
.nav-links.open {
  display: flex;
  flex-direction: column;
  max-height: 300px;
}

.nav-links.closed {
  max-height: 0;
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #003366;
    padding: 10px 0;
    flex-direction: column;
    align-items: center;
  }

  .nav-links li {
    margin: 10px 0;
  }

  .hamburger {
    display: flex;
  }
}
</style>