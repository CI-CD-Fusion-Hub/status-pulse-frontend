import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginPage.vue';
import Endpoints from '../views/Endpoints.vue';
import SingleEndpoint from '../views/SingleEndpoint.vue';

const routes = [
  { path: '/login', component: Login },
  {
    path: '/endpoints',
    name: 'Endpoints',
    component: Endpoints,
  },
  {
    path: '/endpoints/:endpoint_id',
    name: 'SingleEndpoint',
    component: SingleEndpoint,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
