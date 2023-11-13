import axios from "axios"
import {serverUrl} from "@/untils/constant"; // 这里我是将所有常量放在一个地方的，需要的时候做引入，也可以直接写地址
import { getTokens } from "../untils/cookie";
import qs from "qs";
import { Toast } from 'vant';
import 'vant/es/toast/style';
import router from '../router/index'
axios.defaults.timeout = 60000;
axios.defaults.baseURL = serverUrl;

//http 请求拦截器
axios.interceptors.request.use(config => {
    let token = getTokens()
    let newConfig = config;
    if (Object.prototype.toString.call(config.data) != '[object FormData]' && config.url) {
      newConfig.data = qs.stringify(config.data);
      newConfig.headers = {
        'Authorization':token,
        'Content-Type':'application/x-www-form-urlencoded',
      }
    }else{
      newConfig.headers = {
        'Authorization':token,
        'Content-Type':'application/x-www-form-urlencoded',
      }
    }
    return newConfig;
  },
  error => {
    return Promise.reject(error);
  }
);

//http 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code == 401) {
      router.push({
        path: "/login",//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params = {},loading) {
  if (loading) {
    Toast.loading({
      duration:0,
      message: '加载中...',
      forbidClick: true,
    });
  }
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: params
      })
      .then(response => {
        if (response.data.code == 200) {
          Toast.clear()
        }else{
          Toast(response.data.msg)
        }
        resolve(response.data);
      })
      .catch(err => {
        Toast(err.response.data.msg)
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}, loading) {
  if (loading) {
    Toast.loading({
      duration:0,
      message: '加载中...',
      forbidClick: true,
    });
  }
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        if (response.data.code == 200) {
          Toast.clear()
        }else{
          Toast(response.data.msg)
        }
        resolve(response.data);
      }, err => {
        Toast(err.response.data.msg)
        reject(err)
      })
  })
}

/**
 * 封装patch请求（局部更新）
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        Toast('系统异常')
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {},loading) {
  if (loading) {
    Toast.loading({
      duration:0,
      message: '加载中...',
      forbidClick: true,
    });
  }
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        if (response.data.code == 200) {
          Toast.clear()
        }else{
          Toast(response.data.msg)
        }
        resolve(response.data);
      }, err => {
        Toast(err.response.data.msg)
        reject(err)
      })
  })
}

/**
 * 封装del请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url, data = {},loading) {
  if (loading) {
    Toast.loading({
      duration:0,
      message: '加载中...',
      forbidClick: true,
    });
  }
  return new Promise((resolve, reject) => {
    axios.delete(url, {data: data})
      .then(response => {
        if (response.data.code == 200) {
          Toast.clear()
        }else{
          Toast(response.data.msg)
        }
        resolve(response.data);
      }, err => {
        Toast(err.response.data.msg)
        reject(err)
      })
  })
}
