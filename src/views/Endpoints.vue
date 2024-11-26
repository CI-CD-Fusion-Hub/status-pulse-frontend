<script setup>
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { useNotifyStore } from "../stores/notifications";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import EmptyState from "../components/VEmptyState.vue";
import VLoader from "../components/VLoader.vue";
import VTable from "../components/Table/VTable.vue";
import VContextMenu from "../components/VContextMenu.vue";
import VButton from "../components/VButton.vue";
import VBadge from "../components/VBadge.vue";
import VModal from "../components/VModal.vue";
import VTextInput from "../components/Form/VTextInput.vue";
import VTextArea from "../components/Form/VTextArea.vue";
import VDropdown from "../components/Form/VDropdown.vue";

const route = useRoute();

const formData = ref({
  name: "",
  url: "",
  threshold: "",
  cron: "",
  status_code: "",
  type: "",
});

const rules = computed(() => ({
  name: {
    required: helpers.withMessage("Name field cannot be empty.", required),
  },
  url: {
    required: helpers.withMessage("URL field cannot be empty.", required),
  },
  threshold: {
    required: helpers.withMessage("Threshold field cannot be empty.", required),
  },
  cron: {
    required: helpers.withMessage("Cron field cannot be empty.", required),
  },
  status_code: {
    required: helpers.withMessage(
      "Status Code field cannot be empty.",
      required
    ),
  },
  type: {
    required: helpers.withMessage("Type field cannot be empty.", required),
  },
}));

const v$ = useVuelidate(rules, formData);

const backendUrl = import.meta.env.VITE_backendUrl;
const endpoints = ref([]);
const isLoading = ref(true);
const isAddModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isTableLoading = ref(true);

onMounted(async () => {
  await loadData();
});

function closeModal() {
  formData.value = {};
  isAddModalVisible.value = false;
  isEditModalVisible.value = false;
}

function showAddModal() {
  isAddModalVisible.value = true;
}

async function loadData() {
  isTableLoading.value = true;

  try {
    const response = await axios({
      method: "get",
      url: `${backendUrl}/endpoints?page=${route.query.page || "1"}&search=${
        route.query.search || ""
      }`,
    });

    endpoints.value = response.data;
    isLoading.value = false;
    isTableLoading.value = false;
  } catch (error) {
    console.log("Unable to get authentication method.");
  }
}

async function addData() {
  try {
    isLoading.value = true;
    isBtnLoading.value = true;
    const isValid = await v$.value.$validate();

    if (isValid === false) {
      v$.value.$errors.forEach((error) => {
        useNotifyStore().add("error", error.$message);
      });
      isBtnLoading.value = false;
      isLoading.value = false;
      return;
    }

    if (typeof formData.value.response === "string")
      formData.value.response = JSON.parse(formData.value.response);

    const response = await axios({
      method: "post",
      url: `${backendUrl}/endpoints`,
      data: formData.value,
    });

    await loadData();
    useNotifyStore().add(response.data.status, response.data.message);
  } catch (error) {
    useNotifyStore().add("error", error.message);
  }

  isAddModalVisible.value = false;
  isBtnLoading.value = false;
}

async function deleteData(id) {
  try {
    isLoading.value = true;

    const response = await axios({
      method: "delete",
      url: `${backendUrl}/endpoints/${id}`,
    });

    await loadData();
    closeModal();
    useNotifyStore().add(response.data.status, response.data.message);
  } catch (error) {
    useNotifyStore().add("error", "Error loading data!");
    isLoading.value = false;
  }
}
</script>

<template>
  <VLoader v-if="isLoading" />
  <template v-else>
    <EmptyState
      v-if="endpoints.data.length === 0"
      heading="No Endpoints"
      @on-click="showAddModal"
    />
    <template v-else>
      <VTable
        :table-data="endpoints.data.data"
        :is-loading="isTableLoading"
        :page-size="3"
        :search-in-columns="['name', 'url']"
        @on-page-changed="loadData"
        @on-search="loadData"
        table-header="Endpoints"
        @on-add="showAddModal"
      >
        <VColumn header="Name" value="name" />
        <VColumn header="Description" value="description" />
        <VColumn header="URL" value="url" />
        <VColumn header="Cron" value="cron" />
        <VColumn header="Status" value="status">
          <template #body="{ row }">
            <VBadge type="outline" :color="row.status">
              {{ row.status }}
            </VBadge>
          </template>
        </VColumn>
        <VColumn header="" value="actions">
          <template #body="{ row }">
            <VContextMenu>
              <VButton
                icon="bx bx-show"
                :link-to="{
                  name: 'SingleEndpoint',
                  params: { endpoint_id: row.id },
                }"
              >
                View
              </VButton>
              <VButton
                icon="bx bxs-share-alt"
                @on-click="shareEndpoint(row.id)"
              >
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
    </template>
    <VModal
      v-model:isActive="isAddModalVisible"
      header="Creat new dashboard"
      button-label="Add dashboard"
      @on-send="addData"
      @on-close="closeModal"
    >
      <VDropdown
        v-model:data="formData.type"
        :is-multiselect="false"
        name="type"
        placeholder="Endpoint Type"
        label="Endpoint Type"
        :options="['http', 'asdasd']"
      />
      <VTextInput
        v-model:data="formData.name"
        name="name"
        placeholder="Enter endpoint name"
        label="Name"
      />
      <VTextArea
        v-model:data="formData.description"
        name="description"
        placeholder="Enter endpoint description"
        label="Description"
      />
      <VTextInput
        v-model:data="formData.url"
        name="url"
        placeholder="URL"
        label="URL"
      />
      <VTextInput
        v-model:data="formData.threshold"
        type="number"
        name="threshold"
        placeholder="Threshold in ms"
        label="Enter threshold in ms"
        description="Threshold time to mark endpoint as unhealthy."
      />
      <VTextInput v-model:data="formData.cron" name="cron" placeholder="Cron" />
      <VTextInput
        v-model:data="formData.status_code"
        type="number"
        name="status_code"
        placeholder="Status Code"
      />
      <VTextArea
        v-model:data="formData.response"
        name="response"
        placeholder="Response Schema: {'test': '', 'findme': ''}"
      />
      <VDropdown
        v-model:data="formData.notifications"
        :is-multiselect="true"
        option-label="name"
        option-value="id"
        name="notifications"
        placeholder="Notifications"
        :options="notifications"
      />
    </VModal>
  </template>
</template>

<style scoped>
header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header > div {
  display: flex;
  gap: 24px;
}
</style>
