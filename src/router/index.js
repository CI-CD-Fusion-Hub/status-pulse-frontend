import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginPage.vue';
import Register from '../views/RegisterPage.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import VerifyCode from '../views/VerifyCode.vue';
import Endpoints from '../views/Endpoints.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgotPassword', component: ForgotPassword },
  { path: '/verifyCode', component: VerifyCode },
  { path: '/', redirect: () => { return { path: `/endpoints` }; } },
  {
    path: '/endpoints',
    name: 'Endpoints',
    component: Endpoints,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
