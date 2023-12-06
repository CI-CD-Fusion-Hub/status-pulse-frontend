<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import VTextInput from '../components/Form/VTextInput.vue';
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
      notifications: [],
      formData: {
        name: undefined,
        description: undefined,
        type: undefined,
        properties: {
          SMTPHost: undefined,
          SMTPPort: undefined,
          SMTPFrom: undefined,
          SMTPTo: undefined,
          URL: undefined,
          Channel: undefined,
          Username: undefined,
        },
      },
      shareData: {},
      typeIcons: {
        email: ['fas', 'fa-envelope'],
        mattermost: ['fas', 'fa-message'],
      },
    };
  },
  validations() {
    return {
      formData: {
        name: {
          required: helpers.withMessage('Name field cannot be empty.', required),
        },
        type: {
          required: helpers.withMessage('Type field cannot be empty.', required),
        },
        properties: {
          SMTPHost: helpers.withMessage('SMTPHost field cannot be empty.', requiredIf(this.formData.type === 'email')),
          SMTPPort: helpers.withMessage('SMTPPort field cannot be empty.', requiredIf(this.formData.type === 'email')),
          SMTPFrom: helpers.withMessage('SMTPFrom field cannot be empty.', requiredIf(this.formData.type === 'email')),
          SMTPTo: helpers.withMessage('SMTPTo field cannot be empty.', requiredIf(this.formData.type === 'email')),
          URL: helpers.withMessage('URL field cannot be empty.', requiredIf(this.formData.type === 'mattermost')),
          Channel: helpers.withMessage('Channel field cannot be empty.', requiredIf(this.formData.type === 'mattermost')),
          Username: helpers.withMessage('Username field cannot be empty.', requiredIf(this.formData.type === 'mattermost')),
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
    showEditModal(data) {
      Object.assign(this.formData, data);
      this.isAddModalVissible = true;
    },
    showAddModal() {
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
        console.log(this.$route.query.search);
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/notifications`,
        });

        this.notifications = response.data.data;
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

        if (this.formData.response)
          this.formData.response = JSON.parse(this.formData.response);

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/notifications`,
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

        if (this.formData.response)
          this.formData.response = JSON.parse(this.formData.response);

        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/notifications/${this.formData.id}`,
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
          url: `${this.backendUrl}/notifications/${id}`,
        });

        await this.loadData();
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
  <div class="endpoints_holder">
    <VTable :table-data="notifications" :is-loading="isLoading" :pagination="true" :page-size="5" :is-searchable="true" :search-in-columns="['name', 'url']" :show-row-index="true">
      <VColumn header="Type" value="type">
        <template #body="{ row }">
          <span :tooltip-text="row.type" tooltip-position="Top"><font-awesome-icon :icon="typeIcons[row.type]" /></span>
        </template>
      </VColumn>
      <VColumn header="Name" value="name" />
      <VColumn header="Description" value="description" />
      <VColumn header="Properties" value="properties">
        <template #body="{ row }">
          <div v-for="(value, name) in row.properties" :key="name">
            {{ name }}: {{ value }}
          </div>
        </template>
      </VColumn>
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet v-if="row">
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
    <VTextInput v-model:data="formData.name" name="name" placeholder="Name" />
    <VTextInput v-model:data="formData.description" name="discription" placeholder="Discription" />
    <VDropdown
      v-model:data="formData.type" name="type" placeholder="Notification Type" :options="['email', 'mattermost']"
    />
    <VTextInput v-if="formData.type === 'email'" v-model:data="formData.properties.SMTPHost" name="SMTPHost" placeholder="SMTP Host" />
    <VTextInput v-if="formData.type === 'email'" v-model:data="formData.properties.SMTPPort" name="SMTPPort" placeholder="SMTP Port" />
    <VTextInput v-if="formData.type === 'email'" v-model:data="formData.properties.SMTPFrom" name="SMTPFrom" placeholder="SMTP From" />
    <VTextInput v-if="formData.type === 'email'" v-model:data="formData.properties.SMTPTo" name="SMTPTo" placeholder="SMTP To" />
    <VTextInput v-if="formData.type === 'email'" v-model:data="formData.properties.AuthEmail" name="AuthEmail" placeholder="SMTP Auth User" />
    <VTextInput v-if="formData.type === 'email'" v-model:data="formData.properties.AuthPassword" name="AuthPassword" placeholder="SMTP Auth Password" />
    <VTextInput v-if="formData.type === 'mattermost'" v-model:data="formData.properties.URL" name="URL" placeholder="URL" />
    <VTextInput v-if="formData.type === 'mattermost'" v-model:data="formData.properties.Channel" name="Channel" placeholder="Channel" />
    <VTextInput v-if="formData.type === 'mattermost'" v-model:data="formData.properties.Username" name="Username" placeholder="Username" />
    <VButtonSet class="flex-end">
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VButtonSet>
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
