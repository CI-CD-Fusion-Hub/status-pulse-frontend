<script>
import VAsideMenu from './components/VAsideMenu.vue';
import VTopHeader from './components/VTopHeader.vue';
import VNotification from './components/VNotification.vue';
import { useUserStore } from './stores/user';

export default {
  components: { VAsideMenu, VNotification, VTopHeader },
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
      <VTopHeader />
      <div>
        <router-view />
      </div>
    </main>
  </div>
  <div v-else class="login_container">
    <router-view />
  </div>
  <VNotification />
</template>

<style>
.main_container {
  background-color: var(--box-bg);
}

.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.aside-menu[is-collapsed="false"] + main {
  margin-left: 280px;
}
.aside-menu[is-collapsed="true"] + main {
  margin-left: 80px;
}

.main_container > main {
  position: relative;
  transition: margin-left 200ms ease-in-out;
  display: flex;
  flex-flow: column;
  align-items: stretch;
  height: 100vh;
}

.main_container > main > div {
  padding: 40px;
  border-top-left-radius: 8px;
  background-color: var(--main-bg-color);
  height: 100%;
  overflow-y: scroll;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
}
</style>
