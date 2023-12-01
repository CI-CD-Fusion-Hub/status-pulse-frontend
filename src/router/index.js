import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginPage.vue';
import Endpoints from '../views/Endpoints.vue';
import SingleEndpoint from '../views/SingleEndpoint.vue';
import Share from '../views/Share.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: () => { return { path: `/endpoints` }; } },
  {
    path: '/endpoints',
    name: 'Endpoints',
    component: Endpoints,
  },
  {
    path: '/share',
    name: 'Share',
    component: Share,
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
