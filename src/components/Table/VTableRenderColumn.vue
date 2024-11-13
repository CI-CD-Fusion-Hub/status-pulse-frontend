<script setup>
const props = defineProps({
  header: {
    type: String,
  },
  value: { type: String },
  row: {
    required: false,
    type: Object,
  },
});
</script>

<template>
  <div>
    <slot />
    <slot name="body" :row="row" />
  </div>
</template>

<style scoped>
div {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  max-width: 500px;
}
</style>
