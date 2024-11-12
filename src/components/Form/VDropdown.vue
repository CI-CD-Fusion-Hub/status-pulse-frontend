<script setup>
import VTextInput from "../Form/VTextInput.vue";
import { computed, ref, onMounted } from "vue";

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
    required: true,
  },
  label: {
    type: String,
    default: "",
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
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
    default: () => [],
  },
  icon: {
    type: String,
    default: "",
  },
  isSearchable: {
    type: Boolean,
    default: false,
  },
  isMultiselect: {
    type: Boolean,
    default: false,
  },
  tooltipText: {
    type: String,
    default: null,
  },
  tooltipPos: {
    type: String,
    default: "Left",
  },
  description: {
    type: String,
    default: "",
  },
  dynamicContent: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:data", "onSelect"]);
const isOpen = ref(false);
const dropdownPlaceholder = ref(
  props.isMultiselect ? props.data : props.placeholder
);
const searchValue = ref("");
const dropdownValue = ref(props.isMultiselect ? [] : "");

const filterResults = computed(() => {
  if (!props.options) return [];

  return props.options.filter((item) => {
    // Check if items are already selected items
    if (props.isMultiselect && props.optionLabel !== null) {
      return !dropdownValue.value.includes(item[props.optionValue])
        ? item[props.optionLabel].includes(searchValue.value)
        : false;
    }
    return item.toString().includes(searchValue.value);
  });
});

onMounted(() => {
  initializeValue(props.data);
});

function initializeValue(data) {
  if (props.isMultiselect) {
    dropdownValue.value = [...data];
    dropdownPlaceholder.value = [...data];
  } else {
    if (props.optionLabel && props.optionValue) {
      if (data.length > 0) {
        const valueMap = props.options.find(
          (item) => item[props.optionValue] === data
        );
        dropdownValue.value = valueMap.value;
        dropdownPlaceholder.value = valueMap.label;
      } else {
        dropdownValue.value = data;
        dropdownPlaceholder.value = props.placeholder;
      }
    } else {
      dropdownValue.value = data;
      dropdownPlaceholder.value = data;
    }
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectValue(item) {
  const selectedValue =
    props.optionLabel && props.optionValue ? item[props.optionValue] : item;
  const selectedLabel =
    props.optionLabel && props.optionValue ? item[props.optionLabel] : item;

  if (props.isMultiselect) {
    if (!dropdownValue.value.includes(selectedValue)) {
      console.log("ÏN");
      dropdownValue.value.push(selectedValue);
      dropdownPlaceholder.value.push(selectedLabel);
    } else {
      const valueIndex = dropdownValue.value.indexOf(selectedValue);
      dropdownValue.value.splice(valueIndex, 1);
      dropdownPlaceholder.value.splice(valueIndex, 1);
    }
  } else {
    dropdownValue.value = selectedValue;
    dropdownPlaceholder.value = selectedLabel;
    isOpen.value = false;
  }

  onSelect();
}

function removeValue(e) {
  dropdownPlaceholder.value = dropdownPlaceholder.value.filter((item) => {
    return item !== e;
  });

  dropdownValue.value = dropdownValue.value.filter((item) => {
    return item !== (e[props.optionValue] || e);
  });

  emit("update:data", dropdownValue.value);
}

// function getPlaceHolder(item) {
//   const label = this.options.filter((e) => {
//     return item === e[this.optionValue];
//   });

//   return label[0][this.optionLabel];
// }

function onSelect() {
  emit("update:data", dropdownValue.value);
  emit("onSelect");
}
</script>

<template>
  <div class="dropdown-holder">
    <label v-if="label !== ''" class="outside-label" :for="name">{{
      label
    }}</label>
    <div
      class="dropdown-field"
      :tooltip-text="tooltipText"
      :tooltip-position="tooltipPos"
    >
      <a
        href="javascript:;"
        :class="`drop-down-btn is-multiselect-${isMultiselect}`"
        @click="toggleDropdown"
      >
        <i v-if="icon !== ''" :class="icon" />
        <template v-if="Array.isArray(dropdownPlaceholder)">
          <div
            v-for="item in dropdownPlaceholder"
            :key="item"
            class="dropdown-tag"
          >
            <span v-if="optionLabel">{{ item }}</span>
            <span v-else>{{ item }}</span>
            <i class="bx bx-x" @click.stop="removeValue(item)" />
          </div>
          <span v-if="dropdownPlaceholder.length === 0">{{ placeholder }}</span>
        </template>
        <span v-else-if="data?.length > 0">{{ data }}</span>
        <span v-else>{{ dropdownPlaceholder }}</span>
        <i class="bx bxs-down-arrow" :is-open="isOpen" />
      </a>
      <div class="dropdown-menu" :is-vissible="isOpen">
        <VTextInput
          v-if="isSearchable && options.length !== 0"
          v-model:data="searchValue"
          name="searchValue"
          placeholder="Search..."
        />
        <ul>
          <li v-if="filterResults.length === 0" class="dropdown-menu-item">
            <div class="no-data"><i class="bx bxs-ghost" />No Data</div>
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
            >
              {{ item[optionLabel] }}
              <i
                v-if="dropdownPlaceholder === item[optionLabel]"
                class="bx bx-check"
              />
              <i
                v-if="
                  isMultiselect === true &&
                  dropdownPlaceholder.includes(item[optionLabel])
                "
                class="bx bx-check"
              />
            </a>
            <a v-else href="javascript:;" @click="selectValue(item)">
              {{ item }}
              <i v-if="dropdownPlaceholder === item" class="bx bx-check" />
              <i
                v-if="
                  isMultiselect === true && dropdownPlaceholder.includes(item)
                "
                class="bx bx-check"
              />
            </a>
          </li>
        </ul>
      </div>
      <input type="hidden" :name="name" :value="data" />
    </div>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.dropdown-holder .outside-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #e9ebed;
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
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
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
}

.dropdown-holder .dropdown-menu[is-vissible="true"] {
  display: flex;
  flex-flow: column;
  gap: 8px;
  position: absolute;
  top: calc(100% + 8px);
  width: calc(100% - 2px);
  z-index: 2;
}

.dropdown-holder .dropdown-menu ul {
  width: 100%;
  max-height: 215px;
  overflow-y: scroll;
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
.dropdown-holder .dropdown-menu .dropdown-menu-item:hover a {
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

.dropdown-holder > p {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  margin-top: 4px;
}

.dropdown-holder .dropdown-field .is-multiselect-true .dropdown-tag {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
  border-radius: 6px;
  border: solid 1px var(--select-default-color);
  transition: border 300ms ease-in-out;
}

.dropdown-holder .dropdown-field .is-multiselect-true .dropdown-tag:hover {
  border-color: white;
}

.dropdown-holder .dropdown-field .is-multiselect-true .dropdown-tag > i {
  font-size: 16px;
  transition: color 300ms ease-in-out;
}

.dropdown-holder .dropdown-field .is-multiselect-true .dropdown-tag > i:hover {
  color: var(--red-500);
}

.dropdown-holder .input-holder {
  padding: 0 17px 16px 17px;
  border-bottom: solid 1px #252f3a;
}
</style>
