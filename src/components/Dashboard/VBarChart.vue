<script>
import { Bar } from 'vue-chartjs';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'BarChart',
  components: {
    Bar,
  },
  extends: Bar,
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isBtnLoading: false,
      interval: null,
      endpoint: [],
      chartOptions: {
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  computed: {
    loadChartData() {
      const labels = this.data?.map((item) => {
        return this.unixTimestampToFormattedString(item.created_at);
      });

      const chartData = this.data?.map(item => item.response_time);
      const backgroundColors = this.data?.map(item => item.status === 'healthy' ? '#22C55E' : '#EF4444');
      console.log(chartData);
      return {
        labels,
        datasets: [
          {
            label: 'Response Time (ms)',
            backgroundColor: backgroundColors,
            data: chartData,
          },
        ],
      };
    },
  },
};
</script>

<template>
  <div class="bar-chart">
    <Bar :data="loadChartData" :options="chartOptions" />
  </div>
</template>

<style>
.bar-chart {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
}
</style>
