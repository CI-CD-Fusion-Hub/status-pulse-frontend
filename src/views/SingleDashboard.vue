<script>
import { useVuelidate } from '@vuelidate/core';
import { GridItem, GridLayout } from 'grid-layout-plus';
import { useNotifyStore } from '../stores/notifications';
import VLoader from '../components/VLoader.vue';
import VButton from '../components/VButton.vue';
import VModal from '../components/VModal.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VWidget from '../components/Dashboard/VWidget.vue';

export default {
  components: {
    VTextInput,
    VButton,
    VDropdown,
    VModal,
    GridLayout,
    GridItem,
    VLoader,
    VWidget,
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
        this.formData.h = this.formData.type === 'LineChart' ? 2 : 1;

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

        await this.loadData();
        this.closeModal();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.message);
      }

      this.isBtnLoading = false;
    },
    async updateOrder() {
      try {
        await this.axios({
          method: 'put',
          url: `${this.backendUrl}/dashboards/${this.$route.params.dashboard_id}/layout`,
          data: this.data.endpoints,
        });

        this.isEditMode = false;
        this.isLoading = false;
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
      :vertical-compact="true"
      :is-bounded="true"
      :margin="[24, 24]"
      responsive
    >
      <GridItem
        v-for="item in data.endpoints"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resized="updateOrder"
        @moved="updateOrder"
      >
        <VWidget :data="item" @on-edit="showEditModal(item)" @on-delete="deleteData(item.i)" />
      </GridItem>
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
  margin-top: 24px;
  border-radius: 8px;
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

div.vgl-layout {
  width: calc(100% + 48px);
  margin-left: -24px;
  --vgl-placeholder-bg: var(--green-500);
  --vgl-placeholder-opacity: 40%;
  --vgl-item-resizing-opacity: 80%;
}

.vgl-item {
  padding: 20px;
  display: flex;
  background-color: var(--box-bg);
  border-radius: var(--border-radius);
}

.vgl-item__resizer {
  display: none;
}

.vgl-item:hover .vgl-item__resizer {
  display: inherit;
}
</style>
