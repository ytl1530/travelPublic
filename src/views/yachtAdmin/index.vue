<template>
    <div class="yacht-admin">
        <van-search style="margin: 5px 0;" v-model="params.name" show-action placeholder="请输入游艇名称搜索" @search="onSearch">
            <template #action>
                <div @click="onClickButton">搜索</div>
            </template>
        </van-search>
        <van-tabs v-model:active="active" @click-tab="onToggleTab">
            <van-tab v-for="(tab,index) in tabList" :title="tab" :key="index">
                <div class="device-list" :style="yacht_list.length < 3 ? ' height: 30rem;' : ' height: 40rem;'" @scroll="handleScrolls">
                    <van-empty class="empty" v-if="yacht_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无游艇"/>
                    <div class="order-item" v-for="yacht in yacht_list" :key="yacht.id">
                        <div class="goods-list">
                            <van-image style="width: 5rem;height: 5rem;" width="5rem" height="5rem" fit="cover" :src="yacht.imagesList[0]" @click="previewImage(yacht)"/>
                            <div class="goods-item">
                                <div class="body-list">
                                    <span>游艇名称：</span>
                                    <span>{{yacht.yachtName}}</span>
                                </div>
                                <div class="body-list">
                                    <span>游艇品牌：</span>
                                    <span>{{yacht.brand}}</span>
                                </div>
                                <div class="body-list">
                                    <span>船龄：</span>
                                    <span>{{yacht.yachtAge}}</span>
                                </div>
                                <div class="body-list">
                                    <span>可乘坐人数：</span>
                                    <span>{{yacht.personLimit}}</span>
                                </div>
                                <div class="body-list">
                                    <span>收费价格：</span>
                                    <span>{{yacht.hourFee}}元/小时</span>
                                </div>
                                <div class="body-list">
                                    <span>游艇层数：</span>
                                    <span>{{yacht.layers}}</span>
                                </div>
                                <div class="body-list">
                                    <span>游艇位置：</span>
                                    <span>{{yacht.location}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="item-btn">
                            <div class="reminder"  @click.stop="skipYachtDetail(yacht)">查看详情</div>
                            <div class="reminders" v-if="userInfo.roleId == 2 || userInfo.roleId == 4"  @click.stop="deleteYacht(yacht)">删除游艇</div>
                        </div>
                    </div>
                    <div class="log-cheat" v-if="userInfo.roleId == 2 || userInfo.roleId == 4" @click="addYacht">添加游艇</div>
                    <div class="list-box"></div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
  </template>
  
  <script >
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import { yachtList,delYacht } from "../../httpSeiver/apis";
  import 'vant/es/toast/style';
  import { useRoute, useRouter,onBeforeRouteLeave } from 'vue-router';
  export default {
    components: {  },
    setup(porps,cxt) {
        const layoutData = reactive({
            params:{
                status:0,
                pageNum:1,
                name:'',
                pageSize:10
            },
            yacht_list:[],
            total_page:null,
            active:0,
            userInfo:{},
            tabList:['空闲中','出行中','暂不出租'],
            getYachtList:function () {
                yachtList(layoutData.params).then(res=>{
                    if (res.code == 200) {
                        console.log(res);
                        let order = res.data.records
                        layoutData.total_page =  res.data.total
                        layoutData.yacht_list.push(...order)
                        layoutData.yacht_list  = layoutData.yacht_list
                    }else{
                        Toast(res.msg)
                    }
                })
            },
        })
        const route = useRoute()
        const router = useRouter()
        onMounted(()=>{
           layoutData.userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
           layoutData.getYachtList()
        })
        // 回车搜索   
        const onSearch = () => {
            layoutData.yacht_list = []
            layoutData.params.pageNum = 1
            layoutData.getYachtList()
        }
        // 点击搜索   
        const onClickButton = () => {
            layoutData.yacht_list = []
            layoutData.params.pageNum = 1
            layoutData.getYachtList()
        } 
        // 切换Tab
        const onToggleTab = (val) => {
            layoutData.yacht_list = []
            layoutData.params.status = val.name
            layoutData.getYachtList()
        }
        // 列表触底加载
        const handleScrolls = (e) => {
            if((e.target.scrollTop + 1)+ e.target.clientHeight >= e.target.scrollHeight){
                if(layoutData.total_page > layoutData.yacht_list.length){
                    Toast.loading({
                        message: '加载中...',
                        forbidClick: true,
                    });
                    layoutData.params.pageNum++
                    layoutData.getYachtList()
                }else{
                    Toast('已经滑到底了！');
                }
            }
        }
        // 预览图片
        const previewImage = (item) => {
            if (item.imagesList.length == 0) {
                Toast('未上传游艇图片')
            }else{
                ImagePreview(item.imagesList);
            }
        }
        // 添加游艇
        const addYacht = () => {
            router.push('/yachtAdmin/addYacht')
        }
        // 跳转详情
        const skipYachtDetail = (item) => {
            router.push(`/yachtAdmin/yachtDetail?id=${item.id}`)
        }
        // 删除游艇
        const deleteYacht = (item) => {
            Dialog.confirm({
                title: '删除游艇',
                message:`名称为：${item.yachtName}，游艇位置为：${item.location}`
            }).then(() => {
                delYacht(item.id).then(res=>{
                    if (res.code == 200) {
                        Toast.success('删除成功')
                        setTimeout(()=>{
                            layoutData.yacht_list = []
                            layoutData.params.pageNum = 1
                            layoutData.getYachtList()
                        },1000)
                    }else{
                        Toast(res.msg)
                    }
                }) 
            })
        }
        return{
            ...toRefs(layoutData),
            handleScrolls,
            onToggleTab,
            onSearch,
            onClickButton,
            addYacht,
            previewImage,
            skipYachtDetail,
            deleteYacht
        }
    }
  };
  </script>
  <style lang="scss">
    body{
      background-color: #f6faf9;
    }
    .yacht-admin{
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
            .goods-list{
                display: flex;
                align-items: center;
                color:#999;
                .goods-item{
                    margin-left: .9375rem;
                    .body-list{
                        margin: 5px;
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
            margin-top: 7.625rem;
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
        .van-search--show-action {
            border-radius: .625rem;
            padding-right: .75rem;
        }
        .van-popup--top {
            top: 0;
            left: .8125rem;
            width: 93%;
        }
        .van-dropdown-menu__bar {
            position: relative;
            display: flex;
            height: var(--van-dropdown-menu-height);
            background: var(--van-dropdown-menu-background-color);
            box-shadow:none;
            border-radius: 5px;
        }
        .upload-accessory{
          background-color: #fff;
          padding: .625rem;
          border-radius: .625rem;
        }
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
        .van-ellipsis {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
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
    }
  </style>