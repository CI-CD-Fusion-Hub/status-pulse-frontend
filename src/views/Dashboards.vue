<script setup>
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { useNotifyStore } from "../stores/notifications";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import VEmptyState from "../components/VEmptyState.vue";
import VContextMenu from "../components/VContextMenu.vue";
import VButton from "../components/VButton.vue";
import VBadge from "../components/VBadge.vue";
import VLoader from "../components/VLoader.vue";
import VModal from "../components/VModal.vue";
import VTextInput from "../components/Form/VTextInput.vue";
import VTextArea from "../components/Form/VTextArea.vue";
import VDropdownAccess from "../components/Form/VDropdownAccess.vue";

const backendUrl = import.meta.env.VITE_backendUrl;
const formData = ref({ name: "", description: "", scope: "" });
const data = ref([]);
const isLoading = ref(true);
const isBtnLoading = ref(false);
const isAddModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isEndpointsModalVisible = ref(false);
const isShareModalVisible = ref(false);

const rules = computed(() => ({
  name: {
    required: helpers.withMessage("Name field cannot be empty.", required),
  },
  description: {
    required: helpers.withMessage(
      "Description field cannot be empty",
      required
    ),
  },
  scope: {
    required: helpers.withMessage("Access field cannot be empty", required),
  },
}));

const v$ = useVuelidate(rules, formData);

onMounted(async () => {
  await loadData();
});

async function showAddModal() {
  isAddModalVisible.value = true;
}
async function showEditModal(item) {
  isEditModalVisible.value = true;
  formData.value = item;
}
async function showShareModal(item) {
  isShareModalVisible.value = true;

  formData.value = item;
}
async function showEndpointsModal(item) {
  isEndpointsModalVisible.value = true;

  formData.value = item;
}
async function closeModal() {
  formData.value = {};
  isAddModalVisible.value = false;
  isEditModalVisible.value = false;
}
async function loadData() {
  try {
    const response = await axios({
      method: "get",
      url: `${backendUrl}/dashboards`,
    });

    data.value = response.data.data;
    isLoading.value = false;
  } catch (error) {
    console.log("Unable to get authentication method.");
  }
}
async function addData() {
  try {
    isLoading.value = true;
    isBtnLoading.value = true;

    const isValid = await v$.value.$validate();
    if (!isValid) {
      v$.value.$errors.forEach((error) => {
        useNotifyStore().add("error", error.$message);
      });
      isLoading.value = false;
      isBtnLoading.value = false;
      return;
    }

    const response = await axios({
      method: "post",
      url: `${backendUrl}/dashboards`,
      data: formData.value,
    });

    if (response.data.status === "error") {
      useNotifyStore().add(response.data.status, response.data.message);
    } else {
      await loadData();
      closeModal();
      useNotifyStore().add(response.data.status, response.data.message);
    }
  } catch (error) {
    useNotifyStore().add("error", error.message);
  } finally {
    isLoading.value = false;
    isBtnLoading.value = false;
  }
}
async function editData() {
  try {
    isLoading.value = true;
    isBtnLoading.value = true;

    const isValid = await v$.value.$validate();
    if (!isValid) {
      v$.value.$errors.forEach((error) => {
        useNotifyStore().add("error", error.$message);
      });
      isLoading.value = false;
      isBtnLoading.value = false;
      return;
    }

    if (!isValid) {
      v$.$errors.forEach((e) => {
        useNotifyStore().add("error", e.$message);
      });
      isLoading.value = false;
      isBtnLoading.value = false;
      return;
    }

    const response = await axios({
      method: "put",
      url: `${backendUrl}/dashboards/${formData.value.id}`,
      data: formData.value,
    });

    if (response.data.status === "error") {
      useNotifyStore().add(response.data.status, response.data.message);
      isLoading.value = false;
      isBtnLoading.value = false;
      return;
    }

    await loadData();
    closeModal();
    useNotifyStore().add(response.data.status, response.data.message);
  } catch (error) {
    useNotifyStore().add("error", error.message);
  }

  isBtnLoading.value = false;
}
async function deleteData(id) {
  try {
    isLoading.value = true;

    const response = await axios({
      method: "delete",
      url: `${backendUrl}/dashboards/${id}`,
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
    <VEmptyState
      v-if="data.length === 0"
      heading="Create your dashboard"
      text="Start by creating your first dashboard to visualize data, track metrics, and stay organized."
      button-text="Create dashboard"
      @on-click="showAddModal"
    />
    <template v-else>
      <header class="viewHeader">
        <h4>Dashboard</h4>
        <div>
          <VTextInput
            v-model:data="search"
            name="search"
            placeholder="Search..."
          />
          <VButton type="fill" @on-click="showAddModal"> Add New </VButton>
        </div>
      </header>
      <ul class="dashboards-holder">
        <li v-for="item in data" :key="item" class="dashboard">
          <VContextMenu>
            <VButton icon="bx bx-edit-alt" @on-click="showEditModal(item)">
              Edit
            </VButton>
            <VButton icon="bx bx-share" @on-click="showShareModal(item)">
              Share
            </VButton>
            <VButton icon="bx bxs-trash" @on-click="deleteData(item.id)">
              Delete
            </VButton>
          </VContextMenu>
          <h5>{{ item.name }}</h5>
          <p>{{ item.description }}</p>
          <div class="connected-endpoints">
            <div v-if="item.endpoints.length === 0" class="empty">
              <i class="bx bxs-ghost" />No Endpoints connected
            </div>
            <VButton
              v-else
              type="outline"
              full-width="true"
              @on-click="showEndpointsModal(item)"
            >
              Connected ( {{ item.endpoints.length }} ) Endpoints<i
                class="bx bx-chevron-right"
              />
            </VButton>
          </div>
          <VButton
            type="fill"
            full-width="true"
            :link-to="{
              name: 'SingleDashboard',
              params: { dashboard_id: item.id },
            }"
          >
            View Dashboard
          </VButton>
          <div v-if="item.scope === 'Private'" class="scope">
            <i class="bx bxs-lock-alt" />Only people who have access can view
            this dashboard
          </div>
          <div v-else class="scope">
            <i class="bx bx-world" />Anyone on the internet with the link can
            view this dashboard
          </div>
        </li>
      </ul>
    </template>
    <VModal
      v-model:isActive="isAddModalVisible"
      header="Creat new dashboard"
      button-label="Add dashboard"
      @on-send="addData"
      @on-close="closeModal"
    >
      <VTextInput
        v-model:data="formData.name"
        name="name"
        placeholder="Enter dashboard name"
        label="Name"
      />
      <VTextArea
        v-model:data="formData.description"
        name="description"
        placeholder="Enter dashboard description"
        label="Description"
      />
      <VDropdownAccess
        v-model:data="formData.scope"
        name="scope"
        label="Access"
        icon="bx bxs-lock-alt"
      />
    </VModal>
    <VModal
      v-model:isActive="isEditModalVisible"
      header="Edit dashboard"
      button-label="Save"
      type="edit"
      @on-send="editData"
      @on-delete="deleteData(formData.id)"
      @on-close="closeModal"
    >
      <VTextInput
        v-model:data="formData.name"
        name="name"
        placeholder="Enter dashboard name"
        label="Name"
      />
      <VTextArea
        v-model:data="formData.description"
        name="description"
        placeholder="Enter dashboard description"
        label="Description"
      />
      <VDropdownAccess
        v-model:data="formData.scope"
        name="scope"
        label="Access"
        icon="bx bxs-lock-alt"
      />
    </VModal>
    <VModal
      v-model:isActive="isEndpointsModalVisible"
      :is-drawer="false"
      header="Connectedd Endpoints"
      :show-buttons="false"
      @on-close="closeModal"
    >
      <ul class="modalEndpoints">
        <li v-for="item in formData.endpoints" :key="item">
          {{ item.name }}
          <VBadge type="outline" :color="item.status">
            {{ item.status }}
          </VBadge>
        </li>
      </ul>
    </VModal>
    <VModal
      v-model:isActive="isShareModalVisible"
      :is-drawer="false"
      header="Share dashboard"
      button-label="Copy Link"
      button-icon="bx bx-link-alt"
      @on-close="closeModal"
    >
      <VDropdownAccess
        v-model:data="formData.scope"
        name="scope"
        label=""
        icon="bx bxs-lock-alt"
      />
    </VModal>
  </template>
</template>

<style>
.viewHeader {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.viewHeader > div {
  display: flex;
  gap: 24px;
}

.dashboards-holder {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

@media only screen and (min-width: 768px) {
  .dashboards-holder li.dashboard {
    max-width: 100%;
  }
}
@media only screen and (min-width: 1280px) {
  .dashboards-holder li.dashboard {
    max-width: 50%;
  }
}

.dashboards-holder .btn-set-holder {
  position: absolute;
  top: 17px;
  right: 17px;
}

.dashboards-holder .dashboard {
  padding: 32px;
  background-color: var(--box-bg);
  border-radius: var(--box-radius);
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  position: relative;
  gap: 24px;
  flex: 0 0 calc((100% / 3) - 14px);
  max-width: 33%;
}

.dashboards-holder .dashboard h5,
.dashboards-holder .dashboard p {
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
}

.dashboards-holder .dashboard h5 {
  margin-bottom: 8px;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  width: calc(100% - 20px);
}

.dashboards-holder .dashboard p {
  margin-bottom: 36px;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.dashboards-holder .scope {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dashboards-holder .scope i {
  font-size: 20px;
}

.dashboards-holder .connected-endpoints {
  margin-top: auto;
}

.dashboards-holder .connected-endpoints .empty {
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  background-color: #141c24;
  padding: 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
}

.dashboards-holder .connected-endpoints .empty i {
  font-size: 16px;
}

.dashboards-holder .connected-endpoints button {
  padding: 15.28px 16px;
}

.dashboards-holder .connected-endpoints button:hover {
  background-color: var(--gray-scale-6);
  border-color: var(--gray-scale-6);
  color: white;
}

.dashboards-holder .connected-endpoints span {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
}

.dashboards-holder .connected-endpoints span i {
  font-size: 22px;
}

.modal-holder .modalEndpoints li {
  display: flex;
  justify-content: space-between;
  padding: 22px;
  border-top: solid 1px var(--box-border);
}

.modal-holder .modalEndpoints li:last-child {
  border-bottom: solid 1px var(--box-border);
}
</style>
