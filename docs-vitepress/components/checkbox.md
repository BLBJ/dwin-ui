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

#  勾选框

## 基础用法

<script setup>
import {ref} from 'vue';
const checked = ref(null);
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];
const checks = ref([])
</script>
<div class="example">
   <p>默认</p>
    <d-checkbox v-model:checked="check">Check</d-checkbox>
 <p>多选: {{ checks }}</p>
     
  <d-checkbox-group v-model:value="checks" :options="options">
  </d-checkbox-group>
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <p>默认</p>
    <d-checkbox v-model:checked="check">Check</d-checkbox>
    <p>多选: {{ checks }}</p>
    <d-checkbox-group
      v-model:value="checks"
      :options="options"
    ></d-checkbox-group>
  </div>
</template>

<script setup>
import { ref } from "vue";
const checked = ref(null);
const options = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange" },
];
const checks = ref([]);
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

### Checkbox

| 参数             |       说明       |                类型                 | 默认值 |
| ---------------- | :--------------: | :---------------------------------: | :----: |
| checked(v-model) | 指定当前是否选中 | string\|string\[]\|number\|number[] |   -    |
| disabled         |       禁用       |               boolean               | false  |

### CheckboxGroup

| 参数           |    说明    |                类型                 | 默认值 |
| -------------- | :--------: | :---------------------------------: | :----: |
| value(v-model) | 当前选择项 | string\|string\[]\|number\|number[] |   -    |
| options        | 选择配置项 |                array                |   -    |

options格式:
```
  [
    {label:'',value:''},
    {label:'',value:''},
    {label:'',value:''},  
  ]
 
 ```  

## 事件

| 事件名称 |       说明       |    回调函数     |
| -------- | :--------------: | :-------------: |
| change   | 选择项变化时触发 | function(value) |
