<template>
  <header>
    <nav>
      <div class="logo">
        <h2>CleanBooking</h2>
      </div>
      <ul class="nav-links" :class="{ open: menuOpen, closed: !menuOpen }">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
      </ul>
      <div class="hamburger" @click="toggleMenu" :class="{ open: menuOpen }">
        <span class="hamburger-icon"></span>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const menuOpen = ref(true);

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    return {
      menuOpen,
      toggleMenu
    };
  }
};
</script>

<style scoped>
/* Header and Navigation */
header {
  background-color: #003366;
  padding: 0.1rem 0;
  position: relative;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 10px;
}

.logo h2 {
  color: white;
  font-size: 1.3rem;
}

/* Navigation links */
.nav-links {
    display: flex;
    flex-direction: row;
    max-height: 300px;
    justify-content: space-evenly;
    align-content: space-around;
    flex-wrap: nowrap;
    
  
  list-style: none;
  
    /* position: absolute; */
    top: 41%;
    left: 0;
    width: 100%;
    background-color: #003366;
    
    align-items: center;
    justify-content: space-around;
}

.nav-links li {
  margin: 0 15px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: .9rem;
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
  cursor: pointer;
  width: 30px;
  height: 20px;
  position: relative;
}

.hamburger-icon,
.hamburger-icon::before,
.hamburger-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: white;
  transition: all 0.3s ease;
  font-size: 0.3rem;
}

.hamburger-icon::before {
  top: -8px;
}

.hamburger-icon::after {
  bottom: -8px;
}

.hamburger.open .hamburger-icon {
  background-color: transparent;
}

.hamburger.open .hamburger-icon::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.open .hamburger-icon::after {
  transform: rotate(-45deg);
  bottom: 0;
}

/* Mobile menu states */
.nav-links.open {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  max-height: 300px;
  font-size: .1rem;
  padding: 1px 0px;
}

.nav-links.closed {
  max-height: 0;
  overflow: hidden;
}

/* Responsive design */
/* @media (min-width: 768px) { */
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #003366;
    padding: 10px 0;
    
    align-items: center;
  }

  .nav-links li {
    margin: 10px 0;
  }

  .hamburger {
    display: block;
  }

</style>