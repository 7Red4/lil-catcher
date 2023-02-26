import { createApp } from 'vue';
import App from './App.vue';
import SvgIcon from '@jamescoyle/vue-icon';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

import './assets/css/main.scss';

import injections from './injections';

const vuetify = createVuetify({
  ssr: true,
  theme: {
    defaultTheme: 'dark'
  },
  components,
  directives,
  defaults: {
    VTextField: {
      variant: 'outlined',
      density: 'compact'
    },
    VBtn: {
      density: 'default'
    }
  }
});

const app = createApp(App);

injections(app);
app.use(vuetify);
app.use(autoAnimatePlugin);
app.component('SvgIcon', SvgIcon);
app.mount('#app');
