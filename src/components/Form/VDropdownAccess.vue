<script>
import VButton from '../VButton.vue';

export default {
  component: {
    VButton,
  },
  props: {
    label: {
      type: String,
      default: 'Private',
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
      type: String,
      default: 'Private',
    },
    icon: {
      type: String,
      default: '',
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
      dropdownPlaceholder: this.data,
      value: this.data,
      options: { Private: 'Only people who have access can view', Public: 'Anyone on the internet with the link can view' },
    };
  },
  computed: {},
  mounted() {
    this.$emit('update:data', this.data);
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectValue(item) {
      this.isOpen = false;

      this.$emit('update:data', item);
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
    >
      <a
        href="javascript:;"
        class="drop-down-btn"
        @click="toggleDropdown"
      >
        <div>
          <i class="bx bxs-lock-alt" />
          General Access
        </div>
        <div>
          <span>{{ data }}</span>
          <i
            class="bx bx-chevron-down"
            :is-open="isOpen"
          />
        </div>
      </a>
      <div class="dropdown-menu" :is-vissible="isOpen">
        <ul>
          <li
            v-for="(key, val) in options"
            :key="val"
            class="dropdown-menu-item"
          >
            <a
              href="javascript:;"
              @click="selectValue(val)"
            >{{ key }}<i v-if="data === val" class="bx bx-check" /></a>
          </li>
        </ul>
      </div>
      <input
        type="hidden"
        :name="name"
        :value="data"
      >
    </div>
    <p v-if="data === 'Private'">
      Only people who have access can view this dashboard
    </p>
    <p v-else>
      Anyone on the internet with the link can view this dashboard
    </p>
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
  font-size: 20px;
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
  justify-content: space-between;
}

.dropdown-holder .dropdown-field .drop-down-btn:hover {
  border-color: var(--select-hover-color);
}

.dropdown-holder .dropdown-field .drop-down-btn:focus {
  border-color: transparent;
}

.dropdown-holder .dropdown-field .drop-down-btn > div {
  display: flex;
  gap: 12px;
  align-items: center;
}

.dropdown-holder .dropdown-field .drop-down-btn > div:first-child {
  color: var(--select-default-color);
}

.dropdown-holder .dropdown-field .drop-down-btn .bxs-lock-alt {
  font-size: 18px;
}

.dropdown-holder .dropdown-menu {
  display: none;
  padding: 16px 0;
  border-radius: 6px;
  border: 1px;
  background-color: var(--context-menu-bg);
  border: solid 1px var(--context-menu-border)
}

.dropdown-holder .dropdown-menu[is-vissible="true"] {
  display: flex;
  gap: 8px;
}

.dropdown-holder .dropdown-menu ul {
  width: 100%;
}

.dropdown-holder .dropdown-menu .dropdown-menu-item {
  display: flex;
  justify-content: flex-start;
  flex-flow: column;
  width: 100%;
}
.dropdown-holder .dropdown-menu .dropdown-menu-item:hover {
  background-color: var(--gray-scale-6);
}

.dropdown-holder .dropdown-menu .dropdown-menu-item a {
  padding: 8px 24px;
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

.dropdown-holder p {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  margin-top: 4px;
}
</style>
