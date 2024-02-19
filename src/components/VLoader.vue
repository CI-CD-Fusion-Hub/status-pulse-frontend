<script>
export default {
  components: {},
  data() {
    return {
      isMenuVissible: false,
    };
  },
};
</script>

<template>
  <div class="loader">
    <i class="bx bx-pulse bx-flashing" />
  </div>
</template>

<style scoped>
.loader {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: var(--main-bg-color);
    z-index: 2;
    font-size: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
}
</style>
