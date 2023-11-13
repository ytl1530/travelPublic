<template>
    <div class="top-header">
        <van-icon name="bars" size="20" @click="openMenu" />
        <!-- <span class="header-title">{{meta.title}}</span> -->
        <van-tag class="header-title" plain type="primary">{{meta.title}}</van-tag>
        <!-- <div v-if="userInfo.type == 3">
            <van-popover v-model:show="showPopover" :actions="actions" @select="onSelectGander">
                <template #reference>
                    <div v-if="actions.length == 0" style="font-size:12px;margin-left:25px">暂无其他园区<van-icon name="arrow-down" /></div>
                    <div v-else style="font-size:14px;margin-left:25px">{{select_garder}}<van-icon name="arrow-down" /></div>
                </template>
            </van-popover>
        </div> -->
        <div class="user-info">
            <span style="font-size:14px;margin-right:0.625rem;">{{user.nickName}}</span>
            <van-image round width="40" height="40" :src="user.avatar" />
        </div>
        <van-popup  v-model:show="show" position="left" :style="{ width: '60%',height:'100%',backgroundColor: '#f6faf9' }">
            <div class="user-info" style="margin:0.625rem;">
                <div class="name-avatar">
                    <span style="font-size:14px;margin-right:0.625rem;">{{user.nickName}}</span>
                    <van-image round width="40" height="40" :src="user.avatar" />
                </div>
                <van-icon name="close" color="#999" @click="closePopup" size="30"/>
            </div>
            <!-- 代理员管理 -->
            <div class="navigation-menu">
                <div v-for="item in menus" :key="item.id" @click="skipPage(item.id)" >
                    <div class="menu-item" v-if="item.status == 0">
                        <span>{{item.menuName}}</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import { toRefs,reactive, onMounted,watch } from "vue";
    import { onBeforeRouteLeave, useRouter,useRoute } from "vue-router";
    import { listPeopleMenu } from "../../httpSeiver/apis";
    export default {
    components: {  },
    setup(porps,cxt) {
        const layoutData = reactive({
            show:false,
            showPopover:false,
            value1:0,
            userInfo:{},
            meta:{},
            menus:[],
            user:{},
            getListPeopleMenu:function () {
                listPeopleMenu({peopleId:layoutData.userInfo.userId}).then(res=>{
                    if (res.code == 200) {
                        layoutData.menus = res.data
                    }
                })
            }
        })
        const router = useRouter()
        const route = useRoute()
        onMounted(()=>{
            let userInfo = JSON.parse(sessionStorage.getItem('user_info'))
            layoutData.userInfo = userInfo
            layoutData.user = userInfo.user
            layoutData.getListPeopleMenu()
        })
        watch(()=>route.meta,(val,preVal)=>{
                //val为修改后的值,preVal为修改前的值
                layoutData.meta = val
            },
            {
                //如果加了这个参数，值为true的话，就消除了惰性，watch会在创建后立即执行一次
                //那么首次执行，val为默认值,preVal为undefined
                immediate:true,
                //这个参数代表监听对象时，可以监听深度嵌套的对象属性
                //比如message是一个对象的话，可以监听到message.a.b.c，也就是message下的所有属性
                deep:true,
            }
        )
        // 打开弹窗
        const openMenu = () => {
            layoutData.show = true
        }
        // 关闭弹窗
        const closePopup = () => {
            layoutData.show = false
        }
        // 侧边菜单
        const skipPage = (id) => {
            switch (id) {
            case 1:
                // 数据面板
                router.push('/layout')
                break;
            case 2:
                // 游艇会信息管理
                router.push('/yachtMessageAdmin')
                break;
            case 3:
                // 权限管理
                router.push('/roleAdmin')
                break;
            case 4:
                // 游艇管理
                router.push('/yachtAdmin')
                break;
            case 5:
                // 船主管理
                router.push('/shipownerAdmin')
                break;
            case 6:
                // 船长管理
                router.push('/captainAdmin')
                break;
            case 7:
                // 订单管理
                router.push('/orderAdmin')
                break;
            case 8:
                // 财务管理
                router.push('/financialAdmin')
                break;
            case 9:
                // 个人信息
                router.push('/userInfo')
                break;
            default:
                // 执行默认语句块
                break;
            }
            closePopup()
        }
        return{
            ...toRefs(layoutData),
            openMenu,
            closePopup,
            skipPage
        }
        
        }
    };
</script>

<style lang="scss">
.top-header{
    background-color: #EFEFEF;
    padding: .3125rem .625rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3.125rem;
    .user-info{
        display:flex;
        align-items: center;
        justify-content: space-between;
        .name-avatar{
            display:flex;
            align-items: center;
        }
    }
    .header-title{
        font-size: .875rem;
        position: absolute;
        top: 1.0625rem;
        left: 3.3125rem;
        padding-top: .125rem;
    }
    
}
.van-popover__action {
        position: relative;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 9.375rem !important;
        height: var(--van-popover-action-height);
        padding: 0 var(--van-padding-md);
        font-size: var(--van-popover-action-font-size);
        line-height: var(--van-line-height-md);
        cursor: pointer;
    }
.navigation-menu{
    margin-top: .9375rem;
    .menu-item{
        background-color: #fff;
        padding: .9375rem .625rem;
        margin: .625rem .3125rem;
        border-radius: .3125rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        // background-color: #ccc;
    }
    // .menu-item::after{
    //     content: '';
    //     width: 220px;
    //     height: 1px;
    //     position: absolute;
    //     top: 50px;
    //     left: 3px;
    //     border-bottom: 1px solid #ccc;
    // }
}

</style>