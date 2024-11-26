<script setup>
import { GridItem, GridLayout } from "grid-layout-plus";
import { useNotifyStore } from "../stores/notifications";
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import VLoader from "../components/VLoader.vue";
import VButton from "../components/VButton.vue";
import VModal from "../components/VModal.vue";
import VTextInput from "../components/Form/VTextInput.vue";
import VDropdown from "../components/Form/VDropdown.vue";
import VToggle from "../components/Form/VToggle.vue";
import VWidget from "../components/Dashboard/VWidget.vue";

const router = useRouter();
const route = useRoute();

const formData = ref({});
const backendUrl = import.meta.env.VITE_backendUrl;
const data = ref({ endpoints: [] });
const endpoints = ref([]);
const hourUnits = [
  { label: "8h", value: 8 },
  { label: "16h", value: 16 },
  { label: "24h", value: 24 },
  { label: "32h", value: 32 },
  { label: "48h", value: 48 },
  { label: "72h", value: 72 },
];
const dayUnits = [
  { label: "1 Week", value: 7 },
  { label: "2 Weeks", value: 14 },
  { label: "3 Weeks", value: 21 },
  { label: "1 Month", value: 31 },
];
const isLoading = ref(true);
const isAddModalVisible = ref(false);
const isEditModalVisible = ref(false);
const gridColums = 12;
const gridMinHeight = 200;

onMounted(async () => {
  await loadData();
});

async function showAddModal() {
  isAddModalVisible.value = true;
  await getEndpoints();
}
async function showEditModal(item) {
  isEditModalVisible.value = true;
  formData.value = item;
}
async function closeModal() {
  formData.value = {};
  isAddModalVisible.value = false;
  isEditModalVisible.value = false;
}
function getWidgetPos() {
  const posX =
    data?.value.endpoints?.length > 0
      ? (data.value.endpoints.length * 2) % (gridColums || 12)
      : 0;
  const posY =
    data?.value.endpoints?.length > 0
      ? data.value.endpoints.length + (gridColums || 12)
      : 0;
  const posI =
    data?.value.endpoints?.length > 0 ? data.value.endpoints.length + 1 : 0;

  const position = {
    x: posX,
    y: posY,
    w: gridColums,
    h: 2,
    i: posI,
  };

  return position;
}

async function loadData() {
  try {
    const response = await axios({
      method: "get",
      url: `${backendUrl}/dashboards/${route.params.dashboard_id}`,
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

    formData.value.endpoints = [formData.value.endpoints];
    formData.value = {
      ...formData.value,
      ...getWidgetPos(),
    };
    formData.value.h = formData.value.type === "LineChart" ? 2 : 2;

    const response = await axios({
      method: "post",
      url: `${backendUrl}/dashboards/${route.params.dashboard_id}/widgets`,
      data: formData.value,
    });

    await loadData();
    closeModal();
    useNotifyStore().add(response.data.status, response.data.message);
  } catch (error) {
    useNotifyStore().add("error", error.message);
  }

  isBtnLoading.value = false;
}
async function updateData() {
  try {
    isLoading.value = true;

    const response = await axios({
      method: "put",
      url: `${backendUrl}/dashboards/${route.params.dashboard_id}/widgets`,
      data: formData.value,
    });

    await loadData();
    closeModal();
    useNotifyStore().add(response.data.status, response.data.message);
  } catch (error) {
    useNotifyStore().add("error", error.message);
  }

  isBtnLoading.value = false;
}
async function updateOrder() {
  try {
    await axios({
      method: "put",
      url: `${backendUrl}/dashboards/${route.params.dashboard_id}/layout`,
      data: data.value.endpoints,
    });

    isEditMode.value = false;
    isLoading.value = false;
  } catch (error) {
    useNotifyStore().add("error", error.message);
  }
}
async function getEndpoints() {
  try {
    const response = await axios({
      method: "get",
      url: `${backendUrl}/endpoints`,
    });

    endpoints.value = response.data.data.data;
  } catch (error) {
    console.log("Unable to get authentication method.");
  }

  isLoading.value = false;
}
async function deleteData(id) {
  try {
    isLoading.value = true;

    const response = await axios({
      method: "delete",
      url: `${backendUrl}/dashboards/${route.params.dashboard_id}/widgets/${id}`,
    });

    await loadData();
    closeModal();
    useNotifyStore().add(response.data.status, response.data.message);
  } catch (error) {
    useNotifyStore().add("error", "Error loading data!");
    isLoading.value = false;
  }
}

// findAvailablePosition(existingItems, newItem) {
//   const gridWidth = 12; // Assuming a grid layout with a total width of 12 columns
//   const grid = Array.from({ length: existingItems.length }, () => Array(gridWidth).fill(false));

//   // Mark existing positions as occupied
//   existingItems.forEach((item) => {
//     for (let x = item.x; x < item.x + item.w; x++) {
//       for (let y = item.y; y < item.y + item.h; y++)
//         grid[y][x] = true;
//     }
//   });

//   // Find available positions on the grid
//   const availablePositions = [];
//   grid.forEach((row, y) => {
//     row.forEach((isOccupied, x) => {
//       if (!isOccupied)
//         availablePositions.push({ x, y });
//     });
//   });

//   // Choose a position for the new item (you can implement your own logic here)
//   // For example, prioritize positions closest to the top-left corner
//   const chosenPosition = availablePositions[0] || { x: 0, y: 0 };
//   return chosenPosition;
// },
</script>

<template>
  <VLoader v-if="isLoading" />
  <header class="add-widget-header">
    <h4>{{ data.name }}</h4>
    <div>
      <VTextInput v-model:data="search" name="search" placeholder="Search..." />
      <VButton type="fill" @on-click="showAddModal"> Add New </VButton>
    </div>
  </header>
  <div v-if="data.endpoints.length === 0" class="add-widget-container">
    <VButton icon="bx bx-plus" @on-click="showAddModal" />
    <h3>Add your widget</h3>
    <p>Click to display data here</p>
  </div>
  <template v-else>
    <GridLayout
      v-model:layout="data.endpoints"
      :col-num="gridColums"
      :row-height="gridMinHeight"
      :vertical-compact="true"
      :is-bounded="true"
      :margin="[24, 24]"
      responsive
    >
      <GridItem
        v-for="item in data.endpoints"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resized="updateOrder"
        @moved="updateOrder"
      >
        <VWidget
          :data="item"
          @on-edit="showEditModal(item)"
          @on-delete="deleteData(item.i)"
        />
      </GridItem>
    </GridLayout>
  </template>
  <VModal
    v-model:isActive="isAddModalVisible"
    header="Add Widget"
    button-label="Add Widget"
    @on-send="addData"
    @on-close="closeModal"
  >
    <VDropdown
      v-model:data="formData.endpoints"
      label="Endpoints"
      name="Endpoint"
      placeholder="Select Endpoint"
      :options="endpoints"
      option-label="name"
      option-value="id"
      description="Select endpoint which you want connect to dashboard"
    />
    <template v-if="formData.endpoints">
      <VToggle
        v-model:data="formData.type"
        type="icon"
        label="Widget type"
        :options="[
          { icon: 'bx bx-bar-chart-alt', label: 'Uptime bar', value: 'Uptime' },
          { icon: 'bx bx-line-chart', label: 'Line Chart', value: 'LineChart' },
        ]"
        option-label="label"
        option-value="value"
        option-icon="icon"
      />
      <VToggle
        v-model:data="formData.unit"
        type="checked"
        label="Interval"
        :options="['Days', 'Hours']"
      />
      <VToggle
        v-if="formData.unit === 'Hours'"
        v-model:data="formData.duration"
        type="normal"
        :options="hourUnits"
        option-label="label"
        option-value="value"
      />
      <VToggle
        v-else-if="formData.unit === 'Days'"
        v-model:data="formData.duration"
        type="normal"
        :options="dayUnits"
        option-label="label"
        option-value="value"
      />
    </template>
  </VModal>
  <VModal
    v-model:isActive="isEditModalVisible"
    type="edit"
    header="Edit Widget"
    button-label="Save"
    :is-loading="false"
    @on-send="updateData"
    @on-close="closeModal"
    @on-delete="deleteData(formData.i)"
  >
    <VToggle
      v-model:data="formData.unit"
      type="checked"
      label="Interval"
      :options="['Days', 'Hours']"
    />
    <VToggle
      v-if="formData.unit === 'Hours'"
      v-model:data="formData.duration"
      type="normal"
      :options="hourUnits"
      option-label="label"
      option-value="value"
    />
    <VToggle
      v-else-if="formData.unit === 'Days'"
      v-model:data="formData.duration"
      type="normal"
      :options="dayUnits"
      option-label="label"
      option-value="value"
    />
  </VModal>
</template>

<style>
.add-widget-header {
  display: flex;
  justify-content: space-between;
}

.add-widget-header > div {
  display: flex;
  gap: 24px;
}

.add-widget-container {
  height: 384px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background-color: var(--box-bg);
  margin-top: 24px;
  border-radius: 8px;
}

.add-widget-container h3 {
  color: var(--gray-scale-3);
  margin: 24px 0 16px 0;
}

.add-widget-container .btn-holder button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gray-color-9);
  font-size: 24px;
  color: white;
  border-radius: 50%;
  overflow: hidden;
}

.add-widget-container .btn-holder button i {
  font-size: 24px;
}

div.vgl-layout {
  width: calc(100% + 48px);
  margin-left: -24px;
  --vgl-placeholder-bg: var(--gray-scale-6);
  --vgl-placeholder-opacity: 40%;
  --vgl-item-resizing-opacity: 80%;
}

.vgl-item--dragging {
  border: solid 1px var(--body-text);
}

.vgl-item {
  padding: 20px;
  display: flex;
  background-color: var(--box-bg);
  border-radius: var(--border-radius);
}

.vgl-item__resizer {
  display: none;
}

.vgl-item:hover .vgl-item__resizer {
  display: inherit;
}
</style>
