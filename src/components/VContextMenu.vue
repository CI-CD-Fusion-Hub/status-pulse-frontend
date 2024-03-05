<script>
import VButton from './VButton.vue';

export default {
  components: { VButton },
  data() {
    return {
      isMenuVisible: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
  },
};
</script>

<template>
  <div class="btn-set-holder">
    <VButton icon="bx bx-dots-vertical-rounded" :is-active="isMenuVisible" @on-click="toggleMenu" />
    <div v-if="isMenuVisible" class="btn-set-menu" @click="toggleMenu">
      <slot />
    </div>
  </div>
</template>

<style>
.btn-set-holder {
  position: relative;
}

.btn-set-holder > .btn-holder {
  justify-content: flex-end;
  display: flex;
  margin-bottom: 4px;
}

.btn-set-holder > .btn-holder:hover button,
.btn-set-holder > .btn-holder[active='true'] button {
 background-color: #17212B;

}

.btn-set-holder > .btn-holder button {
  border-color: transparent;
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
  display: flex;
}

.btn-set-holder > .btn-holder button i {
  font-size: 24px;
}

.btn-set-holder .btn-set-menu {
  display: flex;
  width: 200px;
  right: 0;
  padding: 16px 0;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  z-index: 9;
  position: absolute;
  border-radius: 6px;
  border: 1px solid var(--context-menu-border);
  background-color: var(--context-menu-bg);
}

.btn-set-holder .btn-set-menu .btn-holder {
  display: flex;
  transition: background-color 300ms ease-in-out;
}

.btn-set-holder .btn-set-menu .btn-holder a {
  width: 100%;
}

.btn-set-holder .btn-set-menu .btn-holder:hover {
  background-color: var(--gray-scale-6);
}
.btn-set-holder .btn-set-menu .btn-holder:hover button i,
.btn-set-holder .btn-set-menu .btn-holder:hover button span{
  color: var(--gray-color-1);
}

.btn-set-holder .btn-set-menu .btn-holder button {
  color: var(--gray-scale-5);
  padding: 8px 16px 8px 16px;
  gap: 8px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.btn-set-holder .btn-set-menu .btn-holder button i {
  font-size: 20px;
  transition: color 300ms ease-in-out;
}

.btn-set-holder .btn-set-menu .btn-holder button span {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  transition: color 300ms ease-in-out;
}
</style>
