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

# Page 分页

## 基础用法

<script setup>
import {ref} from 'vue';
const total = ref(100);
const currentPage = ref(1);
const pageSize = ref(10);
</script>
<div class="example">
    <d-page
    style="justify-content: left;"
    :total="total"
    v-model:pageSize="pageSize"
    v-model="currentPage"
  ></d-page>
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-page
    style="justify-content: left;"
    :total="total"
    v-model:pageSize="pageSize"
    v-model="currentPage"
  ></d-page>
  </div>
</template>

<script setup>
import { ref } from "vue";
const total = ref(100);
const currentPage = ref(1);
const pageSize = ref(10);
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
| modelValue(v-model) | 当前页          | number         | -      |
| total |          页面总数量          | number |   -    |
| pageSize                |      页面尺寸             |        number                |   -    |
| isShowTotal                |      是否显示总数             |        boolean                |   -    |




## 事件

| 事件名称     |        说明        |    回调函数     |
| ------------ | :----------------: | :-------------: |
| pageSizeChange | 页面尺寸触发 | function(value) |
| pageChange | 页面变化触发 | function(value) |
