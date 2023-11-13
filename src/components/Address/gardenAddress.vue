<template>
  <div class="garden-address">
    <van-field
    required
    v-model="fieldValue"
    is-link
    readonly
    :label="title"
    placeholder="请选择停车场"
    @click="show = true"
    input-align="right"
    v-if="gender_show"
    />
    <van-popup v-model:show="show" round position="bottom">
    <van-cascader
        v-model="cascaderValue"
        title="请选择停车场"
        :options="options"
        @close="show = false"
        @change="onChangeDetail"
    />
    </van-popup>
  </div>
</template>

<script>
import { toRefs,reactive, onMounted,watch } from "vue";
import { onBeforeRouteLeave, useRouter,useRoute } from "vue-router";
import { getAddress } from "../../httpSeiver/apis";
import { Toast } from 'vant';
import 'vant/es/toast/style';
export default {
  components: { },
  props:{
    streetId:Number,
    val:String,
    title:{
      type:String,
      default:'停车场选择'
    }
  },
  setup(porps,cxt) {
    const addressData = reactive({
        show:false,
        fieldValue:'',
        cascaderValue:'',
        options : [],
        gender_show:false,
        title:'',
        getAddressId:function (id) {
          let params = { id, type:1}
          getAddress(params).then(res=>{
            if(res.code == 1){
              let data = res.data
              let list = data.reduce((init,value, index)=>{
                  init.push({})
                  init[index].value = value.id
                  init[index].text = value.address_name
                  init[index].lng = value.lng
                  init[index].lat = value.lat
                  init[index].children = []
                  return init
                },[])
              if(list.length == 0){
                addressData.gender_show = false
              }else{
                addressData.gender_show = true
                addressData.options = list  
              }
            }
          })
        },
        addTree:function(selectedOptions, children, id) {
          selectedOptions.forEach(item => {
            if (item.value === id) {
              item.children = children
            }
          })
        }
    })
    watch(()=>porps.streetId,(val,preVal)=>{
                //val为修改后的值,preVal为修改前的值
                addressData.getAddressId(val)
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
    watch(()=>porps.val,(val,preVal)=>{
                //val为修改后的值,preVal为修改前的值
                addressData.fieldValue = val
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
    watch(()=>porps.title,(val,preVal)=>{
                //val为修改后的值,preVal为修改前的值
                addressData.title  = val
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
    onMounted(()=>{
      // addressData.getAddressId(0)
    })
    // 全部选项选择完毕后，会触发 finish 事件
    const onChangeDetail = (val) => {
      let id = val.value
      let params = {
          id,
          type:1
      }
      getAddress(params).then(res=>{
        let data = res.data
        let list = data.reduce((init,value, index)=>{
            init.push({})
            init[index].value = value.id
            init[index].text = value.address_name
            init[index].lng = value.lng
            init[index].lat = value.lat
            init[index].children = []
            return init
        },[]) 
        if(list.length == 0){
          addressData.show= false;
          addressData.fieldValue = val.selectedOptions.map((option) => option.text).join(',');
          cxt.emit('getGardenAddress',id,val.selectedOptions)
        }else{
          addressData.addTree(val.selectedOptions,list,id)
        }

        
      });
      
    }
    return{
        ...toRefs(addressData),
        onChangeDetail
    }
    
  }
};
</script>

<style lang="scss">
  .garden-address{
  margin: .625rem 0;
 }
</style>