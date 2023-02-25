<template>
  <v-app>
    <v-system-bar color="primary darken-1" class="elevation-0" app>
      <template v-if="!isMac">
        <svg-icon type="mdi" size="16" :path="mdiHome" />
      </template>

      <v-spacer style="height: 100%; -webkit-app-region: drag"></v-spacer>
      <template v-if="!isMac">
        <v-btn variant="text" size="sm" @click="minimizeWindow">
          <svg-icon type="mdi" size="16" :path="mdiMinus" />
        </v-btn>
        <div class="px-2"></div>
        <v-btn variant="text" size="sm" @click="toggleWindow">
          <svg-icon
            type="mdi"
            size="16"
            :path="isMaximized ? mdiCheckboxMultipleBlankOutline : mdiCheckboxBlankOutline"
          />
        </v-btn>
        <div class="px-2"></div>
        <v-btn variant="text" size="sm" @click="closeWindow">
          <svg-icon type="mdi" size="16" :path="mdiClose" />
        </v-btn>
      </template>
    </v-system-bar>

    <v-main class="px-3">
      <v-container class="py-8">
        <WorkArea />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  mdiHome,
  mdiMinus,
  mdiCheckboxMultipleBlankOutline,
  mdiCheckboxBlankOutline,
  mdiClose
} from '@mdi/js';
import WorkArea from './components/WorkArea.vue';

const isMac = ref(false);
const isMaximized = ref(false);

const minimizeWindow = () => {
  window.api.minimizeWindow();
};
const toggleWindow = () => {
  window.api.toggleWindow();
  isMaximized.value = !isMaximized.value;
};
const closeWindow = () => {
  window.api.closeWindow();
};
</script>

<style lang="scss"></style>
