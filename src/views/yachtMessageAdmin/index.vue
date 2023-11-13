<template>
    <div class="yacht-message-admin">
        <van-tabs v-model:active="active" @click-tab="onToggleTab">
            <van-tab title="游艇会信息" class="device-list">
                    <!-- <div class="user-image">
                        <van-image round width="50px" height="50px" :src="club_info.avatar"/>
                        <van-uploader max-count=1 :preview-size="avatar_size" :after-read="afterRead">
                            <div class="image-left">
                                <span style="color:#A49797;">修改头像</span>
                                <van-icon name="arrow" size=20 style="margin-left:0.625rem;" />
                            </div>
                        </van-uploader>
                    </div> -->
                    <van-field v-model="clubStatus" is-link readonly label="游艇会状态" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择游艇会状态" @click="openCulb"/>
                    <van-field v-model="club_info.name" label="名称" style="margin:0.625rem 0;" placeholder="请输入游艇会名称"  />
                    <van-field v-model="club_info.mobile" label="联系方式" style="margin:0.625rem 0;" placeholder="请输入联系方式"  />
                    <van-field v-model="club_info.commentDayLimit" label="点评时间/天" style="margin:0.625rem 0;" placeholder="请输入天数" error-message="订单完成后多久之后不可以点评" />
                    <van-cell title="地址" :value="club_info.province + club_info.city + club_info.adname" style="margin:0.625rem 0;" />
                    <!-- <gaode-map></gaode-map> -->
                    <van-cell title="详细地址" :value="club_info.address" style="margin:0.625rem 0;" />
                    <van-cell title="余额" :value="'￥' + club_info.balance" style="margin:0.625rem 0;" />
                    <van-cell title="创建时间" :value="club_info.createTime" style="margin:0.625rem 0;" />
                    <van-field v-model="club_info.description" label="简介" style="margin:10px 0;" placeholder="请输入简介" type="textarea" rows="4"/>
                    <div class="upload-accessory">
                        <p style="margin-bottom: .625rem;">游艇会图片</p>
                        <div class="other-details">
                            <div v-for="(item,index) in club_info.imageList" :key="index" class="img-list">
                                <img @click="previewImage(item)" class="card-imgs"  :src="item">
                                <van-icon name="clear" class="closes" @click="delImg(index)"/>
                            </div>
                            <van-uploader  :preview-size="img_size" :after-read="afterReadOther"></van-uploader>
                        </div>
                    </div>
                    <div class="log-cheat" @click="editYachtClubInfo">修改信息</div>
            </van-tab>
            <van-tab title="保险列表">
                <div class="device-list" @scroll="handleScrolls">
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
                            <div class="body-list">
                                <span>创建时间：</span>
                                <span>{{insure.createTime}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="list-box"></div>
                </div>
            </van-tab>
        </van-tabs>
        
        <!-- 游艇会状态 -->
        <van-popup v-model:show="showClubPicker" round position="bottom">
          <van-picker :columns="columns" @cancel="showClubPicker = false" @confirm="onClubConfirm"/>
        </van-popup> 
       
    </div>
  </template>
  
  <script >
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import { getClubInfo,upLoadFiles,editClubMessage,listInsure } from "../../httpSeiver/apis";
  import 'vant/es/toast/style';
  import GaodeMap from "../../components/GaoDeMap/index.vue";
  import { useRoute, useRouter,onBeforeRouteLeave } from 'vue-router';
  export default {
    components: { GaodeMap },
    setup(porps,cxt) {
        const layoutData = reactive({
            active:0,
            user_id:null,
            club_info:{},
            avatar_size:[100,60],
            img_size:[80,80],
            getYachtClubInfo:function () {
                getClubInfo({peopleId:layoutData.user_id}).then(res=>{
                    if (res.code == 200) {
                        layoutData.club_info = res.data
                        layoutData.params.clubId = res.data.id
                    }
                })
            },
            clubStatus:'',
            showClubPicker:false,
            columns:[
                {text:'可出租',value:0},
                {text:'不可出租',value:1},
            ],
            // 游艇会保险列表
            params:{
                clubId:null,
                pageNum:1,
                pageSize:10
            },
            insure_list:[],
            total_page:null,
            getListInsure:function () {
                listInsure(layoutData.params).then(res=>{
                    if (res.code == 200) {
                        let order = res.rows
                        layoutData.total_page =  res.total
                        layoutData.insure_list.push(...order)
                        layoutData.insure_list  = layoutData.insure_list
                    }else{
                        Toast(res.msg)
                    }
                })
            }
        })
        const route = useRoute()
        const router = useRouter()
        onMounted(()=>{
            let userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
            layoutData.user_id = userInfo.userId
            layoutData.getYachtClubInfo()
        })
        // 切换Tab
        const onToggleTab = (val) => {
            if (val.name == 1) {
                layoutData.params.pageNum = 1
                layoutData.insure_list = []
                layoutData.getListInsure() 
            }
        }
        // 列表触底加载
        const handleScrolls = (e) => {
            if((e.target.scrollTop + 1)+ e.target.clientHeight >= e.target.scrollHeight){
            if(layoutData.total_page > layoutData.insure_list.length){
                Toast.loading({
                message: '加载中...',
                forbidClick: true,
                });
                layoutData.params.pageNum++
                layoutData.getListInsure()
            }else{
                Toast('已经滑到底了！');
            }
            }
        }
        // 修改头像
        const afterRead = (val) => {
            var formData = new FormData()
            formData.append("file",val.file)
            upLoadFiles(formData).then(res=>{
                layoutData.club_info.avatar = res.data
            })
        };
        // 上传游艇会图片
        const afterReadOther = (val) => {
            var formData = new FormData()
            formData.append("file",val.file)
            upLoadFiles(formData).then(res=>{
                layoutData.club_info.imageList.push(res.data)
            })
        }
        // 预览图片
        const previewImage = (item) => {
            ImagePreview([item]);
        }
        // 删除图片
        const delImg = (index) => {
            layoutData.club_info.imageList.splice(index,1)
        }
        // 打开游艇会状态弹窗
        const openCulb = () => {
            if (layoutData.club_info.clubStatus == null) {
                Toast('请先添加游艇！')
            }else{
                layoutData.showClubPicker = true
            }
        }
        // 修改游艇会状态
        const onClubConfirm = (val) => {
            layoutData.showClubPicker = false
            layoutData.clubStatus = val.text
            layoutData.club_info.clubStatus = val.value
        }
        // 修改游艇会信息
        const editYachtClubInfo = () => {
            let params = {
                id:layoutData.club_info.id,
                name:layoutData.club_info.name,
                address:layoutData.club_info.address,
                mobile:layoutData.club_info.mobile,
                description:layoutData.club_info.description,
                imageList:layoutData.club_info.imageList,
                commentDayLimit:parseInt(layoutData.club_info.commentDayLimit),
            }
            editClubMessage(params).then(res=>{
                console.log(res);
            })
            console.log(params);
        }
        return{
            ...toRefs(layoutData),
            afterRead,
            afterReadOther,
            previewImage,
            editYachtClubInfo,
            delImg,
            onClubConfirm,
            openCulb,
            onToggleTab,
            handleScrolls
        }
    }
  };
  </script>
  <style lang="scss">
    body{
      background-color: #f6faf9;
    }
    .yacht-message-admin{
        margin: .625rem;
        .device-list{
            height: 35rem;
            overflow-y: auto;
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
        .log-cheat{
            text-align: center;
            background-color: #0eb17a;
            color: #fff;
            padding: .9375rem;
            margin: 3.125rem 1.25rem;
            border-radius: .625rem;
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
        .upload-accessory{
          background-color: #fff;
          padding: .625rem;
          border-radius: .625rem;
          .other-details{
            display: flex;
            align-items: center;
            padding: .625rem;
            flex-wrap: wrap;
          .van-uploader__upload {
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              width: var(--van-uploader-size);
              height: var(--van-uploader-size);
              margin: .3125rem;
              background: var(--van-uploader-upload-background-color);
          }
          .img-list{
            position: relative;
            width: 5rem;
            height: 5rem;
            margin: .3125rem;
            border-radius: .625rem;
            .card-imgs{
              width: 100%;
              height: 100%;
              border-radius: .625rem;
              background-color: #F8F8F8;
              // text-align: center;
              // line-height: 60px;
              color: #999;
            }
            .closes{
              position: absolute;
              top: -0.3125rem;
              left: 4.25rem;
            }
          }
          }
        }
    }
  </style>