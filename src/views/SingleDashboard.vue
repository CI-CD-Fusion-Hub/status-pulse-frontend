<script>
import { useVuelidate } from '@vuelidate/core';
import { GridLayout } from 'grid-layout-plus';
import { useNotifyStore } from '../stores/notifications';
import VLoader from '../components/VLoader.vue';
import VButton from '../components/VButton.vue';
import VModal from '../components/VModal.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VUptimeChart from '../components/Dashboard/VUptimeChart.vue';
import VLineChart from '../components/Dashboard/VLineChart.vue';
import VContextMenu from '../components/VContextMenu.vue';

export default {
  components: {
    VTextInput,
    VButton,
    VContextMenu,
    VDropdown,
    VModal,
    GridLayout,
    VLoader,
    VUptimeChart,
    VLineChart,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      data: { endpoints: [] },
      endpoints: [],
      formData: {},
      isLoading: true,
      isAddModalVissible: false,
      isEditModalVissible: false,
      isEditMode: false,
      gridColums: 12,
      gridMinHeight: 200,
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async showAddModal() {
      this.isAddModalVissible = true;
      await this.getEndpoints();
    },
    async showEditModal(item) {
      this.isEditModalVissible = true;
      this.formData = item;
      console.log(item);
    },
    async closeModal() {
      this.formData = {};
      this.isAddModalVissible = false;
      this.isEditModalVissible = false;
    },
    getWidgetPos() {
      const posX = this.data?.endpoints?.length > 0 ? (this.data.endpoints.length * 2) % (this.gridColums) : 0;
      const posY = this.data?.endpoints?.length > 0 ? this.data.endpoints.length + (this.gridColums) : 0;
      const posI = this.data?.endpoints?.length > 0 ? this.data.endpoints.length : 0;

      const position = {
        x: posX,
        y: posY,
        w: this.gridColums,
        h: 1,
        i: posI,
      };

      return position;
    },
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}`,
        });

        this.data = response.data.data;
        this.isLoading = false;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }
    },
    async addData() {
      try {
        this.isLoading = true;

        this.formData.endpoints = [this.formData.endpoints];
        this.formData = {
          ...this.formData,
          ...this.getWidgetPos(),
        };

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}/widgets`,
          data: this.formData,
        });

        await this.loadData();
        this.closeModal();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.message);
      }

      this.isBtnLoading = false;
    },
    async updateData() {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}/widgets`,
          data: this.formData,
        });

        this.closeModal();
        await this.loadData();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.message);
      }

      this.isBtnLoading = false;
    },
    async updateOrder() {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}/layout`,
          data: this.data.endpoints,
        });

        this.isEditMode = false;
        this.isLoading = false;
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.message);
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
    async deleteData(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}/widgets/${id}`,
        });

        await this.loadData();
        this.closeModal();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <VLoader v-if="isLoading" />
  <header class="add-widget-header">
    <h4>{{ data.name }}</h4>
    <div>
      <VTextInput
        v-model:data="search"
        name="search"
        placeholder="Search..."
      />
      <VButton type="fill" @on-click="showAddModal">
        Add New
      </VButton>
      <VButton v-if="isEditMode === false" type="fill" @on-click="isEditMode = !isEditMode">
        Edit
      </VButton>
      <VButton v-else type="fill" @on-click="updateOrder()">
        Save
      </VButton>
    </div>
  </header>
  <div v-if="data.endpoints.length === 0" class="add-widget-container">
    <VButton icon="bx bx-plus" @on-click="showAddModal" />
    <h3>Add your widget</h3>
    <p>Click to display data here</p>
  </div>
  <template v-else>
    <GridLayout
      v-model:layout="data.endpoints"
      :col-num="gridColums"
      :row-height="gridMinHeight"
      :is-draggable="isEditMode"
      :is-resizable="isEditMode"
      :vertical-compact="true"
      :is-bounded="true"
      responsive
    >
      <template #item="{ item }">
        <VContextMenu>
          <VButton icon="bx bx-edit-alt" @on-click="showEditModal(item)">
            Edit
          </VButton>
          <VButton icon="bx bxs-trash" @on-click="deleteData(item.i)">
            Delete
          </VButton>
        </VContextMenu>
        <VUptimeChart v-if="item.type === 'Uptime'" :data="item" />
        <VLineChart v-else-if="item.type === 'LineChart'" :data="item" />
      </template>
    </GridLayout>
  </template>
  <VModal v-model:isActive="isAddModalVissible" header="Add Widget" button-label="Add Widget" @on-send="addData" @on-close="closeModal">
    <VDropdown v-model:data="formData.type" name="Type" placeholder="Select Type" :options="['Uptime', 'LineChart']" />
    <VDropdown v-model:data="formData.endpoints" name="Endpoint" placeholder="Select Endpoint" :options="endpoints" option-label="name" option-value="id" />
    <VDropdown v-model:data="formData.unit" name="unit" placeholder="Interval" :options="['Hours', 'Days']" />
    <VTextInput v-if="formData.unit" v-model:data="formData.duration" type="number" name="duration" :placeholder="`Duration in ${formData.unit}`" tooltip-pos="left" />
  </VModal>
  <VModal v-model:isActive="isEditModalVissible" type="edit" header="Edit Widget" button-label="Save" @on-send="updateData" @on-close="closeModal" @on-delete="deleteData(formData.i)">
    <VDropdown v-model:data="formData.unit" name="unit" placeholder="Interval" :options="['Hours', 'Days']" />
    <VTextInput v-if="formData.unit" v-model:data="formData.duration" type="number" name="duration" :placeholder="`Duration in ${formData.unit}`" tooltip-pos="left" />
  </VModal>
</template>

<style>
.add-widget-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
}

.add-widget-header > div {
    display: flex;
    gap: 24px;
}

.add-widget-container {
    height: 384px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    background-color: var(--box-bg);
}

.add-widget-container h3 {
    color: var(--gray-scale-3);
    margin: 24px 0 16px 0;
}

.add-widget-container .btn-holder button {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--gray-color-9);
    font-size: 24px;
    color: white;
    border-radius: 50%;
    overflow: hidden;
}

.add-widget-container .btn-holder button i {
    font-size: 24px;
}

.vgl-item {
  padding: 20px;
  display: flex;
  background-color: var(--box-bg);
  border-radius: var(--border-radius);
}

.vgl-item .btn-set-holder {
  position: absolute;
  top: 20px;
  right: 20px;
}

.vgl-item .btn-set-holder > .btn-holder button {
  transform: rotate(90deg);
}
</style>
