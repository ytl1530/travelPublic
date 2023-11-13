import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 引用路由
import router from "./router/index";
// 引用vuex
import {store}  from './store'
// vant-css样式
import 'vant/lib/index.css';



const app = createApp(App)

app.use(router).use(store).mount('#app')
