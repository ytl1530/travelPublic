<template>
    <div class="authority-admin">
        <div class="device-list" @scroll="handleScrolls">
          <van-empty class="empty" v-if="role_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无角色"/>
          <div class="order-item" v-for="item in role_list" :key="item.id">
            <div class="item-header"  @click="skipDetail(item.id)">
              <span style="font-size:14px;font-weight: bold;">{{item.roleName}}</span>
              <span> <div class="reminders"  @click="setAuthority(item.id)">设置权限</div></span>
            </div>
            <!-- <div class="item-body">
                {{item.desc}}
            </div> -->
           
          </div>
          <div class="list-box"></div>
        </div>
    </div>
  </template>
  
  <script >
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import { listAllRole } from "../../httpSeiver/apis";
  import 'vant/es/toast/style';
  import { useRoute, useRouter } from 'vue-router';
  export default {
    components: {  },
    setup(porps,cxt) {
      const layoutData = reactive({
        role_list:[],
        getRoleList:function () {
            listAllRole().then(res=>{
                if (res.code == 200) {
                    layoutData.role_list = res.data
                }
            })
        }
      })
      const route = useRoute()
      const router = useRouter()
      onMounted(()=>{
        layoutData.getRoleList()
      })
      const skipDetail = (id) => {
        router.push(`/roleAdmin/roleDetail?id=${id}`)
      }
      // 设置权限
      const setAuthority = (id) => {
        router.push(`/roleAdmin/roleDetail?id=${id}`)
      }  
      return{
          ...toRefs(layoutData), 
          skipDetail,
          setAuthority
      }
      
    }
  };
  </script>
  <style lang="scss">
    body{
      background-color: #f6faf9;
    }
    .authority-admin{
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
          align-items: center;
          .reminders{
            background-color: #cfefe4;
            color: #13b27b;
            // width: 7.5rem;
            padding: .6rem .9375rem;
            // margin:0 0 0 14.75rem;
            text-align: center;
            border-radius: .4rem;
          }
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
                text-align: center;
                border-radius: .625rem;
            }
        }
        .reminder{
            background-color: #cfefe4;
            color: #13b27b;
            // width: 7.5rem;
            padding: .6rem 0;
            margin:0 0 0 14.75rem;
            text-align: center;
            border-radius: .4rem;
          }
      }
      .device-list{
          height: 40rem;
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
          margin-top: .625rem;
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