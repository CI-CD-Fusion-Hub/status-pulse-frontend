<script>
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: '', // 3 types: fill, outline and status
    },
    color: {
      type: String,
      default: 'healthy',
    },
  },
  data() {
    return {

    };
  },
};
</script>

<template>
  <span :type="type" class="badge" :color="color">
    <i v-if="type === 'status'" class="bx bxs-circle" /><slot />
  </span>
</template>

<style scoped>
.badge[color="healthy"] {
  color: var(--green-500);
  border-color: var(--green-500);
  text-transform: capitalize;
}
.badge[color="degrageted"] {
  color: var(--red-500);
  border-color: var(--red-500);
}

.badge[type="status"] {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.001em;
  gap: 8px;
  display: flex;
  align-items: center;
  text-transform: capitalize;
}

.badge[type="status"] i {
  font-size: 12px;
}

.badge[type="outline"] {
  padding: 4px 16px 4px 16px;
  border-radius: 36px;
  border: solid 1px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
}
</style>
