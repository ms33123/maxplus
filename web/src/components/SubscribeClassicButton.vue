<script setup lang="ts">
const props = defineProps<{
  label: string;
  open: boolean;
  controlsId: string;
}>();

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const handleClick = () => {
  if (props.open) {
    emit("close");
    return;
  }

  emit("open");
};
</script>

<template>
  <button
    type="button"
    class="subscribe-widget__toggle"
    :aria-controls="controlsId"
    :aria-expanded="open"
    :aria-label="open ? 'Close subscribe dialog' : label"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>
