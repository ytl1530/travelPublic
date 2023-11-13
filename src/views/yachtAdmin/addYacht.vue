<template>
    <div class="add-yacht">
            <van-field v-model="yacht_type" is-link readonly label="游艇类型" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择游艇类型" @click="showYachtTypePicker = true"/>
            <van-field v-model="service" is-link readonly label="客服" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择客服" @click="showServicePicker = true"/>
            <van-field v-model="shipowner" is-link readonly label="船主" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择船主" @click="showShipownerPicker = true"/>
            <van-divider>游艇信息</van-divider>
            <van-field v-model="info.yachtName" label="游艇名称" style="margin:0.625rem 0;" placeholder="请输入游艇名称" />
            <van-field v-model.number="info.personLimit" label="可乘坐人数" style="margin:0.625rem 0;" placeholder="请输入可乘坐人数" />
            <van-field v-model="info.size" label="游艇尺寸" style="margin:0.625rem 0;" placeholder="请输入游艇尺寸" />
            <van-field v-model.number="info.tonnage" label="游艇吨位" style="margin:0.625rem 0;" placeholder="请输入游艇吨位" />
            <van-field v-model.number="info.layers" label="游艇层数" style="margin:0.625rem 0;" placeholder="请输入游艇层数" />
            <van-field v-model="info.location" label="游艇位置" style="margin:0.625rem 0;" placeholder="请输入游艇位置" />
            <van-field v-model="info.speed" label="航速" style="margin:0.625rem 0;" placeholder="请输入航速" />
            <van-field v-model="info.brand" label="品牌" style="margin:0.625rem 0;" placeholder="请输入品牌" />
            <van-field v-model.number="info.yachtAge" label="船龄/年" style="margin:0.625rem 0;" placeholder="请输入船龄" />
            <div class="upload-accessory">
                <span style="font-size:14px;color: var(--van-field-label-color);">游艇图片</span>
                <div class="other-details">
                    <div v-for="(item,index) in info.imagesList" :key="index" class="img-list">
                        <img @click="previewImage(item)" class="card-imgs"  :src="item">
                        <van-icon name="clear" class="closes" @click="delImg(index)"/>
                    </div>
                    <van-uploader  :preview-size="img_size" :after-read="afterReadOther"></van-uploader>
                </div>
            </div>
            <!-- <van-field v-model="info.description" label="游艇简介" style="margin:10px 0;" placeholder="请输入游艇简介" type="textarea" rows="3"/> -->
            <div class="upload-accessory" style="margin:10px 0;">
                <span style="display: inline-block; padding:10px 0;font-size:14px;color: var(--van-field-label-color);">游艇简介</span>
                <quill-editor :descrip="info.description" @getHtml="getDescriptionHtml"></quill-editor>
            </div>
            <div class="item-header" >
                <span style="font-size:14px;">是否热门</span>
                <span>
                    <van-radio-group v-model="info.isHot" direction="horizontal">
                      <van-radio :name="0">否</van-radio><van-radio :name="1">是</van-radio>
                    </van-radio-group>
                </span>
            </div>
            <van-divider>价格/预约</van-divider>
            <van-field v-model.number="info.hourFee" label="收费价格/元" style="margin:0.625rem 0;" placeholder="请输入按小时收费价格" />
            <van-field v-model.number="info.basicPrice" label="基础价格/元" style="margin:0.625rem 0;" placeholder="请输入基础价格" />
            <van-field v-model.number="info.minReservationTime" label="最低预约时长" style="margin:0.625rem 0;" placeholder="请输入最低预约时长" />
            <van-field v-model="info.notice" label="预约须知" style="margin:0.625rem 0;" placeholder="请输入预约须知" type="textarea" rows="3" />

            <!-- 游艇类型弹窗 -->
            <div class="yacht-type">
                <van-popup v-model:show="showYachtTypePicker"  closeable round position="bottom">
                    <div class="device-list" style="margin: 2.5rem .625rem .625rem .625rem;">
                        <van-empty class="empty" v-if="yacht_type_list.length == 0"  image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无类型"/>
                        <div class="order-item" v-for="yachtType in yacht_type_list" :key="yachtType.id">
                            <div class="goods-list" >
                                <van-radio-group v-model="info.yachtTypeId" >
                                    <van-radio @click="yachtTypeSelect(yachtType)" :name="yachtType.id" checked-color="#0eb17a"></van-radio>
                                </van-radio-group>
                                <div class="goods-item">
                                    <div class="body-list">
                                        <span>类型名称：</span>
                                        <span>{{yachtType.typeName}}</span>
                                    </div>
                                    <div class="body-list">
                                        <span>类型简介：</span>
                                        <span style="line-height: 18px;">{{yachtType.description}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="log-cheats" @click="yachtTypeSelect">确认</div> -->
                        <div class="list-box"></div>
                    </div>
                </van-popup>
            </div>
            <!-- 客服弹窗 -->
            <div class="yacht-type">
                <van-popup v-model:show="showServicePicker" closeable round position="bottom">
                    <div class="device-list" style="margin: 2.5rem .625rem .625rem .625rem;">
                        <van-empty class="empty" v-if="service_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无客服"/>
                        <div class="order-item" v-for="serve in service_list" :key="serve.id">
                            <div class="goods-list">
                                <van-radio-group v-model="info.customerId">
                                    <van-radio @click="serviceSelect(serve)"  :name="serve.id"  checked-color="#0eb17a"></van-radio>
                                </van-radio-group>
                                <van-image style="margin-left: 10px;" round width="5rem" height="5rem" fit="cover" :src="serve.avatar[0]"/>
                                <div class="goods-item">
                                    <div class="body-list">
                                        <span>客服名称：</span>
                                        <span>{{serve.name}}</span>
                                    </div>
                                    <div class="body-list">
                                        <span>客服电话：</span>
                                        <span>{{serve.mobile}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="list-box"></div>
                    </div>
                </van-popup>
            </div>
            <!-- 船主弹窗 -->
            <div class="yacht-type">
                <van-popup v-model:show="showShipownerPicker" closeable round position="bottom">
                    <div class="device-list" style="margin: 2.5rem .625rem .625rem .625rem;">
                        <van-empty class="empty" v-if="shipowner_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无船主"/>
                        <div class="order-item" v-for="shipowner in shipowner_list" :key="shipowner.id">
                            <div class="goods-list">
                                <van-radio-group v-model="info.ownerId">
                                    <van-radio @click="shipownerSelect(shipowner)"  :name="shipowner.id"  checked-color="#0eb17a"></van-radio>
                                </van-radio-group>
                                <van-image style="margin-left: 10px;" round width="5rem" height="5rem" fit="cover" :src="shipowner.avatar[0]"/>
                                <div class="goods-item">
                                    <div class="body-list">
                                        <span>客服名称：</span>
                                        <span>{{shipowner.name}}</span>
                                    </div>
                                    <div class="body-list">
                                        <span>客服电话：</span>
                                        <span>{{shipowner.mobile}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="list-box"></div>
                    </div>
                </van-popup>
            </div>
            <div class="log-cheat" @click="addYachtInfo">添加游艇</div>
      </div>
  </template>
  
  <script>
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import 'vant/es/toast/style';
  import { useRouter,useRoute } from 'vue-router';
  import { listType,customerService,addYacht,shipownerList,upLoadFiles } from "../../httpSeiver/apis";
  import { useStore } from "vuex";
  import quillEditor from "../../components/quillEditor/index.vue";
  export default {
    components: { quillEditor },
    setup(porps,cxt) {
      const layoutData = reactive({
        clubId:'',
        info:{
            yachtName:'',
            description:'',
            personLimit:null,
            hourFee:null,
            basicPrice:null,
            size:'',
            yachtTypeId:'',
            tonnage:null,
            layers:null,
            isHot:null,
            location:'',
            minReservationTime:null,
            speed:'',
            brand:'',
            yachtAge:null,
            notice:'',
            customerId:null,
            club_id:'',
            ownerId:null,
            imagesList:[]
        },
        img_size:[80,80],
        // 游艇类型
        yacht_type:'',
        showYachtTypePicker:false,
        yacht_type_list:[],
        getListType:function () {
            listType().then(res=>{
               if (res.code == 200) {
                layoutData.yacht_type_list = res.rows
               }
            })
        },
        // 客服
        service:'',
        showServicePicker:false,
        service_list:[],
        getServiceList:function () {
            customerService(layoutData.clubId).then(res=>{
                if (res.code == 200) {
                    layoutData.service_list = res.data
                }
            })
        },
        // 船主
        shipowner:'',
        showShipownerPicker:false,
        shipowner_list:[],
        getShipownerList:function () {
            shipownerList(layoutData.clubId).then(res=>{
                if (res.code == 200) {
                    layoutData.shipowner_list = res.data
                }
            }) 
        },
      })
      const router = useRouter()
      const route = useRoute()
      onMounted(()=>{
        let userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
        layoutData.clubId = userInfo.clubId
        layoutData.getListType()
        layoutData.getServiceList()
        layoutData.getShipownerList()
      })  
      // 选择游艇类型
      const yachtTypeSelect = (val) => {
        layoutData.showYachtTypePicker = false
        layoutData.yacht_type = val.typeName
      }   
      // 选择客服
      const serviceSelect = (val) => {
        layoutData.showServicePicker = false
        layoutData.service = val.name
      }   
      // 选择客服
      const shipownerSelect = (val) => {
        layoutData.showShipownerPicker = false
        layoutData.shipowner = val.name
      }  
      // 上传游艇图片
      const afterReadOther = (val) => {
            var formData = new FormData()
            formData.append("file",val.file)
            upLoadFiles(formData).then(res=>{
                layoutData.info.imagesList.push(res.data)
            })
      } 
      // 预览图片
      const previewImage = (item) => {
        ImagePreview([item]);
      }
      // 删除图片
      const delImg = (index) => {
        layoutData.info.imagesList.splice(index,1)
      }
      // 获取简介内容
      const getDescriptionHtml = (val) => {
        layoutData.info.description = val
        // console.log(val);
      }
      // 添加游艇
      const addYachtInfo = () => {
        console.log(layoutData.info);
        // addYacht(layoutData.info).then(res=>{
        //     if (res.code == 200) {
        //         Toast.success('添加成功')
        //         setTimeout(()=>{
        //             router.back()
        //         },1000)
        //     }
        // })
      }
      return{
          ...toRefs(layoutData),
          addYachtInfo,
          yachtTypeSelect,
          serviceSelect,
          shipownerSelect,
          afterReadOther,
          previewImage,
          delImg,
          getDescriptionHtml
      }
      
    }
  };
  </script>
  <style lang="scss">
    .add-yacht{
      margin: .625rem;
      font-size: .9375rem;
      .tab-box{
        margin-top: .625rem;
      }
      .log-cheat{
        text-align: center;
        background-color: #0eb17a;
        color: #fff;
        padding: .9375rem;
        margin: 3.125rem 1.25rem;
        border-radius: .625rem;
      }
      .business-license{
        border-radius: .625rem;
        position: relative;
        img{
          border-radius: .625rem;
          width: 100%;
          height: 15.625rem;
          object-fit:contain;
        }
        .delImg{
          position: absolute;
          top: -0.375rem;
          right: -0.3125rem;
        }
      }
      .business-licenses{
        background-color: #fff;
        text-align: center;
        padding: .625rem;
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
      .identity-card{
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: .625rem;
          flex-wrap: wrap;
          .card-img{
            width: 6.25rem;
            height: 3.75rem;
            margin: .3125rem;
            border-radius: .625rem;
            background-color: #F8F8F8;
            text-align: center;
            line-height: 3.75rem;
            color: #999;
          }
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
      .yacht-type{
          position: relative;
          .device-list{
            height: 37.5rem;
            overflow-y: auto;
          }
          .van-popup {
                position: fixed;
                max-height: 100%;
                overflow-y: auto;
                background-color: #f6faf9;
                transition: var(--van-popup-transition);
                -webkit-overflow-scrolling: touch;
          }
          .log-cheats{
                text-align: center;
                background-color: #0eb17a;
                color: #fff;
                padding: 14px 162px;
                margin-bottom: 10px;
                border-radius: 1.625rem;
                position: fixed;
                bottom: 0;
          }
           .order-item{
                background-color: #fff;
                margin-top: .625rem;
                padding: .625rem;
                border-radius: .625rem;
                font-size: .875rem;
                    .item-btn{
                    display: flex;
                    justify-content: space-around;
                    padding: .625rem 0;
                    .reminder{
                        background-color: #cfefe4;
                        color: #13b27b;
                        // width: 7.5rem;
                        padding: .6rem .8rem;
                        text-align: center;
                        border-radius: .4rem;
                    }
                    }
                    .reminder{
                        background-color: #efd0cf;
                        color: #b21313;
                        // width: 7.5rem;
                        padding: .6rem 0;
                        margin:0 0 0 14.75rem;
                        text-align: center;
                        border-radius: .4rem;
                    }
                    .item-header{
                        display: flex;
                        justify-content: space-between;
                        position: relative;
                        padding: .625rem .625rem;
                        align-items: center;
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
            }
            .goods-list{
                display: flex;
                align-items: center;
                color:#999;
                .goods-item{
                    flex: 1;
                    margin-left: .9375rem;
                    .body-list{
                        margin: 5px;
                    }
                }
            }
            .list-box{
            margin-top: .625rem;
            background-color: #f6faf9;
            padding: 1.625rem 1.25rem;
            }
      }
      .item-header{
            display: flex;
            justify-content: space-between;
            position: relative;
            padding: .825rem;
            background-color: #fff;
            margin: .625rem 0;
            align-items: center;
            color: var(--van-field-label-color);
            border-radius: .625rem;
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