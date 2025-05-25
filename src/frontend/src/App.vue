<script setup>
// import CleaningTable from './components/CleaningTable.vue';
import NavigationBar from './components/NavigationBar.vue';

</script>

<template>
  <div class="wrapper">
  <header>
    <NavigationBar/>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer>
  <section id="impressum">
    <h2>Impressum</h2>
    <p><strong>Name:</strong> Joshua Heninger</p>
    <p><strong>Anschrift:</strong> Schweizer Strasse 8, 01069 Dresden, Deutschland</p>
    <p><strong>E-Mail:</strong> <a href="mailto:mail.test@yourmap.com">joshua.heninger@posteo.de</a></p>
    <p><strong>Inhaltlich verantwortlich gemäß § 55 Abs. 2 RStV: </strong>Joshua Heninger</p>
  </section>
</footer>
</div>
</template>


<style>
:root {
  --main-font: "Rethink Sans"
}

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}


footer {
  font-size: 0.5em;
  padding: 20px;
  text-align: left;
  border-top: 1px solid #ccc;
}

</style>