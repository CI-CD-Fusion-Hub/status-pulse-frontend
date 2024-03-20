<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useNotifyStore } from '../stores/notifications';
import EmptyState from '../components/VEmptyState.vue';
import VLoader from '../components/VLoader.vue';
import VTable from '../components/Table/VTable.vue';
import VContextMenu from '../components/VContextMenu.vue';
import VButton from '../components/VButton.vue';
import VBadge from '../components/VBadge.vue';
import VModal from '../components/VModal.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VTextArea from '../components/Form/VTextArea.vue';
import VDropdown from '../components/Form/VDropdown.vue';

export default {
  components: {
    EmptyState,
    VLoader,
    VTable,
    VButton,
    VContextMenu,
    VBadge,
    VTextInput,
    VTextArea,
    VDropdown,
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
        url: {
          required: helpers.withMessage('URL field cannot be empty.', required),
        },
        threshold: {
          required: helpers.withMessage('Threshold field cannot be empty.', required),
        },
        cron: {
          required: helpers.withMessage('Cron field cannot be empty.', required),
        },
        status_code: {
          required: helpers.withMessage('Status Code field cannot be empty.', required),
        },
        type: {
          required: helpers.withMessage('Type field cannot be empty.', required),
        },
      },
    };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      endpoints: [],
      isLoading: true,
      isAddModalVissible: false,
      formData: {},
    };
  },
  closeModal() {
    this.formData = {};
    this.isAddModalVissible = false;
    this.isEditModalVissible = false;
  },
  async created() {
    await this.loadData();
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async showAddModal() {
      this.isAddModalVissible = true;
    },
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints`,
        });

        this.endpoints = response.data;
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

        if (isValid === false) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isBtnLoading = false;
          this.isLoading = false;
          return;
        }

        if (typeof this.formData.response === 'string')
          this.formData.response = JSON.parse(this.formData.response);

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/endpoints`,
          data: this.formData,
        });

        await this.loadData();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.message);
      }

      this.isAddModalVissible = false;
      this.isBtnLoading = false;
    },
  },
};
</script>

<template>
  <VLoader v-if="isLoading" />
  <template v-else>
    <EmptyState v-if="endpoints.data.data.length === 0" heading="No Endpoints" />
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
      <VTable
        :table-data="endpoints.data.data" :is-loading="isLoading" :pagination="true" :page-size="5" :total-pages="endpoints.pages"
        :is-searchable="true" :search-in-columns="['name', 'url']" :show-row-index="true" @on-page-changed="loadData" @on-search="loadData"
      >
        <!-- <VColumn header="Type" value="type">
          <template #body="{ row }">
            <span :tooltip-text="row.type" tooltip-position="Top" />
          </template>
        </VColumn> -->
        <VColumn header="Name" value="name" />
        <VColumn header="Description" value="description" />
        <VColumn header="URL" value="url" />
        <VColumn header="Cron" value="cron" />
        <VColumn header="Status" value="status">
          <template #body="{ row }">
            <VBadge type="status" :color="row.status">
              {{ row.status }}
            </VBadge>
          </template>
        </VColumn>
        <VColumn header="Actions" value="actions">
          <template #body="{ row }">
            <VContextMenu>
              <VButton icon="bx bx-show" :link-to="{ name: 'SingleEndpoint', params: { endpoint_id: row.id } }">
                View
              </VButton>
              <VButton icon="bx bxs-share-alt" @on-click="shareEndpoint(row.id)">
                Share
              </VButton>
              <VButton icon="bx bx-edit-alt" @on-click="showEditModal(row)">
                Edit
              </VButton>
              <VButton icon="bx bxs-trash" @on-click="deleteData(row.id)">
                Delete
              </VButton>
            </VContextMenu>
          </template>
        </VColumn>
      </VTable>
      <VModal v-model:isActive="isAddModalVissible" header="Creat new dashboard" button-label="Add dashboard" @on-send="addData" @on-close="closeModal">
        <VDropdown
          v-model:data="formData.type" name="type" placeholder="Endpoint Type" :options="['http']"
        />
        <VTextInput v-model:data="formData.name" name="name" placeholder="Name" />
        <VTextInput v-model:data="formData.description" name="description" placeholder="Description" />
        <VTextInput v-model:data="formData.url" name="url" placeholder="URL" />
        <VTextInput v-model:data="formData.threshold" type="number" name="threshold" placeholder="Threshold in ms" />
        <VTextInput v-model:data="formData.cron" name="cron" placeholder="Cron" />
        <VTextInput v-model:data="formData.status_code" type="number" name="status_code" placeholder="Status Code" />
        <VTextArea v-model:data="formData.response" name="response" placeholder="Response Schema: {'test': '', 'findme': ''}" />
        <VDropdown
          v-model:data="formData.notifications" :is-multyselect="true" option-label="name" option-value="id" name="notifications" placeholder="Notifications"
          :options="notifications"
        />
      </VModal>
    </template>
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
</style>
