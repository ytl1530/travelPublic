<template>
    <div class="order-detail">
      <van-tabs v-model:active="active">
        <van-tab title="订单信息">
          <div class="tab-box">
            <!-- <van-field  required v-model="info.corporate_name" label="供应商名称" style="margin:0.625rem 0;" placeholder="请输入供应商名称" input-align="right"  /> -->
            <div v-if="order_info.orderStatus == 1">
              <van-field v-model="captainUser.name" is-link readonly label="船长" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择船长" @click="showCaptainPicker = true"/>
              <van-field v-model="customizedUser.name" is-link readonly label="客服" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择客服" @click="showServicePicker = true"/>
            </div>
            <div v-else>
              <van-cell title="船长" :value="captainUser.name" style="margin:0.625rem 0;" />
              <van-cell title="客服" :value="customizedUser.name" style="margin:0.625rem 0;" />
            </div>
            <van-cell title="订单编号" :value="order_info.orderSn" style="margin:0.625rem 0;" />
            <van-cell title="游艇名称" :value="order_info.yachtName" style="margin:0.625rem 0;" />
            <van-cell title="订单总价" :value="'￥' +  order_info.totalPrice" style="margin:0.625rem 0;" />
            <van-cell title="实际支付总价" :value="'￥' + order_info.actualTotalPrice" style="margin:0.625rem 0;" />
            <van-cell title="预约开始时间" :value="order_info.reservationStartTime" style="margin:0.625rem 0;" />
            <van-cell title="预约结束时间" :value="order_info.reservationEndTime" style="margin:0.625rem 0;" />
            <van-cell title="预约时长" :value="order_info.reservationDuration" style="margin:0.625rem 0;" />
            <van-cell title="下单时间" :value="order_info.orderTime" style="margin:0.625rem 0;" />
            <!-- 船长弹窗 -->
            <div class="yacht-type">
                    <van-popup v-model:show="showCaptainPicker" closeable round position="bottom">
                        <div class="device-list" style="margin: 2.5rem .625rem .625rem .625rem;">
                            <van-empty class="empty" v-if="captain_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无船长"/>
                            <div class="order-item" v-for="captain in captain_list" :key="captain.id">
                                <div class="goods-list">
                                    <van-radio-group v-model="params.captainId">
                                        <van-radio @click="propleSelect(captain)" :name="captain.id"  checked-color="#0eb17a"></van-radio>
                                    </van-radio-group>
                                    <van-image style="margin-left: 10px;" round width="5rem" height="5rem" fit="cover" :src="captain.avatar[0]"/>
                                    <div class="goods-item">
                                        <div class="body-list">
                                            <span>船长名称：</span>
                                            <span>{{captain.name}}</span>
                                        </div>
                                        <div class="body-list">
                                            <span>船长电话：</span>
                                            <span>{{captain.mobile}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="log-cheats" @click="onComfigFreePeople('captain')">确认</div>
                            <div class="list-box"></div>
                        </div>
                    </van-popup>
            </div>
            <!-- 客服弹窗 -->
            <div class="yacht-type">
                    <van-popup v-model:show="showServicePicker" closeable round position="bottom">
                        <div class="device-list" style="margin: 2.5rem .625rem .625rem .625rem;">
                            <van-empty class="empty" v-if="service_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无客服"/>
                            <div class="order-item" v-for="serve in service_list" :key="serve.id">
                                <div class="goods-list">
                                    <van-radio-group v-model="params.customerId">
                                        <van-radio @click="propleSelect(serve)" :name="serve.id"  checked-color="#0eb17a"></van-radio>
                                    </van-radio-group>
                                    <van-image style="margin-left: 10px;" round width="5rem" height="5rem" fit="cover" :src="serve.avatar[0]"/>
                                    <div class="goods-item">
                                        <div class="body-list">
                                            <span>客服名称：</span>
                                            <span>{{serve.name}}</span>
                                        </div>
                                        <div class="body-list">
                                            <span>客服电话：</span>
                                            <span>{{serve.mobile}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="log-cheats" @click="onComfigFreePeople('serve')">确认</div>
                            <div class="list-box"></div>
                        </div>
                    </van-popup>
            </div>
            <!-- <div class="log-cheat">修改信息</div> -->
        </div>
        </van-tab>
        <van-tab title="服务列表" class="device-list" :style="serviceList.length < 3 ? ' height: 30rem;' : ' height: 40rem;'">
          <van-empty class="empty" v-if="serviceList.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无服务"/>
              <div class="order-item" v-for="service in serviceList" :key="service.id">
                <div class="item-body">
                    <div class="body-list">
                        <span>服务名称：</span>
                        <span>{{service.serviceName}}</span>
                    </div>
                    <div class="body-list">
                        <span>服务位置：</span>
                        <span>{{service.location == 0 ? '内部' : service.location == 1 ? '外部' : '其他'}}</span>
                    </div>
                    <div class="body-list">
                        <span>价格：</span>
                        <span>￥{{service.price}}</span>
                    </div>
                    <div class="body-list">
                        <span>是否收费：</span>
                        <span>{{service.isCharged == 0 ? '否' :  '是'}}</span>
                    </div>
                    <div class="body-list">
                        <span>是否必选：</span>
                        <span>{{service.required == 0 ? '否' :  '是'}}</span>
                    </div>
                    <div class="body-list">
                        <span>价格类型：</span>
                        <span>{{service.priceType == 0 ? '免费' : service.priceType == 1 ? '固定价格' : service.priceType == 2 ? '按小时收费' : '按人数计算'}}</span>
                    </div>
                </div>
              </div>
              <div class="list-box"></div>
        </van-tab>
        <van-tab title="乘客列表">
          <div class="device-list" :style="serviceList.length < 4 ? ' height: 30rem;' : ' height: 40rem;'">
                    <van-empty class="empty" v-if="passenger_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无乘客"/>
                    <div class="order-item" v-for="insure in passenger_list" :key="insure.id">
                        <div class="item-body">
                            <div class="body-list">
                                <span>姓名：</span>
                                <span>{{insure.userName}}</span>
                            </div>
                            <div class="body-list">
                                <span>联系方式：</span>
                                <span>{{insure.mobile}}</span>
                            </div>
                            <div class="body-list">
                                <span>身份证号码：</span>
                                <span>{{insure.idCard}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="list-box"></div>
                </div>
        </van-tab>
        <van-tab title="保险列表">
          <div class="device-list" :style="serviceList.length < 4 ? ' height: 30rem;' : ' height: 40rem;'">
                    <van-empty class="empty" v-if="insure_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无保险"/>
                    <div class="order-item" v-for="insure in insure_list" :key="insure.id">
                        <div class="item-body">
                          <div class="body-list">
                                <span>保险名称：</span>
                                <span>{{insure.insureName}}</span>
                            </div>
                            <div class="body-list">
                                <span>保险价格：</span>
                                <span>￥{{insure.price}}</span>
                            </div>
                            <div class="body-list">
                                <span>保险介绍：</span>
                                <span style="width:200px;text-align: right; display: inline-block;line-height: 20px;">{{insure.introduction}}</span>
                            </div>
                            <div class="body-list">
                                <span>是否必须购买：</span>
                                <span>{{insure.isMandatory == 0 ? '否' : '是'}}</span>
                            </div>
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
  import { orderDetail,listFreePeople,updateCaptain } from "../../httpSeiver/apis";
  import 'vant/es/toast/style';
  import { useRoute, useRouter } from 'vue-router';
  export default {
    components: {  },
    setup(porps,cxt) {
      const layoutData = reactive({
        active:0,
        params:{
          orderId:null,
          captainId:null,
          customerId:null
        },
        order_info:{},
        serviceList:[],
        passenger_list:[],
        insure_list:[],
        getOrderDetail:function () {
          orderDetail(layoutData.params.orderId).then(res=>{
            if (res.data.captainUser == null) {
              res.data.captainUser = {
                name:''
              }
            }
            if (res.data.customizedUser == null) {
              res.data.customizedUser = {
                name:''
              }
            }
            layoutData.order_info = res.data
            layoutData.captainUser = res.data.captainUser
            layoutData.customizedUser = res.data.customizedUser
            layoutData.serviceList = res.data.services
            layoutData.passenger_list = res.data.passengerList
            layoutData.insure_list = res.data.insureList
            if (res.data.orderStatus == 1) {
              layoutData.getListFreePeople()
            }
          })
        },
        getListFreePeople:function () {
          let param = {
            startTime:layoutData.order_info.reservationStartTime,
            endTime:layoutData.order_info.reservationEndTime,
          }
          listFreePeople(param).then(res=>{
            if (res.code == 200) {
              layoutData.captain_list = res.data.captainList
              layoutData.service_list = res.data.customerList
            }
          })
        },
        // 船长选择
        captainUser:{},
        showCaptainPicker:false,
        captain_list:[],
        // 客服选择
        customizedUser:{},
        showServicePicker:false,
        service_list:[],
        select_item:{}
      })
      const route = useRoute()
      const router = useRouter()
      onMounted(()=>{
        layoutData.params.orderId = parseInt(route.query.id) 
        layoutData.getOrderDetail()
      })
      // 选择按钮信息
      const propleSelect = (item) => {
        layoutData.select_item = item
      }
      // 更改船长
      const onComfigFreePeople = (val) => {
        if (val == 'captain') {
          layoutData.params.customerId = null
        }else{
          layoutData.params.captainId = null
        }
        Dialog.confirm({
          title: `更改${val == 'captain' ? '船长' : '客服'}`,
          message:`是否将${val == 'captain' ? '船长' : '客服'}更改为：${layoutData.select_item.name}`
        }).then(() => {
          updateCaptain(layoutData.params).then(res=>{
            if (res.code == 200) {
              Toast.success('更改成功')
              setTimeout(()=>{
                if (val == 'captain') {
                  layoutData.showCaptainPicker = false
                }else{
                  layoutData.showServicePicker = false
                }
                layoutData.getOrderDetail()
              },1000)
            }else{
              Toast(res.msg)
            }
          }) 
        })
      }
      return{
        ...toRefs(layoutData),
        onComfigFreePeople,
        propleSelect
      }
      
    }
  };
  </script>
  <style lang="scss">
    body{
      background-color: #f6faf9;
    }
    .order-detail{
      margin: .625rem;
      font-size: .9375rem;
      .tab-box{
        margin-top: .625rem;
      }
      .role{
        background-color: #fff;
        padding-top: 10px;
        border-radius: 10px;
      }
      .role-box{
        padding: .9375rem 0 .9375rem 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        // justify-content: space-between;
      }
      .log-cheat{
        text-align: center;
        background-color: #0eb17a;
        color: #fff;
        padding: .9375rem;
        margin: 3.125rem 1.25rem;
        border-radius: .625rem;
      }
      .van-cell {
        position: relative;
        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding: .8125rem .9375rem;
        overflow: hidden;
        border: none;
        color: var(--van-cell-text-color);
        font-size: var(--van-cell-font-size);
        line-height: var(--van-cell-line-height);
        border-radius: .625rem;
        // background: var(--van-cell-background-color);
      }
      .van-cell:after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: var(--van-padding-md);
        bottom: 0;
        left: var(--van-padding-md);
        border-bottom: none;
        transform: scaleY(0.5);
      }
      .van-cell__value span {
        font-size: .875rem;
      }
      .van-cell__title span {
        font-size: .875rem;
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
          margin-top: .625rem;
          background-color: #f6faf9;
          padding: 1.625rem 1.25rem;
      }
      .parking-lot{
          background-color: #fff;
          margin-top: .625rem;
          padding: .625rem ;
          border-radius: .625rem;
          display: flex;
        .lot-info{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 1.25rem;
          .top{
            width: 15.625rem;
            display: flex;
            justify-content: space-between;
          }
          p{
            margin: .3125rem 0 ;
          }
        }
      }
      .box{
        height: 40rem;
        overflow-y: auto;
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
              background-color: #cfefe4;
              color: #13b27b;
              width: 7.5rem;
              padding: .5rem 0;
              margin:0 .3125rem;
              text-align: center;
              border-radius: .625rem;
            }
          }
        }
      }
      .role{
        background-color: #fff;
        padding-top: 10px;
        border-radius: 10px;
      }
      .role-box{
        padding: .9375rem 0 .9375rem 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        // justify-content: space-between;
      }
      .file-url{
        position: relative;
        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding: 0.8125rem 0.9375rem;
        overflow: hidden;
        border: none;
        color: var(--van-cell-text-color);
        font-size: var(--van-cell-font-size);
        line-height: var(--van-cell-line-height);
        border-radius: 0.625rem;
        margin: 0.625rem 0px;
        background-color: #fff;
        justify-content: space-between;
        .btn-down{
            background-color: #0eb17a;
            padding: 0 10px;
            color: #fff;
            border-radius: 5px;
        }
      }
      .yacht-type{
          position: relative;
          .device-list{
            height: 37.5rem;
            overflow-y: auto;
          }
          .van-popup {
                position: fixed;
                max-height: 100%;
                overflow-y: auto;
                background-color: #f6faf9;
                transition: var(--van-popup-transition);
                -webkit-overflow-scrolling: touch;
          }
          .log-cheats{
                text-align: center;
                background-color: #0eb17a;
                color: #fff;
                padding: 14px 162px;
                margin-bottom: 10px;
                border-radius: 1.625rem;
                position: fixed;
                bottom: 0;
          }
           .order-item{
                background-color: #fff;
                margin-top: .625rem;
                padding: .625rem;
                border-radius: .625rem;
                font-size: .875rem;
                    .item-btn{
                    display: flex;
                    justify-content: space-around;
                    padding: .625rem 0;
                    .reminder{
                        background-color: #cfefe4;
                        color: #13b27b;
                        // width: 7.5rem;
                        padding: .6rem .8rem;
                        text-align: center;
                        border-radius: .4rem;
                    }
                    }
                    .reminder{
                        background-color: #efd0cf;
                        color: #b21313;
                        // width: 7.5rem;
                        padding: .6rem 0;
                        margin:0 0 0 14.75rem;
                        text-align: center;
                        border-radius: .4rem;
                    }
                    .item-header{
                        display: flex;
                        justify-content: space-between;
                        position: relative;
                        padding: .625rem .625rem;
                        align-items: center;
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
            }
            .goods-list{
                display: flex;
                align-items: center;
                color:#999;
                .goods-item{
                    flex: 1;
                    margin-left: .9375rem;
                    .body-list{
                        margin: 5px;
                    }
                }
            }
            .list-box{
            margin-top: .625rem;
            background-color: #f6faf9;
            padding: 1.625rem 1.25rem;
            }
      }
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
                    // width: 7.5rem;
                    padding: .6rem .8rem;
                    text-align: center;
                    border-radius: .4rem;
                }
            }
            // .reminder{
            //     background-color: #cfefe4;
            //     color: #13b27b;
            //     // width: 7.5rem;
            //     padding: .6rem 0;
            //     margin:0 0 0 14.75rem;
            //     text-align: center;
            //     border-radius: .4rem;
            // }
        }
    }
  </style>