<template>
    <div class="yacht-detail">
      <van-tabs v-model:active="active" @click-tab="onToggleTab">
          <van-tab title="游艇信息">
            <van-divider>游艇人员</van-divider>
            <van-field v-model="info.yachtTypeName" is-link readonly label="游艇类型" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择游艇类型" @click="showYachtTypePicker = true"/>
            <van-field v-model="customer.name" is-link readonly label="客服" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择客服" @click="showServicePicker = true"/>
            <van-field v-model="owner.name" is-link readonly label="船主" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择船主" @click="showShipownerPicker = true"/>
            <van-field v-if="roleId == 4 || info.ownerStatus == 0 || info.ownerStatus == 2" v-model="info.owner_text" is-link readonly label="船主状态" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择船主状态" @click="showOwnerPicker = true"/>
            <van-cell v-else title="船主状态" :value="info.owner_text" style="margin:0.625rem 0;" />
            <van-cell v-if="roleId == 4" title="游艇会状态" :value="info.platformStatus == 0 ? '可出租' : '不可出租'" style="margin:0.625rem 0;" />
            <!-- <van-field  v-model="info.owner_text" is-link readonly label="船主状态" style="margin:0.625rem 0;" input-align="right"  placeholder="请选择船主状态" @click="showOwnerPicker = true"/> -->
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
            <div class="log-cheat" @click="editYachtInfo">修改游艇信息</div>
          </van-tab>
          <van-tab title="服务列表" class="device-list" :style="serviceList.length < 3 ? ' height: 30rem;' : ' height: 40rem;'">
              <van-empty class="empty" v-if="serviceList.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无服务"/>
              <div class="order-item" v-for="service in serviceList" :key="service.id">
                <div class="item-body">
                    <div class="body-list">
                        <span>服务名称：</span>
                        <span>{{service.serviceName}}</span>
                    </div>
                    <div class="body-list">
                        <span>服务位置：</span>
                        <span>{{service.location == 0 ? '内部' : service.location == 1 ? '外部' : '其他'}}</span>
                    </div>
                    <div class="body-list">
                        <span>价格：</span>
                        <span>￥{{service.price}}</span>
                    </div>
                    <div class="body-list">
                        <span>是否收费：</span>
                        <span>{{service.isCharged == 0 ? '否' :  '是'}}</span>
                    </div>
                    <div class="body-list">
                        <span>是否必选：</span>
                        <span>{{service.required == 0 ? '否' :  '是'}}</span>
                    </div>
                    <div class="body-list">
                        <span>价格类型：</span>
                        <span>{{service.priceType == 0 ? '免费' : service.priceType == 1 ? '固定价格' : service.priceType == 2 ? '按小时收费' : '按人数计算'}}</span>
                    </div>
                </div>
              </div>
              <div class="list-box"></div>
          </van-tab>
          <van-tab title="保养列表" class="device-list" @scroll="handleScrolls" :style="upkeep_list.length < 3 ? ' height: 30rem;' : ' height: 40rem;'">
              <van-search style="margin: 5px 0;" v-model="upkeep_params.name" show-action placeholder="请输入保养名称搜索" @search="onSearch">
                  <template #action>
                      <div @click="onClickButton">搜索</div>
                  </template>
              </van-search>
              <van-empty class="empty" v-if="upkeep_list.length == 0" image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80" description="暂无保养记录"/>
              <div class="order-item" v-for="upkeep in upkeep_list" :key="upkeep.id">
                <div class="item-body">
                    <div class="body-list">
                        <span>保养名称：</span>
                        <span>{{upkeep.maintainName}}</span>
                    </div>
                    <div class="body-list">
                        <span>价格：</span>
                        <span>￥{{upkeep.price}}</span>
                    </div>
                    <div class="body-list">
                        <span>备注：</span>
                        <span>{{upkeep.remark}}</span>
                    </div>
                    <div class="body-list">
                        <span>创建时间：</span>
                        <span>{{upkeep.createTime}}</span>
                    </div>
                </div>
                <div class="item-btn">
                  <div class="reminder"  @click="editUpkeep(upkeep)">修改保养</div>
                  <div class="reminders"  @click="deleteUpkeep(upkeep)">删除保养</div>
                </div>
              </div>
              <div class="log-cheats" @click="addUpkeep('add')">添加保养记录</div>
              <div class="list-box"></div>
          </van-tab>
        </van-tabs>
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
        <!-- 船主状态 -->
        <van-popup v-model:show="showOwnerPicker" round position="bottom">
          <van-picker :columns="roleId == 4 ? owner_columns : columns" @cancel="showOwnerPicker = false" @confirm="onOwnerConfirm"/>
        </van-popup>   
         <!-- 保养弹窗 -->
        <model-comp :visible="show" @update:visible="closeModel" @confirm="confirmModel" :title="'发起立项'" :width="350">
            <van-field  required v-model="upkeep_info.maintainName" label="保养名称" style="margin:0.625rem 0;"   placeholder="请输入保养名称" />
            <van-field  required v-model.number="upkeep_info.price" label="价格" style="margin:0.625rem 0;"   placeholder="请输入价格"/>
            <van-field type="textarea" rows="4" autosize v-model="upkeep_info.remark" label="备注" style="margin:0.625rem 0;" placeholder="请输入备注"  />
        </model-comp>
      </div>
  </template>
  
  <script>
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { Toast,ImagePreview,Dialog } from 'vant';
  import 'vant/es/toast/style';
  import { useRouter,useRoute } from 'vue-router';
  import { listType,customerService,shipownerList,upLoadFiles,yachtDetail,updateYacht,upkeepList,postOrPutMaintain,delMaintain } from "../../httpSeiver/apis";
  import { useStore } from "vuex";
  import quillEditor from "../../components/quillEditor/index.vue";
  import ModelComp from "../../components/ModelComp/index.vue";
  export default {
    components: { quillEditor,ModelComp },
    setup(porps,cxt) {
      const layoutData = reactive({
        active:0,
        yacht_id:'',
        clubId:'',
        info:{},        
        img_size:[80,80],
        customer:{},
        owner:{},
        roleId:null,
        serviceList:[],
        getYachtDetail:function () {
            yachtDetail(layoutData.upkeep_params.yachtId).then(res=>{
                if (res.code == 200) {
                  if (res.data.customer == null) {
                    res.data.customer = {
                      id:null,
                      name:''
                    }
                  }
                  if (res.data.owner == null) {
                    res.data.owner = {
                      id:null,
                      name:''
                    }
                  }
                  res.data.owner_text = res.data.ownerStatus == 0 ? '可出租' : res.data.ownerStatus == 1 ? '不可出租' : '任意'
                  layoutData.info = res.data
                  layoutData.customer = res.data.customer
                  layoutData.owner = res.data.owner
                  layoutData.serviceList = res.data.serviceList
                }
            }) 
        },
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
        // 船主状态
        showOwnerPicker:false,
        owner_columns:[
          {text:'可出租',value:0},
          {text:'不可出租',value:1},
          {text:'任意',value:2},
        ],
        columns:[
          {text:'可出租',value:0},
          {text:'不可出租',value:1}
        ],
        // 获取保养列表
        upkeep_params:{
          pageNum:1,
          pageSize:10,
          yachtId:null,
          name:''
        },
        upkeep_list:[],
        total_page:null,
        getUpkeepList:function () {
          upkeepList(layoutData.upkeep_params).then(res=>{
            if (res.code == 200) {
              let order = res.data.records
              layoutData.total_page =  res.data.total
              layoutData.upkeep_list.push(...order)
              layoutData.upkeep_list  = layoutData.upkeep_list
            }
          })
        },
        // 保养弹窗
        upkeep_info:{
          yachtId:null,
          maintainName:'',
          price:null,
          remark:''
        },
        show:false,
        upkeep_type:''
      })
      const router = useRouter()
      const route = useRoute()
      onMounted(()=>{
        let userInfo = JSON.parse(sessionStorage.getItem('user_info')) 
        layoutData.clubId = userInfo.clubId
        layoutData.roleId = userInfo.roleId
        layoutData.upkeep_params.yachtId = parseInt(route.query.id)
        layoutData.getYachtDetail()
        layoutData.getListType()
        layoutData.getServiceList()
        layoutData.getShipownerList()
        
      })  
      // 切换Tab
      const onToggleTab = (val) => {
          if (val.name == 2) {
            layoutData.upkeep_params.pageNum = 1
            layoutData.upkeep_list = []
            layoutData.getUpkeepList()
          }
      }
      // 回车搜索   
      const onSearch = () => {
        layoutData.upkeep_params.pageNum = 1
        layoutData.upkeep_list = []
        layoutData.getUpkeepList()
      }
      // 点击搜索   
      const onClickButton = () => {
        layoutData.upkeep_params.pageNum = 1
        layoutData.upkeep_list = []
        layoutData.getUpkeepList()
      } 
      // 关闭弹窗
      const closeModel = () => {
        layoutData.show = false
      }
      // 点击确认按钮
      const confirmModel = () => {
        postOrPutMaintain(layoutData.upkeep_info,layoutData.upkeep_type).then(res=>{
          if (res.code == 200) {
            layoutData.upkeep_type == 'add' ? Toast.success('添加成功') : Toast.success('修改成功')
            layoutData.show = false
            setTimeout(()=>{
              layoutData.upkeep_params.pageNum = 1
              layoutData.upkeep_list = []
              layoutData.getUpkeepList()
            },1000)
          }
        })
      } 
      // 列表触底加载
      const handleScrolls = (e) => {
            if((e.target.scrollTop + 1)+ e.target.clientHeight >= e.target.scrollHeight){
                if(layoutData.total_page > layoutData.upkeep_list.length){
                    Toast.loading({
                        message: '加载中...',
                        forbidClick: true,
                    });
                    layoutData.upkeep_params.pageNum++
                    layoutData.getUpkeepList()
                }else{
                    Toast('已经滑到底了！');
                }
            }
      }
      // 选择游艇类型
      const yachtTypeSelect = (val) => {
        layoutData.showYachtTypePicker = false
        layoutData.info.yachtTypeName = val.typeName
      }   
      // 选择客服
      const serviceSelect = (val) => {
        layoutData.showServicePicker = false
        layoutData.customer.name = val.name
      }   
      // 选择船主
      const shipownerSelect = (val) => {
        layoutData.showShipownerPicker = false
        layoutData.owner.name = val.name
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
      // 获取富文本内容
      const getDescriptionHtml = (val) => {
        layoutData.info.description = val
      }
      // 更改船主状态
      const onOwnerConfirm = (val) => {
        layoutData.showOwnerPicker = false
        layoutData.info.ownerStatus = val.value
      }
      // 修改游艇信息
      const editYachtInfo = () => {
       let params = {
        id:layoutData.upkeep_params.yachtId,
        yachtName:layoutData.info.yachtName,
        description:layoutData.info.description,
        personLimit:layoutData.info.personLimit,
        hourFee:layoutData.info.hourFee,
        basicPrice:layoutData.info.basicPrice,
        size:layoutData.info.size,
        yachtTypeId:layoutData.info.yachtTypeId,
        tonnage:layoutData.info.tonnage,
        layers:layoutData.info.layers,
        isHot:layoutData.info.isHot,
        location:layoutData.info.location,
        minReservationTime:layoutData.info.minReservationTime,
        speed:layoutData.info.speed,
        brand:layoutData.info.brand,
        clubId:layoutData.info.clubId,
        notice:layoutData.info.notice,
        customerId:layoutData.info.customerId,
        ownerId:layoutData.info.ownerId,
        imagesList:layoutData.info.imagesList,
        ownerStatus:layoutData.info.ownerStatus,
        platformStatus:layoutData.info.platformStatus,
       } 
       updateYacht(params).then(res=>{
          if (res.code == 200) {
            Toast.success('修改成功')
            setTimeout(()=>{
              layoutData.getYachtDetail()
            },1000)
          }
       })
      }
      // 添加保养记录
      const addUpkeep = (type) => {
        layoutData.upkeep_type = type
        layoutData.show = true
        layoutData.upkeep_info.maintainName = ''
        layoutData.upkeep_info.price = null
        layoutData.upkeep_info.remark = ''
        layoutData.upkeep_info.yachtId = layoutData.upkeep_params.yachtId
        if (layoutData.upkeep_info.id) {
          delete layoutData.upkeep_info.id;
        }
      }
      // 修改保养记录
      const editUpkeep = (item,type) => {
        layoutData.upkeep_type = type
        layoutData.show = true
        layoutData.upkeep_info.maintainName = item.maintainName
        layoutData.upkeep_info.yachtId = item.yachtId
        layoutData.upkeep_info.price = item.price
        layoutData.upkeep_info.remark = item.remark
        layoutData.upkeep_info.id = item.id
      }
      // 删除保养记录
      const deleteUpkeep = (item) => {
        Dialog.confirm({
          title: `删除保养`,
          message:`是否将 ${item.maintainName} 删除`
        }).then(() => {
          delMaintain(item.id).then(res=>{
            if (res.code == 200) {
              Toast.success('删除成功！')
              setTimeout(()=>{
                layoutData.upkeep_params.pageNum = 1
                layoutData.upkeep_list = []
                layoutData.getUpkeepList()
              },1000)
            }
          })
        })
      }
      return{
          ...toRefs(layoutData),
          editYachtInfo,
          yachtTypeSelect,
          serviceSelect,
          shipownerSelect,
          afterReadOther,
          previewImage,
          delImg,
          getDescriptionHtml,
          onOwnerConfirm,
          handleScrolls,
          addUpkeep,
          editUpkeep,
          deleteUpkeep,
          closeModel,
          confirmModel,
          onToggleTab,
          onSearch,
          onClickButton
      }
      
    }
  };
  </script>
  <style lang="scss">
    .yacht-detail{
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
      .log-cheats{
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
        margin-top: 3.625rem;
        background-color: #f6faf9;
        padding: 1.625rem 1.25rem;
      }
    }
  </style>