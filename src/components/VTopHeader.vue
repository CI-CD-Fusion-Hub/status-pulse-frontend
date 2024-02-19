<script>
import { useNotifyStore } from '../stores/notifications';

export default {
  components: {},
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
  <header class="top-header">
    <div class="user-profile">
      <span>F</span>
      <i class="bx bx-chevron-down" />
    </div>
  </header>
</template>

<style scoped>
.top-header {
    display: flex;
    justify-content: flex-end;
    padding: 10px 40px;
    background-color: var(--box-bg);
}

.top-header .user-profile {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
}

.top-header .user-profile span{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--gray-scale-6);
}
</style>
