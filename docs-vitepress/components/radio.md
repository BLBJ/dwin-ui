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

# Radio 单选

## 基础用法

<script setup>
import {ref} from 'vue';
const value = ref(null);
const radioVal1 = ref(1);
</script>
<div class="example">
   <p>默认形式</p>
  <d-radio-group v-model:value="radioVal1">
    <d-radio :value="1">选项1</d-radio>
    <d-radio :value="2">选项2</d-radio>
    <d-radio :value="3">选项3</d-radio>
  </d-radio-group>
     <p>按钮形式</p>
    <span> 选择值： {{ value }}</span>
    <d-radio-group v-model:value="value">
      <d-radio-button :value="1">选项1</d-radio-button>
      <d-radio-button :value="2">选项2</d-radio-button>
      <d-radio-button :value="3">选项3</d-radio-button>
    </d-radio-group>
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <p>默认形式</p>
    <d-radio-group v-model:value="radioVal1">
      <d-radio :value="1">选项1</d-radio>
      <d-radio :value="2">选项2</d-radio>
      <d-radio :value="3">选项3</d-radio>
    </d-radio-group>
    <p>按钮形式</p>
    <span> 选择值： {{ value }}</span>
    <d-radio-group v-model:value="value">
      <d-radio-button :value="1">选项1</d-radio-button>
      <d-radio-button :value="2">选项2</d-radio-button>
      <d-radio-button :value="3">选项3</d-radio-button>
    </d-radio-group>
  </div>
</template>

<script setup>
import { ref } from "vue";
const value = ref(null);
const radioVal1 = ref(1);
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

### Radio/RadioButton

| 参数             |               说明                |                类型                 | 默认值 |
| ---------------- | :-------------------------------: | :---------------------------------: | :----: |
| checked(v-model) |         指定当前是否选中          | string\|string\[]\|number\|number[] |   -    |
| disabled         |               禁用                |               boolean               | false  |
| value            | 根据 value 进行比较，判断是否选中 |           String\|number            |   -    |

### RadioGroup
| 参数             |               说明                |                类型                 | 默认值 |
| ---------------- | :-------------------------------: | :---------------------------------: | :----: |
| value(v-model) |         当前选择项          | string\|string\[]\|number\|number[] |   -    |

## 事件

| 事件名称 |       说明       |    回调函数     |
| -------- | :--------------: | :-------------: |
| change   | 选择项变化时触发 | function(value) |
