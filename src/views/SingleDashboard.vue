<script>
import { useVuelidate } from '@vuelidate/core';

export default {
  components: {},
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      data: [],
      search: '',
      isLoading: true,
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/dashboards`,
        });

        this.data = response.data.data;
        this.isLoading = false;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }
    },
  },
};
</script>

<template>
  <div>{{ $route.params.dashboard_id }}</div>
</template>

<style scoped>
</style>
