<script>
export default {
  name: 'DraggableContainer',
  emits: ['itemDropped'],
  data() {
    return {
      draggedIndex: null,
    };
  },
  methods: {
    dragStart(index) {
      this.draggedIndex = index;
    },
    dragOver(event) {
      event.preventDefault();
    },
    drop(index) {
      if (this.draggedIndex !== null && this.draggedIndex !== index) {
        this.$emit('itemDropped', { fromIndex: this.draggedIndex, toIndex: index });
        this.draggedIndex = null;
      }
    },
    dragEnd() {
      this.draggedIndex = null;
    },
  },
};
</script>

<template>
  <div class="drag-container">
    <slot />
  </div>
</template>

  <style scoped>
  .drag-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  </style>
