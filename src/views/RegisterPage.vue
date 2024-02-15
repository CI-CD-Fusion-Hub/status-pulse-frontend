<script>
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import VTextInput from '../components/Form/VTextInput.vue';
import VPasswordInput from '../components/Form/VPasswordInput.vue';
import VButton from '../components/VButton.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {
    VTextInput,
    VPasswordInput,
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
        name: null,
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
        name: {
          required: helpers.withMessage('Name field cannot be empty.', required),
        },
      },
    };
  },
  methods: {
    async register() {
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
          url: `${this.backendUrl}/register`,
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
  },
};
</script>

<template>
  <div class="container">
    <div class="text-holder">
      <h1>Register to <br>Status-Pulse</h1>
      <p>Start monitoring in minutes.</p>
      <p>
        Already have a account?
        <VButton
          :is-loading="isBtnLoading"
          :is-full-width="true"
          type="link-important"
          :link-to="{ path: 'login' }"
        >
          Login
        </VButton>
      </p>
    </div>
    <div class="form-holder">
      <VTextInput
        v-model:data="formData.email"
        name="name"
        label="Name"
        placeholder="Enter name"
      />
      <VTextInput
        v-model:data="formData.email"
        name="email"
        label="Email"
        placeholder="Enter email address"
      />
      <VPasswordInput
        v-model:data="formData.password"
        v-model:is-valid="formData.isPasswordValid"
        :check-length="true"
        :check-lowercase="true"
        :check-number="true"
        :check-special-chars="true"
        :check-uppercase="true"
        name="password"
        label="Password"
        placeholder="Enter password"
      />
      <VButton
        :is-loading="isBtnLoading"
        :is-full-width="true"
        type="fill"
        @on-click="login()"
      >
        Register
      </VButton>
      <p>
        By signing up, you agree to the
        <VButton
          :is-loading="isBtnLoading"
          :is-full-width="false"
          type="link"
          @on-click="login()"
        >
          Terms of Service
        </VButton> and <VButton
          :is-loading="isBtnLoading"
          :is-full-width="false"
          type="link"
          @on-click="login()"
        >
          Privacy Policy
        </VButton>.
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 65%;
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

.container .form-holder > .btn-holder {
  margin: 36px 0;
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
  line-height: 14px;
}

.container .text-holder p:first-child {
  font-size: 16px;
}
.container .text-holder p:last-child {
  font-size: 14px;
  margin-top: auto;
}
</style>
