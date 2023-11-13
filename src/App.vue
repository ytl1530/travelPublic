
<template>
  <div>
    <div v-if="$route.meta.show">
      <van-sticky><top-header></top-header></van-sticky>
    </div>
    <router-view v-if="$route.meta.keepAlive"  v-slot="{ Component }">
      <keep-alive exclude="searchResult">
        <component :is="Component"></component>
      </keep-alive>
    </router-view>

    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
import topHeader from "./components/Header/topHeader.vue";
import { toRefs,reactive, onMounted } from "vue";
export default {
  components:{topHeader},
  
  setup(){
      const appData = reactive({
        show:false
      })
      onMounted(()=>{})
      return{
        ...toRefs(appData),
      }
  }
}

</script>
<style>
</style>
