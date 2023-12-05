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
    data: {
      type: String,
      default: '',
    },
    icon: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'text',
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
  <div
    class="input-holder"
    :tooltip-text="tooltipText"
    :tooltip-position="tooltipPos"
  >
    <input
      :id="name"
      :type="type"
      :name="name"
      placeholder=" "
      :value="data"
      @input="$emit('update:data', $event.target.value)"
      @click="type === 'datetime-local' ? $event.target.showPicker() : null"
    >
    <label :for="name">{{ placeholder }}</label>
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
    />
  </div>
</template>

<style>
.input-holder {
  border-radius: var(--border-radius);
  position: relative;
  display: flex;
  border: solid 1px transparent;
  align-items: center;
  flex-flow: row-reverse;
  margin-bottom: 16px;
  justify-content: flex-end;
  color: rgba(160, 160, 160, 0.65);
  font-family: var(--main-font);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  border: 1px solid rgba(103, 103, 103, 0.23);
  background: rgba(112, 112, 112, 0.09);
}

.input-holder svg {
  font-size: 13px;
}

.input-holder:last-child {
  margin-bottom: 0;
}

.input-holder label {
  position: absolute;
  left: 0;
  width: calc(100% - 33px);
  padding-left: 28px;
  font-size: 16px;
  line-height: 28px;
  font-weight: 400;
  z-index: 2;
}

.input-holder input {
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  padding: 14px 28px;
  border-radius: var(--border-radius);
  width: 100%;
  color: rgba(160, 160, 160, 0.65);
  font-family: var(--main-font);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 175% */
}

.input-holder input,
.input-holder svg,
.input-holder label {
  padding-top: 14px;
  padding-bottom: 14px;
  cursor: text;
}

.input-holder svg {
  padding-left: 10px;
}

.input-holder svg {
  width: 20px;
}

.input-holder label,
.input-holder svg {
  opacity: 0.6;
  transition: opacity 100ms ease-in-out;
}

.input-holder input:focus + label,
.input-holder input:not(:placeholder-shown) + label  {
  display: none;
}

.input-holder input:focus + label + svg,
.input-holder input:not(:placeholder-shown) + label + svg {
  opacity: 1;
}

.input-holder input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  background: none;
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
