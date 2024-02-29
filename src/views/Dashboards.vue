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
    <VEmptyState v-if="data.length === 0" heading="No Dashboards" @on-click="showAddModal" />
    <template v-else>
      <header>
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
            <VButton icon="bx bx-show" :link-to="{ name: 'SingleDashboard', params: { dashboard_id: item.id } }">
              View
            </VButton>
            <VButton icon="bx bx-edit-alt" @on-click="showEditModal(item)">
              Edit
            </VButton>
            <VButton icon="bx bxs-trash" @on-click="deleteData(item.id)">
              Delete
            </VButton>
          </VContextMenu>
          <h5>{{ item.name }}</h5>
          <p>{{ item.description }}</p>
          <div class="connected-endpoints">
            <h6>Connected ( {{ item.endpoints.length }} ) Endpoints</h6>
            <ul>
              <li v-for="endpoint in item.endpoints" :key="endpoint">
                <VBadge type="status" :color="endpoint.status">
                  {{ endpoint.status }}
                </VBadge>
                <span>{{ endpoint.url }}</span>
              </li>
              <li v-if="item.endpoints.length === 0" class="empty-endpoint">
                <i class="bx bxs-ghost" />
                <span>No Endpoints</span>
              </li>
            </ul>
          </div>
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
  </template>
</template>

<style scoped>
header {
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header > div {
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

.dashboard {
    padding: 40px;
    background-color: var(--box-bg);
    border-radius: var(--box-radius);
    box-sizing: border-box;
    grid-template: 1fr;
    display: flex;
    flex-flow: column;
}

.dashboard h5 {
    margin-bottom: 8px;
}

.dashboard p {
    margin-bottom: 36px;
}

.connected-endpoints {
    margin-top: auto;
}

.connected-endpoints ul {
    padding: 14px 16px;
    border-top: solid 1px var(--box-border);
    border-bottom: solid 1px var(--box-border);
    margin-bottom: 32px;
    margin-top: 24px;
}

.connected-endpoints li {
    display: flex;
    align-items: center;
    gap: 40px;
    color: white;
    position: relative;
}

.connected-endpoints li.empty-endpoint {
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0em;
    justify-content: center;
    gap: 8px;
    color: var(--bod)
}

.connected-endpoints li:not(:first-child) {
    display: none;
}

.connected-endpoints li span:last-child{
    text-overflow: ellipsis;
    overflow: hidden;
}

.scope {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.scope i {
    font-size: 20px;
}

.scope i.bxs-lock-alt {
    color: white;
}
</style>
