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
      const chartData = this.data.map((item) => {
        return { x: new Date(item.created_at), y: Math.random() * 100 }; // Replace Math.random() * 100 with your actual y-values
      });
      const backgroundColors = this.data?.map(item => item.status === 'healthy' ? '#22C55E' : '#EF4444');
      console.log(chartData);
      return {
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
