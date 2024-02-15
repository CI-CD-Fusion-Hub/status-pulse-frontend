<script>
import VAsideMenu from './components/VAsideMenu.vue';
import VNotification from './components/VNotification.vue';
import { useUserStore } from './stores/user';

export default {
  components: { VAsideMenu, VNotification },
  data() {
    return {
      asideMenuRoutes: [
        {
          path: '/dashboards',
          icon: 'bx bx-network-chart',
          label: 'Dashboards',
          requiredAccessLevel: ['User', 'Admin'],
        },
        {
          path: '/endpoints',
          icon: 'bx bx-globe',
          label: 'Endpoints',
          requiredAccessLevel: ['User', 'Admin'],
        },
        {
          path: '/notifiy_channels',
          icon: 'bx bx-bell',
          label: 'Notify Channels',
          requiredAccessLevel: ['User', 'Admin'],
        },
      ],
    };
  },
  created() {
    const userInfo = useUserStore();
    if (!window.location.href.includes('/login') && !window.location.href.includes('/logout'))
      userInfo.loadData();
  },
};
</script>

<template>
  <div v-if="!$route.path.includes('login') && !$route.path.includes('register') && !$route.path.includes('forgotPassword') && !$route.path.includes('verifyCode')" class="main_container">
    <VAsideMenu :menu-items="asideMenuRoutes" />
    <main>
      <router-view />
    </main>
  </div>
  <div v-else class="login_container">
    <router-view />
  </div>
  <VNotification />
</template>

<style>
.main_container {
  display: grid;
  grid-template-columns: 250px 1fr;
}

.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

main {
  position: relative;
}
</style>
