<template>
    <div class="finance-admin">
      <van-tabs v-model:active="active" @click-tab="onToggleTab">
        <van-tab title="账单列表">
          <div class="device-list" :style="finance_list.length < 4 ? ' height: 30rem;' : ' height: 40rem;'" @scroll="handleScrolls">
            <van-empty class="empty" v-if="finance_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无账单"/>
            <div class="order-item" v-for="finance in finance_list" :key="finance.id" @click="skipDetail(order.orderId)">
                <div class="item-header">
                    <span style="font-size:14px;font-weight: bold;">{{finance.orderSn}}</span>
                    <span>{{finance.status == 0 ? '未完成' : finance.status == 1 ? '已完成' : '错误'}}</span>
                </div>
                <div class="item-body">
                    <div class="body-list">
                        <span>变化额度：</span>
                        <span>{{finance.balance}}</span>
                    </div>
                    <div class="body-list">
                        <span>备注：</span>
                        <span style="width:200px;text-align: right; display: inline-block;line-height: 20px;">{{finance.remark}}</span>
                    </div>
                    <div class="body-list">
                        <span>创建时间：</span>
                        <span>{{finance.createTime}}</span>
                    </div>
                </div>
            </div>
            <div class="list-box"></div>
          </div>
        </van-tab>
        <van-tab title="申请提现">
          <div class="account">
            <p>账户余额(元)</p>              
            <p style="margin-top: 10px;font-size: 35px;text-align: center;"><span style="font-size: 24px;">￥</span>{{user_info.balance}}</p>
            <div class="item-btn">
              <div class="reminder" @click="openWithdrawPopup">申请提现</div>
            </div>
          </div>
          <div style="margin: .625rem 0 0 .625rem; ">提现记录</div>
          <div class="device-list" style="height: 25rem;">
            <van-empty class="empty" v-if="page_cash.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无记录"/>
            <div class="order-item" v-for="cash in page_cash" :key="cash.id">
                <div class="item-body">
                    <div class="body-list">
                        <span>提现时间：</span>
                        <span>{{cash.createTime}}</span>
                    </div>
                    <div class="body-list">
                        <span>提现金额：</span>
                        <span>{{cash.price}}</span>
                    </div>
                    <div class="body-list">
                        <span>提现前金额：</span>
                        <span>{{cash.originalLimit}}</span>
                    </div>
                    <div class="body-list">
                        <span>提现银行卡：</span>
                        <span>{{cash.bankCard.bankName}}</span>
                    </div>
                    <!-- <div class="body-list">
                        <span>备注：</span>
                        <span>{{cash.remark}}</span>
                    </div> -->
                    <div class="body-list">
                        <span>状态：</span>
                        <span>{{cash.status == 0 ? '已申请' : cash.status == 1 ? '已转账' : '驳回'}}</span>
                    </div>
                </div>
            </div>
            <div class="list-box"></div>
          </div>
        </van-tab>
      </van-tabs>
      <van-popup v-model:show="show" round closeable position="bottom" :style="{ height: '60%'}" @scroll="handleCashScrolls">
        <div class="cash">
          <van-field v-model="back_name" is-link readonly label="选择银行卡" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择选择银行卡" @click="showPicker = true"/>
          <van-field v-model.number="cash" label="提现金额" style="margin:0.625rem 0;"  placeholder="请输入提现金额"/>
          <van-cell title="账户名" :value="back_card.accountName" style="margin:0.625rem 0;" />
          <van-cell title="账户号" :value="back_card.bankAccount" style="margin:0.625rem 0;" />
          <van-cell title="开户行" :value="back_card.bankName" style="margin:0.625rem 0;" />
          <div class="log-cheats" @click="onComfigCash">提交申请</div>
        </div>
      </van-popup>
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker :columns="back_card_list" :columns-field-names="customFieldName" @cancel="showPicker = false" @confirm="onConfirm" />
      </van-popup>
    </div>
  </template>
  
 <script>
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import { checkList,getUserDetail,pageCashOut,listBankCar,cashOut } from "../../httpSeiver/apis";
  import 'vant/es/toast/style';
  import { useRoute, useRouter } from 'vue-router';
  export default {
    components: {  },
    setup(porps,cxt) {
        const layoutData = reactive({
            active:0,
            finance_list:[],
            params:{
                peopleId:null,
                pageNum:1,
                pageSize:10
            },
            total_page:null,
            user_info:{},
            getCheckList:function () {
                checkList(layoutData.params).then(res=>{
                    if (res.code == 200) {
                        let order = res.data
                        layoutData.total_page =  res.data.total
                        layoutData.finance_list.push(...order)
                        layoutData.finance_list  = layoutData.finance_list
                    }
                }) 
            },
            getUserInfo:function () {
              getUserDetail(layoutData.params.peopleId).then(res=>{
                if (res.code == 200) {
                  layoutData.user_info = res.data
                  layoutData.getPageCashOut()
                }
              })
            },
            page_cash:[],
            total:null,
            getPageCashOut:function () {
              pageCashOut(layoutData.params).then(res=>{
                console.log(layoutData.page_cash);
                if (res.code == 200) {
                  let order = res.data.records
                  layoutData.total =  res.data.total
                  layoutData.page_cash.push(...order)
                  layoutData.page_cash  = layoutData.page_cash
                }
              })
            },
            show:false,
            cash:null,
            back_card_list:[],
            back_name:'',
            showPicker:false,
            back_card:{
              bankName:'请选择银行卡',
              accountName:'请选择银行卡',
              bankAccount:'请选择银行卡',
            },
            customFieldName:{text:'bankName',value:'id'},
            getListBankCard:function () {
              listBankCar({peopleId:layoutData.params.peopleId}).then(res=>{
                if (res.code == 200) {
                  layoutData.back_card_list = res.data
                }
              })
            },
        })
        const route = useRoute()
        const router = useRouter()
        onMounted(()=>{
            let userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
            layoutData.params.peopleId = userInfo.userId
            layoutData.getCheckList()
        })
        // 账单列表触底加载
        const handleScrolls = (e) => {
            if((e.target.scrollTop + 1)+ e.target.clientHeight >= e.target.scrollHeight){
            if(layoutData.total_page > layoutData.finance_list.length){
                Toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                });
                layoutData.params.pageNum++
                layoutData.getCheckList() 
            }else{
                Toast('已经滑到底了！');
            }
            }
        }
        // 提现申请记录列表触底加载
        const handleCashScrolls = (e) => {
            if((e.target.scrollTop + 1)+ e.target.clientHeight >= e.target.scrollHeight){
            if(layoutData.total_page > layoutData.page_cash.length){
                Toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                });
                layoutData.params.pageNum++
                layoutData.getPageCashOut()
            }else{
                Toast('已经滑到底了！');
            }
            }
        }
        // 切换Tab
        const onToggleTab = (val) => {
          layoutData.params.pageNum = 1
          if (val.name == 0) {
            layoutData.finance_list = []
            layoutData.getCheckList()
          }else{
            layoutData.page_cash = []
            layoutData.getUserInfo()
          }
        }
        // 打开提现弹窗
        const openWithdrawPopup = () => {
          layoutData.show = true
          layoutData.back_card.bankName = '请选择银行卡'
          layoutData.back_card.accountName = '请选择银行卡'
          layoutData.back_card.bankAccount = '请选择银行卡'
          layoutData.back_name = ''
          if (layoutData.back_card.id) {
            delete layoutData.back_card.id
          }
          layoutData.getListBankCard()
        }
        // 确认选择银行卡
        const onConfirm = (val) => {
          layoutData.showPicker = false
          layoutData.back_card = val
          layoutData.back_name = val.bankName
        }
        // 确认提现
        const onComfigCash = () => {
          let params = {
            peopleId:layoutData.params.peopleId,
            cash:layoutData.cash,
            cardId:layoutData.back_card.id
          }
          cashOut(params).then(res=>{
            if (res.code == 200) {
              Toast.success('申请成功')
              layoutData.show = false
              layoutData.page_cash = []
              layoutData.active = 1 
              setTimeout(()=>{
                layoutData.getUserInfo()
              },1000)
            }
          })
        }
        return{
            ...toRefs(layoutData),
            handleScrolls,
            onToggleTab,
            openWithdrawPopup,
            handleCashScrolls,
            onConfirm,
            onComfigCash
        }
      
    }
  };
  </script>
  <style lang="scss">
    body{
      background-color: #f6faf9;
    }
    .finance-admin{
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
          padding: .5rem;
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
          position: relative;
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
          margin-top: 3.625rem;
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
      .account{
        background-color: #0eb17a;
        color: #fff;
        margin-top: .625rem;
        padding: 1.25rem;
        border-radius: .625rem;
        .item-btn{
          display: flex;
          justify-content: space-around;
          margin-top: 1.5625rem;
          .reminder{
            width: 30%;
            background-color: #cfefe4;
            color: #13b27b;
            padding: .6rem .8rem;
            text-align: center;
            border-radius: 1.4rem;
          }
        }
      }
      .cash{
        position: relative;
        margin: 2.5rem .625rem .625rem .625rem;
        .log-cheats{
          text-align: center;
          background-color: #0eb17a;
          color: #fff;
          padding: .875rem 9.125rem;
          margin-bottom: .625rem;
          border-radius: 1.625rem;
          position: fixed;
          bottom: 0;
          left: .625rem;
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
      }
      .van-popup {
        position: fixed;
        max-height: 100%;
        overflow-y: auto;
        background-color: #f6faf9;
        transition: var(--van-popup-transition);
        -webkit-overflow-scrolling: touch;
      }
    }
  </style>