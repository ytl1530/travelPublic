<template>
    <div class="shipowner-admin">
      <van-empty class="empty" v-if="shipowner_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无船主"/>
      <div class="individual-client-list scorll" :style="shipowner_list.length < 5 ? ' height: 30rem;' : ' height: 37.5rem;'">
            <div class="client-item1" v-for="shipowner in shipowner_list" :key="shipowner.id" @click="skipShipownerDetail(item)">
              <van-image round style="margin:5px" width="50px" height="50px" :src="shipowner.avatar[0]"/>
              <div style="width: 13.4375rem;margin-left: .625rem;">
                <p style="margin-bottom:20px;"> <span>{{shipowner.name}}</span></p>
                <p>{{shipowner.mobile}}</p>
              </div>
              <van-icon name="arrow" size=26  />
            </div>
      </div>
      
    </div>
  </template>
  
  <script>
  import { toRefs,reactive, onMounted } from "vue";
  import { onBeforeRouteLeave, useRouter,useRoute } from "vue-router";
  import { shipownerList } from "../../httpSeiver/apis";
  import { Toast } from 'vant';
  import 'vant/es/toast/style';
  export default {
    components: {},
    setup(porps,cxt) {
      const layoutData = reactive({
        shipowner_list:[],
        clubId:null,
        getShipownerList:function () {
            shipownerList(layoutData.clubId).then(res=>{
                if (res.code == 200) {
                    layoutData.shipowner_list = res.data
                }
            })
        }
      })
      const router = useRouter()
      onMounted(()=>{
        let userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
        layoutData.clubId = userInfo.clubId
        layoutData.getShipownerList()
      })
      // 跳转详情
      const skipShipownerDetail = (item) => {
        
      }
      return{
          ...toRefs(layoutData),
          skipShipownerDetail
      }
      
    }
  };
  </script>
  
  <style lang="scss">
    .shipowner-admin{
      margin: 10px;
      font-size: 15px;
      .scorll{
        // height: 37.5rem;
        overflow-y: auto;
      }
      .corporate-client-list{
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
      .individual-client-list{
        display: flex;
        flex-direction: column;
        // align-items: center;
        .client-item1{
          background-color: #fff;
          border-radius: 10px;
          padding: 20px;
          margin-top: 10px;
          display: flex;
          align-items: center;
        }
      }
    }
      .empty{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .van-empty__description {
          margin-top: var(--van-empty-description-margin-top);
          padding: 10px;
          color: var(--van-empty-description-color);
          font-size: var(--van-empty-description-font-size);
          line-height: var(--van-empty-description-line-height);
        } 
      }
  </style>