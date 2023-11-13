<template>
    <div class="authority-detail">
        <div class="device-list">
          <van-empty class="empty" v-if="authority_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无权限"/>
          <div class="role-box">
            <van-checkbox-group v-model="checkeds">
              <van-cell v-for="(item, index) in authority_list" :key="item.id" :title="item.menuName">
                <template #right-icon><van-checkbox :name="item.id" /></template>
              </van-cell>
            </van-checkbox-group>
          </div>
          <div class="log-cheat" @click="setAuthority">设置权限</div>
          <div class="list-box"></div>
        </div>
    </div>
  </template>
  
  <script>
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import { listSettingRole,setRoleMenu } from "../../httpSeiver/apis";
  import 'vant/es/toast/style';
  import { useRoute, useRouter } from 'vue-router';
  export default {
    components: {  },
    setup(porps,cxt) {
      const layoutData = reactive({
        id:null,
        authority_list:[],
        checkeds:[],
        getRoleMenusInfo:function () {
           listSettingRole(layoutData.id).then(res=>{
            if (res.code == 200) {
              res.data.forEach(item=>{
                if (item.selected == true) {
                  layoutData.checkeds.push(item.id)
                }
              })
              layoutData.authority_list = res.data
            }else{
              Toast(res.msg)
            }
          })
        }
      })
      const route = useRoute()
      const router = useRouter()
      onMounted(()=>{
        layoutData.id = route.query.id
        layoutData.getRoleMenusInfo()
      })  
      const setAuthority = () => {
        if (layoutData.checkeds.length == 0 ) {
          Toast('请选择菜单权限')
          return false
        }
        setRoleMenu({roleId:layoutData.id,menuIds:layoutData.checkeds}).then(res=>{
          if (res.code == 200) {
                Toast.success('设置成功')
                layoutData.getRoleMenusInfo()
            }
        })
      }

      return{
          ...toRefs(layoutData),
          setAuthority
      }
      
    }
  };
  </script>
  <style lang="scss">
    body{
      background-color: #f6faf9;
    }
    .authority-detail{
      margin: .625rem;
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