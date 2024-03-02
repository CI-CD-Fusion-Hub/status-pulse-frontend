<script>
import { useVuelidate } from '@vuelidate/core';
import EmptyState from '../components/VEmptyState.vue';
import VLoader from '../components/VLoader.vue';
import VTable from '../components/Table/VTable.vue';

// import VTableColumn from '../components/Table/VTableColumn.vue';

export default {
  components: {
    EmptyState,
    VLoader,
    VTable,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      endpoints: [],
      isLoading: true,
    };
  },
  async created() {
    await this.loadData();
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
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
  },
};
</script>

<template>
  <VLoader v-if="isLoading" />
  <template v-else>
    <EmptyState v-if="endpoints.length === 0" heading="No Endpoints" />
    <VTable
      :table-data="endpoints.data" :is-loading="isLoading" :pagination="true" :page-size="5" :total-pages="endpoints.pages"
      :is-searchable="true" :search-in-columns="['name', 'url']" :show-row-index="true" @on-page-changed="loadData" @on-search="loadData"
    >
      <VColumn header="Type" value="type">
        <template #body="{ row }">
          <span :tooltip-text="row.type" tooltip-position="Top" />
        </template>
      </VColumn>
      <VColumn header="Name" value="name" />
      <VColumn header="Description" value="description" />
      <VColumn header="URL" value="url" />
      <VColumn header="Cron" value="cron" />
      <!-- <VColumn header="Status" value="status">
        <template #body="{ row }">
          <span v-if="row.status && !row.status.includes('error')" :tooltip-text="row.status" tooltip-position="Top"><font-awesome-icon :icon="statusIcons[row.status]" /></span>
          <span v-else-if="row.status && row.status.includes('error')" :tooltip-text="row.status" tooltip-position="Top"><font-awesome-icon :icon="statusIcons.degraded" /></span>
          <span v-else tooltip-text="Measuring" tooltip-position="Top"><font-awesome-icon :icon="statusIcons.measuring" /></span>
        </template>
      </VColumn> -->
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
  </template>
</template>

<style scoped>

</style>
