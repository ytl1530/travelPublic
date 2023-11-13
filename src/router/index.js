import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { getTokens } from "../untils/cookie";

import routers from "./routes";

const routes = [
  {
    path:'/',
    redirect:'/login',
    meta:{
      show:false,
      keepAlive:false
    }
  },
  ...routers
]
const router = createRouter({
  history: createWebHistory(),    // 使用history模式
  // history: createWebHashHistory(),	 // 使用hash模式
  routes
})

router.beforeEach((to, from, next) => {
  let token = getTokens()
  let userInfo = {}
  if (sessionStorage.getItem('user_info')) {
    userInfo = JSON.parse(sessionStorage.getItem('user_info'))
  }
  // toekn 存在或者没过期
  if (token && userInfo.type != 0) {
    // token存在的时候不能可以访问login页面
    // token 存在或者没过期，即将要进入的是 login 页面
    if (to.path == '/login') {
        // 这个 if 里面什么时候会进来，比如说某个人他现在操作页面正常，token 存在或者没过期，但是他喵的，贱嗖的，他现在就要重新登录，你管我，然后就进到这里面来了
        next();
        // token 存在或者没过期，即将要进入的不是 login 页面
    } else {
        // 这个 else 里面什么时候会进来，比如说，当前 token 存在或者没过期，我随便进入到任何一个页面，都可以进来
        next();
    }
  // token 不存在或者过期了
  } else {
      // token 不存在或者过期了，即将要进入的是 login 页面
      if (to.path == '/login' || to.path == '/') {
          // 这个 if 里面什么时候会进来，这里就是正常进来，比如说，当前 token 不存在或者过期了，我直接点击 进入登录页
          next();
        // token 不存在或者过期了，即将要进入的不是 login 页面
      } else {
          // 这个 else 里面什么时候会进来，比如说，A 到 B，那么在进入 B 之前执行 router.beforeEach 前置守卫的时候，token 不存在或者过期了，你就要进入到 C 页面，也就是 login登录页
          next();
      }
  }
})
export default router