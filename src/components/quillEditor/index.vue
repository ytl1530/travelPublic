<template>
    <div class="quill-editor">
        <QuillEditor class="editor" contentType="html" :modules="modules" v-model:content="description" @text-change="getChangeHtml" :toolbar="toolbar"></QuillEditor>
    </div>
</template>
  
<script>
  import { toRefs,reactive, onMounted,watch,computed } from "vue";
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import ImageUploader from 'quill-image-uploader';
  import { upLoadFiles } from "../../httpSeiver/apis";
  export default {
    components: { QuillEditor },
    props:{
        descrip:String,
    },
    setup(porps,cxt) {
        const layoutData = reactive({
            description:'',
            modules:{
                name: 'imageUploader',
                module: ImageUploader,
                options: {
                    upload: file => {
                        return new Promise((resolve, reject) => {
                            var formData = new FormData()
                            formData.append("file",file)
                            upLoadFiles(formData).then(res => {
                                console.log(res)
                                resolve(res.data);
                            })
                            .catch(err => {
                                reject("Upload failed");
                                console.error("Error:", err)
                            })
                        })
                    }
                },
                
            },
            toolbar: [
                ['bold', 'italic', 'underline', 'strike',{ align: [] },{ list: 'ordered' }, { list: 'bullet' },'image'],
            ]
        })
        onMounted(()=>{

        }) 
        watch(()=>porps.descrip,(val,preVal)=>{
            //val为修改后的值,preVal为修改前的值
            layoutData.description = val
        },
        {
            //如果加了这个参数，值为true的话，就消除了惰性，watch会在创建后立即执行一次
            //那么首次执行，val为默认值,preVal为undefined
            immediate:true,
            //这个参数代表监听对象时，可以监听深度嵌套的对象属性
            //比如message是一个对象的话，可以监听到message.a.b.c，也就是message下的所有属性
            deep:true,
        })
        const getChangeHtml = () =>{
            const imgList = document.querySelectorAll(".ql-editor img");
            for (let i = 0; i < imgList.length; i++) {
                imgList[i].style.width = "30%"; // 设置 图片宽度为80%
            }
            cxt.emit('getHtml',layoutData.description)
        }
        return{
            ...toRefs(layoutData),
            getChangeHtml
        }
      
    }
  }
  </script>
  
  <style lang="scss">
    .quill-editor{
        background-color: #fff;
        .editor{
            height: 14rem;
        }
    }
  </style>