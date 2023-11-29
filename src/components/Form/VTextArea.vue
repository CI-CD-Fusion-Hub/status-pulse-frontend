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
      default: () => ['fas', 'users'],
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
  <div
    class="input-holder"
    :tooltip-text="tooltipText"
    :tooltip-position="tooltipPos"
  >
    <textarea
      :id="name"
      :name="name"
      placeholder=" "
      @input="$emit('update:data', $event.target.value)"
    />
    <label :for="name">{{ placeholder }}</label>
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
    />
  </div>
</template>

<style>
.input-holder textarea {
  background-color: transparent;
  resize: none;
  height: 23px;
  color: white;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  transition: height 300ms ease-in-out;
  width: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.input-holder textarea:focus-within {
  height: 300px;
}

.input-holder textarea {
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: text;
}

.input-holder textarea:focus + label,
.input-holder textarea:not(:placeholder-shown) + label  {
  display: none;
}

.input-holder textarea:focus + label + svg,
.input-holder textarea:not(:placeholder-shown) + label + svg {
  opacity: 1;
}
</style>
