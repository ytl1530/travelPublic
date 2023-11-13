<template>
  <div id="lineChart" style="width:100%;height:300px; margin-left:10px;"></div>
</template>

<script>
import { toRefs, reactive, onMounted, onUnmounted,} from "vue";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import * as echarts from "echarts";
export default {
  components: {},
  props:['tenOrder'],
  setup(porps, cxt) {
    let myEcharts = echarts;
    const chartsData = reactive({
      initChart: function () {
        let chart = myEcharts.init(document.getElementById("lineChart"));
        let userInfo =JSON.parse(sessionStorage.getItem('user_info'))  
        let keys = []
        let values = []
        porps.tenOrder.forEach(item=>{
          keys.push(item.key)
          values.push(item.value)
        })
        chart.setOption({
            title: {
                text: userInfo.type == 4 ? "三月收入统计" : "十天订单统计",
                textStyle: {
                    color:'#ccc'
                },
                top:15
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: keys
            },
            tooltip: {
                trigger: "axis",
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: values,
                    type: "line",
                    smooth: true,
                    areaStyle: {color: "#D7D4F4"}
                },
            ],
        });
        window.onresize = function () {
          chart.resize();
        };
      },
    });
    onMounted(() => {
        setTimeout(()=>{
            chartsData.initChart();
        },1000)
    });

    onUnmounted(() => {
      myEcharts.dispose;
    });
    return {
        ...toRefs(chartsData)
    };
  },
};
</script>
<style lang="scss">
</style>