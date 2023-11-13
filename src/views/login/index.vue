<template>
  <div class="login">
    <div class="login-item">
      <p class="title">旅游</p>
      <!-- <img class="image" :src="userInfo.avatar"> -->
      <van-image class="image" radius="5" fit="cover" :src="userInfo.avatar"/>
      <div class="hint" v-if="isPageShow == true">加载中...</div>
      <div class="hints" v-if="userInfo.openId">
          <p>因为您还没有绑定角色，无法登录系统</p>
          <p>请联系后台管理员添加角色</p>
          <div class="item-btn">
            <div class="reminder" @click="()=>{showPhone=true}">绑定角色</div>
          </div>
      </div>
    </div>
    <van-popup v-model:show="showPhone" round closeable position="bottom">
      <div class="phone">
        <van-field v-model="phone" style="margin-top:20px;" label="手机号" placeholder="请输入手机号" />
        <!-- <van-field v-model="send_code" style="margin-top:20px;" center clearable label="短信验证码" placeholder="请输入短信验证码">
          <template #button>
            <van-button size="small" :disabled="isShow" type="primary" @click="getPhoneCode">{{content}}</van-button>
          </template>
        </van-field> -->
        <div class="item-btn">
              <div class="reminder" @click="comfig">确认绑定</div>
          </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { toRefs,reactive, onMounted } from "vue";
import { onBeforeRouteLeave, useRouter,useRoute } from "vue-router";
import { useStore } from "vuex";
import { getToken,bindPhone} from "../../httpSeiver/apis";
import { appid } from "../../untils/constant";
import { setToken,removeToken,getTokens } from "../../untils/cookie";
import { salesmanReturnUrl } from "../../untils/wwwUrl";
import { Toast } from 'vant';
import 'vant/es/toast/style';
export default {
  setup(porps,cxt) {
      const router = useRouter()
      const store = useStore();
      const route = useRoute()
      const layoutData = reactive({
        userInfo:{},
        showPhone:false,
        phone:'',
        sms:'',
        token:'',
        content:'获取验证码',
        num:60,
        isShow:false,
        send_code:'',
        isPageShow:false,
        getCode:function() {
          //没授权先授权,授权后会有一个code在地址栏上
          const wwwUrl = salesmanReturnUrl() // 公众号的外网地址
          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            appid +"&redirect_uri=" + wwwUrl +"&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";  
        },
        get_token:function () {
          getToken({code:route.query.code}).then(ress=>{
            if(ress.code == 200){
              layoutData.userInfo = ress.data
              if (ress.data.openId && ress.data.openId !== null) {
                console.log(123);
                layoutData.isPageShow = false
              }
              if(ress.data.token){
                layoutData.isPageShow = true
                setToken(ress.data.token)
                sessionStorage.setItem('user_info',JSON.stringify(ress.data))
                router.push('/layout')
              }
            }
          }).catch(err=>{
            layoutData.getCode()
          })
        },
    })
    onMounted(()=>{
      if(!route.query.code){
        layoutData.getCode()
      }else{
        layoutData.get_token()
      }
    })
    const comfig = () => {
        setToken(layoutData.token)
        bindPhone({mobile:layoutData.phone,openId:layoutData.userInfo.openId}).then(respon=>{
              if(respon.code == 200){
                layoutData.isPageShow = true
                setToken(respon.data.token)
                sessionStorage.setItem('user_info',JSON.stringify(respon.data))
                router.push('/layout')
              }else{
                Toast(respon.msg)
              }
            })
        // checkCode({phone:layoutData.phone,code:layoutData.send_code}).then(ress=>{
        //   if (ress.code == 1) {
            
        //   }else{
        //     Toast(ress.msg)
        //   }
        // })
    }
    const getPhoneCode = () => {
      let phone_rule = new RegExp(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/)  
      if (phone_rule.test(layoutData.phone)) {
        layoutData.isShow = true
        layoutData.getSendCode()
        let timr=setInterval(function () {
          layoutData.content='重新获取' + '(' + layoutData.num + ')';
          
          if (layoutData.num>=0){
              layoutData.num--
          }else {
            layoutData.content="获取验证码";
            layoutData.isShow = false
            layoutData.num = 60
            clearInterval(timr)
          }
        },1000);
      }else{
        Toast('请输入正确的手机号')
      }
    }
    return{
        ...toRefs(layoutData),
        comfig,
        getPhoneCode
    }
    
  }
};
</script>
<style lang="scss">
  body{
    background-color: #010647;
  }
  .login{
    color: #fff;
    .login-item{
      .title{
        text-align: center;
        margin-top: 80px;
        font-size: 1.25rem;
        font-weight: 600;
      }
      .image{
        width: 9.375rem;
        height: 9.375rem;
        position: absolute;
        top: 43%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .hint{
        text-align: center;
        margin-top: 31.25rem;
        font-weight: 600;
      }
      .hints{
        text-align: center;
        margin-top: 27rem;
        font-weight: 600;
        line-height: 25px;
      }
    }
    .phone{
      // width: 21.25rem;
      height: 12.5rem;
      // height: 16.875rem;
      padding: 1.25rem;
       .van-cell {
        position: relative;
        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding: .875rem .625rem;
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
      .van-cell__title, .van-cell__value {
          flex: 1;
      }
      .van-field__label {
          flex: none;
          box-sizing: border-box;
          width: var(--van-field-label-width);
          margin-right: var(--van-field-label-margin-right);
          color: var(--van-field-label-color);
          text-align: left;
          word-wrap: break-word;
      }
      .item-btn{
        display: flex;
        justify-content: space-around;
        padding: .625rem 0;
        .reminder{
          background-color: #cfefe4;
          color: #13b27b;
          width: 12.5rem;
          padding: .9375rem 0;
          margin-top: 1.25rem;
          text-align: center;
          border-radius: .625rem;
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
          margin-top: 1.25rem;
          text-align: center;
          border-radius: .625rem;
        }
    }
  }
</style>