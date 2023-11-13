<template>
  <div id="columnarChart" style="width:100%;height:300px; margin-left:10px;"></div>
</template>

<script>
import { toRefs, reactive, onMounted, onUnmounted,} from "vue";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import * as echarts from "echarts";
export default {
  components: {},
  props:['threeMonth'],
  setup(porps, cxt) {
    let myEcharts = echarts;
    const chartsData = reactive({
      initChart: function () {
        let chart = myEcharts.init(document.getElementById("columnarChart"));
        let months = []
        let add_work_order = []
        let service_work_order = []
        let down_work_order = []
        porps.threeMonth.forEach(item=>{
          months.push(item.month)
          add_work_order.push(item.data.install)
          service_work_order.push(item.data.maintain)
          down_work_order.push(item.data.demolition)
        })
        chart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
            },
            legend: {
                data: ['安装工单','维修工单','拆除工单']
            },
            xAxis: [
                {
                  type: 'category',
                  axisTick: { show: false },
                  data: months
                }
            ],
            yAxis: [
                {
                  type: 'value'
                }
            ],
            series: [
                {
                  name: '安装工单',
                  type: 'bar',
                  barGap: 0,
                  emphasis: {
                      focus: 'series'
                  },
                  data: add_work_order
                },
                {
                  name: '维修工单',
                  type: 'bar',
                  emphasis: {
                      focus: 'series'
                  },
                  data: service_work_order
                },
                {
                  name: '拆除工单',
                  type: 'bar',
                  emphasis: {
                      focus: 'series'
                  },
                  data: down_work_order
                },
            ]
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