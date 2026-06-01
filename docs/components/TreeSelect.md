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

#  树选择 TreeSelect

## 基础用法

<script setup>
import {ref} from 'vue';
const formModalList = ref([]);
const data = ref([
      {
        "id": 26,
        "title": "parent 1",
        "level": 1,
        "children": [],
      },
      {
          "id": 29,
          "title": "parent 2",
          "level": 2,
          "children": [
            {
              "id": 27,
              "title": "parent 2-1",
              "level": 2,
              "children": [
                  {
                      "id": 35,
                      "title": "parent 2-1-1",
                      "level": 3,
                      "children": [],
                  },
                  {
                      "id": 36,
                      "title": "parent 2-1-2",
                      "level": 3,
                      "children": [],
                  }
              ]
          }]
      }
]);
</script>
<div class="example">
    <div>
        <br/>
        <d-tree-select
            :width="320"
            :data="data"
            v-model="formModalList"
            placeholder="请选择"
            labelKey="title"
            mode="multiple"
            valueKey="id"
          ></d-tree-select>
    </div>
    <br/>
</div>
<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-tree-select
      :width="320"
      :data="data"
      v-model="formModalList"
      placeholder="请选择"
      labelKey="title"
      mode="multiple"
      valueKey="id"
    ></d-tree-select>
  </div>
</template>
<script setup>
import { ref } from "vue";
const formModalList = ref([]);
const data = ref([
      {
        "id": 26,
        "title": "parent 1",
        "level": 1,
        "children": [],
      },
      {
          "id": 29,
          "title": "parent 2",
          "level": 2,
          "children": [
            {
              "id": 27,
              "title": "parent 2-1",
              "level": 2,
              "children": [
                  {
                      "id": 35,
                      "title": "parent 2-1-1",
                      "level": 3,
                      "children": [],
                  },
                  {
                      "id": 36,
                      "title": "parent 2-1-2",
                      "level": 3,
                      "children": [],
                  }
              ]
          }]
      }
]);
</script>
```

</details>

# API

## props

| 参数                |                 说明                 |                类型                 | 默认值 |
| ------------------- | :----------------------------------: | :---------------------------------: | :----: | 
| modelValue(v-model) |          指定当前选中的条目          | string\|string\[]\|number\|number[] |   -    |
| data                |             下拉列表数据             |                Array                |   -    |
| placeholder         |              默认提示语              |               string                | 请选择 |
| width               |                 宽度                 |           string\|number            |   -    |
| mode                | 模式（单选：single、多选：multiple） |               string                | single |
| disabled            |               是否禁用               |               boolean               | false  |    
| error               |                 错误                 |               string                |        |
| valueKey           |       指定选中值的key       |           string            |     value   |
| labelKey        |            指定展示的key           |               string               | title  |


## 事件

| 事件名称  |       说明       |    回调函数     |
| --------- | :--------------: | :-------------: |
| selectChange    | 滑动进度变化时回调函数 | function(value) |
