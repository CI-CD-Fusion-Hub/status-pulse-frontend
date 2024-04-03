<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useNotifyStore } from '../stores/notifications';
import VEmptyState from '../components/VEmptyState.vue';
import VContextMenu from '../components/VContextMenu.vue';
import VButton from '../components/VButton.vue';
import VBadge from '../components/VBadge.vue';
import VLoader from '../components/VLoader.vue';
import VModal from '../components/VModal.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VTextArea from '../components/Form/VTextArea.vue';
import VDropdownAccess from '../components/Form/VDropdownAccess.vue';

export default {
  components: {
    VEmptyState,
    VButton,
    VContextMenu,
    VBadge,
    VTextInput,
    VTextArea,
    VDropdownAccess,
    VLoader,
    VModal,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      formData: {
        name: {
          required: helpers.withMessage('Name field cannot be empty.', required),
        },
        description: {
          required: helpers.withMessage('Description field cannot be empty', required),
        },
        scope: {
          required: helpers.withMessage('Access field cannot be empty', required),
        },
      },
    };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      data: [],
      search: '',
      formData: {},
      isLoading: true,
      isAddModalVissible: false,
      isEditModalVissible: false,
      isEndpointsModalVissible: false,
      isShareModalVissible: false,
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async showAddModal() {
      this.isAddModalVissible = true;
    },
    async showEditModal(item) {
      this.isEditModalVissible = true;

      this.formData = item;
    },
    async showShareModal(item) {
      this.isShareModalVissible = true;

      this.formData = item;
    },
    async showEndpointsModal(item) {
      this.isEndpointsModalVissible = true;

      this.formData = item;
    },
    async closeModal() {
      this.formData = {};
      this.isAddModalVissible = false;
      this.isEditModalVissible = false;
    },
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/dashboards`,
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
        this.isBtnLoading = true;

        const isValid = await this.v$.$validate();

        if (!isValid) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isLoading = false;
          this.isBtnLoading = false;
          return;
        }

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/dashboards`,
          data: this.formData,
        });

        if (response.data.status === 'error') {
          useNotifyStore().add(response.data.status, response.data.message);
          this.isLoading = false;
          this.isBtnLoading = false;
          return;
        }

        await this.loadData();
        this.closeModal();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.message);
      }

      this.isBtnLoading = false;
    },
    async editData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const isValid = await this.v$.$validate();

        if (!isValid) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isLoading = false;
          this.isBtnLoading = false;
          return;
        }

        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/dashboards/${this.formData.id}`,
          data: this.formData,
        });

        if (response.data.status === 'error') {
          useNotifyStore().add(response.data.status, response.data.message);
          this.isLoading = false;
          this.isBtnLoading = false;
          return;
        }

        await this.loadData();
        this.closeModal();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.message);
      }

      this.isBtnLoading = false;
    },
    async deleteData(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/dashboards/${id}`,
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
  <template v-else>
    <VEmptyState v-if="data.length === 0" heading="Create your dashboard" text="Start by creating your first dashboard to visualize data, track metrics, and stay organized." button-text="Create dashboard" @on-click="showAddModal" />
    <template v-else>
      <header class="viewHeader">
        <h4>Dashboard</h4>
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
      <ul class="dashboards-holder">
        <li v-for="item in data" :key="item" class="dashboard">
          <VContextMenu>
            <VButton icon="bx bx-edit-alt" @on-click="showEditModal(item)">
              Edit
            </VButton>
            <VButton icon="bx bx-share" @on-click="showShareModal(item)">
              Share
            </VButton>
            <VButton icon="bx bxs-trash" @on-click="deleteData(item.id)">
              Delete
            </VButton>
          </VContextMenu>
          <h5>{{ item.name }}</h5>
          <p>{{ item.description }}</p>
          <div class="connected-endpoints">
            <div v-if="item.endpoints.length === 0" class="empty">
              <i class="bx bxs-ghost" />No Endpoints connected
            </div>
            <VButton v-else type="outline" full-width="true" @on-click="showEndpointsModal(item)">
              Connected ( {{ item.endpoints.length }} ) Endpoints<i class="bx bx-chevron-right" />
            </VButton>
          </div>
          <VButton type="fill" full-width="true" :link-to="{ name: 'SingleDashboard', params: { dashboard_id: item.id } }">
            View Dashboard
          </VButton>
          <div v-if="item.scope === 'Private'" class="scope">
            <i class="bx bxs-lock-alt" />Only people who have access can view this dashboard
          </div>
          <div v-else class="scope">
            <i class="bx bx-globe" />Anyone on the internet with the link can view this dashboard
          </div>
        </li>
      </ul>
    </template>
    <VModal v-model:isActive="isAddModalVissible" header="Creat new dashboard" button-label="Add dashboard" @on-send="addData" @on-close="closeModal">
      <VTextInput v-model:data="formData.name" name="name" placeholder="Enter dashboard name" label="Name" />
      <VTextArea v-model:data="formData.description" name="description" placeholder="Enter dashboard description" label="Description" />
      <VDropdownAccess
        v-model:data="formData.scope" name="scope" label="Access" icon="bx bxs-lock-alt"
      />
    </VModal>
    <VModal v-model:isActive="isEditModalVissible" header="Edit dashboard" button-label="Save" type="edit" @on-send="editData" @on-delete="deleteData(formData.id)" @on-close="closeModal">
      <VTextInput v-model:data="formData.name" name="name" placeholder="Enter dashboard name" label="Name" />
      <VTextArea v-model:data="formData.description" name="description" placeholder="Enter dashboard description" label="Description" />
      <VDropdownAccess
        v-model:data="formData.scope" name="scope" label="Access" icon="bx bxs-lock-alt"
      />
    </VModal>
    <VModal v-model:isActive="isEndpointsModalVissible" :is-drawer="false" header="Connectedd Endpoints" :show-buttons="false" @on-close="closeModal">
      <ul class="modalEndpoints">
        <li v-for="item in formData.endpoints" :key="item">
          {{ item.name }} <VBadge type="outline" :color="item.status">
            {{ item.status }}
          </VBadge>
        </li>
      </ul>
    </VModal>
    <VModal v-model:isActive="isShareModalVissible" :is-drawer="false" header="Share dashboard" button-label="Copy Link" button-icon="bx bx-link-alt" @on-close="closeModal">
      <VDropdownAccess
        v-model:data="formData.scope" name="scope" label="" icon="bx bxs-lock-alt"
      />
    </VModal>
  </template>
</template>

<style>
.viewHeader {
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.viewHeader > div {
  display: flex;
  gap: 24px;
}

.dashboards-holder {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90%, 1fr));
  gap: 20px;
}

@media only screen and (min-width: 768px) {
    .dashboards-holder {
        grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
    }
}
@media only screen and (min-width: 1280px) {
    .dashboards-holder {
        grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
    }
}

.dashboards-holder .btn-set-holder {
  position: absolute;
  top: 17px;
  right: 17px;
}

.dashboards-holder .dashboard {
    padding: 40px;
    background-color: var(--box-bg);
    border-radius: var(--box-radius);
    box-sizing: border-box;
    grid-template: 1fr;
    display: flex;
    flex-flow: column;
    position: relative;
    gap: 24px;
}

.dashboards-holder .dashboard:only-child {
  max-width: 33.3%;
}

.dashboards-holder .dashboard h5 {
  margin-bottom: 8px;
}

.dashboards-holder .dashboard p {
  margin-bottom: 36px;
}

.dashboards-holder .scope {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dashboards-holder .scope i {
  font-size: 20px;
}

.dashboards-holder .connected-endpoints {
  margin-top: auto;
}

.dashboards-holder .connected-endpoints .empty{
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  background-color: #141C24;
  padding: 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
}

.dashboards-holder .connected-endpoints .empty i {
  font-size: 16px;
}

.dashboards-holder .connected-endpoints button {
  padding: 15.28px 16px;
}

.dashboards-holder .connected-endpoints button:hover {
  background-color: var(--gray-scale-6);
  border-color: var(--gray-scale-6);
  color: white;
}

.dashboards-holder .connected-endpoints span {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
}

.dashboards-holder .connected-endpoints span i {
  font-size: 22px;
}

.modal-holder .modalEndpoints li{
  display: flex;
  justify-content: space-between;
  padding: 22px;
  border-top: solid 1px var(--box-border)
}

.modal-holder .modalEndpoints li:last-child {
  border-bottom: solid 1px var(--box-border)
}
</style>
