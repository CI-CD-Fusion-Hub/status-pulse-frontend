<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import EmptyState from "../components/VEmptyState.vue";
import VLoader from "../components/VLoader.vue";
import VTable from "../components/Table/VTable.vue";
import VContextMenu from "../components/VContextMenu.vue";
import VButton from "../components/VButton.vue";
import VBadge from "../components/VBadge.vue";

const backendUrl = import.meta.env.VITE_backendUrl;
const endpoints = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  await loadData();
});
async function loadData() {
  try {
    const response = await axios({
      method: "get",
      url: `${backendUrl}/endpoints`,
    });

    endpoints.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.log("Unable to get authentication method.");
  }
}
</script>

<template>
  <VLoader v-if="isLoading" />
  <template v-else>
    <EmptyState v-if="endpoints.data.length === 0" heading="No Endpoints" />
    <VTable
      :table-data="endpoints.data.data"
      :is-loading="isLoading"
      :pagination="true"
      :page-size="5"
      :total-pages="endpoints.pages"
      :is-searchable="true"
      :search-in-columns="['name', 'url']"
      :show-row-index="true"
      @on-page-changed="loadData"
      @on-search="loadData"
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
      <VContextMenu>
        <VButton icon="bx bx-edit-alt" @on-click="onEdit()"> Edit </VButton>
        <VButton icon="bx bxs-trash" @on-click="onDelete()"> Delete </VButton>
      </VContextMenu>
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <VBadge :color="row.status">
            {{ row.status }}
          </VBadge>
        </template>
      </VColumn>
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet v-if="row">
            <VButton
              v-if="row.status"
              :icon="['fas', 'eye']"
              :link-to="{
                name: 'SingleEndpoint',
                params: { endpoint_id: row.id },
              }"
              tooltip-text="View"
            />
            <VButton
              v-if="row.status"
              :icon="['fas', 'fa-share-nodes']"
              tooltip-text="Share"
              @on-click="shareEndpoint(row.id)"
            />
            <VButton
              :icon="['fas', 'pen-to-square']"
              tooltip-text="Edit"
              @on-click="showEditModal(row)"
            />
            <VButton
              :icon="['fas', 'trash']"
              :is-loading="isBtnLoading"
              tooltip-text="Remove"
              @on-click="deleteData(row.id)"
            />
          </VButtonSet>
        </template>
      </VColumn>
    </VTable>
  </template>
</template>

<style scoped></style>
