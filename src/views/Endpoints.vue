<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import VTextInput from '../components/Form/VTextInput.vue';
import VTextArea from '../components/Form/VTextArea.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VButton from '../components/VButton.vue';
import VTable from '../components/VTable.vue';
import VColumn from '../components/VColumn.vue';
import VModal from '../components/VModal.vue';
import VTag from '../components/VTag.vue';
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
    VTag,
    VModal,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isLoading: false,
      isBtnLoading: false,
      isModalVissible: false,
      interval: null,
      userStore: useUserStore(),
      endpoints: [],
      formData: {},
      typeIcons: {
        http: ['fas', 'globe'],
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
    this.clearInterval(this.interval);
  },
  methods: {
    clearForm() {
      Object.keys(this.formData).forEach(key => (this.formData[key] = undefined));
    },
    showEditModal(data) {
      this.clearForm();
      data.response = toString(data.response);
      Object.assign(this.formData, data);
      this.isModalVissible = true;
    },
    async intervalLoadData() {
      this.interval = setInterval(() => {
        this.loadData();
      }, 3000);
    },
    async loadData() {
      this.isLoading = true;
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints`,
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

        this.formData.response = JSON.parse(this.formData.response);
        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/endpoints`,
          data: this.formData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.message);
      }

      this.isModalVissible = false;
      this.isBtnLoading = false;
      await this.loadData();
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

        this.formData.response = JSON.parse(this.formData.response);
        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/endpoints/${this.formData.id}`,
          data: this.formData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData();
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

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData();
    },
  },
};
</script>

<template>
  <div class="endpoints_holder">
    <VTable :table-data="endpoints" :is-loading="isLoading" :pagination="true" :page-size="15" :is-searchable="true" :search-in-columns="['name', 'url']" :show-row-index="true">
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
          <VTag :type="row.status" :value="row.status ? row.status : 'initializing'" />
        </template>
      </VColumn>
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet v-if="row">
            <VButton
              :icon="['fas', 'eye']" :link-to="{ name: 'SingleEndpoint', params: { endpoint_id: row.id } }"
              tooltip-text="View"
            />
            <VButton :icon="['fas', 'pen-to-square']" tooltip-text="Edit" @on-click="showEditModal(row)" />
            <VButton
              :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
              @on-click="deleteData(row.id)"
            />
          </VButtonSet>
        </template>
      </VColumn>
    </VTable>
    <VButton :icon="['fas', 'plus']" class="flex-end" @on-click="isModalVissible = true">
      Add New
    </VButton>
  </div>
  <VModal v-model:isActive="isModalVissible">
    <VDropdown
      v-model:data="formData.type" name="type" placeholder="Endpoint Type" :icon="['fas', 'flag']"
      :options="['http']"
    />
    <VTextInput v-model:data="formData.name" name="name" placeholder="Name" :icon="['fas', 'fa-user-tag']" />
    <VTextInput v-model:data="formData.description" name="description" placeholder="Description" :icon="['fas', 'fa-user-tag']" />
    <VTextInput v-model:data="formData.url" name="url" placeholder="URL" :icon="['fas', 'fa-user-tag']" />
    <VTextInput v-model:data="formData.threshold" name="threshold" placeholder="Threshold in ms" :icon="['fas', 'fa-user-tag']" />
    <VTextInput v-model:data="formData.cron" name="cron" placeholder="Cron" :icon="['fas', 'fa-user-tag']" />
    <VTextInput v-model:data="formData.status_code" name="status_code" placeholder="Status Code" :icon="['fas', 'fa-user-tag']" />
    <VTextArea v-model:data="formData.response" name="response" placeholder="Response Schema: {'test': '', 'findme': ''}" :icon="['fas', 'file-code']" />
    <VButtonSet class="flex-end">
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VButtonSet>
  </VModal>
</template>

<style>

</style>
