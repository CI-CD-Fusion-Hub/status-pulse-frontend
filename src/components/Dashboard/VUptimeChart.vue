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
    formatDate(timestamp) {
      var dateObject = new Date(timestamp * 1000);
      var month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(dateObject);
      var day = dateObject.getDate();
      var year = dateObject.getFullYear();
      var hour = dateObject.getHours().toString().padStart(2, '0');
      var minute = dateObject.getMinutes().toString().padStart(2, '0');
      return `${month} ${day},${year} - ${hour}:${minute} h`;
    }
  },
};
</script>

<template>
  <ul class="uptime-graph">
    <li v-for="item in data" :key="item" :class="`uptime-item ${item.status} ${item?.is_active}`">
      <div>
        <span>{{ formatDate(item.created_at) }}</span>
        <span><span :status="item.status"></span>{{ item.status }} (100%)</span>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.uptime-graph {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 4px;
  z-index: 2;
  cursor: pointer;
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
  position: relative;
  transition: background-color 300ms ease-in-out;
}

.uptime-graph li.uptime-item.healthy,
.uptime-graph li:hover div span[status="healthy"]{
  background-color: var(--green-500);
}
.uptime-graph li.uptime-item.healthy:hover {
  background-color: #187c41;
}

.uptime-graph li.uptime-item.degraded,
.uptime-graph li:hover div span[status="degraded"]{
  background-color: var(--red-500);
}
.uptime-graph li.uptime-item.degraded:hover {
  background-color: #932f32;
}

.uptime-graph li.uptime-item.unhealthy,
.uptime-graph li:hover div span[status="unhealthy"]{
  background-color: yellow;
}
.uptime-graph li.uptime-item.unhealthy:hover {
  background-color: #9c8c34;
}


.uptime-graph li.uptime-item.nodata,
.uptime-graph li:hover div span[status="nodata"]{
  background-color: var(--bar-chart-bg);
}
.uptime-graph li.uptime-item.nodata:hover {
  background-color: #10171f;
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

.uptime-graph li div {
  width: 155px;
  position: absolute;
  background-color: var(--gray-scale-6);
  padding: 8px 12px;
  display: none;
  border-radius: 2px;
  top:-68px;
  left: calc(50% - 89.5px);
  right: 0;
}


.uptime-graph li::before {
  content: url("data:image/svg+xml,%3Csvg width='7' height='8' viewBox='0 0 7 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 8L7 0L0.788855 3.10557C0.0518064 3.4741 0.0518053 4.5259 0.788854 4.89443L7 8Z' fill='%23414B55'/%3E%3C/svg%3E");
  position: absolute;
  top: -12px;
  left: calc(50% - 4px);
  transform: rotate(270deg);
  display: none;
}

.uptime-graph li:hover div {
  display: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  display: flex;
  gap: 5px;
  flex-flow: column;
}
.uptime-graph li:first-child:hover div {
  right: auto;
  left: 0
}
.uptime-graph li:last-child:hover div {
  left: auto;
  right: 0
}

.uptime-graph li:hover::before {
  display: inherit;
}

.uptime-graph li:hover div span:first-child {
  color: var(--gray-scale-4)
}
.uptime-graph li:hover div span:last-child {
  color: white;
  text-transform: capitalize;
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 500;
}

.uptime-graph li:hover div span[status] {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

</style>
