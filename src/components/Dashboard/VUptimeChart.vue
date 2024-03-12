<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
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
  <ul class="uptime-graph">
    <li v-for="item in data" :key="item" :class="`uptime-item ${item.status} ${item?.is_active}`" :tooltip-text="getEndpointTooltip(item)" tooltip-position="Top" />
  </ul>
</template>

<style scoped>
.uptime-graph {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 4px;
}

.uptime-graph li:first-child {
  border-radius: 6 0 0 6;
}
.uptime-graph li:last-child{
  border-radius: 0 6 6 0;
}

.uptime-graph li {
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

.uptime-graph [tooltip-text]::after {
  min-width: 150px;
}
</style>
