<script>
import VContextMenu from '../VContextMenu.vue';
import VButton from '../VButton.vue';
import VBarChart from './VBarChart.vue';
import VUptimeChart from './VUptimeChart.vue';

export default {
  components: { VContextMenu, VButton, VUptimeChart, VBarChart },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['onEdit', 'onDelete'],
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      widgetData: [],
      isLoading: true,
      interval: null,
    };
  },
  computed: {},
  async mounted() {
    await this.loadData();
    await this.reloadData();
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints/${this.data.id}/widget?unit=${this.data.unit}&duration=${this.data.duration}&type=${this.data.type}&rand=${new Date().getTime()}-${this.data.i}`,
        });

        this.widgetData = response.data.data;
        this.isLoading = false;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }
    },
    async reloadData() {
      this.interval = setInterval(() => {
        (async () => {
          try {
            this.isLoading = true;
            await this.loadData();
          }
          catch (error) {
            console.log('Error occurred while reloading data:', error);
          }
        })();
      }, 60000);
    },
    onEdit() {
      this.$emit('onEdit');
    },
    onDelete() {
      this.$emit('onDelete');
    },
  },
};
</script>

<template>
  <div class="widget-holder">
    <h5>{{ data.name }}</h5>
    <p>Here is the time graph for {{ data.duration }} {{ data.unit }}.</p>

    <div v-if="isLoading" class="loader">
      <i class="bx bx-loader-circle bx-spin bx-rotate-90" />
    </div>
    <div v-else-if="widgetData.length === 0" class="loader">
      <i class="bx bxs-ghost" />No Data
    </div>
    <template v-else>
      <VUptimeChart v-if="data.type === 'Uptime'" :data="widgetData" />
      <VBarChart v-else-if="data.type === 'LineChart'" :data="widgetData" />
    </template>

    <VContextMenu>
      <VButton icon="bx bx-edit-alt" @on-click="onEdit()">
        Edit
      </VButton>
      <VButton icon="bx bxs-trash" @on-click="onDelete()">
        Delete
      </VButton>
    </VContextMenu>
  </div>
</template>

<style>
.widget-holder {
    width: 100%;
    height: 100%;
    color: white;
    display: flex;
    flex-flow: column;
    position: relative;
}

.widget-holder > p {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.01em;
    color: var(--body-text);
}

.widget-holder .loader {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bar-chart-bg);
  color: white;
  gap: 10px;
  border-radius: 6px;
  height: 100%;
  font-size: 20px;
}

.widget-holder .btn-set-holder {
    position: absolute;
    top: 0;
    right: 0;
}

.widget-holder .btn-set-holder > .btn-holder button {
  transform: rotate(90deg);
}
</style>
