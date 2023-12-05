<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import VTextInput from '../components/Form/VTextInput.vue';
import VTextArea from '../components/Form/VTextArea.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VButton from '../components/VButton.vue';
import VTable from '../components/VTableNew.vue';
import VColumn from '../components/VColumn.vue';
import VModal from '../components/VModal.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {
    VTextArea,
    VTextInput,
    VDropdown,
    VButton,
    VButtonSet,
    VColumn,
    VTable,
    VModal,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isLoading: true,
      isBtnLoading: false,
      isAddModalVissible: false,
      isEditModalVissible: false,
      isShareModalVissible: false,
      interval: null,
      userStore: useUserStore(),
      endpoints: [],
      notifications: [],
      formData: {},
      shareData: {},
      typeIcons: {
        email: ['fas', 'at'],
        mattermost: ['fas', 'slack'],
        slack: ['fas', 'slack'],
        rocketchat: ['fas', 'rocketchat'],
      },
      shareLink: undefined,
      shareId: undefined,
      statusIcons: {
        measuring: ['fas', 'fa-heart-pulse'],
        healthy: ['fas', 'fa-heart'],
        unhealthy: ['fas', 'fa-heart-circle-exclamation'],
        degraded: ['fas', 'fa-heart-crack'],
      },
    };
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
  async created() {
    this.loadData();
  },
  mounted() {
    this.intervalLoadData();
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    clearForm() {
      Object.keys(this.formData).forEach(key => (this.formData[key] = undefined));
    },
    showEditModal(data) {
      console.log(Object.keys(data.response).length);
      if (Object.keys(data.response).length > 0)
        data.response = JSON.parse(data.response);

      this.getNotifications();
      Object.assign(this.formData, data);
      this.isEditModalVissible = true;
    },
    showAddModal() {
      this.clearForm();
      this.getNotifications();
      this.isAddModalVissible = true;
    },
    async intervalLoadData() {
      this.interval = setInterval(() => {
        this.loadData();
      }, 30000);
    },
    async loadData() {
      this.isLoading = true;
      
      try {
        console.log(this.$route.query.search)
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints?page=${this.$route.query.page || '1'}&search=${this.$route.query.search || ''}`,
        });

        this.endpoints = response.data.data;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }

      this.isLoading = false;
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

        if (typeof this.formData.response === "string")
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
      this.clearForm();
    },
    async updateData() {
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

        if (typeof this.formData.response === "string")
          this.formData.response = JSON.parse(this.formData.response);

        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/endpoints/${this.formData.id}`,
          data: this.formData,
        });

        await this.loadData();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        console.log(error);
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isEditModalVissible = false;
      this.isBtnLoading = false;
    },
    async deleteData(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/endpoints/${id}`,
        });

        await this.loadData();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
        this.isLoading = false;
      }
    },
    shareEndpoint(id) {
      this.shareId = id;
      this.isShareModalVissible = true;
    },
    async createShareLink() {
      try {
        this.isBtnLoading = true;
        this.shareData.expiration = new Date(this.shareData.expiration).getTime() / 1000;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/endpoints/${this.shareId}/share`,
          data: this.shareData,
        });

        this.shareLink = `${document.location.origin}/share?token=${response.data.data}`;
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.data.message || error);
      }

      this.shareData.permissions = '';
      this.isBtnLoading = false;
    },
    copyShareLink() {
      if (this.shareLink !== '') {
        navigator.clipboard.writeText(this.shareLink)
          .then(() => {
            useNotifyStore().add('success', 'Successfully copied share link.');
          })
          .catch((err) => {
            useNotifyStore().add('error', err);
          });

        this.shareData = {};
        this.shareLink = undefined;
        this.isShareModalVissible = false;
      }
    },
    async getNotifications() {
      
      try {
        console.log(this.$route.query.search)
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/notifications`,
        });

        this.notifications = response.data.data;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }
    },
  },
};
</script>

<template>
  <div class="endpoints_holder">
    <VTable :table-data="endpoints.data" :is-loading="isLoading" :pagination="true" :page-size="5" :total_pages="endpoints.pages" 
    :is-searchable="true" :search-in-columns="['name', 'url']" :show-row-index="true" @on-page-changed="loadData" @on-search="loadData">
      <VColumn header="Type" value="type">
        <template #body="{ row }">
          <span :tooltip-text="row.type" tooltip-position="Top"><font-awesome-icon :icon="typeIcons[row.type]" /></span>
        </template>
      </VColumn>
      <VColumn header="Name" value="name" />
      <VColumn header="Description" value="description" />
      <VColumn header="URL" value="url" />
      <VColumn header="Cron" value="cron" />
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <span v-if="row.status && !row.status.includes('error')" :tooltip-text="row.status" tooltip-position="Top"><font-awesome-icon :icon="statusIcons[row.status]" /></span>
          <span v-else-if="row.status && row.status.includes('error')" :tooltip-text="row.status" tooltip-position="Top"><font-awesome-icon :icon="statusIcons.degraded" /></span>
          <span v-else tooltip-text="Measuring" tooltip-position="Top"><font-awesome-icon :icon="statusIcons.measuring" /></span>
        </template>
      </VColumn>
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet v-if="row">
            <VButton
              v-if="row.status"
              :icon="['fas', 'eye']" :link-to="{ name: 'SingleEndpoint', params: { endpoint_id: row.id } }"
              tooltip-text="View"
            />
            <VButton v-if="row.status" :icon="['fas', 'fa-share-nodes']" tooltip-text="Share" @on-click="shareEndpoint(row.id)" />
            <VButton :icon="['fas', 'pen-to-square']" tooltip-text="Edit" @on-click="showEditModal(row)" />
            <VButton
              :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
              @on-click="deleteData(row.id)"
            />
          </VButtonSet>
        </template>
      </VColumn>
    </VTable>
    <VButton :icon="['fas', 'plus']" class="flex-end" @on-click="showAddModal">
      Add New
    </VButton>
  </div>
  <VModal v-model:isActive="isAddModalVissible">
    <VDropdown
      v-model:data="formData.type" name="type" placeholder="Endpoint Type" :options="['http']"
    />
    <VTextInput v-model:data="formData.name" name="name" placeholder="Name"/>
    <VTextInput v-model:data="formData.description" name="description" placeholder="Description"/>
    <VTextInput v-model:data="formData.url" name="url" placeholder="URL" />
    <VTextInput v-model:data="formData.threshold" type="number" name="threshold" placeholder="Threshold in ms" />
    <VTextInput v-model:data="formData.cron" name="cron" placeholder="Cron" />
    <VTextInput v-model:data="formData.status_code" type="number" name="status_code" placeholder="Status Code" />
    <VTextArea v-model:data="formData.response" name="response" placeholder="Response Schema: {'test': '', 'findme': ''}" />
    <VDropdown
      v-model:data="formData.notifications" :is-multyselect="true" option-label="name" option-value="id" name="notifications" placeholder="Notifications"
      :options="notifications"
    />
    <VButtonSet class="flex-end">
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VButtonSet>
  </VModal>
  <VModal v-model:isActive="isEditModalVissible">
    <VDropdown
      v-model:data="formData.type" name="type" placeholder="Endpoint Type"
      :options="['http']"
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
    <VButtonSet class="flex-end">
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="updateData">
        Save
      </VButton>
    </VButtonSet>
  </VModal>
  <VModal v-model:isActive="isShareModalVissible">
    <VDropdown
      v-model:data="shareData.permissions" name="permissions" placeholder="Permissions"
      :options="['Read', 'Update']"
    />
    <VTextInput v-model:data="shareData.expiration" type="datetime-local" name="expiration" placeholder="Expiration Date" />
    <div v-if="shareLink" class="shareLinkHolder">
      <VButton :icon="['fas', 'fa-copy']" @on-click="copyShareLink" />
      <p>{{ shareLink }}</p>
    </div>
    <div v-else-if="isBtnLoading" class="link_loader">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
    </div>
    <VButton :icon="['fas', 'fa-share-nodes']" :is-loading="isBtnLoading" @on-click="createShareLink">
      Create
    </VButton>
  </VModal>
</template>

<style>
main > div {
  margin: 20px;
}
.fa-heart {
  color: rgb(32, 194, 32);
  font-size: 20px;
}

.fa-heart-pulse {
  animation: fade 1s infinite;
  opacity: 1;
  color: #eeeb30;
  font-size: 20px;
}

.fa-heart-crack {
  color: red;
  font-size: 20px;
}

.shareLinkHolder,
.link_loader {
  color: white;
  display: flex;
  background-color: var(--main-color-hover);
  padding: 10px;
  border-radius: var(--border-radius);
  gap: 10px;
  margin-bottom: 10px;
}

.shareLinkHolder {
  justify-content: space-between;
}

.link_loader {
  height: 126px;
  justify-content: center;
  align-items: center;
}

.shareLinkHolder p {
  word-break: break-word;
}

@keyframes fade {
  0%,100% { opacity: 0 }
  50% { opacity: 1 }
}
</style>
