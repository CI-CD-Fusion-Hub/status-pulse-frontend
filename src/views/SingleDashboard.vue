<script>
import DraggableContainer from '../components/DraggableContainer.vue';
import VUptimeGraph from '../components/VUptimeGraph.vue';
import VButton from '../components/VButton.vue';
import VModal from '../components/VModal.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VBarChart from '../components/VBarChart.vue';

export default {
  components: {
    DraggableContainer,
    VUptimeGraph,
    VButton,
    VModal,
    VDropdown,
    VTextInput,
    VBarChart,
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isLoading: false,
      isBtnLoading: false,
      isAddModalVissible: false,
      itemFrom: null,
      itemTo: null,
      dashboards: {},
      endpoints: [],
      formData: {},
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async showAddModal() {
      this.isAddModalVissible = true;
      await this.getEndpoints();
    },
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
    async addData() {
      try {
        this.isBtnLoading = true;

        await this.axios({
          method: 'post',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}/endpoints`,
          data: this.formData,
        });
        this.formData = {};
      }
      catch (error) {
        console.log('Unable to update dashboard.');
      }

      this.isBtnLoading = false;
      this.isAddModalVissible = false;
    },
    async updateOrder() {
      try {
        await this.axios({
          method: 'put',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}/endpoints`,
          data: this.dashboards.endpoints,
        });
      }
      catch (error) {
        console.log('Unable to update dashboard.');
      }
    },
    async getEndpoints() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints`,
        });

        this.endpoints = response.data.data.data;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }

      this.isLoading = false;
    },
    reorderItems() {
      const movedItem = this.dashboards.endpoints.splice(this.itemFrom, 1)[0];
      this.dashboards.endpoints.splice(this.itemTo, 0, movedItem);
    },
    dragStart(index) {
      this.itemFrom = index;
    },
    dragOver(event) {
      event.preventDefault();
    },
    drop(index) {
      this.itemTo = index;
    },
    async dragEnd() {
      if (this.itemFrom !== this.itemTo) {
        this.reorderItems();
        await this.updateOrder();
      }
    },
  },
};
</script>

<template>
  <div v-if="Object.keys(dashboards).length === 0" class="loader">
    <font-awesome-icon :icon="['fas', 'spinner']" spin />
  </div>
  <DraggableContainer v-else @item-dropped="reorderItems">
    <h1>
      <span>Testing Drag and drop on Endpoints</span><VButton :icon="['fas', 'plus']" @on-click="showAddModal">
        Add
      </VButton>
    </h1>
    <template v-for="(item, index) in dashboards.endpoints" :key="index">
      <VUptimeGraph
        v-if="item.type === 'Uptime'"
        class="drag-div"
        :data="item"
        :draggable="true"
        @dragstart="dragStart(index)"
        @dragover="dragOver"
        @drop="drop(index)"
        @dragend="dragEnd"
      />
      <VBarChart
        v-if="item.type === 'BarChart'"
        class="drag-div"
        :data="item"
        :draggable="true"
        @dragstart="dragStart(index)"
        @dragover="dragOver"
        @drop="drop(index)"
        @dragend="dragEnd"
      />
    </template>

    <div v-if="dashboards.endpoints.length === 0" class="loader">
      <font-awesome-icon :icon="['fas', 'ghost']" /> No Data
    </div>
  </DraggableContainer>
  <VModal v-model:isActive="isAddModalVissible">
    <VDropdown
      v-model:data="formData.type" name="scope" placeholder="Scope" :options="['Uptime', 'BarChart']"
    />
    <VDropdown
      v-model:data="formData.endpoints" name="type" placeholder="Endpoints" :options="endpoints" option-label="name" option-value="id" :is-multyselect="true"
    />
    <VDropdown
      v-model:data="formData.unit" name="unit" placeholder="Interval" :options="['Hours', 'Days']"
    />
    <VTextInput v-if="formData.unit" v-model:data="formData.duration" type="number" name="duration" :placeholder="`Duration in ${formData.unit}`" tooltip-pos="left" />
    <VButtonSet class="flex-end">
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VButtonSet>
  </VModal>
</template>

<style scoped>
h1 {
  color: red;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.loader {
  border: var(--border-style);
  position: relative;
  min-height: 50vh;
  justify-content: center;
  gap: 10px;
  width: auto;
}
</style>
