<template>
    <div class="app-container">
        <div style="background-color: #ffffff;">
            <div id="container"></div>
        </div>
    </div>
</template>
 
<script>
import { toRefs,reactive, onMounted,watch,computed } from "vue";
import AMapLoader from '@amap/amap-jsapi-loader';
/*在Vue3中使用时,需要引入Vue3中的shallowRef方法(使用shallowRef进行非深度监听,
因为在Vue3中所使用的Proxy拦截操作会改变JSAPI原生对象,所以此处需要区别Vue2使用方式对地图对象进行非深度监听,
否则会出现问题,建议JSAPI相关对象采用非响应式的普通对象来存储)*/
import { shallowRef } from '@vue/reactivity';
export default {
    setup(porps,cxt) {
        const mapData = reactive({
            path:[],
            current_position:[],
            initMap:function() {
                window._AMapSecurityConfig = {
                    securityJsCode: 'ef6f3d93d265d735aee66a5535d78598',
                }
                AMapLoader.load({
                    key:"4e32269a46d7875571d0e6ab65cd57cb", // 申请好的Web端开发者Key，首次调用 load 时必填
                    version:"2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                }).then((AMap)=>{
                    const map = new AMap.Map("container",{  //设置地图容器id
                        viewMode:"2D",    //是否为3D地图模式
                        zoom:13,           //初始化地图级别
                        center:[116.397428,39.90923], //初始化地图中心点位置
                    });
                    // 单击
                    // map.on('click',(e) => {
                    //     // lng ==> 经度值  lat => 维度值
                    //     current_position.value = [e.lnglat.lng,e.lnglat.lat];
                    //     path.value.push([e.lnglat.lng,e.lnglat.lat]);
                    // })
                }).catch(e=>{
                    console.log(e,123456);
                })
            }
        })
        onMounted(()=>{
            mapData.initMap()
        })
        return{
            ...toRefs(mapData),
        }
    }
}
 

 


</script>
 
<style>
    #container{
        padding:0px;
        margin: 0px;
        width: 100%;
        height: 300px;
    }
</style>