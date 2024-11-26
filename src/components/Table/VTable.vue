<script setup>
import { h, useSlots, computed, ref } from "vue";
import VButtonSet from "../VContextMenu.vue";
import VButton from "../VButton.vue";
import VTextInput from "../Form/VTextInput.vue";
import VDropdown from "../Form/VDropdown.vue";
import VRenderColumn from "./VTableRenderColumn.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  tableHeader: {
    type: String,
    default: "",
  },
  showAddBtn: {
    type: Boolean,
    default: true,
  },
  showRowIndex: {
    type: Boolean,
    default: true,
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  isSearchable: {
    type: Boolean,
    default: true,
  },
  searchInColumns: {
    type: Array,
    default: () => [],
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["onPageChanged", "onSearch", "onAdd"]);
const searchText = ref(route?.query.search || "");
const pageSize = props.itemsPerPage || 10;
const slots = useSlots();
const tableSize = [
  { label: "5 Entries", value: 5 },
  { label: "10 Entries", value: 10 },
  { label: "20 Entries", value: 20 },
];

const getColumns = computed(() => {
  return slots.default().filter((obj) => {
    if (obj.props) return true;
    else return false;
  });
});

const getActivePage = computed(() => {
  return Number.parseInt(route.query.page) || 1;
});
const filteredData = computed(() => {
  if (!searchText.value) return props.tableData;

  return props.tableData.filter((row) =>
    props.searchInColumns.some(
      (col) =>
        row[col] &&
        row[col]
          .toString()
          .toLowerCase()
          .includes(searchText.value.toLowerCase())
    )
  );
});

const paginatedData = computed(() => {
  const start = (getActivePage - 1) * pageSize;
  const end = start + pageSize;
  return filteredData.value.slice(start, end);
});
const getTotalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize);
});
function vnode(el, row) {
  return h(VRenderColumn, { ...el.props, row }, el.children);
}
async function changePage(n) {
  if (n >= 1 && n <= getTotalPages)
    await router.push({
      path: route.path,
      query: Object.assign({}, route.query, {
        page: n,
        page_size: pageSize,
      }),
    });
  emit("onPageChanged", n);
}
async function executeSearch(e) {
  changePage(1);
  searchText.value = e;
  await router.push({
    path: route.path,
    query: Object.assign({}, route.query, {
      page: 1,
      search: e,
      page_size: pageSize,
    }),
  });
}
function onAdd() {
  emit("onAdd");
}
</script>

<template>
  <div>
    <header v-if="!hideHeader" class="table-heading">
      <h4>{{ tableHeader }}</h4>
      <div>
        <VTextInput
          v-if="isSearchable"
          name="search"
          placeholder="Search"
          :data="searchText"
          @keyup.enter="executeSearch($event.target.value)"
        />
        <VButton v-if="showAddBtn" type="fill" @on-click="onAdd">
          Add New
        </VButton>
      </div>
    </header>
    <div v-if="isLoading" class="table-loader">
      <i class="bx bx-loader-circle bx-spin bx-rotate-90" />
    </div>
    <template v-else>
      <table>
        <thead>
          <tr>
            <th v-if="showRowIndex" class="index_row">#</th>
            <th v-for="el in getColumns" :key="el.props.header">
              {{ el.props.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredData.length === 0">
            <td colspan="100" class="empty_data">
              <i class="bx bxs-ghost" /> No Data
            </td>
          </tr>
          <tr v-for="(row, index) in paginatedData" :key="row">
            <td v-if="showRowIndex" class="index_row">
              {{ index + 1 + pageSize * (getActivePage - 1) }}
            </td>
            <td
              v-for="el in getColumns"
              :key="`slot-${el.props?.header ?? ''}-${idx}`"
            >
              <template v-if="!el.children">
                {{ row[el.props.value] ?? "" }}
              </template>
              <template v-else-if="el.children">
                <component :is="vnode(el, row)" />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <nav v-if="pagination" class="pagination-holder">
        <div v-if="getTotalPages > 1" class="pagination">
          <VButton
            icon="bx bx-chevron-left"
            class="arrows"
            type="outline"
            @on-click="changePage(getActivePage - 1)"
          />
          <!-- <VButton icon="bx bx-dots-horizontal-rounded" type="outline" v-if="(getActivePage - 1) > 1" /> -->
          <template v-for="n in getTotalPages" :key="n">
            <VButton
              v-if="getActivePage - 2 < n && getActivePage + 2 > n"
              :is-active="getActivePage === n ? true : false"
              type="outline"
              @on-click="changePage(n)"
            >
              {{ n }}
            </VButton>
          </template>
          <!-- <VButton icon="bx bx-dots-horizontal-rounded" type="outline" v-if="(getActivePage + 1) < getTotalPages" /> -->
          <VButton
            icon="bx bx-chevron-right"
            class="arrows"
            type="outline"
            @on-click="changePage(getActivePage + 1)"
          />
        </div>
        <div v-if="getTotalPages > 1" class="page-teleport">
          <span>Go to</span>
          <VTextInput
            v-model:data="getActivePage"
            type="number"
            name="goToPage"
            @keyup.enter="changePage($event.target.value)"
          />
        </div>
        <div
          v-if="paginatedData.length >= tableSize[0].value"
          class="entries-size"
        >
          <span>Show</span>
          <VDropdown
            v-model:data="pageSize"
            :options="tableSize"
            option-label="label"
            option-value="value"
            @on-select="changePage(1)"
          />
        </div>
      </nav>
    </template>
  </div>
</template>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--main-color);
  padding: 15px;
  font-size: 14px;
  position: relative;
  margin-bottom: 10px;
  color: white;
  border: var(--border-style);
  border-radius: 6px;
}

thead {
  background-color: var(--gray-color-9);
}

thead th {
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
  padding: 8px;
  text-align: left;
}

tbody tr {
  background-color: var(--box-bg);
  border-bottom: solid 2px var(--main-bg-color);
}

tbody tr:last-child {
  border-bottom: none;
}

table thead tr th {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

table tbody tr:last-child td {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

tbody td {
  padding: 4.5px 10px;
}

table .index_row {
  padding: 5px 10px;
  text-align: center;
}

table .btn-set-holder div.btn-holder {
  margin-top: 0;
  justify-content: center;
}

table .empty_data {
  text-align: center;
  font-weight: 500;
}

.pagination-holder {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: row;
  gap: 20px;
  margin-top: 32px;
}

.pagination-holder .pagination {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.pagination-holder .pagination .btn-holder button {
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 13px;
}

.pagination-holder .pagination .btn-holder button:hover,
.pagination-holder .pagination .btn-holder[active="true"] button {
  background-color: var(--select-bg);
  color: white;
  border-color: var(--select-bg);
}

.pagination-holder .pagination .btn-holder button i {
  font-size: 20px;
}

.pagination-holder .page-teleport {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-holder .page-teleport .input-holder {
  width: 50px;
}

.pagination-holder .page-teleport .input-holder input {
  padding: 3px 3px;
  width: 48px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.pagination-holder .entries-size {
  margin-left: auto;
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 12px;
}

.pagination-holder .entries-size span,
.pagination-holder .page-teleport span {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.pagination-holder .entries-size .dropdown-holder .dropdown-field {
  min-width: 125px;
}

.pagination-holder .entries-size .dropdown-field .drop-down-btn {
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.table-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bar-chart-bg);
  color: white;
  gap: 10px;
  border-radius: 6px;
  height: 50vh;
  font-size: 20px;
}

.table-heading {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-heading > div {
  display: flex;
  gap: 24px;
}
</style>
