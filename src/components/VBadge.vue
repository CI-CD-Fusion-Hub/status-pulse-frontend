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
.badge {
  display: flex;
  align-items: center;
  text-transform: capitalize;
}

.badge[color="healthy"] {
  color: var(--green-500)
}

.badge[type="status"] {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.001em;
  gap: 8px;
}

.badge[type="status"] i {
  font-size: 12px;
}
</style>
