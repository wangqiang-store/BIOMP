<template>
    {{fileList}}
    <el-upload v-model:file-list="fileList" class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :multiple="multiple"
        :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove">
        <slot></slot>
        <template #tip>
            <div class="el-upload__tip" v-if="tip">{{ tip }}</div>
        </template>
    </el-upload>
</template>
  
<script lang="ts" setup>
import {
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
    toRefs,
} from "vue";
// import { CustomType } from '@/types';
let { proxy }: any = getCurrentInstance();

interface Props {
    fileList: any[],  // 文件列表
    multiple?: boolean, // 是否多选
    tip?: string,
    disable?: boolean,
    border?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    fileList: () => [],
    multiple: false,
    tip: "",
})

const emits = defineEmits(["handleSuccess", "handleRemove", "handleError"])

const handleSuccess = (res: any) => {
    emits("handleSuccess", res)
}
const handleRemove = (res: any) => {
    emits("handleRemove", res)
}
const handleError = (res: any) => {
    emits("handleError", res)
}






onMounted(() => {
});
</script>
  
<style lang="scss" scoped >
:deep(.upload-demo) {
    width: 100%;
    height: 100%;
}
</style>
  