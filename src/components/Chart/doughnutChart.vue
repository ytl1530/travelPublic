<template>
  <div  ref="chartContainer" style="width:100%;height:200px"></div>
  <!-- <div id="doughnutChart" style="width:100%;height:200px"></div> -->
</template>

<script>
import { toRefs, reactive, onMounted, onUnmounted, watch,onBeforeUnmount,ref } from "vue";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import * as echarts from "echarts";
export default {
  components: {},
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  setup(porps, cxt) {
    const chartContainer = ref(null);
    let chartInstance = null;
    const generateChart  = (chartData) => {
      if (chartInstance) {
        chartInstance.setOption(chartData);
      }
    }
    onMounted(() => {
      chartInstance = echarts.init(chartContainer.value);
      // chartInstance.setOption(porps.chartData);
      generateChart(porps.chartData)
    });
    watch(()=>porps.chartData,(val,preVal)=>{
          //val为修改后的值,preVal为修改前的值
          generateChart(val)
        },
        {
          //如果加了这个参数，值为true的话，就消除了惰性，watch会在创建后立即执行一次
          //那么首次执行，val为默认值,preVal为undefined
          immediate:true,
          //这个参数代表监听对象时，可以监听深度嵌套的对象属性
          //比如message是一个对象的话，可以监听到message.a.b.c，也就是message下的所有属性
          deep:true,
        }
      )
   
    onBeforeUnmount(() => {
      if (chartInstance && !chartInstance.isDisposed()) {
        chartInstance.dispose();
      }
    });
    return {
      chartContainer
    };
  },
  // setup(porps, cxt) {
  //   let myEcharts = echarts;
  //   const chartsData = reactive({
  //     userStatus:{},
  //     initChart: function () {
  //       let chart = myEcharts.init(document.getElementById("doughnutChart"));
        // chart.setOption({
        //     tooltip: {
        //         trigger: 'item'
        //     },
        //     legend: {
        //       type: 'scroll',
        //       orient: 'vertical',
        //       right: 10,
        //       top: 20,
        //       bottom: 20,
        //       data: porps.userData
        //     },
        //     series: [
        //         {
        //             type: 'pie',
        //             radius: ['40%', '70%'],
        //             minAngle: 10,//最小角度
        //             startAngle:200, //起始角度
        //             center: ['30%', '50%'],
        //             labelLine: {
        //                 show: false
        //             },
        //             label: {
        //                 show: false
        //             },
        //             data: porps.userData
        //         }
        //     ]
        // });
  //       window.onresize = function () {
  //         chart.resize();
  //       };
  //     },
  //     destroyChart:function () {
  //       if (myEcharts) {
  //         myEcharts.dispose();
  //         myEcharts = null;
  //       }
  //     }
  //   });
  //   onMounted(() => {
  //       setTimeout(()=>{
  //           chartsData.initChart();
  //       },1000)
  //   });
  // //  watch(()=>porps.userStatus,(val,preVal)=>{
  // //       //val为修改后的值,preVal为修改前的值
  // //       chartsData.userStatus = val
  // //     },
  // //     {
  // //       //如果加了这个参数，值为true的话，就消除了惰性，watch会在创建后立即执行一次
  // //       //那么首次执行，val为默认值,preVal为undefined
  // //       immediate:true,
  // //       //这个参数代表监听对象时，可以监听深度嵌套的对象属性
  // //       //比如message是一个对象的话，可以监听到message.a.b.c，也就是message下的所有属性
  // //       deep:true,
  // //     }
  // //   )
  //   return {
  //       ...toRefs(chartsData)
  //   };
  // },
};
</script>
<style lang="scss">
</style>