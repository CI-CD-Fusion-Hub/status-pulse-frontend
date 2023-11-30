<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import VButtonSet from '../../components/VButtonSet.vue';
import VButton from '../../components/VButton.vue';
import VTag from '../../components/VTag.vue';
import { useUserStore } from '../../stores/user';
import { useNotifyStore } from '../../stores/notifications';

export default {
  components: {
    VButton,
    VButtonSet,
    VTag,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isBtnLoading: false,
      isModalVissible: false,
      interval: null,
      formData: {},
      userStore: useUserStore(),
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
    async loadData() {
      this.isLoading = true;
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints/${this.$route.params.endpoint_id}`,
        });

        this.formData = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    async intervalLoadData() {
      this.interval = setInterval(() => {
        this.loadData();
      }, 3000);
    },
    clearForm() {
      Object.keys(this.formData).forEach(key => (this.formData[key] = undefined));
    },
    showEditModal() {
      this.clearForm();
      this.formData.response = toString(this.formData.response);
      Object.assign(this.formData, this.formData);
      this.isModalVissible = true;
    },
    async updateData() {
      try {
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
      this.isModalVissible = false;
      this.isBtnLoading = false;
    },
  },
};
</script>

<template>
  <div class="endpoint_overview">
    <header>
      <div>
        <h1><font-awesome-icon :icon="['fas', 'circle-info']" /> Monitor Details</h1>
        <p>Here's more details for this monitor.</p>
      </div>
      <VButtonSet>
        <VButton :icon="['fas', 'pen-to-square']" tooltip-text="Edit" @on-click="showEditModal" />
        <VButton
          :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
          @on-click="deleteData(row.id)"
        />
      </VButtonSet>
    </header>
    <ul>
      <li>
        <h3>Monitor Name</h3>
        <div>{{ formData.name }}</div>
      </li>
      <li>
        <h3>Monitor Type</h3>
        <div><VTag type="Admin" :value="formData.type" /></div>
      </li>
      <li>
        <h3>Monitor Description</h3>
        <div>{{ formData.description }}</div>
      </li>
      <li>
        <h3>Monitor URL</h3>
        <div>{{ formData.url }}</div>
      </li>
      <li>
        <h3>Monitor Threshold</h3>
        <div>{{ formData.threshold }}</div>
      </li>
      <li>
        <h3>Monitor Cron</h3>
        <div>{{ formData.cron }}</div>
      </li>
      <li>
        <h3>Monitor Status Code</h3>
        <div>{{ formData.status_code }}</div>
      </li>
      <li>
        <h3>Monitor Current Status</h3>
        <div><VTag :type="formData.status" :value="formData.status" /></div>
      </li>
    </ul>
  </div>
  <!-- <VModal v-model:isActive="isModalVissible">
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
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="updateData">
        Save
      </VButton>
    </VButtonSet>
  </VModal> -->
</template>

<style>
.endpoint_overview {
  background-color: white;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
}

.endpoint_overview header,
.endpoint_overview ul {
  padding: 20px;
}

.endpoint_overview header {
  border-bottom: solid 1px var(--main-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.endpoint_overview ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.endpoint_overview ul li {
  grid-template-columns: repeat(2, 1fr);
}

.endpoint_overview ul li div {
  font-size: 14px;
  margin-top: 3px;
}
</style>
