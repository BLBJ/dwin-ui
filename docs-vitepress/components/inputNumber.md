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

# InputNumber 数字输入框

## 基础用法

<script setup>
import {ref} from 'vue';
const value = ref(null);
const value1 = ref(null);
const value2 = ref(null);
</script>
<div class="example">
    <div>
        <d-input-number :width='300' v-model='value1' placeholder='请输入内容'></d-input-number>
        <br/><br/>
         <div> 设置最大值、最小值</div>
        <d-input-number :width='300' v-model='value' :min="6" :max="10" placeholder='请输入内容'></d-input-number>
    </div>
    <br/>
</div>

<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-input-number
      :width="300"
      v-model="value1"
      placeholder="请输入内容"
    ></d-input-number>
    <br /><br />
    <div>设置最大值、最小值</div>
    <d-input-number
      :width="300"
      v-model="value"
      :min="6"
      :max="10"
      placeholder="请输入内容"
    ></d-input-number>
  </div>
</template>

<script setup>
import { ref } from "vue";
const value = ref(null);
</script>
```

</details>

# API

## props

| 参数                | 说明               | 类型           | 默认值 |
| ------------------- | :----------------- | :------------- | :----- |
| modelValue(v-model) | 指定当前选中的条目 | string         | -      |
| placeholder         | 默认提示语         | string         | 请选择 |
| width               | 宽度               | string\|number | -      |
| disabled            | 是否禁用           | boolean        | false  |
| error               | 错误               | string         |        |
| max                 | 最大值             | number         |   Infinity     |
| min                 | 最小值             | number         | 0       |
|integer| 是否取整|boolean | false|
| precision |数值精度，小数点后几位，取整时候此值无效  | number |  |
## 事件

| 事件名称  |       说明       |    回调函数     |
| --------- | :--------------: | :-------------: |
| input     | 输入值变化时触发 | function(value) |
| iconClick |   图标点击触发   |    function     |
