import './assets/main.css'

import { createApp } from 'vue'
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
app.mount('#app');

