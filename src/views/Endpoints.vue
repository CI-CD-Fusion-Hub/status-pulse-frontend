<script>
import { useVuelidate } from '@vuelidate/core';
import EmptyState from '../components/VEmptyState.vue';
import VLoader from '../components/VLoader.vue';

export default {
  components: {
    EmptyState,
    VLoader,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      data: [],
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
          url: `${this.backendUrl}/endpoints`,
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
  <VLoader v-if="isLoading" />
  <EmptyState v-else heading="No Endpoints" />
</template>

<style scoped>

</style>
