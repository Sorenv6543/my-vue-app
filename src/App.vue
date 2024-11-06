<template>
  <div id="app">
    <!-- Main content area -->
    <router-view></router-view>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Global styles */
#app {
  max-width: 1800px;
  font-family: Arial, sans-serif;
  color: #7197bd;
  text-align: center;
}

/* Header and Navigation */
header {
  background-color: #cdd8e3;
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

.logo h1 {
  color: #ffffff;
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
  color: #ffffff;
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
  background-color: #ffffff;
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
@media (max-width: 1768px) {
  .nav-links {
    position: relative;
    top: 30px;
    left: 0;
    width: 100%;
    background-color: #c7cbcf;
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