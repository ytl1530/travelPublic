<template>
    <div class="order-admin">
        <van-search style="margin: 5px 0;" v-model="params.yachtName" show-action placeholder="请输入游艇名称或订单编号" @search="onSearch">
            <template #action>
                <div @click="onClickButton">搜索</div>
            </template>
        </van-search>
        <van-tabs v-model:active="active" @click-tab="onToggleTab">
            <van-tab v-for="(tab,index) in tabList" :title="tab" :key="index">
                <div class="device-list" :style="order_list.length < 3 ? ' height: 30rem;' : ' height: 40rem;'" @scroll="handleScrolls">
                    <van-empty class="empty" v-if="order_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无订单"/>
                    <div class="order-item" v-for="order in order_list" :key="order.id"  @click="skipDetail(order.orderId)">
                        <div class="item-header">
                            <span style="font-size:14px;font-weight: bold;">{{order.yachtName}}</span>
                            <span>{{ order.orderStatus == 0 ? '待支付' : order.orderStatus == 1 ? '未出行' : order.orderStatus == 2 ? '已出行' : order.orderStatus == 3 ? '已取消' : '已完成'}}<van-icon style="margin-left:0.625rem" name="arrow" /></span>
                        </div>
                        <div class="item-body">
                            <div class="body-list">
                                <span>下单人名称：</span>
                                <span>{{order.appUser.userName}}</span>
                            </div>
                            <div class="body-list">
                                <span>订单编号：</span>
                                <span>{{order.orderSn}}</span>
                            </div>
                            <div class="body-list">
                                <span>订单总价：</span>
                                <span>￥{{order.totalPrice}}</span>
                            </div>
                            <div class="body-list">
                                <span>实际支付总价：</span>
                                <span>￥{{order.actualTotalPrice}}</span>
                            </div>
                            <div class="body-list">
                                <span>预约开始时间：</span>
                                <span>{{order.reservationStartTime}}</span>
                            </div>
                            <div class="body-list">
                                <span>预约结束时间：</span>
                                <span>{{order.reservationEndTime}}</span>
                            </div>
                            <div class="body-list">
                                <span>预约时长：</span>
                                <span>{{order.reservationDuration}}/小时</span>
                            </div>
                            <div class="body-list">
                                <span>创建时间：</span>
                                <span>{{order.createTime}}</span>
                            </div>
                        </div>
                        <div class="item-btn">
                            <div class="reminder" v-if="order.orderStatus == 0 || order.orderStatus == 1 || order.orderStatus == 2"  @click.stop="contactOrderHolder(order.appUser)">联系下单人</div>
                        </div>
                    </div>
                    
                    <div class="list-box"></div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
  </template>
  
  <script>
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import { orderList } from "../../httpSeiver/apis";
  import 'vant/es/toast/style';
  import { useRoute, useRouter } from 'vue-router';
  export default {
    components: {  },
    setup(porps,cxt) {
        const layoutData = reactive({
            active:0,
            order_list:[],
            total_page:null,
            params:{
                yachtName:'',
                orderStatus:'0,1,2,3,9',
                pageNum:1,
                pageSize:10 
            },
            getOrderList:function () {
                // layoutData.params.orderStatus = JSON.stringify(layoutData.params.orderStatus)
                orderList(layoutData.params).then(res=>{
                    if (res.code == 200) {
                        let order = res.data.records
                        layoutData.total_page =  res.data.total
                        layoutData.order_list.push(...order)
                        layoutData.order_list  = layoutData.order_list
                    }else{
                        Toast(res.msg)
                    }
                })
            },
            tabList:['全部','待支付','未出行','已出行','已取消','已完成']
        })
        const route = useRoute()
        const router = useRouter()
        onMounted(()=>{
            layoutData.getOrderList()
        })
       // 切换Tab
       const onToggleTab = (val) => {
           layoutData.params.pageNum = 1
           layoutData.order_list = []
           if (val.name == 0) {
                layoutData.params.orderStatus = '0,1,2,3,9'
           }else if(val.name == 5){
                layoutData.params.orderStatus = 9
           }else{
                layoutData.params.orderStatus = val.name - 1
           }
           layoutData.getOrderList() 
        }
        // 回车搜索   
        const onSearch = () => {
            layoutData.order_list = []
            layoutData.params.pageNum = 1
            layoutData.getOrderList() 
        }
        // 点击搜索   
        const onClickButton = () => {
            layoutData.order_list = []
            layoutData.params.pageNum = 1
            layoutData.getOrderList() 
        } 
        // 列表触底加载
        const handleScrolls = (e) => {
            if((e.target.scrollTop + 1)+ e.target.clientHeight >= e.target.scrollHeight){
            if(layoutData.total_page > layoutData.order_list.length){
                Toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                });
                layoutData.params.pageNum++
                layoutData.getOrderList() 
            }else{
                Toast('已经滑到底了！');
            }
            }
        }
        // 跳转详情
        const skipDetail = (id) => {
            router.push(`/orderAdmin/orderDetail?id=${id}`)
        }
        // 联系下单人
        const contactOrderHolder = (item) => {
            window.location.href = 'tel://' + item.mobile
        }
      return{
          ...toRefs(layoutData),
          skipDetail,
          onToggleTab,
          handleScrolls,
          onSearch,
          onClickButton,
          contactOrderHolder
      }
      
    }
  };
  </script>
  <style lang="scss">
    body{
      background-color: #f6faf9;
    }
    .order-admin{
      margin: .625rem;
      .order-item{
        background-color: #fff;
        margin-top: .625rem;
        padding: .625rem;
        border-radius: .625rem;
        font-size: .875rem;
        
        .item-header{
          display: flex;
          justify-content: space-between;
          position: relative;
          padding: .625rem .625rem;
        }
        .item-body{
          padding: .625rem;
          .body-list{
            display: flex;
            justify-content: space-between;
            padding: .375rem 0;
            span{
              font-size: .875rem;
              color: #adadad;
            }
          }
        }
        .item-btn{
                display: flex;
                justify-content: space-around;
                padding: .625rem 0;
                .reminder{
                    width: 30%;
                    background-color: #cfefe4;
                    color: #13b27b;
                    padding: .6rem .8rem;
                    text-align: center;
                    border-radius: .4rem;
                }
                .reminders{
                    width: 30%;
                    background-color: #efd0cf;
                    color: #b21313;
                    padding: .6rem .8rem;
                    text-align: center;
                    border-radius: .4rem;
                }
        }
      }
      .device-list{
          overflow-y: auto;
      }
      .empty{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .van-empty__description {
          margin-top: var(--van-empty-description-margin-top);
          padding: .625rem;
          color: var(--van-empty-description-color);
          font-size: var(--van-empty-description-font-size);
          line-height: var(--van-empty-description-line-height);
        } 
      }
      .list-box{
          margin-top: 6.625rem;
          background-color: #f6faf9;
          padding: 1.625rem 1.25rem;
      }
      .add-work-order{
        position: absolute;
        right: 1.875rem;
        bottom: 3.125rem;
      }
      .pop{
        position: absolute;
        right: -0.625rem;
        bottom: 2.1875rem;
      }
      .log-cheat{
        position: fixed;
        bottom: 0;
        width: 90%;
        text-align: center;
        background-color: #0eb17a;
        color: #fff;
        padding: .9375rem;
        margin: 0 0 1.5625rem .375rem;
        border-radius: .625rem;
      }
    }
  </style>