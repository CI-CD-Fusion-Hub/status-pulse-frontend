import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSlack } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRightFromBracket,
  faArrowsRotate,
  faAt,
  faBan,
  faBell,
  faBellSlash,
  faBullhorn,
  faChartColumn,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircleExclamation,
  faCircleInfo,
  faCopy,
  faEnvelope,
  faEye,
  faFileCode,
  faFilePen,
  faFilter,
  faFlag,
  faFloppyDisk,
  faGauge,
  faGaugeHigh,
  faGear,
  faGhost,
  faGlobe,
  faHeart,
  faHeartCircleExclamation,
  faHeartCrack,
  faHeartPulse,
  faKey,
  faLock,
  faMagnifyingGlass,
  faMessage,
  faPause,
  faPenToSquare,
  faPeopleGroup,
  faPersonPraying,
  faPhone,
  faPlay,
  faPlus,
  faQuestion,
  faRightToBracket,
  faRocket,
  faShareNodes,
  faShieldHalved,
  faSignal,
  faSitemap,
  faSlash,
  faSpinner,
  faSquare,
  faSquareCheck,
  faStop,
  faTag,
  faTrash,
  faUserGear,
  faUserTag,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/css/index.css';
import axios from './config/axios';
import VNotification from './components/VNotification.vue';
import * as sharedFunctions from './utils/sharedFunctions';

library.add(faPhone);
library.add(faSitemap);
library.add(faShieldHalved);
library.add(faUsers);
library.add(faGear);
library.add(faArrowRightFromBracket);
library.add(faRocket);
library.add(faSpinner);
library.add(faPlus);
library.add(faUserTag);
library.add(faAt);
library.add(faKey);
library.add(faChevronDown);
library.add(faFlag);
library.add(faFloppyDisk);
library.add(faPenToSquare);
library.add(faTrash);
library.add(faEye);
library.add(faCheck);
library.add(faGhost);
library.add(faXmark);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faMagnifyingGlass);
library.add(faSquare);
library.add(faSquareCheck);
library.add(faRightToBracket);
library.add(faPlay);
library.add(faFilter);
library.add(faPause);
library.add(faBan);
library.add(faSlash);
library.add(faArrowsRotate);
library.add(faStop);
library.add(faTag);
library.add(faQuestion);
library.add(faUserGear);
library.add(faPersonPraying);
library.add(faFilePen);
library.add(faSignal);
library.add(faGauge);
library.add(faGaugeHigh);
library.add(faCircleExclamation);
library.add(faCircleInfo);
library.add(faChartColumn);
library.add(faGlobe);
library.add(faFileCode);
library.add(faHeart);
library.add(faHeartCrack);
library.add(faHeartPulse);
library.add(faHeartCircleExclamation);
library.add(faShareNodes);
library.add(faCopy);
library.add(faSlack);
library.add(faBell);
library.add(faMessage);
library.add(faEnvelope);
library.add(faBellSlash);
library.add(faBullhorn);
library.add(faPeopleGroup);
library.add(faLock);

axios.defaults.withCredentials = true;

const pinia = createPinia();
const app = createApp(App);

app
  .use(router)
  .use(pinia)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('VNotification', VNotification);

app.config.globalProperties.axios = axios;
app.config.globalProperties.unixTimestampToFormattedString = sharedFunctions.unixTimestampToFormattedString;
app.config.globalProperties.formatSeconds = sharedFunctions.formatSeconds;

app.mount('#app');
