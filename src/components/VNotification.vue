<script setup>
import { useNotifyStore } from "../stores/notifications";
import VButton from "./VButton.vue";

const allNotifications = useNotifyStore().notifications;
const statusIcon = {
  error: "bx bxs-error-circle",
  success: "bx bxs-check-circle",
};
function removeNotification(index) {
  allNotifications.splice(index, 1);
}
</script>

<template>
  <div>
    <div v-if="allNotifications.length > 0" class="notifications">
      <div
        v-for="(notification, index) in allNotifications"
        :key="index"
        class="notification"
        :type="notification.status"
      >
        <i :class="statusIcon[notification.status]" />
        <div>
          {{ notification.message }}
        </div>
        <VButton
          icon="bx bx-x"
          class="btn-notification"
          @on-click="removeNotification(index)"
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
  background: linear-gradient(0deg, #052e16, #052e16),
    linear-gradient(0deg, #07211c, #07211c);
  border: 1px solid #052e16;
  color: var(--green-300);
}

.notifications .notification[type="error"] {
  background: linear-gradient(0deg, #260806, #260806),
    linear-gradient(0deg, #772323, #772323);
  border: 1px solid #772323;
  color: #f25454;
}
</style>
