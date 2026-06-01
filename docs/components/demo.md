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

# Select 选择器

## 基础用法

<script setup>
import {ref} from 'vue';
const list = ref([
    {label:'选项1',value:1},
    {label:'选项2',value:2,disable:true},
    {label:'选项3',value:3},
]);
const value = ref(null);
const multValue = ref([]);
</script>
<div class="example">
    <div class='item'>
        <span>（单选）</span><br/>
        <d-select :width='300' :data="list" v-model='value' placeholder='请选择'></d-select>
    </div>
    <br/>
    <div class='item'>
        <span>（多选）</span><br/>
        <d-select mode='multiple' :width='300' :data="list" v-model='multValue'></d-select>
    </div>
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <div class="item">
      <span>（单选）</span><br />
      <d-select
        :width="300"
        :data="list"
        v-model="value"
        placeholder="请选择"
      ></d-select>
    </div>
    <br />
    <div class="item">
      <span>（多选）</span><br />
      <d-select
        mode="multiple"
        :width="300"
        :data="list"
        v-model="multValue"
      ></d-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const list = ref([
  { label: "选项1", value: 1 },
  { label: "选项2", value: 2 },
  { label: "选项3", value: 3 },
]);
const value = ref(null);
const multvalue = ref(null);
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
| modelValue(v-model) |          指定当前选中的条目          | string\|string\[]\|number\|number[] |   -    |
| data                |             下拉列表数据             |                Array                |   -    |




## 事件

| 事件名称     |        说明        |    回调函数     |
| ------------ | :----------------: | :-------------: |
| change | 下拉选项选中时触发 | function(value) |
