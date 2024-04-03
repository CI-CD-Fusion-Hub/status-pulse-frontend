<script>
import { useNotifyStore } from '../stores/notifications';
import VButton from './VButton.vue';

export default {
  components: { VButton },
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
      breadcrumbs: [],
    };
  },
  watch: {
    $route() {
      this.generateBreadcrumbs();
    },
  },
  mounted() {
    // console.log(this.$route)
    this.generateBreadcrumbs();
  },
  methods: {
    remove_notification(index) {
      this.all_notifications.splice(index, 1);
    },
    generateBreadcrumbs() {
      this.breadcrumbs = Array.isArray(this.$route.meta.breadcrumb) ? this.$route.meta.breadcrumb : [this.$route.meta.breadcrumb];
      console.log(this.breadcrumbs);
    },
  },
};
</script>

<template>
  <header class="top-header">
    <nav class="breadcrumb-holder">
      <ol class="breadcrumb">
        <li v-for="item in breadcrumbs" :key="item" class="breadcrumb-item">
          <i class="bx bx-chevron-right" />
          <VButton v-if="item?.to" type="link" :link-to="item?.to">
            {{ item.label }}
          </VButton>
          <span v-else>{{ item.label || item }}</span>
        </li>
      </ol>
    </nav>
    <div class="user-profile">
      <span>F</span>
      <i class="bx bx-chevron-down" />
    </div>
  </header>
</template>

<style>
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px 10px 33px;
  background-color: var(--main-bg-color);
  border-bottom: solid 1px #252F3A;
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

.breadcrumb-holder .breadcrumb,
.breadcrumb-holder .breadcrumb .breadcrumb-item {
  display: flex;
  gap: 5px;
  align-items: center;
}

.breadcrumb-holder .breadcrumb .breadcrumb-item button,
.breadcrumb-holder .breadcrumb .breadcrumb-item {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
}

.breadcrumb-holder .breadcrumb .breadcrumb-item button:hover {
  text-decoration: underline;
}

.breadcrumb-holder .breadcrumb .breadcrumb-item i {
  font-size: 18px;
}
</style>
