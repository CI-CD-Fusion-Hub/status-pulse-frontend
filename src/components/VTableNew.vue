<script>
import { h, useSlots } from 'vue';
import VRenderColumn from './VRenderColumn.vue';
import VButtonSet from './VButtonSet.vue';
import VButton from './VButton.vue';
import VTextInput from './Form/VTextInput.vue';

export default {
  components: { VButton, VButtonSet, VTextInput, VRenderColumn },
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
    pageSize: {
      type: Number,
      default: 15,
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
      <VTextInput
        name="table_search" placeholder="Search" :icon="['fas', 'magnifying-glass']" :data="search_text"
        @keyup.enter="filterResults($event.target.value)"
      />
    </div>
    <table>
      <div v-if="isLoading" class="loader">
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
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
            <font-awesome-icon :icon="['fas', 'ghost']" /> No Data
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
    <nav v-if="pagination && totalPages > 1" class="pagination_holder">
      <VButton :icon="['fas', 'chevron-left']" tooltip-text="Prev" @on-click="changePage(getActivePage - 1)" />
      <VButtonSet>
        <VButton
          v-for="n in totalPages" :key="n" :is-active="getActivePage === n ? true : false"
          @on-click="changePage(n)"
        >
          {{ n }}
        </VButton>
      </VButtonSet>
      <VButton :icon="['fas', 'chevron-right']" tooltip-text="Next" @on-click="changePage(getActivePage + 1)" />
    </nav>
  </div>
</template>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--main-color);
  padding: 15px;
  border-radius: var(--border-radius);
  font-size: 14px;
  position: relative;
  margin-bottom: 10px;
  color: white;
  border: var(--border-style);
  overflow: hidden;
}

thead {
  border-bottom: var(--border-style)
}

th,
td {
  padding: 15px 2.5px;
  text-align: left;
}

tbody tr:nth-child(odd) {
  background-color: var(--main-bg-color)
}

table .index_row {
  padding: 5px 10px;
  text-align: center;
}

table div.btn-holder {
  margin-top: 0;
}

table .empty_data {
  text-align: center;
  font-weight: 500;
}

.pagination_holder {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.table_search + table,
.table_search + table .loader {
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.table_search .input-holder {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

@media only screen and (min-width: 1024px) {
  th,
  td {
    padding: 15px 15px;
  }
}
</style>
