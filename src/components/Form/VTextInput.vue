<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    data: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    description: {
      type: String,
      default: '',
    },
    tooltipText: {
      type: String,
      default: null,
    },
    tooltipPos: {
      type: String,
      default: 'Left',
    },
  },
  emits: ['update:data'],
};
</script>

<template>
  <div class="input-holder">
    <label v-if="label !== ''" class="outside-label" :for="name">{{ label }}</label>
    <div class="input-field">
      <input
        :id="name"
        :type="type"
        :name="name"
        placeholder=" "
        :value="data"
        @input="$emit('update:data', $event.target.value)"
      >
      <label class="inside-label" :for="name">{{ placeholder }}</label>
      <!-- <i class='bx bx-search'></i> -->
    </div>
    <!-- <div class="input-error">Helper Text</div> -->
  </div>
</template>

<style scoped>
.input-holder .outside-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #E9EBED;
  display: block;
  margin-bottom: 6px;
}

.input-holder .input-field {
  position: relative;
  display: flex;
}

.input-holder .input-field input,
.input-holder .input-field label {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  width: 100%;
}

.input-holder .input-field input {
  background: transparent;
  border: solid 1px transparent;
  padding: 11px 16px;
  background-color: var(--select-bg);
  border-radius: var(--select-radius);
  transition: all 300ms ease-in-out;
  outline: none;
  color: white;
}

.input-holder .input-field input:hover {
  border-color: var(--select-hover-color);
}

.input-holder .input-field input:focus{
  border-color: var(--select-focus-color);
  background-color: transparent;
}

.input-holder .input-field label {
  position: absolute;
  cursor: text;
  width: calc(100% - 34px);
  color: var(--select-default-color);
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 17px;
}

.input-holder .input-field input:focus + label,
.input-holder .input-field input:not(:placeholder-shown) + label  {
  display: none;
}

.input-holder .input-field input:focus + label + svg,
.input-holder .input-field input:not(:placeholder-shown) + label + svg {
  opacity: 1;
}

.input-holder .input-error {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  margin-top: 4px;
  color: var(--select-error-color)
}

.input-holder input::-webkit-outer-spin-button,
.input-holder input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.input-holder input[type=number] {
  -moz-appearance: textfield;
}
</style>
