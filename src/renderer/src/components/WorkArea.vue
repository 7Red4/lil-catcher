<template>
  <div v-auto-animate>
    <v-form ref="FORM">
      <v-text-field
        ref="EL_INPUT_URL"
        v-model="inputURL"
        label="輸入網址"
        @update:focused="onInputURLFocused"
      />
      <div v-if="!!inputURL">
        <v-row>
          <v-col cols="12">
            <Async :loading="isGettingInfo">
              <VideoInfoCard :video-details="videoInfo" />
            </Async>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex">
            <v-btn color="primary" @click="submit">
              <svg-icon type="mdi" :path="mdiVideoOutline" />
              獲取為 影片
            </v-btn>
            <div class="px-2"></div>
            <v-btn color="secondary">
              <svg-icon type="mdi" :path="mdiFileGifBox" />
              獲取為 gif
            </v-btn>
          </v-col>

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

          <v-col>
            <v-btn color="primary" @click="submit">開始下載</v-btn>
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
import Async from './Async.vue';

// const date = new Date();
enum ETestingURLs {
  youtube = 'https://www.youtube.com/watch?v=yxNfJTxydDA',
  twitter = 'https://twitter.com/013095Yui/status/1638104252357963778'
}

const now = dayjs().format('YYYYMMDD_Hmmss');

const rules = inject(_rules);

const FORM = ref();
const EL_INPUT_URL = ref();

const inputURL = ref('');
const onInputURLFocused = async (isFocused) => {
  if (!isFocused) return;
  const copiedText = await navigator.clipboard.readText();
  if (inputURL.value === copiedText) return;
  analyzeText(copiedText);
};

const analyzeText = (text) => {
  const urlReg =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/;
  const isUrl = urlReg.test(text);

  if (isUrl) {
    inputURL.value = text;
    getInfo(text);
    EL_INPUT_URL.value?.blur();
  }
};

const videoInfo = ref<VideoDetails>();
const isGettingInfo = ref(false);
const getInfo = async (text) => {
  isGettingInfo.value = true;
  videoInfo.value = await window.api.getInfo(text);
  console.log(videoInfo.value);

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

const submit = () => {
  if (!FORM.value.validate()) return;
  console.log('submit');

  // type Payload = {
  //   url: string;
  //   title: string;
  //   vQuallity?: number | 'best';
  //   aQuality?: number | 'best';
  //   fileExtension: string;
  //   path: string;
  // };

  // window.api.startProcess({
  //   processName: 'ytDlp:youtube',
  //   payload: {
  //     url: inputURL.value,
  //     title: fileTitle.value,
  //     vQuallity: 'best',
  //     aQuality: 'best',
  //     fileExtension: 'mp4',
  //     path: filePath.value
  //   }
  // });

  window.api.startProcess({
    processName: 'ytDlp:direct',
    payload: {
      url: inputURL.value,
      title: fileTitle.value,
      path: filePath.value
    }
  });
};

const usingTest = true;
const testingSubject: keyof typeof ETestingURLs = 'youtube';

if (process.env.NODE_ENV === 'development') {
  if (usingTest) {
    inputURL.value = ETestingURLs[testingSubject];
    getInfo(ETestingURLs[testingSubject]);
    filePath.value = 'D:\\.download\\ytdl';
  }
}
</script>

<style scoped></style>
