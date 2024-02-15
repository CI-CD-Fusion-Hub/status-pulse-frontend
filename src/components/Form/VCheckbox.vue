<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:isChecked'],
};
</script>

<template>
  <div class="input-checkbox">
    <input type="checkbox" :id="name" :name="name" :checked="isChecked" @change="$emit('update:isChecked', $event.target.checked)" />
    <label :for="name"><span class='checkbox-icon' :checked="isChecked"><i v-if="isChecked" class='bx bx-check'></i></span><span>{{ label }}</span></label>
  </div>
</template>

<style scoped>
.input-checkbox input {
    opacity: 0;
    position: absolute;
    z-index: -1;
}

.input-checkbox label {
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.input-checkbox i {
    font-size: 20px;
}

.input-checkbox .checkbox-icon {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: solid 1px var(--select-default-color);
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-checkbox .checkbox-icon[checked="true"] {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}
</style>
