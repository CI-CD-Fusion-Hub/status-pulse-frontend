import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'boxicons/css/boxicons.min.css';
import './assets/css/index.css';
import axios from './config/axios';
import * as sharedFunctions from './utils/sharedFunctions';

axios.defaults.withCredentials = true;

const pinia = createPinia();
const app = createApp(App);

app
  .use(router)
  .use(pinia)

app.config.globalProperties.axios = axios;
app.config.globalProperties.unixTimestampToFormattedString = sharedFunctions.unixTimestampToFormattedString;
app.config.globalProperties.formatSeconds = sharedFunctions.formatSeconds;

app.mount('#app');
