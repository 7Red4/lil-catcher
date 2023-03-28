<template>
  <div v-auto-animate>
    <v-form ref="FORM">
      <v-text-field
        ref="EL_INPUT_URL"
        v-model="tempInputURL"
        label="輸入網址"
        :rules="[(v) => isURL(v) || '請輸入有效網址']"
        @update:focused="onInputURLFocused"
      >
        <template #append-inner>
          <v-btn size="small" color="primary" @click="analyzeText(tempInputURL)">
            獲取網址資訊
          </v-btn>
        </template>
      </v-text-field>
      <div class="py-2" />

      <div v-if="!!inputURL">
        <v-row>
          <v-col cols="12">
            <Async :loading="isGettingInfo">
              <VideoInfoCard :video-details="videoInfo" />
            </Async>
          </v-col>
        </v-row>
        <v-row v-if="isDownloadable">
          <v-col cols="12">
            <v-text-field v-model="fileTitle" label="儲存標題" :rules="[rules?.required as any]" />
            <v-text-field
              v-model="filePath"
              label="儲存路徑"
              readonly
              :rules="[rules?.required as any]"
            >
              <template #append>
                <v-btn icon size="x-small" color="primary" @click="pickPath">
                  <svg-icon type="mdi" :path="mdiDotsVertical" />
                </v-btn>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" class="d-flex">
            <v-btn color="primary" @click="isVideoOptionExpanded = true">
              <svg-icon type="mdi" :path="mdiVideoOutline" />
              獲取為 影片
            </v-btn>
            <div class="px-2"></div>
            <v-btn color="secondary" @click="isGifOptionExpanded = true">
              <svg-icon type="mdi" :path="mdiFileGifBox" />
              獲取為 gif
            </v-btn>
          </v-col>

          <v-col v-if="isVideoOptionExpanded" cols="12">
            <VideoDownloadOptions @download="(opts) => submit('vid', opts)" />
          </v-col>

          <v-col v-if="isGifOptionExpanded" cols="12">
            <GifDownloadOptions @download="(opts) => submit('gif', opts)" />
          </v-col>
        </v-row>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { mdiVideoOutline, mdiFileGifBox, mdiDotsVertical } from '@mdi/js';
import { VideoDetails } from '../../../type';
import { _rules } from '../injections';
import { ref, inject } from 'vue';
import dayjs from 'dayjs';
import VideoInfoCard from './VideoInfoCard.vue';
import VideoDownloadOptions from './VideoDownloadOptions.vue';
import GifDownloadOptions from './GifDownloadOptions.vue';
import Async from './Async.vue';
import { watch } from 'vue';

// const date = new Date();
enum ETestingURLs {
  youtube = 'https://www.youtube.com/watch?v=TkHB9ZZSDq4',
  twitter = 'https://twitter.com/013095Yui/status/1638104252357963778'
}

const isURL: (url: string) => boolean = (url) => {
  const urlReg =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/;
  return urlReg.test(url);
};

const isYoutubeURL: (url: string) => boolean = (url) => {
  return /youtube|youtu.be/.test(url);
};

const now = dayjs().format('YYYYMMDD_Hmmss');

const rules = inject(_rules);

const FORM = ref();
const EL_INPUT_URL = ref();
const isDownloadable = ref(false);

const inputURL = ref('');
const tempInputURL = ref('');

const isVideoOptionExpanded = ref(false);
const isGifOptionExpanded = ref(false);
watch(
  () => isVideoOptionExpanded.value,
  (isExpanded) => {
    if (isExpanded) {
      isGifOptionExpanded.value = false;
    }
  }
);
watch(
  () => isGifOptionExpanded.value,
  (isExpanded) => {
    if (isExpanded) {
      isVideoOptionExpanded.value = false;
    }
  }
);

const onInputURLFocused = async (isFocused) => {
  if (!isFocused) return;
  const copiedText = await navigator.clipboard.readText();
  if (tempInputURL.value === copiedText || !isURL(copiedText)) return;
  tempInputURL.value = copiedText;
  analyzeText(copiedText);
};

const analyzeText = (text) => {
  if (!FORM.value.validate()) return;
  tempInputURL.value = text;
  getInfo(text);
  EL_INPUT_URL.value?.blur();
};

const videoInfo = ref<VideoDetails>();
const isGettingInfo = ref(false);
watch(
  () => isGettingInfo.value,
  (v) => {
    if (v) {
      isDownloadable.value = false;
    }
  }
);
const getInfo = async (text) => {
  isGettingInfo.value = true;
  videoInfo.value = await window.api.getInfo(text);

  inputURL.value = tempInputURL.value;

  if (videoInfo.value) {
    isDownloadable.value = true;
  }

  isGettingInfo.value = false;
};

const fileTitle = ref('' || now);
const filePath = ref('');

const pickPath = async () => {
  const { filePaths } = await window.api.callPathPicker();

  if (filePaths.length) {
    filePath.value = filePaths[0];
  }
};

const submit = (type: 'vid' | 'gif' = 'vid', opts = {}) => {
  if (!FORM.value.validate()) return;
  let processName = '';
  let payload = {};

  const isYT = isYoutubeURL(inputURL.value);

  if (isYT) {
    processName = 'ytDlp:youtube';
    payload = {
      type,
      url: inputURL.value,
      title: fileTitle.value,
      path: filePath.value,
      ...opts, // should include properties below
      vQuallity: 'best',
      aQuality: 'best',
      fileExtension: 'mp4'
    };
  } else {
    processName = 'ytDlp:direct';
    payload = {
      type,
      url: inputURL.value,
      title: fileTitle.value,
      path: filePath.value,
      ...opts, // should include properties below
      width: 480
    };
  }

  if (processName) {
    window.api.startProcess({
      processName,
      payload
    });

    cleanUp();
  }
};

const cleanUp = () => {
  tempInputURL.value = '';
  inputURL.value = '';
  fileTitle.value = now;
  filePath.value = '';
  videoInfo.value = undefined;
};

const usingTest = true;
const testingSubject: keyof typeof ETestingURLs = 'twitter';

if (process.env.NODE_ENV === 'development') {
  if (usingTest) {
    tempInputURL.value = ETestingURLs[testingSubject];
    inputURL.value = ETestingURLs[testingSubject];
    getInfo(ETestingURLs[testingSubject]);
    filePath.value = 'D:\\.download\\ytdl';
  }
}
</script>

<style scoped></style>
