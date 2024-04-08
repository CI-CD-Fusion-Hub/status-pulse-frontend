<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    optionLabel: {
      type: String,
      default: '',
    },
    optionValue: {
      type: String,
      default: '',
    },
    optionIcon: {
      type: String,
      default: '',
    },
    data: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'normal',
    },
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
  },
  emits: ['update:data'],
};
</script>

<template>
  <div class="radio-holder">
    <label>{{ label }}</label>
    <div class="input-radio" :type="type">
      <div v-for="item in options" :key="item" :is-checked="data === (item[optionValue] || item)" @click="$emit('update:data', item[optionValue] || item)">
        <i v-if="type === 'icon'" :class="item[optionIcon]" />
        <span v-else-if="type === 'checked'" class="checked"><i class="bx bx-check" /></span>
        <span>{{ item[optionLabel] || item }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radio-holder .input-radio {
    display: flex;
    gap: 8px;
}

.radio-holder label {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: #E9EBED;
    display: block;
    margin-bottom: 6px;
}

.radio-holder .input-radio div {
    cursor: pointer;
    padding: 16px;
    border: solid 1px var(--box-border);
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--gray-color-5);
    width: 50%;
}
.radio-holder .input-radio div[is-checked="true"] {
    background-color: var(--box-border);
    color: white;
}

.radio-holder .input-radio[type="checked"] div {
    padding: 7px 16px;
}
.radio-holder .input-radio[type="checked"] div span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
}

.radio-holder .input-radio[type="checked"] div,
.radio-holder .input-radio[type="normal"] div {
    color: white;
}

.radio-holder .input-radio[type="normal"] div{
    width: auto;
    padding: 2px 12px;
    border-radius: 30px;
}
.radio-holder .input-radio[type="normal"] i {
    display: none;
}
.radio-holder .input-radio[type="normal"] div span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
}

.radio-holder .input-radio div span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
}

.radio-holder .input-radio div > i {
    font-size: 40px;
}

.radio-holder .input-radio div .checked {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    display: none;
}

.radio-holder .input-radio div[is-checked="true"] .checked {
    display: inherit;
}
</style>
