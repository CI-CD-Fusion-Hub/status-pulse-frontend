<script>
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import VCodeVerify from '../components/Form/VCodeVerify.vue';
import VButton from '../components/VButton.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {
    VCodeVerify,
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
        data: null,
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
      },
    };
  },
  methods: {
    async resetPassword() {
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
          url: `${this.backendUrl}/forgot_password`,
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
      <h1>Code verification</h1>
      <p>We have sent an verification code to your email exa****@mail.com. Enter the code below.</p>
    </div>
    <div class="form-holder">
      <VCodeVerify
        v-model:data="formData.email"
        name="code"
        :length="6"
        label="-"
        placeholder="-"
      />
      <VButton
        :is-loading="isBtnLoading"
        :is-full-width="true"
        type="fill"
        @on-click="resetPassword()"
      >
        Send
      </VButton>
      <p>
        Didn’t receive code? <VButton
          :is-loading="isBtnLoading"
          :is-full-width="false"
          type="link-important"
          :link-to="{ path: 'login' }"
          @on-click="login()"
        >
          Resend
        </VButton>
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

.container .text-holder p {
  font-size: 18px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 0em;
}
</style>
