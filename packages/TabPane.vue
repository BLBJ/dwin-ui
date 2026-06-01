<template>
  <div v-show="active">
    <slot></slot>
  </div>
</template>

<script setup>
import { reactive, toRefs, inject, ref, computed,onMounted, onUnmounted } from 'vue';

const props = defineProps({
  label: {
    type: String,
  },
  value: {
    type: [String, Number],
  }
});
const {label, value} = toRefs(props);
const tabs = inject('tabs');
const pane = reactive({
  label,
  value
})

const active = computed(() => {
  return tabs?.currentName.value === value.value;
})
onMounted(() => {
  tabs?.addPane(pane)
})

onUnmounted(() => {
  tabs?.removePane(pane)
})

</script>