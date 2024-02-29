<script>
import { useNotifyStore } from '../stores/notifications';
import VButton from './VButton.vue';

export default {
  components: {
    VButton,
  },
  props: {
    heading: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
    },
  },
  emits: ['onClick'],
  data() {
    return {
      all_notifications: useNotifyStore().notifications,
      status_icon: {
        error: ['fas', 'xmark'],
        success: ['fas', 'check'],
      },
    };
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
};
</script>

<template>
  <div class="empty-state">
    <h1>{{ heading }}</h1>
    <p>{{ text }}</p>
    <VButton type="fill" @on-click="onClick()">
      Add New
    </VButton>
  </div>
</template>

<style scoped>
.empty-state {
  width: 50%;
  max-width: 524px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  flex-flow: column;
  align-items: center;
  gap: 20px;
}

.empty-state > .btn-holder {
  margin-top: 12px;
}
</style>
