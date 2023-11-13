import { Toast,ImagePreview,Dialog } from 'vant';
import 'vant/es/toast/style';
// 防抖
export function debounce(fn, delay) {
    // 定时器
    let timer = null
 
    // 将debounce处理结果当作函数返回
    return function () {
        // 保留调用时的this上下文
        let context = this
        // 保留调用时传入的参数
        let args = arguments
 
        // 每次事件被触发时，都去清除之前的旧定时器
        if(timer) {
            clearTimeout(timer)
        }
        // 设立新定时器
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }
}

// 节流
export function throttle(fn, time = 500 ,type = 2) {
    let previous,timeout
    if(type===1){
         previous = 0
    }
    return function() {
        let context = this
        let args = arguments
        if(type===1){
            let now = Date.now()
            if (now - previous > time) {
                fn.apply(context, args);
                previous = now
            }
        }else if(type===2){
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null
                    fn.apply(context, args)
                }, time)
            }
        }
    }
}

// 文件下载
export function downloadFile(url) {
    // 弹出确认框
    Dialog.confirm({
      title: '下载文件',
      message: '是否要下载该文件？',
    })
    .then(() => {
        // 显示加载提示
        const loading = Toast.loading({
          duration: 0, // 持续显示 toast
          forbidClick: true, // 禁止背景点击
          message: '文件下载中...',
        });
  
        // 发送请求，获取文件数据
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            // 使用 file-saver.js 库保存文件
            // const fileName = url.substring(url.lastIndexOf('/') + 1);
            // saveAs(blob, fileName);
            const urls = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = urls;
            a.download = 'file.txt'; // 文件名
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url); // 释放内存
            loading.clear(); // 关闭加载提示
        });
    })
    .catch(() => {
        // 用户取消下载
        Toast('已取消下载');
    });
}