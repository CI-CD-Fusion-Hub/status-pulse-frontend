<script>
import VButton from './VButton.vue';

export default {
  components: { VButton },
  props: {
    header: {
      type: String,
      default: '',
    },
    buttonLabel: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'add',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:isActive', 'onSend', 'onClose', 'onDelete'],
  computed: {
    is_visible() {
      return this.isActive;
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    close_modal() {
      this.$emit('update:isActive', false);
      this.onClose();
    },
    handleKeyDown(event) {
      if (event.key === 'Escape')
        this.close_modal();
    },
    onSend() {
      this.$emit('onSend');
    },
    onClose() {
      this.$emit('onClose');
    },
    onDelete() {
      this.$emit('onDelete');
    },
  },
};
</script>

<template>
  <div
    v-if="is_visible"
    class="modal-holder"
  >
    <div class="modal-container" :type="type">
      <header>
        <h4 v-if="header !== ''">
          {{ header }}
        </h4>
        <VButton
          icon="bx bx-x"
          class="btn-modal-close"
          @on-click="close_modal"
        />
      </header>
      <main>
        <slot />
      </main>
      <footer>
        <VButton v-if="type === 'edit'" class="btn-delete" type="basic" icon="bx bx-trash" @on-click="onDelete">
          Delete
        </VButton>
        <VButton type="fill" @on-click="onSend">
          {{ buttonLabel }}
        </VButton>
      </footer>
    </div>
  </div>
</template>

<style>
.modal-holder {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top:0;
    display: flex;
    justify-content: flex-end;
    background-color: var(--main-bg-color);
    z-index: 10;
}

.modal-holder .modal-container {
    max-width: 528px;
    width: 30vw;
    min-width: 200px;
    background-color: var(--box-bg);
    height: 100%;
    display: flex;
    flex-flow: column;
}

.modal-holder .modal-container header {
    display: flex;
    justify-content: space-between;
    padding: 32px;
    color: white;
    align-items: center;
}

.modal-holder .modal-container header i {
    font-size: 24px;
    color: white;
}

.modal-holder .modal-container main {
    padding: 0 32px;
    display: flex;
    gap: 24px;
    flex-flow: column;
}

.modal-holder .modal-container[type="add"] footer {
    display: flex;
    justify-content: flex-end;
}
.modal-holder .modal-container[type="edit"] footer {
    display: flex;
    justify-content: space-between;
}

.modal-holder .modal-container footer {
    margin-top: auto;
    padding: 32px;
    border-top: solid 1px var(--box-border)
}

.modal-holder .modal-container footer .btn-delete button {
    color: var(--red-500);
}
</style>
