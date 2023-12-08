<script>
import { Bar } from 'vue-chartjs';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useUserStore } from '../stores/user';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'BarChart',
  components: {
    Bar,
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isBtnLoading: false,
      interval: null,
      endpoint: [],
      userStore: useUserStore(),
      chartData: {
        labels: [],
        type: 'line',
        datasets: [
          {
            label: 'Response Time',
            backgroundColor: 'green',
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    prepareChartData() {
      const labels = this.data.logs.map((item) => {
        return this.unixTimestampToFormattedString(item.created_at);
      });

      const data = this.data.logs.map(item => item.response_time);
      const backgroundColors = this.data.logs.map(item => item.status === 'healthy' ? 'green' : 'red');

      // Replace the entire chartData object to ensure reactivity
      return this.chartData = {
        labels,
        datasets: [
          {
            label: 'Response Time (ms)',
            backgroundColor: backgroundColors,
            data,
          },
        ],
      };
    },
  },
};
</script>

<template>
  <div class="status_graph">
    <h2><font-awesome-icon :icon="['fas', 'chart-column']" /> {{ data.name }}</h2>
    <p>Here is the response time graph for {{ data.duration }} {{ data.unit }}.</p>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="prepareChartData"
    />
  </div>
</template>

<style>
.status_graph {
  padding: 20px;
  background-color: var(--main-color);
  margin-top: 20px;
  font-family: var(--main-font);
  border-radius: var(--border-radius);
  color: white;
}

.status_graph h2 {
  margin-bottom: 5px;
}
.uptime_graph p {
  font-size: 14px;
  margin-bottom: 10px;
}

.status_graph .status_loader {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main-color);
  color: white;
  border-radius: var(--border-radius);
}

.stats {
  margin-top: 20px;
  color: white;
  font-family: var(--main-font);
}

.stats ul{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
}

.stats ul li {
  padding: 20px;
  background-color: var(--main-color);
  border-radius: var(--border-radius);
  text-align: center;
}

.stats ul li h2 {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.stats ul li p {
  font-size: 25px;
}
</style>
