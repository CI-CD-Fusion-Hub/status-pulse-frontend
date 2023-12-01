<script>
export default {
  components: {},
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      response: '',
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        console.log(this.$route);
        if (this.$route.query.token || false) {
          const response = await this.axios({
            method: 'get',
            url: `${this.backendUrl}/endpoints/share?token=${this.$route.query.token}`,
          });

          this.response = response.data.message;
        }
        else {
          this.response = 'Please, use valid Token.';
        }
      }
      catch (error) {
        console.log('Unable to confirm access to endpoint.');
      }
    },
  },
};
</script>

<template>
  <h1> {{ response }}</h1>
</template>

<style scoped>
h1 {
    display: flex;
    justify-content: center;
    height: 100vh;
    align-items: center;
}
</style>
