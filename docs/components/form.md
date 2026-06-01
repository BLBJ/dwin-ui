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

# Form 表单

## 基础用法

<script setup>
import {ref,reactive} from 'vue';
import { useForm } from '../../dwin-ui/dist/index.es';
const formModal = reactive({
  name: '',
  age: ''
});
const rules = {
  name: [{
    result: true, type: "string", verify: "", prompt: "请输入姓名"
  }],
  age: [{
    result: true, type: "string", verify: "", prompt: "请输入年龄"
  }]
}
let { error,formVerify, resetError } = useForm(formModal, rules);

function submit(){
  if(!formVerify()) return
}
function cancel(){
  resetError()
}
</script>
<div class="example">
  <d-form class="form">
    <d-form-item label="姓名" required>
      <d-input v-model="formModal.name" :error="error.name"></d-input>
    </d-form-item>
    <d-form-item label="年龄" required>
      <d-input v-model="formModal.age" :error="error.age"></d-input>
    </d-form-item>
    <d-button type="text" style="margin-right:20px" @click="cancel">取消</d-button>
    <d-button @click="submit">确认</d-button>
  </d-form>
</div>

<details>

<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <d-form class="form">
      <d-form-item label="姓名" required>
        <d-input v-model="formModal.name" :error="error.name"></d-input>
      </d-form-item>
      <d-form-item label="年龄" required>
        <d-input v-model="formModal.age" :error="error.age"></d-input>
      </d-form-item>
      <d-button style="margin-right:20px" @click="cancel">取消</d-button>
      <d-button @click="submit">确认</d-button>
    </d-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useForm } from "dwin-ui";
const formModal = reactive({
  name: "",
  age: "",
});
const rules = {
  name: [
    {
      result: true,
      type: "string",
      verify: "",
      prompt: "请输入姓名",
    },
  ],
  age: [
    {
      result: true,
      type: "string",
      verify: "",
      prompt: "请输入年龄",
    },
  ],
};
let { error, formVerify, resetError } = useForm(formModal, rules);

function submit() {
  if (!formVerify()) return;
}
function cancel() {
  resetError();
}
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

### FormItem

| 参数       |    说明    |  类型   | 默认值 |
| ---------- | :--------: | :-----: | :----: |
| label      |   标签值   | string  |   -    |
| labelWidth | 标签值宽度 | Number  |  100   |
| required   |  是否必填  | Boolean | false  |

### rules 校验规则

支持 string、array、regexp、function 类型，例如：

```javascript
 { result: true, type: "array", verify: [], prompt: "请选择角色" }

 {
    result: true,
    require: false,   //非必填
    verify: /^1[0-9]{10}$/,
    prompt: "手机号应为1开头的11位数字",
    type: "regexp",
}

{
    result: true,
    verify: function(value){
            let res =value.replace(/\p{sc=Han}/gu,'𝒳'); 
            return /^\S{1,10}$/g.test(res);
          },
    prompt: "最多10个字符（汉字最多5个）",
    type: "function", 
 }

```
