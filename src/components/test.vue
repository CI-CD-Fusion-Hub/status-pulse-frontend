<template>
  <div class="resizable-grid" :style="{ width: `${width}%`, height: `${height}%`, transform: `translate(${x}%, ${y}%)` }">
    <div class="resize-handle" @mousedown="startResize"></div>
    <div class="content">
      <!-- Your content goes here -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    gridSize: Number, // Percentage of the parent's width/height
    defaultWidth: Number, // Default width percentage
    defaultHeight: Number, // Default height percentage
    defaultX: Number, // Default X position percentage
    defaultY: Number, // Default Y position percentage
  },
  setup(props) {
    const width = ref(props.defaultWidth);
    const height = ref(props.defaultHeight);
    const x = ref(props.defaultX);
    const y = ref(props.defaultY);

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    const startResize = (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = width.value;
      startHeight = height.value;

      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
    };

    const handleResize = (e) => {
      if (!isResizing) return;

      const parentWidth = window.innerWidth;
      const parentHeight = window.innerHeight;

      const deltaX = (e.clientX - startX) / parentWidth * 100;
      const deltaY = (e.clientY - startY) / parentHeight * 100;

      const newWidth = Math.max(0, startWidth + deltaX);
      const newHeight = Math.max(0, startHeight + deltaY);

      width.value = newWidth;
      height.value = newHeight;
    };

    const stopResize = () => {
      isResizing = false;
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };

    return {
      width,
      height,
      x,
      y,
      startResize,
    };
  },
};
</script>

<style scoped>
.resizable-grid {
  position: absolute;
  border: 1px solid #ccc;
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #007bff;
  cursor: nwse-resize;
  bottom: 0;
  right: 0;
}

.content {
  width: 100%;
  height: 100%;
  background-color: lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
