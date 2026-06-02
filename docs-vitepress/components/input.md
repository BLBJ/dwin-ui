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

# Input 输入框

## 基础用法

<script setup>
import {ref} from 'vue';
const value = ref(null);
const value1 = ref(null);
const value2 = ref(null);
</script>
<div class="example">
    <div>
        <d-input :width='300'  v-model='value' placeholder='请输入内容'></d-input>
        <br/><br/>
        <d-input :width='300' v-model='value1' disabled  placeholder='请输入内容'></d-input>
         <br/><br/>
        <d-input :width='300' :isAddIcon="true" icon="search" v-model='value2'   placeholder='请输入内容'></d-input>
    </div>
    <br/>
</div>

<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-input
      :width="300"
      :data="list"
      v-model="value"
      placeholder="请输入内容"
    ></d-input>
    <br /><br />
    <d-input
      :width="300"
      :data="list"
      v-model="value"
      disabled
      placeholder="请输入内容"
    ></d-input>
    <br /><br />
    <d-input
      :width="300"
      :isAddIcon="true"
      icon="search"
      :data="list"
      v-model="value"
      placeholder="请输入内容"
    ></d-input>
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

| 参数                | 说明                        | 类型           | 默认值 |
| ------------------- | :-------------------------- | :------------- | :----- |
| modelValue(v-model) | 指定当前选中的条目          | string         | -      |
| isAddIcon           | 是否增加图标                | boolean        | false  |
| icon                | 图标,isAddIcon 为 true 有用 | string         |        |
| placeholder         | 默认提示语                  | string         | 请选择 |
| width               | 宽度                        | string\|number | -      |
| disabled            | 是否禁用                    | boolean        | false  |
| error               | 错误                        | string         |        |
| maxlength           | 输入的最大长度              | string、number |        |

## 事件

| 事件名称  |       说明       |    回调函数     |
| --------- | :--------------: | :-------------: |
| input     | 输入值变化时触发 | function(value) |
| iconClick |   图标点击触发   |    function     |
