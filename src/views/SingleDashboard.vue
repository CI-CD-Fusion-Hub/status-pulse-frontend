<template>
  <div id="app">
    <DraggableContainer @item-dropped="reorderItems">
      <VUptimeGraph
        class="drag-div"
        v-for="(item, index) in dashboards"
        :data="item"
        :key="index"
        :draggable="true"
        @dragstart="dragStart(index)"
        @dragover="dragOver"
        @drop="drop(index)"
        @dragend="dragEnd"
      />
    </DraggableContainer>
  </div>
</template>

<script>
import DraggableContainer from '../components/DraggableContainer.vue';
import VUptimeGraph from '../components/VUptimeGraph.vue';

export default {
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isLoading: false,
      itemFrom: null,
      itemTo: null,
      dashboards: [],
    };
  },
  components: {
    DraggableContainer,
    VUptimeGraph
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

        this.dashboards = response.data.data;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }

      this.isLoading = false;
    },
    reorderItems() {
      const movedItem = this.items.splice(this.itemFrom, 1)[0];
      this.items.splice(this.itemTo, 0, movedItem);
    },
    dragStart(index) {
      console.log("FROMT: " + index)
      this.itemFrom = index
    },
    dragOver(event) {
      event.preventDefault();
    },
    drop(index) {
      this.itemTo = index
    },
    dragEnd() {
      this.reorderItems()
    },
  },
};
</script>

<style>

</style>
