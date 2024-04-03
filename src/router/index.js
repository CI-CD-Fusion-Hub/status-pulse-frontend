import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginPage.vue';
import Register from '../views/RegisterPage.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import VerifyCode from '../views/VerifyCode.vue';
import Endpoints from '../views/Endpoints.vue';
import SingleEndpoint from '../views/SingleEndpoint.vue';
import Dashboards from '../views/Dashboards.vue';
import SingleDashboard from '../views/SingleDashboard.vue';

const routes = [
  { path: '/login', component: Login, meta: { breadcrumb: 'Login' } },
  { path: '/register', component: Register, meta: { breadcrumb: 'Register' } },
  { path: '/forgotPassword', component: ForgotPassword, meta: { breadcrumb: 'Forgot Password' } },
  { path: '/verifyCode', component: VerifyCode, meta: { breadcrumb: 'Verify Code' } },
  { path: '/', redirect: '/dashboards' },
  {
    path: '/endpoints',
    name: 'Endpoints',
    component: Endpoints,
    meta: { breadcrumb: 'Endpoints' },
  },
  {
    path: '/endpoints/:endpoint_id',
    name: 'SingleEndpoint',
    component: SingleEndpoint,
    meta: { breadcrumb: 'Single Endpoint' },
  },
  {
    path: '/dashboards',
    name: 'Dashboards',
    component: Dashboards,
    meta: { breadcrumb: 'Dashboards' },
  },
  {
    path: '/dashboards/:dashboard_id',
    name: 'SingleDashboard',
    component: SingleDashboard,
    meta: {
      breadcrumb: [
        { to: '/dashboards', label: 'Dashboards' },
        { label: `Single Dashboard` },
      ],
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
