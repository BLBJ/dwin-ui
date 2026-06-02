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

# Table 表格

## 基础用法

<script setup>
import {ref} from 'vue';
const dataList = ref([
  { label: '无人驾驶', value: '0001assc' ,num :11,company: '北京路凯智行科技有限公司' ,id: 1},
  { label: '自动巡航', value: '0001bssc' ,num: 21 ,company: '北京路凯智行科技有限公司' ,id: 2},
  { label: '安全避让', value: '0001cd1s' ,num: 12  ,company: '北京路凯智行科技有限公司',id: 3}
]);
const columns = [
  {
    key: "index",
    title: "序号"
  },
  {
    key: "label",
    title: "名称"
  },
  {
    key: "value",
    title: "编码"
  },
  {
    key: "num",
    title: "数量"
  },
  {
    key: "company",
    title: "公司",
    ellipsis: true,
    format: (v) => (v.length > 10 ? v.slice(0, 10) + "..." : v)
  }
];
const columns1 = [
  { 
    key: "ruleName", 
    rowspan: 2,
    colspan: 1,
    headerIndex: 1,
    rowIndex: 1,
    title: "名称" 
  },
  { 
    key: "shiftType",
    rowspan: 2,
    colspan: 1,
    headerIndex: 1,
     title: "班次类型"
  },
  { 
    key: "ruleDef",
    rowspan: 1,
    colspan: 7,
    headerIndex: 1,
    hasChild: true,
    title: "规则设定"
  },
  {
    key: "shift1Name",
    title: "1",
    headerIndex: 2,
  },
  {
    key: "shift2Name",
    title: "2",
    headerIndex: 2,
  },
  {
    key: "shift3Name",
    title: "3",
    headerIndex: 2,
  },
  {
    key: "shift4Name",
    title: "4",
    headerIndex: 2,
  },
  {
    key: "shift5Name",
    title: "5",
    headerIndex: 2,
  },
  {
    key: "shift6Name",
    title: "6",
    headerIndex: 2,
  },
  {
    key: "shift7Name",
    title: "7",
    headerIndex: 2,
  },
  { 
    key: "operation", 
    rowspan: 2,
    colspan: 1,
    headerIndex: 1,
    title: "操作" 
  },
];
const dataList1 = ref([
  {
    id: 7,
    ruleName: "做五休二法",
    shift1Name: "夜班",
    shift2Name: "白班",
    shift3Name: "中班",
    shift4Name: "白班",
    shift5Name: "休息",
    shift6Name: "夜班",
    shift7Name: "休息",
    shiftType: "测试班次",
 }
])
//表格选择设置
const rowSelection = ref({
  selectedRowKeys: [],
  onChange: (keys, rows) => {
    console.log(keys, rows);
  },
});
const columns2=[
  {
    key: "index",
    title: "序号"
  },
  {
    key: "label",
    title: "名称",
    width:260,
    filters:[{
      text: '无人驾驶',
      value: '1',
    },
    {
      text: '自动巡航',
      value: '2',
    },
    {
      text: '安全避让',
      value: '3',
    }]
  },
  {
    key: "value",
    title: "编码",
    width:160,
    filters:[{
      text: 'Joe',
      value: 'Joe1',
    },
    {
      text: 'Jim',
      value: 'Jim1',
    }]
  },
  {
    key: "num",
    title: "数量"
  },
  {
    key: "company",
    title: "公司",
    ellipsis: true,
    format: (v) => (v.length > 10 ? v.slice(0, 10) + "..." : v)
  }
];
const dataList2 = ref([
  { label: '无人驾驶', value: 'Joe' ,num :11,company: '北京路凯智行科技有限公司',id: 1},
  { label: '自动巡航', value: 'Jim' ,num: 21 ,company: '北京路凯智行科技有限公司' ,id: 2}
]);
const filterChange=(obj)=>{
  console.log('表头筛选监听--',obj);
}
</script>
<div class="example">
    <div>
        <d-table :columns="columns" :data="dataList" />
        <br/><br/>
        <div> 设置多选</div>
        <d-table :columns="columns" :data="dataList" :rowSelection="rowSelection" />
        <div> 表头合并</div>
        <d-table :columns="columns1" :data="dataList1"  :headerLevel="2">
        <template #operation="{ column }">
        <d-button type="text" >编辑</d-button>
        </template>
        </d-table>
        <br/><br/>
        <div> 表头筛选</div>
        <d-table :columns="columns2" :data="dataList2"  @filterChange="filterChange" />
    </div>
    <br/>
</div>

<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-table :columns="columns" :data="dataList">
    <br /><br />
     <div> 设置多选</div>
    <d-table :columns="columns" :data="dataList" :rowSelection="rowSelection" />
    <div> 表头合并</div>
        <d-table :columns="columns1" :data="dataList1"  :headerLevel="2">
        <template #operation="{ column }">
        <d-button type="text" >编辑</d-button>
        </template>
        </d-table>
    <div> 表头筛选</div>
    <d-table :columns="columns2" :data="dataList2"  @filterChange="filterChange" />
  </div>
</template>

<script setup>
import { ref } from "vue";
const dataList = ref([
  { label: '无人驾驶', value: '0001assc' ,num :11,company: '北京路凯智行科技有限公司',id: 1},
  { label: '自动巡航', value: '0001bssc' ,num: 21 ,company: '北京路凯智行科技有限公司' ,id: 2},
  { label: '安全避让', value: '0001cd1s' ,num: 12  ,company: '北京路凯智行科技有限公司',id: 3}
]);
const columns = [
  {
    key: "index",
    title: "序号"
  },
  {
    key: "label",
    title: "名称"
  },
  {
    key: "value",
    title: "编码"
  },
  {
    key: "num",
    title: "数量"
  },
  {
    key: "company",
    title: "公司",
    ellipsis: true,
    format: (v) => (v.length > 10 ? v.slice(0, 10) + "..." : v)
  }
];
const columns1 = [
  { 
    key: "ruleName", 
    rowspan: 2,
    colspan: 1,
    headerIndex: 1,
    rowIndex: 1,
    title: "名称" 
  },
  { 
    key: "shiftType",
    rowspan: 2,
    colspan: 1,
    headerIndex: 1,
     title: "班次类型"
  },
  { 
    key: "ruleDef",
    rowspan: 1,
    colspan: 7,
    headerIndex: 1,
    hasChild: true,
    title: "规则设定"
  },
  {
    key: "shift1Name",
    title: "1",
    headerIndex: 2,
  },
  {
    key: "shift2Name",
    title: "2",
    headerIndex: 2,
  },
  {
    key: "shift3Name",
    title: "3",
    headerIndex: 2,
  },
  {
    key: "shift4Name",
    title: "4",
    headerIndex: 2,
  },
  {
    key: "shift5Name",
    title: "5",
    headerIndex: 2,
  },
  {
    key: "shift6Name",
    title: "6",
    headerIndex: 2,
  },
  {
    key: "shift7Name",
    title: "7",
    headerIndex: 2,
  },
  { 
    key: "operation", 
    rowspan: 2,
    colspan: 1,
    headerIndex: 1,
    title: "操作" 
  },
];
const dataList1 = ref([
  {
    id: 7,
    ruleName: "做五休二法",
    shift1Name: "夜班",
    shift2Name: "白班",
    shift3Name: "中班",
    shift4Name: "白班",
    shift5Name: "休息",
    shift6Name: "夜班",
    shift7Name: "休息",
    shiftType: "测试班次",
 }
])
//表格选择设置
const rowSelection = ref({
  selectedRowKeys: [],
  onChange: (keys, rows) => {
    console.log(keys, rows);
  },
});
const columns2=[
  {
    key: "index",
    title: "序号"
  },
  {
    key: "label",
    title: "名称",
    filters:[{
      text: '无人驾驶',
      value: '1',
    },
    {
      text: '自动巡航',
      value: '2',
    },
    {
      text: '安全避让',
      value: '3',
    }]
  },
  {
    key: "value",
    title: "编码",
    filters:[{
      text: 'Joe',
      value: 'Joe1',
    },
    {
      text: 'Jim',
      value: 'Jim1',
    }]
  },
  {
    key: "num",
    title: "数量"
  },
  {
    key: "company",
    title: "公司",
    ellipsis: true,
    format: (v) => (v.length > 10 ? v.slice(0, 10) + "..." : v)
  }
];
const dataList2 = ref([
  { label: '无人驾驶', value: 'Joe' ,num :11,company: '北京路凯智行科技有限公司',id: 1},
  { label: '自动巡航', value: 'Jim' ,num: 21 ,company: '北京路凯智行科技有限公司' ,id: 2}
]);
const filterChange=(obj)=>{
  // console.log('表头筛选监听--',obj)
  //{"value": ["Jim1"]}
  //{"value": ["Jim1"],"label": ["1","2"]}
}
</script>
```

</details>

# API

## props

| 参数                | 说明               | 类型           | 默认值 |
| ------------------- | :----------------- | :------------- | :----- |
| data | 表格的数据 | array         | -      |
| columns         | 表格的表头配置         | array         | -- |
| fixedMeterHead            | 固定头部      | boolean        | --  |
| headerLevel      | 表头合并等级     | number         |        |
| fixedMeterBodyHeight      | 最大值      | number         |   --    |

## column

| 参数                | 说明               | 类型           | 默认值 |
| ------------------- | :----------------- | :------------- | :----- |
| title | 表头字段展示 | string         | -      |
| key         | 绑定列表字段(index, 序列)         |   string      | -- |
| sort            | 排序      | boolean        | --  |
| ellipsis      | 字段超出展示     | string         |        |
| format      | 字段超出展示函数      | fanction         |   --    |
| headerIndex      | 表头层数      | fanction         |   --    |
| rowspan      | 行合并数      | number         |   --    |
| colspan      | 列合并数      | number         |   --    |
| filters      | 表头的筛选菜单项 | Array         |   []    |
## 事件

| 事件名称  |       说明       |    回调函数     |
| --------- | :--------------: | :-------------: |
| selectListId     | 输入值变化时触发事件 | function(value) |
| selectClick |   行点击触发事件   |    function     |
| sortChange |   表头排序事件   |    function     |
| cellClick |   单元触发事件   |    function     |
| filterChange |   表头筛选监听事件   |    function(value)     |
## 插槽

| 插槽名称  |       说明       |    类型     |
| --------- | :--------------: | :-------------: |
| noDataText     | 无数据文本展示 | -- |
| columns.key |   columns字段自定义展示   |    --     |