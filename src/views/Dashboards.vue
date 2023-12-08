<script>
import { useVuelidate } from '@vuelidate/core';
import VTextInput from '../components/Form/VTextInput.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VButton from '../components/VButton.vue';
import VModal from '../components/VModal.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {
    VTextInput,
    VDropdown,
    VButton,
    VButtonSet,
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
      dashboards: [],
      endpoints: [],
      formData: {
        id: undefined,
        name: undefined,
        description: undefined,
        endpoints: undefined,
      },
      shareData: {},
      typeIcons: {
        email: ['fas', 'fa-envelope'],
        mattermost: ['fas', 'fa-message'],
      },
      statusIcons: {
        measuring: ['fas', 'fa-heart-pulse'],
        healthy: ['fas', 'fa-heart'],
        unhealthy: ['fas', 'fa-heart-circle-exclamation'],
        degraded: ['fas', 'fa-heart-crack'],
      },
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
    async showEditModal(data) {
      Object.assign(this.formData, data);
      this.isEditModalVissible = true;
      await this.getEndpoints();
    },
    async loadData() {
      this.isLoading = true;

      try {
        console.log(this.$route.query.search);
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/dashboards`,
        });

        this.dashboards = response.data.data;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }

      this.isLoading = false;
    },
    async updateData() {
      this.isLoading = true;
      this.isBtnLoading = true;

      try {
        console.log(this.$route.query.search);
        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/dashboards/${this.formData.id}`,
          data: this.formData,
        });

        this.dashboards = response.data.data;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }

      this.isAddModalVissible = false;
      this.isBtnLoading = false;
    },
    async addData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/dashboards`,
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
    async deleteData(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/dashboards/${id}`,
        });

        await this.loadData();
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
        this.isLoading = false;
      }
    }
  },
};
</script>

<template>
  <div class="dashboards_holder">
    <div class="search_holder">
      <VTextInput :data="[]" name="search" placeholder="Search..." />
      <VButton :icon="['fas', 'fa-plus']" @on-click="showAddModal">
        Add
      </VButton>
    </div>
    <ul v-if="dashboards?.length > 0" class="dashboard_cards">
      <li v-for="item in dashboards" :key="item" :class="`card ${item}`">
        <header>
          <h2 :tooltip-text="item.scope" tooltip-position="top">
            <font-awesome-icon v-if="item.scope === 'Private'" :icon="['fas', 'fa-lock']" />
            <font-awesome-icon v-else :icon="['fas', 'fa-people-group']" />
            <span>{{ item.name }}</span>
          </h2>
          <VButtonSet>
            <VButton :icon="['fas', 'fa-eye']" tooltip-text="View" :link-to="{ name: 'SingleDashboard', params: { dashboard_id: item.id } }" />
            <VButton :icon="['fas', 'fa-edit']" tooltip-text="Edit" @on-click="showEditModal(item)" />
            <VButton :icon="['fas', 'fa-trash']" tooltip-text="Delete" @on-click="deleteData(item.id)" />
          </VButtonSet>
        </header>
        <p>{{ item.description }}</p>
        <ul class="endpoints">
          <li v-for="endpoint in item.endpoints" :key="endpoint">
            <font-awesome-icon :icon="statusIcons[endpoint.status]" :tooltip-text="endpoint.status" /><a href="#" :title="endpoint.url">{{ endpoint.url }}</a>
          </li>
        </ul>
      </li>
    </ul>
    <div v-else class="loader">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
    </div>
  </div>
  <VModal v-model:isActive="isAddModalVissible">
    <VDropdown
      v-model:data="formData.scope" name="scope" placeholder="Scope" :options="['Public', 'Private']"
    />
    <VTextInput v-model:data="formData.name" name="name" placeholder="Name" />
    <VTextInput v-model:data="formData.description" name="description" placeholder="Description" />
    <VButtonSet class="flex-end">
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VButtonSet>
  </VModal>
  <VModal v-model:isActive="isEditModalVissible">
    <VDropdown
      v-model:data="formData.scope" name="scope" placeholder="Scope" :options="['Public', 'Private']"
    />
    <VTextInput v-model:data="formData.name" name="name" placeholder="Name" />
    <VTextInput v-model:data="formData.description" name="description" placeholder="Description" />
    <VButtonSet class="flex-end">
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="updateData">
        Save
      </VButton>
    </VButtonSet>
  </VModal>
</template>

<style>
.dashboards_holder .search_holder {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboards_holder .search_holder .input-holder {
  margin-bottom: 0;
}

.dashboard_cards {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.dashboard_cards .card {
  padding: 20px;
  border: var(--border-style);
  border-radius: var(--border-radius);
  background-color: var(--main-color);
  color: rgba(235, 235, 235, 0.75);
  display: flex;
  flex-flow: column;
  gap: 10px;
  position: relative;
}

.dashboard_cards .card.error {
  border-left: dashed 2px red;
}

.dashboard_cards .card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard_cards .card header h2 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.dashboard_cards .card header .btn-set-holder {
  border: var(--border-style);
  border-radius: var(--border-radius);
}

.dashboard_cards .card header .btn-holder button {
  background-color: transparent;
  color: gray
}
.dashboard_cards .card header .btn-holder:hover button {
  background-color: var(--second-color);
  color: white;
}

.dashboard_cards .card p {
  font-size: 14px;
  margin-bottom: 10px;
}

.dashboard_cards .card .endpoints {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.dashboard_cards .card .endpoints li {
  display: flex;
  gap: 7px;
  align-items: center;
}

.dashboard_cards .card .endpoints a {
  color: var(--second-color);
  text-decoration-line: underline;
}

.dashboard_cards .card:hover .btn-set-holder {
  opacity: 1;
  top: 0;
}

.dashboards_holder .loader {
  position: relative;
  margin-top: 20px;
  height: 50vh;
  border: var(--border-style);
  width: auto;
}
</style>
