<template>
  <div class="address">
    <van-field
    required
    v-model="fieldValue"
    is-link
    readonly
    :label="title"
    placeholder="请选择所在地区"
    @click="show = true"
    input-align="right"
    />
    <van-popup v-model:show="show" round position="bottom">
    <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="show = false"
        @change="onChange"
    />
    </van-popup>
  </div>
</template>
<script>
import { toRefs,reactive, onMounted,watch } from "vue";
import { onBeforeRouteLeave, useRouter,useRoute } from "vue-router";
import { getAddress } from "../../httpSeiver/apis";
export default {
  components: { },
  props:{
    val:String,
    title:{
      type:String,
      default:'市区选择'
    }
  },
  setup(porps,cxt) {
    const addressData = reactive({
        show:false,
        fieldValue:'',
        cascaderValue:'',
        options : [],
        getAddressId:function (id) {
          let params = {
            id:id,
            type:0
          }
          getAddress(params).then(res=>{
            if(res.code == 1){
              let data = res.data
              let list = data.reduce((init,value, index)=>{
                  init.push({})
                  init[index].value = value.id
                  init[index].text = value.region_name
                  init[index].children = []
                  return init
                },[])
                addressData.options = list
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
    onMounted(()=>{
       addressData.getAddressId(0)
    })
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
    // 选择项发生变化时 
    const onChange = (val) => {
      let id = val.value
      let params = {
          id,
          type:0
      }
      getAddress(params).then(res=>{
        let data = res.data
        let list = data.reduce((init,value, index)=>{
            init.push({})
            init[index].value = value.id
            init[index].text = value.region_name
            init[index].children = []
            return init
        },[])
        if(list.length == 0){
          addressData.show= false;
          addressData.fieldValue = val.selectedOptions.map((option) => option.text).join(',');
          getAddress({id,type:1}).then(res=>{
             cxt.emit('getAddress',addressData.fieldValue,id,res.data)
          })
          
        }else{
          addressData.addTree(val.selectedOptions,list,id)
        }
      });
      
    }
    return{
        ...toRefs(addressData),
        onChange
    }
    
  }
};
</script>

<style lang="scss">
 .address{
  margin: .625rem 0;
 }
</style>