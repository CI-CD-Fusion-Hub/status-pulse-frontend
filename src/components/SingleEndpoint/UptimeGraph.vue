<script>
import { useVuelidate } from '@vuelidate/core';
import VTable from '../../components/VTable.vue';
import VColumn from '../../components/VColumn.vue';
import VTag from '../../components/VTag.vue';
import { useUserStore } from '../../stores/user';

export default {
  components: {
    VColumn,
    VTable,
    VTag,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isBtnLoading: false,
      isModalVissible: false,
      isUptimeTableVissible: false,
      isUptimeTableLoading: false,
      activeUptimeItem: null,
      interval: null,
      modalData: {},
      endpoint: [],
      endpoint_logs: [],
      userStore: useUserStore(),
      statusIcons: {
        measuring: ['fas', 'fa-heart-pulse'],
        healthy: ['fas', 'fa-heart'],
        unhealthy: ['fas', 'fa-heart-circle-exclamation'],
        degraded: ['fas', 'fa-heart-crack'],
      },
    };
  },
  computed: {
    getUptimeItems() {
      return this.endpoint.map((item, index) => {
        if (index === this.activeUptimeItem)
          return { ...item, is_active: true };

        return item;
      });
    },
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
    getEndpointTooltip(item) {
      if (item.status !== 'nodata') {
        return `
        Date: ${this.unixTimestampToFormattedString(item.created_at)}\n
        Status: ${item.status}
        `;
      }
      else {
        return `No Data`;
      }
    },
    getUTCHourFromTimestamp(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const utcHour = date.getHours();

      return `${year}-${month}-${day} ${utcHour}:00:00`;
    },
    async showUptimeTable(item, idx) {
      console.log(idx, this.activeUptimeItem);
      if (idx !== this.activeUptimeItem) {
        this.activeUptimeItem = idx;
        this.isUptimeTableLoading = true;
        this.isUptimeTableVissible = true;
        const date_from = this.getUTCHourFromTimestamp(item.created_at);
        const date_to = this.getUTCHourFromTimestamp(item.created_at + 3600);

        try {
          const response = await this.axios({
            method: 'get',
            url: `${this.backendUrl}/endpoints/${this.$route.params.endpoint_id}/uptime/logs?date_from=${date_from}&date_to=${date_to}&full=${item.status === 'healthy'}`,
          });

          this.endpoint_logs = response.data.data;
        }
        catch (error) {
          console.log('Unable to get authentication method.');
        }

        this.isUptimeTableLoading = false;
      }
      else {
        this.isUptimeTableVissible = false;
        this.activeUptimeItem = null;
      }
    },
    async loadData() {
      this.isLoading = true;
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints/${this.$route.params.endpoint_id}/uptime`,
        });

        this.endpoint = response.data.data;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
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
  <div class="uptime_graph">
    <h2><font-awesome-icon :icon="['fas', 'signal']" /> Uptime Graph</h2>
    <p>Here the 72h uptime of this endpoint.</p>
    <ul>
      <li v-if="endpoint?.length === 0" class="uptime_loader">
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
      </li>
      <li v-for="(item, idx) in getUptimeItems" v-else :key="item" :class="`uptime_item ${item.status} ${item?.is_active}`" :tooltip-text="getEndpointTooltip(item)" tooltip-position="Top" @click="showUptimeTable(item, idx)" />
    </ul>
    <div v-if="isUptimeTableVissible" class="uptime_table">
      <VTable :table-data="endpoint_logs" :is-loading="isUptimeTableLoading" :pagination="true" :page-size="15" :is-searchable="true" :search-in-columns="['status']" :show-row-index="true">
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
  </div>
</template>

<style>
.uptime_graph {
  padding: 20px;
  background-color: white;
  border-radius: var(--border-radius);
}

.uptime_graph ul {
  display: flex;
  height: 100px;
  gap: 1px;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: nowrap;
}

.uptime_graph .uptime_loader {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-color);
  color: white;
  gap: 10px;
  border-radius: var(--border-radius);
}

.uptime_graph ul li:first-child {
  border-radius: var(--border-radius) 0 0 var(--border-radius);
}
.uptime_graph ul li:last-child{
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.uptime_graph ul li {
  border-radius: 0;
  padding: 0;
  width: -webkit-fill-available;
  cursor: pointer;
}

.uptime_graph li.uptime_item.healthy{
  background-color: green;
}
.uptime_graph li.uptime_item.degraded{
  background-color: red;
}
.uptime_graph li.uptime_item.unhealthy{
  background-color: yellow;
}
.uptime_graph li.uptime_item.nodata{
  background-color: gray;
}

.uptime_graph li.uptime_item.true {
  outline: auto;
  outline-color: var(--main-color);
}

.uptime_graph h2 {
  margin-bottom: 5px;
}
.uptime_graph p {
  font-size: 14px;
  margin-bottom: 10px;
}

.uptime_graph [tooltip-text]::after {
  min-width: 150px;
}

.uptime_modal {
  padding: 20px;
  background-color: white;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: space-between;
}

.uptime_table {
  margin-top: 20px;
}
</style>
