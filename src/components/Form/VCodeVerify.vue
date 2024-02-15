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
    length: {
      type: Number,
      default: 6,
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
  data() {
    return {
      code: '',
    };
  },
  methods: {
    setValue(target, idx, e) {
      if (e.length > 1 && e.length !== this.length) {
        e = e.substring(0, 1);
        target.value = e;
      }

      this.code = this.code.substring(0, idx - 1) + e + this.code.substring(idx);

      if (this.code.length > this.length)
        this.code = this.code.substring(0, this.length);

      this.$emit('update:data', this.code);
    },
  },
};
</script>

<template>
  <div class="input-holder">
    <div v-for="n in length" :key="n" class="input-field">
      <input
        :id="name + n"
        :type="type"
        :name="name + n"
        placeholder=" "
        :maxlength="n === 1 ? length : 1"
        :value="code[n - 1]"
        @input="setValue($event.target, n, $event.target.value)"
      >
      <label class="inside-label" :for="name + n">{{ label }}</label>
    </div>
  </div>
</template>

<style scoped>
.input-holder {
    display: flex;
    justify-content: space-between;
    gap: 10px;
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
  text-align: center    ;
}

.input-holder .input-field input {
  background: transparent;
  border: solid 1px transparent;
  padding: 11px 5%;
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
  top: 13px;
  cursor: text;
  color: var(--select-default-color);
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
</style>
