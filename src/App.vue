<script>
import VTopHeader from './components/VTopHeader.vue';
import { useUserStore } from './stores/user';

export default {
  components: { VTopHeader },
  created() {
    const userInfo = useUserStore();
    if (!window.location.href.includes('/login') && !window.location.href.includes('/logout'))
      userInfo.loadData();
  },
};
</script>

<template>
  <VTopHeader v-if="!$route.path.includes('login')" />
  <main>
    <router-view />
  </main>

  <VNotification />
</template>

<style>
main {
  position: relative;
  background-color: var(--main-bg-color);
}

header + main {
  max-width: 1600px;
  margin: 20px auto;
}
</style>
