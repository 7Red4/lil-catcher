import { createApp } from 'vue';
import App from './App.vue';
import SvgIcon from '@jamescoyle/vue-icon';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  ssr: true,
  theme: {
    defaultTheme: 'dark'
  },
  components,
  directives,
  defaults: {
    VTextField: {
      variant: 'outlined'
    }
  }
});

const app = createApp(App);
app.use(vuetify);
app.component('SvgIcon', SvgIcon);
app.mount('#app');
