<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
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
  <div class="uptime_graph">
    <h2><font-awesome-icon :icon="['fas', 'signal']" /> Uptime Graph</h2>
    <p>Here the 72h uptime of this endpoint.</p>
    <ul>
      <li v-if="data?.length === 0" class="uptime_loader">
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
      </li>
      <li v-for="(item, idx) in data" v-else :key="item" :class="`uptime_item ${item.status} ${item?.is_active}`" :tooltip-text="getEndpointTooltip(item)" tooltip-position="Top" @click="showUptimeTable(item, idx)" />
    </ul>
  </div>
</template>

<style>
.uptime_graph {
  padding: 20px;
  background-color: var(--main-color);
  border-radius: var(--border-radius);
  color: white;
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
  outline-color: rgb(184 74 5);
  outline-style: solid;
  z-index: 3;
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
