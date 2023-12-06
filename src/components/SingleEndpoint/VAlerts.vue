<script>
import VTable from '../VTable.vue';
import VColumn from '../VColumn.vue';
import { useUserStore } from '../../stores/user';
import { useNotifyStore } from '../../stores/notifications';

export default {
  components: {
    VTable,
    VColumn,
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      notifications: [],
      isLoading: true,
      interval: null,
      formData: {},
      userStore: useUserStore(),
      statusIcons: {
        ok: ['fas', 'fa-bell'],
        failed: ['fas', 'fa-bell-slash'],
      },
      typeIcons: {
        email: ['fas', 'fa-envelope'],
        mattermost: ['fas', 'fa-message'],
      },
    };
  },
  async created() {
    this.loadData();
  },
  mounted() {
    this.intervalLoadData();
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints/${this.$route.params.endpoint_id}/notifications`,
        });

        this.notifications = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    async intervalLoadData() {
      this.interval = setInterval(() => {
        this.loadData();
      }, 30000);
    },
  },
};
</script>

<template>
  <div class="notifications_holder">
    <h2><font-awesome-icon :icon="['fas', 'fa-bullhorn']" /> Alerts</h2>
    <p>Here the all of the alerts triggered on this endpoint.</p>
    <VTable :table-data="notifications" :is-loading="isLoading" :pagination="true" :page-size="10" :is-searchable="true" :search-in-columns="['status', 'notification_name']" :show-row-index="true">
      <VColumn header="Type" value="notification_type">
        <template #body="{ row }">
          <span :tooltip-text="row.notification_type" tooltip-position="Top"><font-awesome-icon :icon="typeIcons[row.notification_type]" /></span>
        </template>
      </VColumn>
      <VColumn header="Name" value="notification_name" />
      <VColumn header="Result" value="response" />
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <span :tooltip-text="row.status" tooltip-position="Top"><font-awesome-icon :icon="statusIcons[row.status]" /></span>
        </template>
      </VColumn>
      <VColumn header="Description" value="created_at">
        <template #body="{ row }">
          {{ unixTimestampToFormattedString(row.created_at) }}
        </template>
      </VColumn>
    </VTable>
  </div>
</template>

<style>
.notifications_holder {
  padding: 20px;
  background-color: var(--main-color);
  margin-top: 20px;
  font-family: var(--main-font);
  border-radius: var(--border-radius);
  color: white;
}

.notifications_holder h2 {
  margin-bottom: 5px;
}
.notifications_holder p {
  font-size: 14px;
  margin-bottom: 10px;
}

.notifications_holder .fa-bell,
.notifications_holder .fa-bell-slash {
    font-size: 20px;
}

.notifications_holder .fa-bell {
    color: green;
}
.notifications_holder .fa-bell-slash {
    color: red;
}
</style>
