<template>
    <div class="user-detail">
      <van-tabs v-model:active="active" @click-tab="onToggleTab">
      <van-tab title="个人信息">
        <div class="tab-box">
          <div class="user-image">
              <van-image round width="50px" height="50px" :src="info.avatarString"/>
              <van-uploader max-count=1 :preview-size="img_size" :after-read="afterRead">
                  <div class="image-left">
                      <span style="color:#A49797;">修改头像</span>
                      <van-icon name="arrow" size=20 style="margin-left:0.625rem;" />
                  </div>
              </van-uploader>
          </div>
          <van-field v-model="info.name" label="姓名" style="margin:0.625rem 0;" placeholder="请输入姓名" input-align="right" />
          <van-field v-model="info.mobile" label="手机号" style="margin:0.625rem 0;" placeholder="请输入手机号" input-align="right" />
          <van-cell title="所属游艇会" :value="info.mobile" style="margin:0.625rem 0;" />
          <van-cell title="入会时间" :value="info.createTime" style="margin:0.625rem 0;" />
          <div class="log-cheat" @click="saveInfo">保存</div>
        </div>
      </van-tab>
      <van-tab title="银行卡">
        <div class="device-list" :style="back_card_list.length < 3 ? ' height: 30rem;' : ' height: 40rem;'  ">
            <van-empty class="empty" v-if="back_card_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无银行卡"/>
            <div class="order-item" v-for="card in back_card_list" :key="card.id">
                <div class="item-body">
                    <div class="body-list">
                        <span>账户名：</span>
                        <span>{{card.accountName}}</span>
                    </div>
                    <div class="body-list">
                        <span>账户号：</span>
                        <span>{{card.bankAccount}}</span>
                    </div>
                    <div class="body-list">
                        <span>开户银行：</span>
                        <span>{{card.bankName}}</span>
                    </div>
                    <div class="body-list">
                        <span>添加时间：</span>
                        <span>{{card.createTime}}</span>
                    </div>
                </div>
                <div class="item-btn">
                  <div class="reminder" @click="editBackCard(card,'edit')">修改</div>
                </div>
            </div>
            <div class="log-cheat" @click="addBackCard('add')">添加银行卡</div>
            <div class="list-box"></div>
        </div>
      </van-tab>
    </van-tabs>
    <model-comp :visible="show" @update:visible="closeModel" @confirm="confirmModel" :title="'添加银行卡'" :width="350">
      <van-field v-model="back_card.accountName" label="账户名" style="margin:0.625rem 0;"  placeholder="请输入账户名"/>
      <van-field v-model="back_card.bankAccount" label="账户号" style="margin:0.625rem 0;"  placeholder="请输入账户号"/>
      <van-field v-model="back_card.bankName" label="开户银行" style="margin:0.625rem 0;"  placeholder="请输入开户银行"/>
    </model-comp>
    </div>
  </template>
  
  <script >
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import {getUserDetail,listBankCar,bankCard } from "../../httpSeiver/apis";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import 'vant/es/toast/style';
  import { useRoute } from 'vue-router';
  import { useStore } from "vuex";
  import ModelComp from "../../components/ModelComp/index.vue";
  export default {
    components: { ModelComp },
    setup(porps,cxt) {
      const layoutData = reactive({
        active:0,
        info:{},
        img_size:[100,60],
        after_id:null,
        getUserInfo:function () {
          getUserDetail(layoutData.after_id).then(res=>{
            if (res.code == 200) {
              layoutData.info = res.data
            }
          })
        },
        getListBankCard:function () {
          listBankCar({peopleId:layoutData.after_id}).then(res=>{
            if (res.code == 200) {
              layoutData.back_card_list = res.data
            }
          })
        },
        show:false,
        back_card:{
          peopleId:null,
          bankName:'',
          accountName:'',
          bankAccount:''
        },
        back_card_list:[],
        card_type:''
      })
      const route = useRoute()
      const store = useStore()
      onMounted(()=>{
        let userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
        layoutData.after_id = userInfo.userId
        layoutData.back_card.peopleId = userInfo.userId
        layoutData.getUserInfo()
      })
      // 切换Tab
      const onToggleTab = (val) => {
          if (val.name == 0) {
            layoutData.getUserInfo()
          }else{
            layoutData.getListBankCard()
          }
        }
      // 关闭弹窗
      const closeModel = () => {
          layoutData.show = false
      }
      // 点击确认按钮
      const confirmModel = () => {
        bankCard(layoutData.back_card,layoutData.card_type).then(res=>{
          if (res.code == 200) {
            Toast.success(layoutData.card_type == 'add' ? '添加成功' : '修改成功')
            layoutData.show = false
            layoutData.getListBankCard()
          }
        })
      }
      // 修改头像
      const afterRead = (val) => {
       var formData = new FormData()
       formData.append("file",val.file)
        upLoadFiles(formData).then(res=>{
          let data = res.data
          layoutData.info.avatar = data.path_url
        })
      };
      // 保存用户信息
      const saveInfo = () => {
        if (!layoutData.rule()) return
        editUserDetail(layoutData.info).then(res=>{
          if (res.code == 1) {
            Toast.success(res.msg)
            layoutData.getUserInfo()
          }
        })
      }
      // 添加银行卡
      const addBackCard = (type) => {
        layoutData.back_card.accountName = ''
        layoutData.back_card.bankAccount = ''
        layoutData.back_card.bankName = ''
        layoutData.show = true
        layoutData.card_type = type
        if (layoutData.back_card.id) {
          delete layoutData.back_card.id
        }
      }
      // 编辑银行卡
      const editBackCard = (item,type) => {
        layoutData.back_card.accountName = item.accountName
        layoutData.back_card.bankAccount = item.bankAccount
        layoutData.back_card.bankName = item.bankName
        layoutData.back_card.id = item.id
        layoutData.show = true
        layoutData.card_type = type
      }
      return{
          ...toRefs(layoutData),
          saveInfo,
          afterRead,
          closeModel,
          confirmModel,
          onToggleTab,
          addBackCard,
          editBackCard
      }
      
    }
  };
  </script>
  <style lang="scss">
    .user-detail{
      margin: .625rem;
      font-size: .9375rem;
      .tab-box{
        margin-top: .625rem;
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
      .user-image{
        background-color: #fff;
        border-radius: .625rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .9375rem;
        .image-left{
          display: flex;
          align-items: center;
        }
      }
      .device-list{
          overflow-y: auto;
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
    }
  </style>