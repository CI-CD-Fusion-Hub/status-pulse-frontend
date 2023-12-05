<script>
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import VTextInput from '../components/Form/VTextInput.vue';
import VButton from '../components/VButton.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {
    VTextInput,
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
  <div class="login_holder">
    <div class="text_holder">
      <div class="logo_holder">
        <img src="/logo2.png" alt="logo">
      </div>
      <h1>Sign in to <br>Status-Pulse</h1>
      <p>Check out our new font generator and level up your social </p>
      <p>Don't have an account? <a href="#" title="sign up">Sign up</a></p>
    </div>
    <div class="login_form">
      <VTextInput
        v-model:data="formData.email"
        name="email"
        placeholder="Enter email address"
      />
      <VTextInput
        v-model:data="formData.password"
        name="password"
        placeholder="Enter password"
        type="password"
      />
      <div class="remember_me">
        <label for="remember_me"><input id="remember_me" type="checkbox" name="remember_me">Remember me</label>
        <div><a href="#" title="Forgot password">Forgot password</a></div>
      </div>
      <VButton
        :is-loading="isBtnLoading"
        @on-click="login()"
      >
        Login
      </VButton>
    </div>
  </div>
</template>

<style>
.login_container .login_holder {
  border-radius: 20px;
  border: 1px solid rgba(103, 103, 103, 0.21);
  padding: 72px 0;
  display: flex;
  justify-content: space-between;
  max-width: 1136px;
  margin: auto;
  background: rgba(153, 153, 153, 0.08);
  position: relative;
}

.login_container .login_holder .input-holder {
  width: 100%;
}

.login_container .login_holder .btn-holder button {
  width: 100%;
  font-family: Sora;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0em;
}

.login_container .login_holder .btn-holder button:hover {
  background-color: white;
  color: var(--main-color)
}

.login_container .login_holder > div {
  padding: 56px 104px;
  width: 50%;
  gap: 1px;
}

.login_container .login_holder > div:last-child {
  border-left: solid 1px rgba(76, 76, 76, 0.35);
  display: flex;
  padding: 56px 104px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
}

.login_container .login_holder .text_holder {
  display: flex;
  flex-flow: column;
  gap: 32px;
}

.login_container .login_holder h1 {
  color: #FFF;
  font-family: Sora;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 56px; /* 116.667% */
  letter-spacing: -2%;
}

.login_container .login_holder p {
  color: rgba(235, 235, 235, 0.75);
  /* font-family: Sora; */
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 140% */
}

.login_container .login_holder p:last-child {
  color: rgba(235, 235, 235, 0.65);
  font-family: Sora;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  margin-top: auto;
}

.login_container .login_holder .remember_me {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.login_container .login_holder .remember_me label {
  display: flex;
  align-content: center;
  gap: 8px;
  margin-bottom: 40px;
  color: rgba(235, 235, 235, 0.75);
}

.login_container .login_holder a {
  color: #DB613A;
  font-family: Sora;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  text-decoration-line: underline;
}

.login_container .login_holder .btn-holder{
  width: 100%;
}

.login_container .login_holder .btn-holder button {
  padding: 16px 0px;
  width: 100%;
  border-radius: 10px;
  background: #B84A05;
  color: #FFF;
  font-family: var(--main-font);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 133.333% */
}

.login_container .login_holder .logo_holder {
  position: absolute;
  top: -60px;
  padding: 20px;
  background-color: black;
  border-radius: 50%;
  width: 80px;
  left: calc(50% - 60px);
  border: 1px solid rgba(103, 103, 103, 0.21);
  background: rgb(19 24 37);
  text-align: center;
}

.login_container .login_holder .logo_holder img {
  height: 80px;
}
</style>
