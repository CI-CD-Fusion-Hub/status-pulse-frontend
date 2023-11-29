<script>
import { Bar } from 'vue-chartjs';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useUserStore } from '../../stores/user';

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
  computed: {
    averageResponseTime() {
      const totalResponseTime = this.endpoint.reduce((sum, item) => sum + item.response_time, 0);
      const averageResponseTime = totalResponseTime / this.endpoint.length;
      return Number.parseInt(averageResponseTime);
    },
    uptimePercentage() {
      const upCount = this.endpoint.filter(item => item.status === 'ok').length;
      const total = this.endpoint.length;
      const uptimePercentage = (upCount / total) * 100;
      return Number.parseFloat(uptimePercentage.toFixed(2));
    },
    calculateTotalErrors() {
      const errorCount = this.endpoint.filter(item => item.status !== 'ok').length;
      return errorCount;
    },
    getLastResponseTime() {
      if (this.endpoint.length === 0)
        return 'No data available';

      return this.endpoint[this.endpoint.length - 1].response_time;
    },
  },
  async created() {
    await this.loadData();
  },
  mounted() {
    this.intervalLoadData();
  },
  unmounted() {
    this.clearInterval(this.interval);
  },
  methods: {
    async loadData() {
      this.isBtnLoading = true;
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints/${this.$route.params.endpoint_id}/status`,
        });

        this.endpoint = response.data.data;
        this.prepareChartData();
      }
      catch (error) {
        console.log('Unable to get data.');
      }
      finally {
        this.isBtnLoading = false;
      }
    },
    async intervalLoadData() {
      this.interval = setInterval(() => {
        this.loadData();
      }, 3000);
    },
    prepareChartData() {
      const labels = this.endpoint.map((item) => {
        const date = new Date(item.created_at);

        // Function to add leading zero if necessary
        const pad = num => num < 10 ? `0${num}` : num;

        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        return formattedDate;
      });
      const data = this.endpoint.map(item => item.response_time);
      const backgroundColors = this.endpoint.map(item => item.status === 'ok' ? 'green' : 'red');

      // Replace the entire chartData object to ensure reactivity
      this.chartData = {
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
  <div class="stats">
    <ul>
      <li>
        <h2><font-awesome-icon :icon="['fas', 'gauge-high']" />Avg Response Time</h2>
        <p>{{ averageResponseTime || 0 }}ms</p>
      </li>
      <li>
        <h2><font-awesome-icon :icon="['fas', 'gauge']" />Last Response Time</h2>
        <p>{{ getLastResponseTime || 0 }}ms</p>
      </li>
      <li>
        <h2><font-awesome-icon :icon="['fas', 'signal']" /> Uptime</h2>
        <p>{{ uptimePercentage || 0 }}%</p>
      </li>
      <li>
        <h2><font-awesome-icon :icon="['fas', 'circle-exclamation']" />Total Errors</h2>
        <p>{{ calculateTotalErrors }}</p>
      </li>
    </ul>
  </div>
  <div class="status_graph">
    <h2><font-awesome-icon :icon="['fas', 'chart-column']" /> Response Graph</h2>
    <p>Here the 24 hours response time of this endpoint.</p>
    <div v-if="endpoint.length === 0" class="status_loader">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
    </div>
    <Bar
      v-else
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<style>
.status_graph {
  padding: 20px;
  background-color: white;
  margin-top: 20px;
  border-radius: var(--border-radius);
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
}

.stats ul{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
}

.stats ul li {
  padding: 20px;
  background-color: white;
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
