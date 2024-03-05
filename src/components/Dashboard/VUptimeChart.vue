<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      widgetData: [],
    };
  },
  computed: {},
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints/${this.data.id}/widget?unit=${this.data.unit}&duration=${this.data.duration}&type=${this.data.type}`,
        });

        this.widgetData = response.data.data;
        this.isLoading = false;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }
    },
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
    floorTimestamp(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);

      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);

      return date.getTime();
    },
  },
};
</script>

<template>
  <div class="uptime-graph">
    <h5>{{ data.name }}</h5>
    <p>Here is the uptime time graph for {{ data.duration }} {{ data.unit }}.</p>
    <ul>
      <li v-if="widgetData?.length === 0" class="uptime-loader">
        <i class="bx bx-loader-circle bx-spin bx-rotate-90" />
      </li>
      <li v-for="item in widgetData" v-else :key="item" :class="`uptime-item ${item.status} ${item?.is_active}`" :tooltip-text="getEndpointTooltip(item)" tooltip-position="Top" />
    </ul>
  </div>
</template>

<style>
.uptime-graph {
    width: 100%;
    height: 100%;
    color: white;
    display: flex;
    flex-flow: column;
}

.uptime-graph ul {
  display: flex;
  height: 100%;
  gap: 4px;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: nowrap;
}

.uptime-graph .uptime-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bar-chart-bg);
  color: white;
  gap: 10px;
  border-radius: 6px;
}

.uptime-graph ul li:first-child {
  border-radius: 6 0 0 6;
}
.uptime-graph ul li:last-child{
  border-radius: 0 6 6 0;
}

.uptime-graph ul li {
  border-radius: 0;
  padding: 0;
  width: -webkit-fill-available;
  cursor: pointer;
}

.uptime-graph li.uptime-item.healthy{
  background-color: var(--green-500);
}
.uptime-graph li.uptime-item.degraded{
  background-color: var(--red-500);
}
.uptime-graph li.uptime-item.unhealthy{
  background-color: yellow;
}
.uptime-graph li.uptime-item.nodata{
  background-color: var(--bar-chart-bg);
}

.uptime-graph li.uptime-item.true {
  outline: auto;
  outline-color: rgb(184 74 5);
  outline-style: solid;
  z-index: 3;
}

.uptime-graph h5 {
  margin-bottom: 8px;
}
.uptime-graph p {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.01em;
  color: var(--body-text);
  margin-bottom: 32px;
}

.uptime-graph [tooltip-text]::after {
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
