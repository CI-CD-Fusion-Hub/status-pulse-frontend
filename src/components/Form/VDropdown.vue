<script>
import VButton from '../VButton.vue';

export default {
  component: {
    VButton,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    optionLabel: {
      type: String,
      default: null,
    },
    optionValue: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
    },
    icon: {
      type: String,
      default: '',
    },
    isSearchable: {
      type: Boolean,
      default: false,
    },
    isMultyselect: {
      type: Boolean,
      default: false,
    },
    tooltipText: {
      type: String,
      default: null,
    },
    tooltipPos: {
      type: String,
      default: 'Left',
    },
    description: {
      type: String,
      default: '',
    },
  },
  emits: ['update:data'],
  data() {
    return {
      isOpen: false,
      dropdownPlaceholder: this.isMultyselect ? this.data : this.placeholder,
      value: this.data?.length > 0 ? this.data : [],
      searchValue: '',
    };
  },
  computed: {
    filterResults() {
      if (!this.options)
        return [];

      return this.options.filter((item) => {
        // Check if items is in already selected items
        if (this.isMultyselect && this.optionLabel !== '')
          return !this.value.includes(item[this.optionValue]) ? item[this.optionLabel].includes(this.searchValue) : false;

        return item.toString().includes(this.searchValue);
      });
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectValue(item) {
      const selectedValue = this.optionLabel && this.optionValue ? item[this.optionValue] : item;
      const selectedLabel = this.optionLabel && this.optionValue ? item[this.optionLabel] : item;

      if (this.isMultyselect) {
        this.value.push(selectedValue);
        this.dropdownPlaceholder.push(selectedLabel);
      }
      else {
        this.value = selectedValue;
        this.dropdownPlaceholder = selectedLabel;
        this.isOpen = false;
      }

      this.$emit('update:data', this.value);
    },
    removeValue(e) {
      this.dropdownPlaceholder = this.dropdownPlaceholder.filter((item) => {
        return item !== e;
      });

      this.value = this.value.filter((item) => {
        return item !== (e[this.optionValue] || e);
      });
    },
    getPlaceHolder(item) {
      const label = this.options.filter((e) => {
        return item === e[this.optionValue];
      });

      return label[0][this.optionLabel];
    },
  },
};
</script>

<template>
  <div class="dropdown-holder">
    <label v-if="label !== ''" class="outside-label" :for="name">{{ label }}</label>
    <div
      class="dropdown-field"
      :tooltip-text="tooltipText"
      :tooltip-position="tooltipPos"
    >
      <a
        href="javascript:;"
        :class="`drop-down-btn is-multyselect-${isMultyselect}`"
        @click="toggleDropdown"
      >
        <i
          v-if="icon !== ''"
          :class="icon"
        />
        <template v-if="Array.isArray(dropdownPlaceholder)">
          <div
            v-for="item in dropdownPlaceholder"
            :key="item"
            class="dropdown-tag"
          >
            <span v-if="optionLabel">{{ item[optionLabel] || getPlaceHolder(item) }}</span>
            <span v-else>{{ item }}</span>
            <i class="bx bx-x" @click.stop="removeValue(item)" />
          </div>
          <span v-if="dropdownPlaceholder.length === 0">{{ placeholder }}</span>
        </template>
        <span v-else-if="data?.length > 0">{{ data }}</span>
        <span v-else>{{ dropdownPlaceholder }}</span>
        <i
          class="bx bxs-down-arrow"
          :is-open="isOpen"
        />
      </a>
      <div class="dropdown-menu" :is-vissible="isOpen">
        <div
          v-if="isSearchable && options.length !== 0"
          class="input-holder"
        >
          <input
            :id="name"
            type="text"
            placeholder=""
            @input="searchValue = $event.target.value"
          >
          <label :for="name">Search</label>
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </div>
        <ul>
          <li v-if="filterResults.length === 0" class="dropdown-menu-item">
            <div class="no-data">
              <i class="bx bxs-ghost" />No Data
            </div>
          </li>
          <li
            v-for="item in filterResults"
            :key="item"
            class="dropdown-menu-item"
          >
            <a
              v-if="optionValue && optionLabel"
              href="javascript:;"
              @click="selectValue(item)"
            >{{ item[optionLabel] }}<i v-if="dropdownPlaceholder === item[optionLabel]" class="bx bx-check" /></a>
            <a
              v-else
              href="javascript:;"
              @click="selectValue(item)"
            >{{ item }}<i v-if="dropdownPlaceholder === item" class="bx bx-check" /></a>
          </li>
        </ul>
      </div>
      <input
        type="hidden"
        :name="name"
        :value="data"
      >
    </div>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.dropdown-holder .outside-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #E9EBED;
  display: block;
  margin-bottom: 6px;
}

.dropdown-holder .dropdown-field {
  position: relative;
  display: flex;
  flex-flow: column;
  gap: 8px;
}

.dropdown-holder .dropdown-field > a {
  display: flex;
  align-items: center;
}

.dropdown-holder .dropdown-field > a i:last-child {
  margin-left: auto;
  font-size: 11px;
  transition: transform 100ms ease-in-out;
}

.dropdown-holder .dropdown-field > a i[is-open="true"]:last-child {
  transform: rotate(-90deg);
}

.dropdown-holder .dropdown-field .drop-down-btn {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  background: transparent;
  border: solid 1px transparent;
  padding: 11px 16px;
  background-color: var(--select-bg);
  border-radius: var(--select-radius);
  transition: all 300ms ease-in-out;
  color: white;
}

.dropdown-holder .dropdown-field .drop-down-btn:hover {
  border-color: var(--select-hover-color);
}

.dropdown-holder .dropdown-field .drop-down-btn:focus {
  border-color: transparent;
}

.dropdown-holder .dropdown-menu {
  display: none;
  padding: 16px 0;
  border-radius: 6px;
  border: 1px;
  background-color: var(--context-menu-bg);
  border: solid 1px var(--context-menu-border);
  max-height: 215px;
  overflow-y: scroll;
}

.dropdown-holder .dropdown-menu[is-vissible="true"] {
  display: flex;
  gap: 8px;
  position: absolute;
  top: calc(100% + 8px);
  width: calc(100% - 2px);
  z-index: 2;
}

.dropdown-holder .dropdown-menu ul {
  width: 100%;

}

.dropdown-holder .dropdown-menu .dropdown-menu-item .no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.dropdown-holder .dropdown-menu .dropdown-menu-item {
  display: flex;
  justify-content: flex-start;
  flex-flow: column;
  width: 100%;
}
.dropdown-holder .dropdown-menu .dropdown-menu-item:hover a{
  background-color: var(--gray-scale-6);
}

.dropdown-holder .dropdown-menu .dropdown-menu-item a {
  padding: 8px 6px 8px 17px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-holder .dropdown-menu .dropdown-menu-item .bx-check {
  color: var(--green-500);
  font-size: 20px;
}

.dropdown-holder  > p {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  margin-top:4px;
}
</style>
