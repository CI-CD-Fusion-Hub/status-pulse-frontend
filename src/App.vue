<script>
import VTopHeader from './components/VTopHeader.vue';
import VAsideMenu from './components/VAsideMenu.vue';
import { useUserStore } from './stores/user';

export default {
  components: { VTopHeader, VAsideMenu },
  created() {
    const userInfo = useUserStore();
    if (!window.location.href.includes('/login') && !window.location.href.includes('/logout'))
      userInfo.loadData();
  },
};
</script>

<template>
  <div v-if="!$route.path.includes('login')" class="main_container">
    <VAsideMenu />
    <main>
      <VTopHeader />
      <router-view />
    </main>
  </div>
  <div v-else class="login_container">
    <router-view />
  </div>
</template>

<style>
.main_container {
  display: grid;
  grid-template-columns: 200px 1fr;
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
