<script>
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  props: {},
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      userInfo: useUserStore(),
      asideMenuRoutes: [
        {
          path: '/dashboards',
          icon: ['fas', 'gauge'],
          label: 'Dashboards',
          requiredAccessLevel: ['User', 'Admin'],
        },
        {
          path: '/endpoints',
          icon: ['fas', 'sitemap'],
          label: 'Endpoints',
          requiredAccessLevel: ['User', 'Admin'],
        },
        {
          path: '/notifications',
          icon: ['fas', 'bell'],
          label: 'Notifications',
          requiredAccessLevel: ['User', 'Admin'],
        },
        {
          path: '/login',
          icon: ['fas', 'arrow-right-from-bracket'],
          label: 'Logout',
          requiredAccessLevel: ['User', 'Admin'],
        },
      ],
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
  <aside class="aside_menu">
    <ul>
      <!-- <li class="logo_holder">
          <router-link
            to="/endpoints"
          >
          <img src="/logo2.png" alt="Logo" />
          </router-link>
      </li> -->
      <template
        v-for="route in asideMenuRoutes"
        :key="route"
      >
        <li v-if="route.requiredAccessLevel.includes(userInfo.accessLevel)" :tooltip-text="route.label" tooltip-position="right">
          <router-link
            v-if="route.label !== 'Logout'"
            :to="route.path"
            :class="{ active: $route.path.startsWith(route.path) }"
          >
            <font-awesome-icon :icon="route.icon" />
            <span>{{ route.label }}</span>
          </router-link>
          <router-link
            v-else
            :to="route.path"
            :class="{ active: $route.path.startsWith(route.path) }"
            @click="logout"
          >
            <font-awesome-icon :icon="route.icon" />
            <span>{{ route.label }}</span>
          </router-link>
        </li>
      </template>
    </ul>
  </aside>
</template>

<style>
.aside_menu > ul {
  height: 100%;
  background-color: var(--main-color);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 10;
  flex-flow: column nowrap;
  display: flex;
  width: 160px;
  padding: 0 20px;
  gap: 10px;
  border-right: var(--border-style);
  list-style: none;
}

.aside_menu ul li:first-child {
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

.aside_menu > ul > li:last-child {
  margin-top: auto;
}

.aside_menu > ul > li:hover:last-child {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.aside_menu ul li {
  transition: background-color 300ms;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.aside_menu ul li:hover,
.aside_menu ul li a.active {
  background-color:var(--main-color-hover);
}

.aside_menu ul li span {
  display: none;
}

.aside_menu ul li a {
  text-decoration: none;
  color: #fff;
  padding: 15px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.aside_menu svg {
  min-width: 20px;
}

@media only screen and (min-width: 1024px) {
  .aside_menu {
    width: 200px;
    overflow-x: hidden;
    position: relative;
  }

  .aside_menu ul li span {
    display: inline-block;
  }
}
</style>
