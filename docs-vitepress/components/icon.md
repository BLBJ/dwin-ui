#  图标

## 基础用法

使用 name、size、color 来定义图标。

取自第三方图标库，更多请参考：https://arco.design/iconbox/lib/83/0

<div class="example">
    <div>
        <d-svg-icon class='d-icon' name='plus'></d-svg-icon>
         <d-svg-icon class='d-icon' name='refresh'></d-svg-icon>
        <d-svg-icon class='d-icon' name='close'></d-svg-icon>
        <d-svg-icon class='d-icon' name='fullscreen'></d-svg-icon>
        <d-svg-icon class='d-icon' name='search' size='20'></d-svg-icon>
        <d-svg-icon class='d-icon' name='loading' size='25'></d-svg-icon>
        <d-svg-icon class='d-icon' name='loading' size='30' color='red'></d-svg-icon>
    </div>
</div>

<details>
<summary>展开查看代码示例</summary>

```vue
<template>
  <div>
    <svg-icon class="d-icon" name="plus"></svg-icon>
    <svg-icon class="d-icon" name="refresh"></svg-icon>
    <svg-icon class="d-icon" name="close"></svg-icon>
    <svg-icon class="d-icon" name="fullscreen"></svg-icon>
    <svg-icon class="d-icon" name="search" size="20"></svg-icon>
    <svg-icon class="d-icon" name="loading" size="18"></svg-icon>
    <svg-icon class="d-icon" name="loading" size="18" color="red"></svg-icon>
  </div>
</template>
<script setup></script>
<style>
.d-icon {
  margin-right: 20px;
}
</style>
```

</details>

<style>
    .example{
        border: 1px solid #f5f5f5;
        border-radius: 5px;
        padding:20px;
    }
    .d-icon{
        margin-right:20px;
        display:inline-block;
    }
    

</style>
