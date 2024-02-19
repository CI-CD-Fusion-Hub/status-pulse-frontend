<script>
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    data: {
      type: String,
      default: '',
    },
    isFullWidth: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    linkTo: {
      type: Object,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isTooltipActive: {
      type: Boolean,
      default: null,
    },
    tooltipText: {
      type: String,
      default: null,
    },
    tooltipPos: {
      type: String,
      default: 'Top',
    },
    align: {
      type: String,
      default: 'right',
    },
  },
  emits: ['onClick'],
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
};
</script>

<template>
  <div class="btn-holder" :active="isActive" :full-width="isFullWidth" :type="type">
    <router-link
      v-if="Object.keys(linkTo).length > 0"
      :to="linkTo"
    >
      <button @click="onClick">
        <span v-if="$slots.default"><slot /></span>
      </button>
    </router-link>
    <button
      v-else
      @click="onClick"
    >
      <i v-if="isLoading" class="bx bx-loader-alt bx-spin" />
      <template v-else>
        <i v-if="icon !== ''" :class="icon" />
        <span v-if="$slots.default"><slot /></span>
      </template>
    </button>
  </div>
</template>

<style>
.btn-holder[type="simple"] {
  color: white;
}

.btn-holder[type="link"],
.btn-holder[type="link-important"] {
  display: inline-block;
}

.btn-holder[type="fill"] button,
.btn-holder[type="outline"] button {
  display: flex;
  flex-flow: row-reverse;
}

.btn-holder[type="fill"][full-width="true"] button,
.btn-holder[type="outline"][full-width="true"] button{
  width: 100%;
}

.btn-holder button,
.btn-holder button i {
  cursor: pointer;
  transition: all 300ms ease-in-out;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.009em;
}

.btn-holder[type="fill"] button,
.btn-holder[type="outline"] button {
  padding: 12px 24px 12px 24px;
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: var(--border-radius);
}

.btn-holder[type="fill"] button {
  background-color: var(--primary-color);
  border: none;
  color: white;

}
.btn-holder[type="fill"] button:hover,
.btn-holder.active[type="fill"] button {
  color: white;
  background-color: var(--primary-hover-color);
}
.btn-holder[type="fill"] button:active,
.btn-holder[type="fill"] button:focus {
  outline: solid 1px var(--primary-focus-color);
  outline-offset: 1px;
}

.btn-holder[type="outline"] button {
  color: white;
  border: solid 1px var(--box-border);
}
.btn-holder[type="outline"] button:hover,
.btn-holder.active[type="outline"] button {
  color: var(--primary-color);
  border: solid 1px var(--primary-color);
}

.btn-holder[type="link"] button,
.btn-holder[type="link-important"] button {
  text-decoration: underline;
}
.btn-holder[type="link"] button:hover,
.btn-holder[type="link-important"] button:hover {
  text-decoration: none;
}

.btn-holder[type="link"] button {
  color: var(--gray-scale-3);
}
.btn-holder[type="link"] button:hover{
  color: white;
}

.btn-holder[type="link-important"] button {
  color: var(--link-default-color);
}
.btn-holder[type="link-important"] button:hover{
  color: var(--link-hover-color);
}
</style>
