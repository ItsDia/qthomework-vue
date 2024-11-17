// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './App.vue';
import Login  from './Login.vue';
import Main from './main.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/main', component: Main, name: 'Main' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;