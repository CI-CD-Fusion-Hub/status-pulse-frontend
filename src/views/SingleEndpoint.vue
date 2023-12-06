<script>
import { useVuelidate } from '@vuelidate/core';
import VOverview from '../components/SingleEndpoint/VOverview.vue';
import VStatusGraph from '../components/SingleEndpoint/VStatusGraph.vue';
import VUptimeGraph from '../components/SingleEndpoint/VUptimeGraph.vue';
import VAlerts from '../components/SingleEndpoint/VAlerts.vue';

export default {
  components: {
    VOverview,
    VStatusGraph,
    VUptimeGraph,
    VAlerts,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
    };
  },
  methods: {},
};
</script>

<template>
  <VOverview />
  <VUptimeGraph />
  <VStatusGraph />
  <VAlerts />
</template>

<style>

</style>
