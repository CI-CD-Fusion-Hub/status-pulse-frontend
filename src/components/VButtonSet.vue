<script>
import VButton from "../components/VButton.vue";

export default {
  components: {VButton},
  data () {
    return {
      isMenuVissible: false,
    }
  },
}
</script>

<template>
  <div class="btn-set-holder">
    <VButton :icon="['fas', 'ellipsis-vertical']" @on-click="isMenuVissible=!isMenuVissible" />
    <div v-if="isMenuVissible" class="btn-set-menu">
      <slot />
    </div>
  </div>
</template>

<style>
.btn-set-holder {
  position: relative;
}

div.btn-set-holder > .btn-holder button {
  border-color: transparent;
  color: white;
}

.btn-set-holder > .btn-holder button svg {
  font-size: 22px;
}

.btn-set-holder .btn-set-menu {
  display: flex;
  width: 130px;
  left: -120px;
  padding: 8px;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  z-index: 2;
  position: absolute;
  border-radius: 12px;
  border: 1px solid rgba(210, 210, 210, 0.04);
  background: linear-gradient(0deg, rgba(92, 92, 92, 0.25) 0%, rgba(92, 92, 92, 0.25) 100%), #0A0A0A;
}

.btn-set-holder .btn-set-menu .btn-holder button,
.btn-set-holder .btn-set-menu .btn-holder a {
  width: 100%;
  background-color: transparent;
  justify-content: flex-start;

}

.btn-set-holder .btn-set-menu .btn-holder button {
  padding: 10px 12px 7px 12px;
}

.btn-set-holder .btn-set-menu .btn-holder:hover button {
  border-radius: 8px;
  background-color: rgba(175, 175, 175, 0.20);
  color: white;
}

.btn-set-holder .btn-set-menu .delete-btn button {
  color: #F25454;
}
</style>
