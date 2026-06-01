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

# Ring 圆形

## 基础用法

<script setup>
import {ref} from 'vue';
const text = ref('180KM/h');
const rate= ref(1);
</script>
<div class="example">
    <d-ring :text="text" :rate="rate"></d-ring>
    <d-ring text="80%" :rate="0.8" strokeColor='blue'></d-ring>
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-ring :text="text" :rate="rate"></d-ring>
     <d-ring text="80%" :rate="0.8" strokeColor='blue'></d-ring>
  </div>
</template>

<script setup>
import { ref } from "vue";
const text = ref('180KM/h');
const rate= ref(1);
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
| size                |   圆环外圈的直径       | number          |   175    |
| strokeWidth        |    圆环的小宽度         |     number          |   5    |
| strokeColor        |    圆环的颜色           |       string        |   #00D476   |
| stokeBgColor        |    圆环的背景颜色      |          string        |   rgba(255,255,255,.2)   |
| text        |    圆环里面的文字             |   string\|number        |   50   |
| rate        |    圆环显示的百分比 小数       |            number       |   0.5   |
| textSize        |    圆环里面的文字大小    |       string\|number         |   20   |






