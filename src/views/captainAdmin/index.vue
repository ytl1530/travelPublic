<template>
    <div class="captain-admin">
      <van-empty class="empty" v-if="captain_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无船长"/>
      <div class="individual-client-list scorll" :style="captain_list.length < 5 ? ' height: 30rem;' : ' height: 37.5rem;'">
        <div class="client-item1" v-for="captain in captain_list" :key="captain.id" @click="skipCaptainDetail(captain,'edit')">
            <van-image round style="margin:5px" width="50px" height="50px" :src="captain.avatar[0]"/>
            <div style="width: 13.4375rem;margin-left: .625rem;">
                <p style="margin-bottom:20px;"> <span>{{captain.name}}</span></p>
                <p>{{captain.mobile}}</p>
            </div>
            <van-icon name="arrow" size=26  />
        </div>
        <div class="log-cheat" @click="addCaptain('add')">添加船长</div>
        <div class="list-box"></div>
      </div>
      <model-comp :visible="show" @update:visible="closeModel" @confirm="confirmModel" :title="'添加船长'" :width="350">
        <van-field v-model="captain_info.name" label="姓名" style="margin:0.625rem 0;"  placeholder="请输入姓名"/>
        <van-field v-model="captain_info.mobile" label="手机号" style="margin:0.625rem 0;"  placeholder="请输入手机号"/>
      </model-comp>
    </div>
  </template>
  
  <script>
  import { toRefs,reactive, onMounted } from "vue";
  import { onBeforeRouteLeave, useRouter,useRoute } from "vue-router";
  import { captainList,editCaptains } from "../../httpSeiver/apis";
  import { Toast } from 'vant';
  import 'vant/es/toast/style';
  import ModelComp from "../../components/ModelComp/index.vue";
  export default {
    components: { ModelComp },
    setup(porps,cxt) {
      const layoutData = reactive({
        captain_list:[],
        clubId:null,
        show:false,
        getCaptainList:function () {
            captainList(layoutData.clubId).then(res=>{
                if (res.code == 200) {
                    layoutData.captain_list = res.data
                }
            })
        },
        captain_info:{
            name:'',
            mobile:''
        },
        captain_type:''
      })
      const router = useRouter()
      onMounted(()=>{
        let userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
        layoutData.clubId = userInfo.clubId
        layoutData.getCaptainList()
      })
       // 关闭弹窗
       const closeModel = () => {
        layoutData.show = false
      }
      // 点击确认按钮
      const confirmModel = () => {
        editCaptains(layoutData.captain_info,layoutData.captain_type).then(res=>{
          if (res.code == 200) {
            Toast.success(layoutData.captain_type == 'add' ? '添加成功' : '修改成功')
            layoutData.show = false
            setTimeout(()=>{
              layoutData.getCaptainList()
            },1000)
          }
        })
      } 
      // 编辑船长
      const skipCaptainDetail = (item,type) => {
        layoutData.captain_type = type
        layoutData.captain_info.name = item.name
        layoutData.captain_info.mobile = item.mobile
        layoutData.captain_info.id = item.id
        layoutData.show = true
      }
      // 添加船长
      const addCaptain = (type) => {
        layoutData.captain_type = type
        layoutData.captain_info.name = ''
        layoutData.captain_info.mobile = ''
        if (layoutData.captain_info.id) {
            delete layoutData.captain_info.id
        }
        layoutData.show = true 
      }
      return{
          ...toRefs(layoutData),
          skipCaptainDetail,
          addCaptain,
          closeModel,
          confirmModel
      }
      
    }
  };
  </script>
  
  <style lang="scss">
    .captain-admin{
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
        .list-box{
            margin-top: 3.625rem;
            background-color: #f6faf9;
            padding: 1.625rem 1.25rem;
        }
    }
  </style>