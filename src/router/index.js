import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginPage.vue';
import Endpoints from '../views/Endpoints.vue';
import SingleEndpoint from '../views/SingleEndpoint.vue';
import Notifications from '../views/Notifications.vue';
import Share from '../views/Share.vue';
import Dashboards from '../views/Dashboards.vue';
import SingleDashboard from '../views/SingleDashboard.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: () => { return { path: `/dashboards` }; } },
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
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
  },
  {
    path: '/share',
    name: 'Share',
    component: Share,
  },
  {
    path: '/dashboards',
    name: 'Dashboards',
    component: Dashboards,
  },
  {
    path: '/dashboards/:dashboard_id',
    name: 'SingleDashboard',
    component: SingleDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
