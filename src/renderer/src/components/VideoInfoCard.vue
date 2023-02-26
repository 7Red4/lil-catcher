<template>
  <v-card v-if="videoDetails" class="video_info_card mb-10">
    <v-row align="center" class="px-3">
      <v-col cols="4">
        <v-img :src="videoDetails?.thumbnail" class="fill-height" />
      </v-col>

      <v-col cols="8">
        <v-card-title>
          {{ videoDetails?.title?.slice(0, 40) }}
          {{ videoDetails?.title?.length > 40 ? '...' : '' }}
        </v-card-title>
        <v-card-text>
          {{ videoDetails?.description?.slice(0, 120) }}
          {{ videoDetails?.description?.length > 120 ? '...' : '' }}
        </v-card-text>
        <v-card-text class="d-flex">
          時間長度 : {{ length }}
          <v-spacer></v-spacer>
        </v-card-text>
      </v-col>
    </v-row>

    <v-snackbar v-model="snack" dark @input="(v) => !v && (snackMsg = '')">
      <div class="d-flex align-center">
        {{ snackMsg }}
        <v-spacer></v-spacer>
        <v-btn text icon color="error" @click="snack = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-snackbar>

    <v-fade-transition>
      <div v-if="loading" class="loading_layout">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </v-fade-transition>
  </v-card>
  <v-alert v-else density="compact" color="error" border="start">無法產生詳細資訊 🥹</v-alert>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { VideoDetails } from '../../../type';

const props = defineProps<{
  videoDetails?: VideoDetails;
}>();

console.log(props.videoDetails);

const loading = ref(false);

const snackMsg = ref('');
const snack = ref(false);

const length = computed(() => {
  if (!props.videoDetails) return '00:00:00';
  if (props.videoDetails.is_live) return '直播中';
  try {
    return new Date(props?.videoDetails?.duration * 1000)?.toISOString()?.substr(11, 8);
  } catch (error) {
    return '-';
  }
});
</script>

<style scoped lang="scss"></style>
