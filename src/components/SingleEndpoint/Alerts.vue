<script>
import VTag from '../VTag.vue';
import { useUserStore } from '../../stores/user';
import { useNotifyStore } from '../../stores/notifications';

export default {
  components: {
    VTag,
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      notifications: [],
      interval: null,
      formData: {},
      userStore: useUserStore(),
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
      this.isLoading = true;
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints/${this.$route.params.endpoint_id}/notifications`,
        });

        this.formData = response.data.data;
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
    <VTable :table-data="notifications" :is-loading="isLoading" :pagination="true" :page-size="5" :is-searchable="true" :search-in-columns="['name', 'status']" :show-row-index="true">
      <VColumn header="Description" value="created_at">
        <template #body="{ row }">
          {{ unixTimestampToFormattedString(row.created_at) }}
        </template>
      </VColumn>
      <VColumn header="Response Time (ms)" value="response_time" />
      <VColumn header="Response Status Code" value="response">
        <template #body="{ row }">
          {{ row.response.status_code }}
        </template>
      </VColumn>
      <VColumn header="Response Body" value="response">
        <template #body="{ row }">
          <template v-if="row.response.body !== ''">
            {{ row.response.body }}
          </template>
          <VTag v-else :icon="['fas', 'ghost']" type="skipped" tooltip-text="No Body Fetched" tooltip-position="Top" />
        </template>
      </VColumn>
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <span v-if="row.status && !row.status.includes('error')" :tooltip-text="row.status" tooltip-position="Top"><font-awesome-icon :icon="statusIcons[row.status]" /></span>
          <span v-else-if="row.status && row.status.includes('error')" :tooltip-text="row.status" tooltip-position="Top"><font-awesome-icon :icon="statusIcons.degraded" /></span>
          <span v-else tooltip-text="Measuring" tooltip-position="Top"><font-awesome-icon :icon="statusIcons.measuring" /></span>
        </template>
      </VColumn>
    </VTable>
  </div>
</template>

<style>

</style>
