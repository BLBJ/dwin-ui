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

#  PickTimer 日期选择框

## 基础用法

<script setup>
import {ref} from 'vue';
const value = ref();
const value1 = ref('');
const value2 = ref();
</script>
<div class="example">
    <div>
        <d-date-picker type="text" picker="month" v-model="value" format="YYYY-MM" :width="420" placeholder="请选择月份"></d-date-picker>
        <br /><br />
        <d-date-picker type="text" v-model="value1" format="YYYY-MM" :width="420" placeholder="请选择日期"></d-date-picker>
        <br/><br/>
        <d-date-picker type="text" v-model="value2" :showTime="true" :width="420" placeholder="请选择日期"></d-date-picker>
    </div>
    <br/>
</div>
<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-date-picker 
        type="text" 
        picker="month" 
        v-model="value" 
        format="YYYY-MM" 
        :width="420" 
        placeholder="请选择月份"
    ></d-date-picker>
    <br /><br />
    <d-date-picker 
        type="text" 
        width="420" 
        v-model="value1"
        placeholder="请选择日期"
    ></d-date-picker> 
    <br /><br />
    <d-date-picker 
        type="text" 
        v-model="value2" 
        :showTime="true" 
        :width="420" 
        placeholder="请选择日期"
    ></d-date-picker>
    <br /><br />
  </div>
</template>

<script setup>
import { ref } from "vue";
const value = ref();
const value1 = ref('');
const value2 = ref();
</script>
```

</details>

# API

## props

| 参数                | 说明                        | 类型           | 默认值 |
| ------------------- | :-------------------------- | :------------- | :----- |
| modelValue(v-model) | 指定设置时间                | string         | -      |
| picker              | 指定月/日 (month/date)      | string         |  -
| format              | 设置日期格式                | string         |   YYYY-MM-DD     |
| width               | 宽度                        | string\|number | -      |
| placeholder         | 默认提示语                  |       string   | 请选择 |
| showTime            | 显示时分秒                  | Boolean        |  false |
| disabledDate        | 禁止选择日期                | Function       | -       |
| disabledTime        | 禁止选择时间                | Function       |  -      |

## 事件

| 事件名称  |       说明       |    回调函数     |
| --------- | :--------------: | :-------------: |
| date-change     | 待选日期发生变化的回调 | function(value) |
