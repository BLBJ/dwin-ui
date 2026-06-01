<style>
    .example{
        border: 1px solid #f5f5f5;
        border-radius: 5px;
        padding:20px;
    }
    button{
        margin-right:20px;
    }
    details > summary:first-of-type {
        font-size: 10px;
        padding: 8px 0;
        cursor: pointer;
         color: #1989fa;
    }

</style>

# 全局提示 Prompt

## 基础用法

<script setup>
import { Message } from '../../dwin-ui/dist/index.es';
import {ref} from 'vue';
const info=(type)=>{
    Message[type](type);
}
</script>
<div class="example">
    <div>
        <br/>
        <d-button @click="info('info')">默认提示</d-button>
        <d-button @click="info('success')" type="success">成功提示</d-button>
        <d-button @click="info('warning')" type="warning">告警提示</d-button>
        <d-button @click="info('error')" type="error">错误提示</d-button>
    </div>
    <br/>
</div>
<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <br />
    <d-button @click="info('info')">默认提示</d-button>
    <d-button @click="info('success')" type="success">成功提示</d-button>
    <d-button @click="info('warning')" type="warning">告警提示</d-button>
    <d-button @click="info('error')" type="error">错误提示</d-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Message } from "dwin-ui";
const info = () => {
  Message.info("提示");
};
const success = () => {
  Message.info("成功");
};
const warning = () => {
  Message.info("警告");
};
const error = () => {
  Message.info("异常");
};
</script>
```

</details>

# API

## props

| 参数    | 说明          | 类型                               | 默认值 |
| ------- | :------------ | :--------------------------------- | :----- |
| content | 提示内容      | string/number                      |        |
| type    | 提示类型      | string(info/success/warning/error) |        |
| styles  | 设置 top/left | function                           |        |

# 方法

- `Message.info(content)`
- `Message.warning(content)`
- `Message.error(content)`
- `Message.success(content)`
