<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const chartOptions = {
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
};

const loadChartData = computed(() => {
  const chartData = props.data.map((item) => {
    return { x: new Date(item.created_at), y: Math.random() * 100 }; // Replace Math.random() * 100 with your actual y-values
  });
  const backgroundColors = props.data?.map((item) =>
    item.status === "healthy" ? "#22C55E" : "#EF4444"
  );
  return {
    datasets: [
      {
        label: "Response Time (ms)",
        backgroundColor: backgroundColors,
        data: chartData,
      },
    ],
  };
});
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
