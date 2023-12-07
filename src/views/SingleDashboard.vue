<script>
import DraggableContainer from '../components/DraggableContainer.vue';
import VUptimeGraph from '../components/VUptimeGraph.vue';

export default {
  components: {
    DraggableContainer,
    VUptimeGraph,
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isLoading: false,
      itemFrom: null,
      itemTo: null,
      dashboards: [],
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;

      try {
        console.log(`${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}`);
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}`,
        });

        this.dashboards = response.data.data.endpoints;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }

      this.isLoading = false;
    },
    reorderItems() {
      const movedItem = this.dashboards.splice(this.itemFrom, 1)[0];
      this.dashboards.splice(this.itemTo, 0, movedItem);
    },
    dragStart(index) {
      console.log(`FROMT: ${index}`);
      this.itemFrom = index;
    },
    dragOver(event) {
      event.preventDefault();
    },
    drop(index) {
      console.log(`TO: ${index}`);
      this.itemTo = index;
    },
    dragEnd() {
      this.reorderItems();
    },
  },
};
</script>

<template>
  <DraggableContainer @item-dropped="reorderItems">
    <VUptimeGraph
      v-for="(item, index) in dashboards"
      :key="index"
      class="drag-div"
      :data="item"
      :draggable="true"
      @dragstart="dragStart(index)"
      @dragover="dragOver"
      @drop="drop(index)"
      @dragend="dragEnd"
    />
  </DraggableContainer>
</template>

<style>

</style>
