<script>
import { useVuelidate } from '@vuelidate/core';
import { GridItem, GridLayout } from 'grid-layout-plus';
import { useNotifyStore } from '../stores/notifications';
import VLoader from '../components/VLoader.vue';
import VButton from '../components/VButton.vue';
import VModal from '../components/VModal.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VToggle from '../components/Form/VToggle.vue';
import VCheckBox from '../components/Form/VCheckBox.vue';
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
    VToggle,
    VCheckBox,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      data: { endpoints: [] },
      endpoints: [],
      hourUnits: [{label: '8h', value: 8},{label: '16h', value: 16},{label: '24h', value: 24},{label: '32h', value: 32},{label: '48h', value: 48},{label: '72h', value: 72}],
      dayUnits: [{label: '1 Week', value: 7},{label: '2 Weeks', value: 14},{label: '3 Weeks', value: 21},{label: '1 Month', value: 31}],
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
    <VDropdown v-model:data="formData.endpoints" label="Endpoints" name="Endpoint" placeholder="Select Endpoint" :options="endpoints" option-label="name" option-value="id" description="Select endpoint which you want connect to dashboard" />
    <template v-if="formData.endpoints">
      <VToggle v-model:data="formData.type" type="icon" label="Widget type" :options="[{icon: 'bx bx-bar-chart-alt', label: 'Uptime bar', value: 'Uptime'},{icon: 'bx bx-line-chart', label: 'Line Chart',value: 'LineChart'}]" option-label="label" option-value="value" optionIcon="icon" />
      <VToggle v-model:data="formData.unit" type="checked" label="Interval" :options="['Days', 'Hours']" />
      <VToggle v-if="formData.unit === 'Hours'" v-model:data="formData.duration" type="normal" :options="hourUnits" option-label="label" option-value="value" />
      <VToggle v-else-if="formData.unit === 'Days'" v-model:data="formData.duration" type="normal" :options="dayUnits" option-label="label" option-value="value" />
    </template>
  </VModal>
  <VModal v-model:isActive="isEditModalVissible" type="edit" header="Edit Widget" button-label="Save" :is-loading="false" @on-send="updateData" @on-close="closeModal" @on-delete="deleteData(formData.i)">
    <VToggle v-model:data="formData.unit" type="checked" label="Interval" :options="['Days', 'Hours']" />
    <VToggle v-if="formData.unit === 'Hours'" v-model:data="formData.duration" type="normal" :options="hourUnits" option-label="label" option-value="value" />
    <VToggle v-else-if="formData.unit === 'Days'" v-model:data="formData.duration" type="normal" :options="dayUnits" option-label="label" option-value="value" />
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
  --vgl-placeholder-bg: var(--gray-scale-6);
  --vgl-placeholder-opacity: 40%;
  --vgl-item-resizing-opacity: 80%;
}

.vgl-item--dragging {
  border: solid 1px var(--body-text);
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
