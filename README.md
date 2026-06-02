
<p align="center">
  <img width="200" src="./logo.png" alt="DWin UI">
</p>

<h1 align="center">DWin UI</h1>

<div align="center">

基于 Vue3 的企业级中台后台 UI 组件库

[![npm version](https://img.shields.io/npm/v/dwin-ui.svg?style=flat-square)](https://www.npmjs.org/package/dwin-ui)
[![npm downloads](https://img.shields.io/npm/dm/dwin-ui.svg?style=flat-square)](https://www.npmtrends.com/dwin-ui)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Vue3](https://img.shields.io/badge/Vue-3.x-%2342b883.svg?style=flat-square)](https://vuejs.org/)

</div>

<p align="center">
<a href="./README.md">简体中文</a> | English
</p>

## 介绍
**DWin UI** 是一套基于 Vue3 开发的轻量化、标准化**企业中台后台通用组件库**。
全面采用 `<script setup>` 语法开发，专注服务 **企业中台、B端后台管理系统** 等场景。

全局统一 `d-` 组件前缀，内置完整样式变量体系，组件开箱即用、低侵入、高可扩展，非常适合中后台项目快速开发与二次封装。

简洁易用，功能强大，快速上手

## 特性
- ✨ **Vue3 原生开发**：全量 script setup 语法，体积轻量、性能极致
- 🧩 **中台场景专属**：针对中后台高频业务深度优化，适配性极强
- 🎨 **全局统一规范**：固定 `d-` 组件前缀，样式、类名、交互统一
- 🛠 **可全局配置**：支持自定义组件前缀、主题色、全局样式变量
- 📦 **双引入模式**：支持全量引入 / 按需引入
- 🔧 **极易二次开发**：结构清晰、封装克制、无冗余逻辑

## 环境支持
- 适配 Vue 3.x 所有版本
- 支持 Vite / Vue-CLI 工程
- 主流现代浏览器
- 支持 SSR、Electron

## 安装
```bash
pnpm add dwin-ui
# npm
npm install dwin-ui --save
# yarn
yarn add dwin-ui
```

## 使用


```vue
import { createApp } from 'vue'
import DWinUI from 'dwin-ui'
import 'dwin-ui/style/base.css'

const app = createApp(App)
app.use(DWinUI)
app.mount('#app')
```



## 目录介绍

/docs   开发文档搭建

/packages   公共组件源码

## 运行命令

安装依赖

`npm install`

运行组件库测试

`npm run dev`

运行文档工程

`npm run docs:dev`

文档打包

`npm run docs:build`

文档部署

`npm run docs:deploy`

组件库更新后，需先打包再运行文档工程

`npm run build`

