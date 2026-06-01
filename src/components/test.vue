<template>
  <div>
    <h3>组件测试</h3>

    <d-button type="primary">你好</d-button>

    <d-button type="success">你好</d-button>

    <d-image-view-big :imgList="imgList" />
  </div>
</template>

<script setup>
import { ref } from "vue";
const imgList = ref([
  "https://picsum.photos/400/225?random=1",
  "https://picsum.photos/400/225?random=3",
]);
</script>

<style lang="scss" scoped></style>
