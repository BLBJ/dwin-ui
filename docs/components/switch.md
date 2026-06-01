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

# Switch 开关

## 基础用法

<script setup>
import {ref} from 'vue';
const value1 = ref(false);
const value2 = ref(true);
const value3 = ref(["开启", "关闭"]);
</script>
<div class="example">
    <div>
        <br/>
        <d-switch
            :value="value1"
        ></d-switch>
         <br/> <br/>
         <d-switch
            :value="value2"
            :text="value3"
        ></d-switch>
    </div>
    <br/>
</div>
<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-switch :value="value1"></d-switch>
    <br />
    <br />
    <d-switch :value="value2" :text="value3"></d-switch>
  </div>
</template>

<script setup>
import { ref } from "vue";
const value1 = ref(false);
const value2 = ref(true);
const value3 = ref(["开启", "关闭"]);
</script>
```

</details>

# API

## props

| 参数  | 说明                | 类型    | 默认值           |
| ----- | :------------------ | :------ | :--------------- |
| value | 指定当前是否选中    | Boolean | false            |
| text  | 选中内容/非选中内容 | Array   | ["启用", "禁用"] |

## 事件

| 事件名称 |        说明        |    回调函数     |
| -------- | :----------------: | :-------------: |
| change   | 开关变化时回调函数 | function(value) |
