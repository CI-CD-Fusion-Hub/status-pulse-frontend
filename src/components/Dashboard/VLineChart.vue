<script>
import { VueEcharts } from 'vue3-echarts';

export default {
  components: {
    VueEcharts,
  },
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
      option: {
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
          },
        ],
      },
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

        for (const item of this.widgetData) {
          this.option.xAxis.data.push(this.unixTimestampToFormattedString(item.created_at));
          this.option.series[0].data.push(item.response_time);
        }

        this.isLoading = false;
      }
      catch (error) {
        console.log(error);
        console.log('Unable to get authentication method.');
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
    <p>Here is the response time graph for {{ data.duration }} {{ data.unit }}.</p>
    <div class="chart-holder">
      <VueEcharts :option="option" style="height: 100%" />
    </div>
  </div>
</template>

<style>
.line-chart {
    width: 100%;
    height: 100%;
    color: white;
    display: flex;
    flex-flow: column;
}

.line-chart .chart-holder {
    height: 100%;
}
</style>
