<script>
import { useVuelidate } from '@vuelidate/core';
import VOverview from '../components/SingleEndpoint/Overview.vue';
import VStatusGraph from '../components/SingleEndpoint/StatusGraph.vue';
import VUptimeGraph from '../components/SingleEndpoint/UptimeGraph.vue';

export default {
  components: {
    VOverview,
    VStatusGraph,
    VUptimeGraph,
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
</template>

<style>

</style>
