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

# 数值滚动统计

## 基础用法

<script setup>
import {ref} from 'vue';
const num = ref(124);
const num1 = ref(8132);
const num2 = ref(343221);
setInterval(() => {
  num.value += Math.ceil(Math.random() * 50);
  num1.value += Math.ceil(Math.random() * 100);
  num2.value += Math.ceil(Math.random() * 500);
}, 3000);

</script>
<div class="example">
   <d-scroll-num :value="num" color="#000000" size="22" height="30" width="12"></d-scroll-num>
   <br/>
    <d-scroll-num :value="num1" color="#000000" size="30" height="30" width="20"></d-scroll-num>
      <br/>
    <d-scroll-num :value="Number(num2).toLocaleString()" color="#000000" size="30" height="30" width="20"></d-scroll-num>
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <div class="example">
      <d-scroll-num
        :value="num"
        color="#000000"
        size="22"
        height="30"
        width="12"
      ></d-scroll-num>
      <br />
      <d-scroll-num
        :value="num1"
        color="#000000"
        size="30"
        height="30"
        width="20"
      ></d-scroll-num>
      <br />
      <d-scroll-num
        :value="Number(num2).toLocaleString()"
        color="#000000"
        size="30"
        height="30"
        width="20"
      ></d-scroll-num>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const num = ref(124);
const num1 = ref(8132);
const num2 = ref(3432213221);
setInterval(() => {
  num.value += Math.ceil(Math.random() * 50);
  num1.value += Math.ceil(Math.random() * 100);
  num2.value += Math.ceil(Math.random() * 500);
}, 3000);
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

| 参数   |     说明     |      类型      | 默认值 |
| ------ | :----------: | :------------: | :----: |
| value  |     数值     | string\|number |   -    |
| color  |     颜色     |     string     |   -    |
| size   |     大小     |     string     |   -    |
| height |     高度     | string\|number |   -    |
| width  | 单个字符宽度 | string\|number |   -    |
