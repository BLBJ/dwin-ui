<style>
    .example{
        border: 1px solid #f5f5f5;
        border-radius: 5px;
        padding:20px
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

#  对话弹窗 Modal

## 基础用法

<script setup>
import { ref } from 'vue';
import { Modal } from '../../dwin-ui/dist/index.es';
const modalClick=(type)=>{
  Modal[type]("确认----？", {
    okCallback: function () {
        
    }
  });
}
const showMessage=ref(false);
const ModalBoxOpen=()=>{
    showMessage.value=true;
}
</script>
<div class="example">
    <div>
        <div>基本</div>
        <br/>
            <d-button  @click="ModalBoxOpen">ModalBox</d-button>
            <d-modal-box
                v-model="showMessage"
                title="标题"
                @onOk="showMessage=false;"
                @onCancel="showMessage=false;"
                width="400"
                >
                <template #content>
                    <div class="form form_verify">
                        内容
                    </div>
                </template>
            </d-modal-box>
         <br/><br/><br/>
        <div>对话框</div>
        <br/>
        <d-button  @click="modalClick('info')">info</d-button>
        <d-button type="warning"  @click="modalClick('warning')">warning</d-button>
        <d-button type="error"  @click="modalClick('error')">error</d-button>
        <d-button type="success"  @click="modalClick('success')">success</d-button>
        <d-button  @click="modalClick('confirm')">confirm</d-button>
    </div>
    <br/>
</div>
<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div class="example">
    <div>
        <div>基本</div>
        <br/>
            <d-button  @click="ModalBoxOpen">ModalBox</d-button>
            <d-modal-box
                v-model="showMessage"
                title="标题"
                @onOk="showMessage=false;"
                @onCancel="showMessage=false;"
                width="400"
                >
                <template #content>
                    <div class="form form_verify">
                        内容
                    </div>
                </template>
            </d-modal-box>
         <br/><br/><br/>
        <div>对话框</div>
        <br/>
        <d-button  @click="modalClick('info')">info</d-button>
        <d-button type="warning"  @click="modalClick('warning')">warning</d-button>
        <d-button type="error"  @click="modalClick('error')">error</d-button>
        <d-button type="success"  @click="modalClick('success')">success</d-button>
        <d-button  @click="modalClick('confirm')">confirm</d-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Modal } from 'dwin-ui';
const modalClick=(type)=>{
  Modal[type]("Modal确认？", {
    okCallback: function () {
        
    }
  });
}
const showMessage=ref(false);
const ModalBoxOpen=()=>{
    showMessage.value=true;
}
</script>
```

</details>

# API

## props

| 参数                | 说明                                                                               | 类型    | 默认值    |
| ------------------- | ---------------------------------------------------------------------------------- | ------- | --------- |
| modelValue(v-modal) | 对话框是否可见                                                                     | Boolean | false     |
| title               | 对话框标题                                                                         | String  | '提示'    |
| type                | 对话框类型                                                                         | String  | 'info'    |
| content             | 对话框内容                                                                         | String  | ''        |
| isShowTitle         | 是否展示标题                                                                       | Boolean | true      |
| isShowClose         | 是否展示关闭按钮                                                                   | Boolean | false     |
| isShowBtn           | 是否展示最下面的操作按钮                                                           | Boolean | true      |
| btnText             | 按钮内容 （非交互确认框）                                                          | String  | "知道了"  |
| cancelTex           | 取消按钮内容 （确认框）                                                            | String  | "取消"    |
| confirmText         | 确认按钮内容 （确认框）                                                            | String  | "确定"    |
| btnCancelType       | 取消按钮类型 （确认框）                                                            | String  | "default" |
| btnConfirmType      | 确认按钮类型 （确认框）                                                            | String  | "info"    |
| btnControllable     | 是否通过按钮自己控制对话框的显示隐藏，而不是点击后自动关闭，主要用作确认前进行校验 | Boolean | false     |

# 事件

| 事件名称       | 说明                   |
| -------------- | ---------------------- |
| onBtn          | 非确认框按钮点击回调   |
| okCallback     | 确认框确认按钮点击回调 |
| cancelCallback | 确认框取消按钮点击回调 |

# 方法

- Modal.info(option)
- Modal.warning(option)
- Modal.error(option)
- Modal.success(option)
- Modal.confirm(option)

简写：
Modal.info('这是一个提示');
Modal.confirm('确认删除？',{
okCallback(){},
cancelCallback(){}
})
