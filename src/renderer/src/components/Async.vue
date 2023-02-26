<template>
  <div :class="overlay && loading ? 'relative' : null">
    <div :class="overlay && loading ? '_overlay' : null">
      <ProgressCircular v-if="isLoading" v-bind="$attrs" />
    </div>
    <slot v-if="shoudShowContent" :res="res"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import ProgressCircular from './ProgressCircular.vue';

const props = defineProps<{
  fn?: () => void;
  loading?: boolean;
  inline?: boolean;
  remainContent?: boolean;
  overlay?: boolean;
}>();

const emit = defineEmits(['load']);
const loadComplete = ref<boolean>(false);
const res = ref<any>(null);
const isLoading = computed<boolean>(() => props.loading || !loadComplete.value);
const shoudShowContent = computed<boolean>(
  () => !isLoading.value || !!props.remainContent || !!props.overlay
);
onMounted(async () => {
  if (props.fn) {
    res.value = await props.fn();
  }
  loadComplete.value = true;
  nextTick(() => {
    emit('load');
  });
});
</script>

<style>
._overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
