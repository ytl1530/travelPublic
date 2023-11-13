<template>
  <div class="statis-tical">
    <!-- 饼图 -->
    <div class="box">
      <p style="padding: 10px;">订单统计</p>
      <doughnut-chart v-if="chart_show" :chartData="order_doughnut_chart"></doughnut-chart>
    </div>
    <!-- 折线图 -->
    <div class="box">
      <p style="padding: 10px;">订单数量统计</p>
      <doughnut-chart  v-if="chart_show" :chartData="active_user"></doughnut-chart>
    </div>
  </div>
</template>

<script >
import { toRefs,reactive, onMounted,watch,computed } from "vue";
import { Toast,ImagePreview,Dialog } from 'vant';
import 'vant/es/toast/style';
import doughnutChart from "../../components/Chart/doughnutChart.vue";
import { getDataBoard } from "../../httpSeiver/apis";
export default {
  components: { doughnutChart },
  setup(porps,cxt) {
    const layoutData = reactive({
      data_info:{},
      chart_show:false,
      user_type:'',
      params:{
        r_day:7
      },
      supperTotal:{},
      userTotal:{},
      day_keys:[],
      // 订单饼图
      order_doughnut_chart:{
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            minAngle: 10,//最小角度
            startAngle:200, //起始角度
            center: ['30%', '50%'],
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
            data: []
          }
        ]
      },
      // 活跃用户折线图
      active_user:{
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: []
            },
            tooltip: {
                trigger: "axis",
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: [],
                    type: "line",
                    smooth: true,
                    // areaStyle: {color: "#D7D4F4"}
                },
            ],
      },
      getHomeData:function () {
        getDataBoard().then(res=>{
          console.log(res);
          if (res.code == 200) {
            layoutData.chart_show = true
            let dateOrder = res.data.dateOrder
            let orderStatus = res.data.orderStatus
            orderStatus.forEach(item=>{
              item.name = `${layoutData.order_type(item.name)}：${item.value}`
            })
            layoutData.order_doughnut_chart.series[0].data = orderStatus
            layoutData.active_user.xAxis.data = dateOrder.dateList
            layoutData.active_user.series[0].data = dateOrder.orderCountList
          }
        })
      },
      order_type:function (key) {
        switch (key) {
          case "NOT_PAY":
            return '未支付';
          case "NOT_TRAVELED":
           return '未出行'
          case "TRAVELED":
           return '已出行'
          case "CANCEL":
           return '取消'
          case "REFUNDING":
           return '退款中'
          case "REFUND":
           return '已退款'
          case "REJECT":
           return '已驳回'
          case "FINISH":
           return '已完成'
          default:
            break;
        }
      }
    })
    onMounted(()=>{
      let userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
      layoutData.user_type = userInfo.type
      layoutData.getHomeData()
    })
    return{
        ...toRefs(layoutData),
    }
  }
};
</script>
<style lang="scss">
  body{
    background-color: #f6faf9;
  }
  .statis-tical{
    margin: .625rem;
    font-size: .9375rem;
    .box{
      margin-top: .625rem;
      background-color: #fff;
      border-radius: .625rem;
    }
    .box-num{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: .625rem;
      background-color: #0eb17a;
      color: #fff;
      border-radius: .625rem;
      .num-title{
        padding: .625rem;
        font-size: 1rem;
        font-weight: 600;
      }
      .box-img{
        width: 3.125rem;
        height: 3.125rem;
        margin-right: 1.25rem;
      }
      .num-sty{
        font-size: 1.875rem;
        margin-left: 1.875rem;
      }
      .num-tip{
        padding: .625rem;
        font-size: .875rem;
      }
    }
    .filtrate{
      margin-top: .625rem;
      background-color: #fff;
      border-radius: .5rem; 
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .625rem;
      font-size: .875rem;
      .btn{
        font-size: .75rem;
        margin: 0 .1875rem;
        padding: .125rem .3125rem;
        border: .0625rem solid #0eb17a;
      }
    }
    .active{
      font-size: .75rem;
      margin: 0 .1875rem;
      padding: .125rem .3125rem;
      color: #fff;
      background-color: #0eb17a;
    }
  }
</style>