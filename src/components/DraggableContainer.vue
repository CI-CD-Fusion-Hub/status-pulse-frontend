<template>
    <div class="drag-container">
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DraggableContainer',
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
          this.$emit('item-dropped', { fromIndex: this.draggedIndex, toIndex: index });
          this.draggedIndex = null;
        }
      },
      dragEnd() {
        this.draggedIndex = null;
      },
    },
  };
  </script>
  
  <style scoped>
  .drag-container {
    display: flex;
    flex-direction: column;
  }
  </style>
  