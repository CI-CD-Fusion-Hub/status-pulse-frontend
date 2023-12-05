<script>
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';
import VButton from './VButton.vue';

export default {
  components: { VButton },
  props: {},
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      userInfo: useUserStore(),
    };
  },
  methods: {
    async logout() {
      try {
        await this.axios({ method: 'post', url: `${this.backendUrl}/logout` });

        this.$router.push({ path: '/login' });
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
    },
  },
};
</script>

<template>
  <header class="top_header">
    <div class="logo_container"><img src="/logo2.png" alt="logo"></div>
    <div class="user_profile">
      {{ userInfo.email }}
      <!-- <VButton :icon="['fas', 'arrow-right-from-bracket']" @on-click="logout" /> -->
    </div>
  </header>
</template>

<style>
.top_header {
  padding: 7px 20px;
  background-color: var(--main-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  border-bottom: var(--border-style)
}

.top_header .logo_container img {
  width: 26px;
}

.top_header .user_profile {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}
</style>
