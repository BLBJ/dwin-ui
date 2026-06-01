<style>
    .example{
        border: 1px solid #f5f5f5;
        border-radius: 5px;
        padding:20px
    }
    .d-button{
        margin-right:20px;
    }
    
    details > summary:first-of-type {
        font-size: 10px;
        padding: 8px 0;
        cursor: pointer;
        color: #1989fa;
    }
</style>

# Button 按钮

## 基础用法

使用 type 来定义按钮的样式。

<div class="example">
    <div>
        <d-button>主题按钮</d-button>
        <d-button type="success">成功按钮</d-button>
        <d-button type="warning">提醒按钮</d-button>
        <d-button type="error">错误按钮</d-button>
        <br/><br/>
        <d-button type="border">边框按钮</d-button>
        <d-button type="text">文字按钮</d-button>
    </div>
</div>

<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div>
    <d-button>主题按钮</d-button>
    <d-button type="success">成功按钮</d-button>
    <d-button type="warning">提醒按钮</d-button>
    <d-button type="error">错误按钮</d-button>
    <br /><br />
    <d-button type="border">边框按钮</d-button>
    <d-button type="text">文字按钮</d-button>
  </div>
</template>
<script setup></script>
<style>
.d-button {
  margin-right: 10px;
}
</style>
```

</details>

## 增加图标

设置 icon 增加图标按钮

<div class="example">
    <div>
        <d-button icon='plus'>按钮1</d-button>
        <d-button icon='search'>按钮2</d-button>
        <d-button icon='loading'>按钮3</d-button>
        <d-button icon='loading' iconColor="#ff0404">按钮3</d-button>
    </div>
</div>

<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div>
    <d-button icon="plus">按钮1</d-button>
    <d-button icon="search">按钮2</d-button>
    <d-button icon="loading">按钮3</d-button>
    <d-button icon="loading" iconColor="#ff0404">按钮3</d-button>
  </div>
</template>
<script lang="ts" setup></script>
<style></style>
```

</details>
