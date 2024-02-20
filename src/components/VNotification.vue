<script>
import { useNotifyStore } from '../stores/notifications';
import VButton from './VButton.vue';

export default {
  components: {
    VButton,
  },
  data() {
    return {
      all_notifications: useNotifyStore().notifications,
      status_icon: {
        error: 'bx bxs-error-circle',
        success: 'bx bxs-check-circle',
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
  <div>
    <div
      v-if="all_notifications.length > 0"
      class="notifications"
    >
      <div
        v-for="(notification, index) in all_notifications"
        :key="index"
        class="notification"
        :type="notification.status"
      >
        <i :class="status_icon[notification.status]" />
        <div>
          {{ notification.message }}
        </div>
        <VButton
          icon="bx bx-x"
          class="btn-notification"
          @on-click="remove_notification(index)"
        />
      </div>
    </div>
  </div>
</template>

<style>
/* Add styles for notifications */
.notifications {
  position: fixed;
  top: 15px;
  right: 23px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notifications .notification {
  padding: 15px;
  border-radius: var(--border-radius);
  max-width: 300px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  line-height: 17px;
  position: relative;
  font-family: monospace;
}

.notifications .notification .btn-notification i {
  font-size: 17px;
  color: white;
}

.notifications .notification > i {
  font-size: 22px;
}

.notifications .notification[type="success"] {
  background-color: #4caf50;
  color: #fff;
  background: linear-gradient(0deg, #052E16, #052E16),linear-gradient(0deg, #07211C, #07211C);
  border: 1px solid #052E16;
  color: var(--green-300)
}

.notifications .notification[type="error"] {
  background: linear-gradient(0deg, #260806, #260806),linear-gradient(0deg, #772323, #772323);
  border: 1px solid #772323;
  color: #F25454;
}
</style>
