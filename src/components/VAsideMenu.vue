<script>
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {},
  props: {
    menuItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      userInfo: useUserStore(),
      isCollapsed: true,
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
    toggleMenu() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<template>
  <aside :class="`aside-menu is-collapsed-${isCollapsed}`">
    <ul>
      <li class="logo-holder">
        <router-link
          to="/"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_748_422)">
              <rect width="32" height="32" rx="6" fill="white" />
              <ellipse cx="16.5" cy="15" rx="27.5" ry="27" fill="#6157DB" />
              <path d="M0.211892 21.0261L-13 42H35V5L16.6111 24.998C15.0264 26.7213 12.307 26.7213 10.7223 24.998L6.54077 20.4506C4.75675 18.5105 1.61668 18.796 0.211892 21.0261Z" fill="black" fill-opacity="0.3" />
              <path d="M17.4917 7.41205L32 -8H-29V28L-1.88889 -0.800001L5.84159 7.41206C9.00019 10.7674 14.3331 10.7674 17.4917 7.41205Z" fill="white" fill-opacity="0.6" />
            </g>
            <defs>
              <clipPath id="clip0_748_422">
                <rect width="32" height="32" rx="6" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span v-if="!isCollapsed">StatusPulse</span>
        </router-link>
      </li>
      <template v-for="route in menuItems">
        <li v-if="route.requiredAccessLevel.includes(userInfo.accessLevel)" :key="route" :tooltip-text="isCollapsed ? route.label : null" :tooltip-position="isCollapsed ? 'right' : null">
          <router-link
            :to="route.path"
            :class="{ active: $route.path.startsWith(route.path) }"
          >
            <i :class="route.icon" />
            <span v-if="!isCollapsed">{{ route.label }}</span>
          </router-link>
        </li>
      </template>
      <li class="footer">
        <div class="links">
          <a href="https://www.external-url.com" target="_blank" rel="noopener noreferrer" class="github" :tooltip-text="isCollapsed ? 'Check GitHub' : null" :tooltip-position="isCollapsed ? 'right' : null">
            <span v-if="!isCollapsed">GitHub</span>
            <i v-if="isCollapsed" class="bx bxl-github" />
            <i v-else class="bx bx-link-external" />
          </a>
          <a href="https://www.external-url.com" target="_blank" rel="noopener noreferrer" class="github" :tooltip-text="isCollapsed ? 'Check GitLab' : null" :tooltip-position="isCollapsed ? 'right' : null">
            <span v-if="!isCollapsed">GitLab</span>
            <i v-if="isCollapsed" class="bx bxl-gitlab" />
            <i v-else class="bx bx-link-external" />
          </a>
        </div>
        <p v-if="!isCollapsed">
          © 2024  StatusPulse - Beta
        </p>
      </li>
      <li class="menu-btn">
        <span v-if="!isCollapsed">Hide Menu</span>
        <button :tooltip-text="isCollapsed ? 'Show Menu' : null" :tooltip-position="isCollapsed ? 'right' : null" @click="toggleMenu">
          <span v-if="!isCollapsed" class="menu-collapse"><i class="bx bx-chevron-left" /></span>
          <span v-else class="menu-collapse"><i class="bx bx-chevron-right" /></span>
        </button>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.aside-menu {
  background-color: #0A0F16;
  position: fixed;
  height: 100vh;
  display: flex;
  transition: width 100ms ease-in-out;
}

.aside-menu.is-collapsed-true {
  width: 80px;
  align-content: center;
}

.aside-menu.is-collapsed-false {
  width: 280px;
  align-content: left;
  overflow: hidden;
}

.aside-menu ul {
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 10px;
}

.aside-menu.is-collapsed-true li {
  margin: 0 20px;
  align-items: center;
}

.aside-menu li {
  display: flex;
  justify-content: center;
  flex-flow: column;
  color: #848F9D;
}

.aside-menu.is-collapsed-true .links {
  display: flex;
  flex-flow: column;
  gap: 10px;
}

.aside-menu li > a,
.aside-menu.is-collapsed-true li:not(:first-child) .links a {
  transform: border-box;
  text-align: center;
  border-radius: 4px;
  padding: 8px 8px 6px 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.aside-menu.is-collapsed-false li{
  margin: 0 16px;
}

.aside-menu li:not(:first-child) > a:hover,
.aside-menu li:not(:first-child) > a.active,
.aside-menu.is-collapsed-true .links a:hover{
  background-color: #141C24;
  color: white;
}

.aside-menu li > a i,
.aside-menu li > button i,
.aside-menu.is-collapsed-true .links i {
  font-size: 24px;
}

.aside-menu .logo-holder {
  padding: 24px 0;
  color: white;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
}

.aside-menu li.footer {
  margin-top: auto;
}

.aside-menu.is-collapsed-false li.footer .links {
  display: flex;
  justify-content: flex-start;
  flex-flow: row;
  gap: 24px;
  margin-bottom: 16px;
}

.aside-menu.is-collapsed-false li.footer .links a {
  gap: 10px;
  display: flex;
  align-items: center;
  transition: color 300ms ease-in-out;
}

.aside-menu.is-collapsed-false li.footer a:hover{
  color: white;
}

.aside-menu.is-collapsed-false li.footer a:hover span{
  text-decoration: underline;
}

.aside-menu.is-collapsed-false li.footer i {
  font-size: 20px;
}

.aside-menu.is-collapsed-false li.footer p {
  font-size: 12px;
}

.aside-menu li.menu-btn {
  border-top: solid 1px #252F3A;
  padding: 8px 0 0 8px;
  margin: 16px 16px 8px 16px;
  display: flex;
  align-content: space-between;
  align-items: center;
  flex-flow: row;
  justify-content: space-between;
}

.aside-menu.is-collapsed-true li.menu-btn {
  padding: 8px 0 0 0;
  justify-content: center;
}

.aside-menu .menu-collapse {
  border: solid 1px #848F9D;
  width: 32px;
  border-radius: 4px;
  display: flex;
  color: #848F9D;
  cursor: pointer;
}

.aside-menu.is-collapsed-true .menu-collapse {
  justify-content: flex-end;
}
.aside-menu.is-collapsed-false .menu-collapse {
  justify-content: flex-start;
}
</style>
