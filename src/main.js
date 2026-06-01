import { createApp } from 'vue'
import './assets/base.css'
import App from './App.vue'

//引入组件库 
import dwinUI from '../packages';

createApp(App)
.use(dwinUI)
.mount('#app')
