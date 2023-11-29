<script>
import { useVuelidate } from '@vuelidate/core';
import VButtonSet from '../../components/VButtonSet.vue';
import VButton from '../../components/VButton.vue';
import VTag from '../../components/VTag.vue';
import { useUserStore } from '../../stores/user';

export default {
  components: {
    VButton,
    VButtonSet,
    VTag,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isBtnLoading: false,
      endpoint: [],
      userStore: useUserStore(),
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/endpoints/${this.$route.params.endpoint_id}`,
        });

        this.endpoint = response.data.data;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }

      this.isLoading = false;
    },
  },
};
</script>

<template>
  <div class="endpoint_overview">
    <header>
      <div>
        <h1><font-awesome-icon :icon="['fas', 'circle-info']" /> Monitor Details</h1>
        <p>Here's more details for this monitor.</p>
      </div>
      <VButtonSet>
        <VButton :icon="['fas', 'pen-to-square']" tooltip-text="Edit" />
        <VButton
          :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
          @on-click="deleteData(row.id)"
        />
      </VButtonSet>
    </header>
    <ul>
      <li>
        <h3>Monitor Name</h3>
        <div>{{ endpoint.name }}</div>
      </li>
      <li>
        <h3>Monitor Type</h3>
        <div><VTag type="Admin" :value="endpoint.type" /></div>
      </li>
      <li>
        <h3>Monitor Description</h3>
        <div>{{ endpoint.description }}</div>
      </li>
      <li>
        <h3>Monitor URL</h3>
        <div>{{ endpoint.url }}</div>
      </li>
      <li>
        <h3>Monitor Threshold</h3>
        <div>{{ endpoint.threshold }}</div>
      </li>
      <li>
        <h3>Monitor Cron</h3>
        <div>{{ endpoint.cron }}</div>
      </li>
      <li>
        <h3>Monitor Status Code</h3>
        <div>{{ endpoint.status_code }}</div>
      </li>
      <li>
        <h3>Monitor Current Status</h3>
        <div><VTag :type="endpoint.status" :value="endpoint.status" /></div>
      </li>
    </ul>
  </div>
</template>

<style>
.endpoint_overview {
  background-color: white;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
}

.endpoint_overview header,
.endpoint_overview ul {
  padding: 20px;
}

.endpoint_overview header {
  border-bottom: solid 1px var(--main-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.endpoint_overview ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.endpoint_overview ul li {
  grid-template-columns: repeat(2, 1fr);
}

.endpoint_overview ul li div {
  font-size: 14px;
  margin-top: 3px;
}
</style>
