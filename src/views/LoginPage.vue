<script>
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import VTextInput from '../components/Form/VTextInput.vue';
import VPasswordInput from '../components/Form/VPasswordInput.vue';
import VCheckbox from '../components/Form/VCheckbox.vue';
import VButton from '../components/VButton.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {
    VTextInput,
    VPasswordInput,
    VCheckbox,
    VButton,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isBtnLoading: false,
      userStore: useUserStore(),
      formData: {
        email: null,
        password: null,
        rememberMe: false,
        isPasswordValid: false,
      },

    };
  },
  validations() {
    return {
      formData: {
        email: {
          required: helpers.withMessage('Email field cannot be empty.', required),
          email: helpers.withMessage('Email field is not a valid email address.', email),
        },
        password: {
          required: helpers.withMessage('Password field cannot be empty.', required),
        },
        isPasswordValid: {
          required: helpers.withMessage('Password field doesn\'t meet required complexity.', required),
        },
      },
    };
  },
  // async created() {
  //   this.checkAuthMethod();
  // },
  methods: {
    async login() {
      try {
        this.isBtnLoading = true;
        const isValid = await this.v$.$validate();

        if (!isValid) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isBtnLoading = false;
          return;
        }

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/login`,
          data: this.formData,
        });

        if (response.data.status === 'error') {
          useNotifyStore().add(response.data.status, response.data.message);
          this.isBtnLoading = false;
          return;
        }

        this.userStore.loadData();
        this.$router.push({ path: '/' });
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.data.message || 'Error loading data!');
      }

      this.isBtnLoading = false;
    },
    async checkAuthMethod() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/login/method`,
          data: this.formData,
        });

        if (!response.data.data)
          window.location.href = `${this.backendUrl}/login`;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="text-holder">
      <h1>Login to <br>Status-Pulse</h1>
      <p>Please enter your details.</p>
      <p>
        Don't have an account?
        <VButton
          :is-loading="isBtnLoading"
          :is-full-width="true"
          type="link-important"
          :link-to="{ path: 'register' }"
        >
          Signup
        </VButton>
      </p>
    </div>
    <div class="form-holder">
      <VTextInput
        v-model:data="formData.email"
        name="email"
        label="Email"
        placeholder="Enter email address"
      />
      <VPasswordInput
        v-model:data="formData.password"
        v-model:is-valid="formData.isPasswordValid"
        name="password"
        label="Password"
        placeholder="Enter password"
      />
      <VCheckbox
        v-model:isChecked="formData.rememberMe"
        name="rememberMe"
        label="Remember me"
      />
      <VButton
        :is-loading="isBtnLoading"
        :is-full-width="true"
        type="fill"
        @on-click="login()"
      >
        Login
      </VButton>
      <VButton
        :is-loading="isBtnLoading"
        :is-full-width="false"
        type="link"
        :link-to="{ path: 'forgotPassword' }"
      >
        Forgot password
      </VButton>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 65%;
  padding: 72px 4%;
  background-color: var(--box-bg);
  border-radius: 16px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.container > div {
  padding: 24px 0;
}

.container > div:first-child {
  padding-right: 12.3%;
}
.container > div:last-child {
  padding-left: 12.3%;
  border-left: solid 1px var(--box-border);
}

.container .form-holder {
  display: flex;
  flex-flow: column;
  gap: 16px;
}

.container .form-holder .btn-holder {
  margin-top: 36px;
}

.container .text-holder {
  display: flex;
  flex-flow: column;
  gap: 16px;
}

.container .text-holder h1 {
  text-wrap: nowrap;
}

.container .text-holder p {
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
}

.container .text-holder p:first-child {
  font-size: 16px;
}
.container .text-holder p:last-child {
  font-size: 14px;
  margin-top: auto;
}
</style>
