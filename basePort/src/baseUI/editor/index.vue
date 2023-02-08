<template>
  <div style="border: 1px solid #ccc">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
          :mode="mode" />
      <Editor style="height: 350px;width:100%; overflow-y: hidden;" v-model="content" :defaultConfig="editorConfig"
          @onBlur="handleBlur" :mode="mode" @onCreated="handleCreated" />
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor } from '@wangeditor/editor'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus';
interface Props {
  valueHtml: string; //内容 HTML 
  mode?: string; //编辑器模式 'default' 或 'simple'
}
const props = withDefaults(defineProps<Props>(), {
  valueHtml: "",
  mode: "default"
})
const emits = defineEmits<{
  (e: 'onChangeVal', html: string): void
  (e: 'onBlur', data: boolean): void
}>()

const content = ref('');

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 工具栏配置
const toolbarConfig: any = {
  excludeKeys: ["fullScreen", "undo", "redo", "emotion", "insertTable", "group-video", "codeBlock", "todo", "insertImage"]
}
const editorConfig = {
  placeholder: '请输入内容...',
  html: '',
  MENU_CONF: {
      uploadImage: {
          server: `${import.meta.env.VITE_BASE_URL}/file/upload`,
          fieldName: 'file',
          allowedFileTypes: ['image/*'],
          maxFileSize: 5 * 1024 * 1024,
          headers: {
              "Authorization": getToken(),
          },
          withCredentials: true,
          // 继续写其他配置...
          //【注意】不需要修改的不用写，wangEditor 会去 merge 当前其他配置
          // 上传之前触发
          onBeforeUpload(file: any) {
              console.log("上传之前触发", file)
              // file 选中的文件，格式如 { key: file }
              return file
          },
          // 单个文件上传失败
          onFailed(file: any, res: any) {
              console.log(`${file.name} 上传失败`, res)
          },
          // 单个文件上传成功之后
          onSuccess(file: File, res: any) {  // TS 语法
              // console.log(`${file.name} 上传成功`, res)
          },
          // 上传错误，或者触发 timeout 超时
          onError(file: any, err: any, res: any) {
              console.log(`${file.name} 上传出错`, err, res)
              if (err.toString().indexOf('exceeds maximum allowed size of 5 MB') !== -1) {
                  ElMessage({
                      message: "上传图片大小不能超过5m",
                      type: "error"
                  })
                  return
              }
              ElMessage({
                  message: err,
                  type: "error"
              })
          },
          customInsert(result: any, insertFn: any) {
              // 从 result 中找到 url alt href ，然后插图图片
              insertFn(import.meta.env.VITE_BASE_URL + result.data.path)
          }
      }
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  editorRef.value.setHtml(content.value)
}

const handleBlur = (editor: IDomEditor) => {
  emits("onBlur", true)
}
watch(content, (newVal) => {
  emits("onChangeVal", newVal)
})
watch(() => props.valueHtml, (newVal) => {
  content.value = newVal
})
</script> 
<style scoped lang="scss">
:deep(.w-e-text-placeholder) {
  top: 6px;
}
</style>