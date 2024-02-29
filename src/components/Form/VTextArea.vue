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
    description: {
      type: String,
      default: '',
    },
  },
  emits: ['update:data'],
  data() {
    return {
      textAreaData: this.data,
    };
  },
  methods: {
    getData(value) {
      console.log(value);
      try {
        const parsedJSON = JSON.parse(this.data);
        const beautifiedJSON = JSON.stringify(parsedJSON, null, 2);
        this.textAreaData = beautifiedJSON;
      }
      catch (error) {
        this.textAreaData = 'Invalid JSON';
      }

      this.$emit('update:data', this.textAreaData);
    },
  },
};
</script>

<template>
  <div class="text-holder">
    <label v-if="label !== ''" class="outside-label" :for="name">{{ label }}</label>
    <div
      class="text-field"
      :tooltip-text="tooltipText"
      :tooltip-position="tooltipPos"
    >
      <textarea
        :id="name"
        :name="name"
        placeholder=" "
        :value="data"
        @input="$emit('update:data', $event.target.value)"
      />
      <label class="inside-label" :for="name">{{ placeholder }}</label>
    </div>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.text-holder .outside-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #E9EBED;
  display: block;
  margin-bottom: 6px;
}

.text-holder .text-field {
  position: relative;
  display: flex;
}

.text-holder .text-field textarea,
.text-holder .text-field label {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  width: 100%;
}

.text-holder .text-field textarea {
  background: transparent;
  border: solid 1px transparent;
  padding: 11px 16px;
  background-color: var(--select-bg);
  border-radius: var(--select-radius);
  transition: all 300ms ease-in-out;
  outline: none;
  color: white;
  min-height: 114px;
  resize: none;
}

.text-holder .text-field textarea:hover {
  border-color: var(--select-hover-color);
}

.text-holder .text-field textarea:focus{
  border-color: var(--select-focus-color);
  background-color: transparent;
}

.text-holder .text-field label {
  position: absolute;
  cursor: text;
  width: calc(100% - 34px);
  color: var(--select-default-color);
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 12px 17px;
}

.text-holder .text-field textarea:focus + label,
.text-holder .text-field textarea:not(:placeholder-shown) + label  {
  display: none;
}

.text-holder .text-field textarea:focus + label + svg,
.text-holder .text-field textarea:not(:placeholder-shown) + label + svg {
  opacity: 1;
}

.text-holder .text-error {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  margin-top: 4px;
  color: var(--select-error-color)
}
</style>
