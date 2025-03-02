<script setup>
// import CleaningTable from './components/CleaningTable.vue';
import NavigationBar from './components/NavigationBar.vue';
</script>

<template>
  <header>
    <NavigationBar/>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer></footer>
</template>

