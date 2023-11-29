<script>
import { useVuelidate } from '@vuelidate/core';
import VModal from '../../components/VModal.vue';
import { useUserStore } from '../../stores/user';

export default {
  components: {
    VModal,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isBtnLoading: false,
      isModalVissible: false,
      interval: null,
      modalData: {},
      endpoint: [],
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
    this.clearInterval(this.interval);
  },
  methods: {
    getEndpointTooltip(item) {
      if (item.status !== 'nodata') {
        const date = new Date(item.created_at);
        const pad = num => num < 10 ? `0${num}` : num;
        return `
        Date: ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}\n
        Status: ${item.status}
        `;
      }
      else {
        return `No Data`;
      }
    },
    showUptimeModal(item) {
      this.modalData = item;
      this.isModalVissible = true;
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
      }, 3000);
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
      <li v-for="item in endpoint.slice(-90)" v-else :key="item" :class="`uptime_item ${item.status}`" :tooltip-text="getEndpointTooltip(item)" tooltip-position="Top" @click="showUptimeModal(item)" />
    </ul>
  </div>
  <VModal v-model:isActive="isModalVissible">
    <ul class="uptime_modal">
      <li>
        <h3>Status</h3>
        <div>{{ modalData.status }}</div>
      </li>
      <li>
        <h3>Response time</h3>
        <div>{{ modalData.response_time }}</div>
      </li>
      <li>
        <h3>Response Code</h3>
        <pre>{{ modalData.response.status_code }}</pre>
      </li>
      <li>
        <h3>Response Body</h3>
        <pre>{{ modalData.response.body }}</pre>
      </li>
    </ul>
  </VModal>
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

.uptime_graph li.uptime_item.ok{
  background-color: green;
}
.uptime_graph li.uptime_item.error_threshold_exceeded,
.uptime_graph li.uptime_item.error_invalid_status_code,
.uptime_graph li.uptime_item.error_parsing_incoming_body,
.uptime_graph li.uptime_item.error_invalid_body{
  background-color: red;
}
.uptime_graph li.uptime_item.nodata{
  background-color: gray;
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
</style>
