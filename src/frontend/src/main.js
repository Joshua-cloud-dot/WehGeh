import './assets/main.css'

import { createApp } from 'vue'
import OneSignalVuePlugin from '@onesignal/onesignal-vue3'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import CleaningTable from './components/CleaningTable.vue';
import Home from './components/Home.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/putzplan', component: CleaningTable },
    ]
});


const app = createApp(App);
app.use(router);
app.use(OneSignalVuePlugin, {
        appId: "222c4fa7-6611-43d0-b5c9-8aebe22680e8",
      safari_web_id: "web.onesignal.auto.0e731bf1-0f8d-4c8c-8593-03e4c907000a",
      notifyButton: {
        enable: true,
      },
      subdomainName: "wehgehweb",
  });
app.mount('#app');

