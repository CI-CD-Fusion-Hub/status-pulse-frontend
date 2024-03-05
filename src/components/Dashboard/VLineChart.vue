<script>
import ApexCharts from 'apexcharts'

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
      options: {
            chart: {
                type: 'line'
            },
            series: [{
                name: 'sales',
                data: [30,40,35,50,49,60,70,91,125]
            }],
            xaxis: {
                categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
            }
        } 
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
  <div class="line-chart">
    <h5>{{ data.name }}</h5>
    <p>Here is the uptime time graph for {{ data.duration }} {{ data.unit }}.</p>
    <div>
        <i class="bx bx-loader-circle bx-spin bx-rotate-90" />
    </div>
    <div id="chart">
        <apexchart type="area" height="350" :options="options"></apexchart>
    </div>
  </div>
</template>

<style>

</style>
