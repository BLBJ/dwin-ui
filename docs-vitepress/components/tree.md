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

# Tree 树形组件

## 基础用法


<script setup>
import {ref} from 'vue';
const as = ref([150]);

const treeData1 = [
  {
    value: 150,
    title: "首页",
    menuType: 1,
    children: [],
  },
  {
    value: 151,
    title: "菜单一",
    menuType: 0,
    children: [
      {
      children: [],
      menuType: 1,
      title: "子菜单一",
      value: 78,
      },
      {
      children:[],
      menuType:1,
      title:"子菜单二",
      value:144,
      }
    ]
  }
];
const treeData2 = [
  {
    value: 150,
    title: "首页",
    menuType: 1,
    selected: true,
    isCheck: true,
    children: [],
  },
  {
    value: 151,
    title: "菜单一",
    selected: true,
    isCheck: true,
    menuType: 0,
    children: [
      {
      children: [],
      menuType: 1,
      selected: true,
      isCheck: true,
      title: "子菜单一",
      value: 78,
      },
      {
      children:[],
      isCheck:true,
      menuType:1,
      selected:true,
      title:"子菜单二",
      value:144,
      }
    ]
  }
];
</script>
<div class="example">
<div>
        <d-tree 
        :isDeafultOpen="true"
        :treeData="treeData1"
        labelKey="title"
        valueKey="value"
        ></d-tree>
         <br/>多选<br/>
        <d-tree 
        :checkable="true" 
        :isDeafultOpen="false"
        :treeData="treeData2"
        labelKey="title"
        valueKey="value"
        v-model:checkedKeys="as"
        :isDisableSelect="true"></d-tree>
    </div>
    
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-tree 
        :isDeafultOpen="false"
        :treeData="treeData1"
        labelKey="title"
        valueKey="value"
        ></d-tree>
         <br/>多选<br/>
        <d-tree 
        :checkable="true" 
        :isDeafultOpen="false"
        :treeData="treeData2"
        labelKey="title"
        valueKey="value"
        v-model:checkedKeys="as"
        :isDisableSelect="true"></d-tree>
  </div>
</template>

<script setup>
import { ref } from "vue";
const as = ref([150]);

const treeData1 = [
  {
    value: 150,
    title: "首页",
    menuType: 1,
    children: [],
  },
  {
    value: 151,
    title: "调度监控",
    menuType: 0,
    children: [
      {
      children: [],
      menuType: 1,
      title: "综合监控大屏",
      value: 78,
      },
      {
      children:[],
      menuType:1,
      title:"调度地图监控",
      value:144,
      }
    ]
  }
];
const treeData2 = [
  {
    value: 150,
    title: "首页",
    menuType: 1,
    selected: true,
    isCheck: true,
    children: [],
  },
  {
    value: 151,
    title: "调度监控",
    selected: true,
    isCheck: true,
    menuType: 0,
    children: [
      {
      children: [],
      menuType: 1,
      selected: true,
      isCheck: true,
      title: "综合监控大屏",
      value: 78,
      },
      {
        children:[],
        isCheck:true,
        menuType:1,
        selected:true,
        title:"调度地图监控",
        value:144,
      }
    ]
  }
];
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
| treeData |    树数据         | array |   -    |
| labelKey  |   树label名称    | string  |   -    |
| labelKeyFn  |   树label名称函数    | function  |   -    |
| valueKey  |   绑定选中的字段    | string  |   -    |
| valueKeyFn  |   绑定选中的字段函数    | function  |   -    |
| mode  |   模式    | string  |   -    |
| isDeafultOpen  |   是否默认打开    | boolean  |   -    |
| checkable  |    是否展示选择框   |  boolean |   -    |
| checkBottomNodeFn  |   是否行内展示    | () => boolean   |   -    |
| checkedKeys  |   选择框选中的值    | array  |   -    |
| isDisableSelect  |   是否触发label选择事件    | boolean  |   -    |
| expandKeys  |   children子集是否展示关联    | array  |   -    |



## 事件

| 事件名称     |        说明        |    回调函数     |
| ------------ | :----------------: | :-------------: |
| selectChange | label点击事件 | function(value) |

## 插槽

| 插槽名称  |       说明       |    类型     |
| --------- | :--------------: | :-------------: |
| label     | 文本展示 | -- |
| rightMenu |   右键菜单展示   |    --     |