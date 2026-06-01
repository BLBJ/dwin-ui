<style>
    .example{
        border: 1px solid #f5f5f5;
        border-radius: 5px;
        padding:20px
    }
    details > summary:first-of-type {
        font-size: 10px;
        padding: 8px 0;
        cursor: pointer;
         color: #1989fa;
    }
    .item{
        display:flex;
        align-items:center;
    }
    .item > span:nth-child(1){
            display:inline-block;
            width:100px;
        }
</style>

# ImageViewBig 查看器

## 基础用法

<script setup>
import {ref} from 'vue';
const imgList = ref([
'https://picsum.photos/400/225?random=1',
'https://picsum.photos/400/225?random=3',
])
</script>
<div class="example">
    <d-image-view-big :imgList="imgList" />
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <div class="item">
      <d-image-view-big :imgList="imgList" />
  </div>
</template>

<script setup>
import { ref } from "vue";
const imgList = ref([
'https://www.d-ai.com.cn/images/news_img_newyear_def.png?id=mrgpkb0xo9',
'https://www.d-ai.com.cn/images/news_img_lutiancaikuangjishu_def.png?id=82cpvyj5m6',
])
</script>
<style>
.item {
  display: flex;
  align-items: center;
}
.item > span:nth-child(1) {
  display: inline-block;
  width: 100px;
}
</style>
```

</details>

# API

## props

| 参数                |                 说明                 |                类型                 | 默认值 |
| ------------------- | :----------------------------------: | :---------------------------------: | :----: | 
| imgList                |     图片数组             |                Array                |   -    |



