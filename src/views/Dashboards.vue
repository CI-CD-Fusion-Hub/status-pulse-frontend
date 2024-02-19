<script>
import { useVuelidate } from '@vuelidate/core';
import VEmptyState from '../components/VEmptyState.vue';
import VButton from '../components/VButton.vue';
import VBadge from '../components/VBadge.vue';
import VLoader from '../components/VLoader.vue';
import VTextInput from '../components/Form/VTextInput.vue';

export default {
  components: {
    VEmptyState,
    VButton,
    VBadge,
    VTextInput,
    VLoader,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      data: [],
      search: '',
      isLoading: true,
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/dashboards`,
        });

        this.data = response.data.data;
        this.isLoading = false;
      }
      catch (error) {
        console.log('Unable to get authentication method.');
      }
    },
  },
};
</script>

<template>
  <VLoader v-if="isLoading" />
  <template v-else>
    <VEmptyState v-if="data.length === 0" heading="No Dashboards" />
    <template v-else>
      <header>
        <h4>Dashboard</h4>
        <div>
          <VTextInput
            v-model:data="search"
            name="search"
            placeholder="Search..."
          />
          <VButton type="fill">
            Add New
          </VButton>
        </div>
      </header>
      <ul class="dashboards-holder">
        <li v-for="item in data" :key="item" class="dashboard">
          <h5>{{ item.name }}</h5>
          <p>{{ item.description }}</p>
          <div class="connected-endpoints">
            <h6>Connected ( {{ item.endpoints.length }} ) Endpoints</h6>
            <ul>
              <li v-for="endpoint in item.endpoints" :key="endpoint">
                <VBadge type="status" :color="endpoint.status">
                  {{ endpoint.status }}
                </VBadge>
                <span>{{ endpoint.url }}</span>
              </li>
              <li v-if="item.endpoints.length === 0" class="empty-endpoint">
                <i class="bx bxs-ghost" />
                <span>No Endpoints</span>
              </li>
            </ul>
          </div>
          <div v-if="item.scope === 'Private'" class="scope">
            <i class="bx bxs-lock-alt" />Only people who have access can view this dashboard
          </div>
          <div v-else class="scope">
            <i class="bx bx-globe" />Anyone on the internet with the link can view this dashboard
          </div>
        </li>
      </ul>
    </template>
  </template>
</template>

<style scoped>
header {
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header > div {
    display: flex;
    gap: 24px;
}

.dashboards-holder {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90%, 1fr));
    gap: 20px;
}

@media only screen and (min-width: 768px) {
    .dashboards-holder {
        grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
    }
}
@media only screen and (min-width: 1280px) {
    .dashboards-holder {
        grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
    }
}

.dashboards-holder .btn-holder {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    border-radius: 50%;
    color: red;
}

.dashboards-holder .btn-holder button {
    color: red;
}
.dashboard {
    padding: 40px;
    background-color: var(--box-bg);
    border-radius: var(--box-radius);
    box-sizing: border-box;
    grid-template: 1fr;
    display: flex;
    flex-flow: column;
}

.dashboard h5 {
    margin-bottom: 8px;
}

.dashboard p {
    margin-bottom: 36px;
}

.connected-endpoints {
    margin-top: auto;
}

.connected-endpoints ul {
    padding: 14px 16px;
    border-top: solid 1px var(--box-border);
    border-bottom: solid 1px var(--box-border);
    margin-bottom: 32px;
    margin-top: 24px;
}

.connected-endpoints li {
    display: flex;
    align-items: center;
    gap: 40px;
    color: white;
    position: relative;
}

.connected-endpoints li.empty-endpoint {
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0em;
    justify-content: center;
    gap: 8px;
    color: var(--bod)
}

.connected-endpoints li:not(:first-child) {
    display: none;
}

.connected-endpoints li span:last-child{
    text-overflow: ellipsis;
    overflow: hidden;
}

.scope {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.scope i {
    font-size: 20px;
}

.scope i.bxs-lock-alt {
    color: white;
}
</style>
