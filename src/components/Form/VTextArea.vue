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
  <div class="text-area-holder">
    <label v-if="label !== ''" class="outside-label" :for="name">{{ label }}</label>
    <div
      class="text-area-field"
      :tooltip-text="tooltipText"
      :tooltip-position="tooltipPos"
    >
      <textarea
        :id="name"
        :name="name"
        placeholder=" "
        @input="$emit('update:data', $event.target.value)"
      />
      <label class="inside-label" :for="name">{{ placeholder }}</label>
      <font-awesome-icon
        v-if="icon"
        :icon="icon"
      />
    </div>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.text-area-holder .outside-label {
  color: white;
  margin-bottom: 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 133.333% */
  letter-spacing: 0.12px;
  display: block;
}

.text-area-field {
  position: relative;
  background: rgba(112, 112, 112, 0.11);
  display: flex;
  border-radius: 6px;
}

.text-area-field textarea {
  padding: 9px 24px;
  background: transparent;
  border: none;
  max-height: 50vh;
  outline: none;
  color: white;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  cursor: text;
  position: relative;
  width: 100%;
  resize: none;
}

.text-area-field .inside-label {
  position: absolute;
  color: rgba(160, 160, 160, 0.65);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
  left: 0;
  top: 0;
  padding: 9.5px 24px;
  width: calc(100% - 48px);
  height: 100%;
}

.text-area-field textarea:focus + label,
.text-area-field textarea:not(:placeholder-shown) + label  {
  display: none;
}

.text-area-field textarea:focus + label + svg,
.text-area-field textarea:not(:placeholder-shown) + label + svg {
  opacity: 1;
}
</style>
