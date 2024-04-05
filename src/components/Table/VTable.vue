<script>
import { h, useSlots } from 'vue';
import VButtonSet from '../VContextMenu.vue';
import VButton from '../VButton.vue';
import VTextInput from '../Form/VTextInput.vue';
import VDropdown from '../Form/VDropdown.vue';
import VRenderColumn from './VTableRenderColumn.vue';

export default {
  components: { VButton, VButtonSet, VTextInput, VRenderColumn, VDropdown },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    showRowIndex: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    isSearchable: {
      type: Boolean,
      default: false,
    },
    searchInColumns: {
      type: Array,
      default: () => [],
    },
    totalPages: {
      type: Number,
      default: 1,
    },
  },
  emits: ['onPageChanged', 'onSearch'],
  data() {
    return {
      search_text: this.$route?.query.search || '',
      slots: useSlots(),
      pageSize: 10,
    };
  },
  computed: {
    getColumns() {
      return this.slots.default().filter((obj) => {
        if (obj.props)
          return true;

        else
          return false;
      });
    },
    getActivePage() {
      return Number.parseInt(this.$route.query.page) || 1;
    },
  },
  methods: {
    vnode(el, row) {
      return h(VRenderColumn, { ...el.props, row }, el.children);
    },
    async changePage(n) {
      console.log(n);
      if (n >= 1 && n <= this.totalPages)
        await this.$router.push({ path: this.$route.path, query: Object.assign({}, this.$route.query, { page: n }) });
      this.$emit('onPageChanged', n);
    },
    async filterResults(e) {
      await this.$router.push({ path: this.$route.path, query: this.pagination ? { search: e, page: 1 } : { search: e } });

      this.search_text = e.toLowerCase();
      this.$emit('onSearch', this.search_text);
    },
  },
};
</script>

<template>
  <div>
    <div v-if="isSearchable" class="table_search">
      <!-- <VTextInput
        name="table_search" placeholder="Search" :icon="['fas', 'magnifying-glass']" :data="search_text"
        @keyup.enter="filterResults($event.target.value)"
      /> -->
    </div>
    <table>
      <div v-if="isLoading" class="loader">
        <i class="bx bx-loader-alt bx-spin" />
      </div>
      <thead>
        <tr>
          <th v-if="showRowIndex" class="index_row">
            #
          </th>
          <th v-for="el in getColumns" :key="el.props.header">
            {{ el.props.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="tableData.length === 0">
          <td colspan="100" class="empty_data">
            <i class="bx bxs-ghost" /> No Data
          </td>
        </tr>
        <tr v-for="(row, index) in tableData" :key="row">
          <td v-if="showRowIndex" class="index_row">
            {{ (index + 1) + pageSize * (getActivePage - 1) }}
          </td>
          <td v-for="el in getColumns" :key="`slot-${el.props?.header ?? ''}-${idx}`">
            <template v-if="!el.children">
              {{ row[el.props.value] ?? '' }}
            </template>
            <template v-else-if="el.children">
              <component :is="vnode(el, row)" />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <nav v-if="pagination && totalPages > 1" class="pagination-holder">
      <div class="pagination">
        <VButton icon="bx bx-chevron-left" class="arrows" type="outline" @on-click="changePage(getActivePage - 1)" />
        <VButton
          v-for="n in totalPages" :key="n" :is-active="getActivePage === n ? true : false" type="outline"
          @on-click="changePage(n)"
        >
          {{ n }}
        </VButton>
        <VButton icon="bx bx-chevron-right" class="arrows" type="outline" @on-click="changePage(getActivePage + 1)" />
      </div>
      <div class="page-teleport">
        <span>Go to</span>
        <VTextInput v-model:data="getActivePage" type="number" @update="console.log(getActivePage)" />
      </div>
      <div class="entries-size">
        <span>Show</span>
        <VDropdown :options="[{label: '5 Entries', value: 5}, {label: '10 Entries', value: 10}, {label: '15 Entries', value: 15}]" option-label="label" option-value="value" v-model:data="pageSize" />
      </div>
    </nav>
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

table thead tr th {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

table tbody tr:last-child td {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

tbody td {
  padding: 9px 0;
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
  width:28px;
  height: 28px;
  padding: 0;
  font-size: 13px;
}

.pagination-holder .pagination .btn-holder button:hover,
.pagination-holder .pagination .btn-holder[active='true'] button{
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

</style>
