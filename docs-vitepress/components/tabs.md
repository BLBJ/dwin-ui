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

# Tabs 标签页

## 基础用法

<script setup>
import {ref} from 'vue';
const active = ref('a');
</script>
<div class="example">
    <d-tabs  v-model:active="active">
      <d-tab-pane label="苹果" value="a">特使11</d-tab-pane>
      <d-tab-pane label="橘子" value="b">特使12</d-tab-pane>
    </d-tabs>
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-tabs  v-model:active="active">
      <d-tab-pane label="苹果" value="a">特使11</d-tab-pane>
      <d-tab-pane label="橘子" value="b">特使12</d-tab-pane>
    </d-tabs>
  </div>
</template>

<script setup>
import { ref } from "vue";
const active = ref('a');
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
| active(v-model) |          指定当前选中的条目          | string|number |   -    |

## tabPane

| 参数                |                 说明                 |                类型                 | 默认值 |
| ------------------- | :----------------------------------: | :---------------------------------: | :----: | 
| label |          标签页名称          | string |   -    |
| value |          标签页名称          | string\number |   -    |


## 事件

| 事件名称     |        说明        |    回调函数     |
| ------------ | :----------------: | :-------------: |
| tabClick | 选项选中时触发 | function(value) |
