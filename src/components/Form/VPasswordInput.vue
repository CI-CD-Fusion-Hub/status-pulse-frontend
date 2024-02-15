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
    isValid: {
      type: Boolean,
      default: false,
    },
    checkUppercase: {
      type: Boolean,
      default: false,
    },
    checkLowercase: {
      type: Boolean,
      default: false,
    },
    checkNumber: {
      type: Boolean,
      default: false,
    },
    checkSpecialChars: {
      type: Boolean,
      default: false,
    },
    checkLength: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:data', 'update:isValid'],
  data() {
    return {
      isUppercaseValid: false,
      isLowercaseValid: false,
      isNumberValid: false,
      isSpecialCharValid: false,
      isLengthValid: false,
      isInputValid: false,
    };
  },
  methods: {
    hasUpperCase(str) {
      return /[A-Z]/.test(str);
    },
    hasLowerCase(str) {
      return /[a-z]/.test(str);
    },
    hasNumber(str) {
      return /\d/.test(str);
    },
    hasSpecialChar(str) {
      return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
    },
    isGreaterThanSeven(str) {
      return str.length > 7;
    },
    validate(value) {
      const validator = [];

      if (this.checkUppercase)
        this.isUppercaseValid = this.hasUpperCase(value);
      if (this.checkLowercase)
        this.isLowercaseValid = this.hasLowerCase(value);
      if (this.checkNumber)
        this.isNumberValid = this.hasNumber(value);
      if (this.checkSpecialChars)
        this.isSpecialCharValid = this.hasSpecialChar(value);
      if (this.checkLength)
        this.isLengthValid = this.isGreaterThanSeven(value);

      // Push the validity checks into the validator array
      validator.push(
        this.isUppercaseValid,
        this.isLowercaseValid,
        this.isNumberValid,
        this.isSpecialCharValid,
        this.isLengthValid,
      );

      // Check if any of the validations failed
      this.isInputValid = !validator.includes(false);

      // Emit events
      this.$emit('update:isValid', this.isInputValid);
      this.$emit('update:data', value);
    },
  },
};
</script>

<template>
  <div class="input-holder">
    <label class="outside-label" :for="name">{{ label }}</label>
    <div class="input-field">
      <input
        :id="name"
        type="password"
        :name="name"
        placeholder=" "
        :value="data"
        @input="validate($event.target.value)"
      >
      <label class="inside-label" :for="name">{{ placeholder }}</label>
    </div>
    <!-- <div v-if="" class="input-error">Helper Text</div> -->
    <div v-if="data !== null && data !== ''" class="input-validator">
      <ul>
        <li v-if="checkUppercase" :class="isUppercaseValid ? 'valid' : ''">
          <i :class="isUppercaseValid ? 'bx bxs-check-circle' : 'bx bx-circle'" />Uppercase letter
        </li>
        <li v-if="checkLowercase" :class="isLowercaseValid ? 'valid' : ''">
          <i :class="isLowercaseValid ? 'bx bxs-check-circle' : 'bx bx-circle'" />Lowercase letter
        </li>
        <li v-if="checkNumber" :class="isNumberValid ? 'valid' : ''">
          <i :class="isNumberValid ? 'bx bxs-check-circle' : 'bx bx-circle'" />Number
        </li>
        <li v-if="checkSpecialChars" :class="isSpecialCharValid ? 'valid' : ''">
          <i :class="isSpecialCharValid ? 'bx bxs-check-circle' : 'bx bx-circle'" />Special character (e.g. !?&lt;>@#$%)
        </li>
        <li v-if="checkLength" :class="isLengthValid ? 'valid' : ''">
          <i :class="isLengthValid ? 'bx bxs-check-circle' : 'bx bx-circle'" />> 7 characters
        </li>
      </ul>
    </div>
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
  padding: 9px 16px;
  background-color: var(--select-bg);
  border-radius: var(--select-radius);
  transition: all 300ms ease-in-out;
  outline: none;
  color: white;
  font-size: 20px;
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
  left: 17px;
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

.input-holder .input-validator li:first-child{
  margin-top: 16px;
}

.input-holder .input-validator li {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--body-text);
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 300ms ease-in-out;
}

.input-holder .input-validator li.valid {
  color: var(--select-default-color);
}

.input-holder .input-validator li.valid i {
  color: var(--green-400);
}

.input-holder .input-validator li i {
  font-size: 16px;
}
</style>
