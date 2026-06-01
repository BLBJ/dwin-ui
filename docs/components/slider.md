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
    
</style>

#  滑动输入条 Slider

## 基础用法

<script setup>
import {ref} from 'vue';
const value1 = ref(5);
const value2 = ref([1,65]);

</script>
<div class="example">
    <div>
        <br/>
        <d-slider   v-model:value="value1" width="420"></d-slider>
        <br/>
        <d-slider range   v-model:value="value3" width="420"></d-slider>
    </div>
    <br/>
</div>
<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
   <div>
        <br/>
        <d-slider   v-model:value="value1" width="420"></d-slider>
        <br/>
        <d-slider range   v-model:value="value2" width="420"></d-slider>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const value1 = ref(5);
const value2 = ref([1,65]);
</script>
```

</details>

# API

## props

| 参数                | 说明                        | 类型           | 默认值 |
| ------------------- | :-------------------------- | :------------- | :----- |
| range               | 双滑块模式                  | boolean        | false  |
| width               | 宽度                        | string/number  | 300      |
| v-model:value       | 设置当前取值                | number/Array| 50/[30,60]  |
| min                 | 设置最小值                | number/Array|   0|
| max                 | 设置最大值                | number/Array|   100|

## 事件

| 事件名称  |       说明       |    回调函数     |
| --------- | :--------------: | :-------------: |
| change    | 滑动进度变化时回调函数 | function(value) |
