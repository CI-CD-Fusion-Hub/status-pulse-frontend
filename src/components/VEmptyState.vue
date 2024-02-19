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
    func: {
      type: Function,
      default: null,
    },
  },
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
    remove_notification(index) {
      this.all_notifications.splice(index, 1);
    },
  },
};
</script>

<template>
  <div class="emptyState">
    <h1>{{ heading }}</h1>
    <p>{{ text }}</p>
    <VButton type="fill" @on-click="func(index)">
      Add New
    </VButton>
  </div>
</template>

<style scoped>
.emptyState {
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

.emptyState > .btn-holder {
    margin-top: 12px;
}
</style>
