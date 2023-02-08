<template>
    <div>
        <el-upload v-model:file-list="files" :headers="headerOption" :multiple="multiple" :action="fileUploaadUrl"
            :list-type="listType" :on-preview="handlePictureCardPreview" :on-success="handleUploadSuccess"
            :on-remove="handleRemove" :before-upload="beforeUpload" ref="upload">
            <template v-if="listType === 'text'">
                <el-button type="primary">点击上传</el-button>
            </template>
            <template v-if="listType === 'picture-card'">
                <el-icon>
                    <Plus />
                </el-icon>
            </template>
            <template #tip>
                <div class="el-upload__tip">
                    {{ hintText }}
                </div>
            </template>
        </el-upload>
        <el-dialog v-model="ImgVisible">
            <img w-full :src="dialogImageUrl" style="width:100%" alt="图片" />
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { getToken } from '@/utils/auth';
import type { UploadInstance, UploadProps } from 'element-plus'
import { computed, ref, toRefs, watch } from 'vue';
import { CustomType } from '@/types';
interface Props {
    fileList: Array<{ name?: string, url?: string }>,
    multiple?: boolean,
    hintText?: string//提示语
    listType?: string;
    beforeUpload?: Function
}

const props = withDefaults(defineProps<Props>(), {
    fileList: () => {
        return []
    },
    multiple: false,
    hintText: "只能上传jpg/png文件,且单个文件不超过5MB",
    listType: 'text',
    beforeUpload: () => { }
})

let { beforeUpload, listType } = toRefs(props);

const emits = defineEmits<{
    (e: 'onUploadSuccess', res: CustomType, file: CustomType, fileList: Array<any>): void
    (e: 'onRemove', res: any, fileList: Array<any>): void
    (e: 'onBeforeUpload', file: CustomType): void
}>()

const upload = ref<UploadInstance>()
let dialogImageUrl = ref("");
let ImgVisible = ref(false);
let files = ref<Array<{ name?: string, url?: string }>>([]);

const headerOption = computed(() => {
    return {
        Authorization: getToken()
    }
});

const fileUploaadUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}/file/upload`
})

// 预览图片
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
    if (listType.value !== "picture-card") return;
    dialogImageUrl.value = uploadFile.url!;
    ImgVisible.value = true;
}

// 上传前的判断
// const beforeUpload = (file: any) => {
//     emits("onBeforeUpload", file);
// }

//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: Array<any>) => {
    files.value = fileList;
    emits("onUploadSuccess", res, file, fileList);
}

// 移除
const handleRemove = (res: any, fileList: Array<any>) => {
    emits("onRemove", res, fileList);
}

watch(() => props.fileList,
    (newData) => {
        files.value = newData;
    },
    {
        deep: true
    }
)

watch(files,
    (newData) => {
        if (props.listType === 'picture-card' && !props.multiple) {
            let card: HTMLDivElement | null = document.querySelector('.el-upload--picture-card');
            if (newData.length > 0) {
                (card as HTMLDivElement).style.display = 'none'
            } else {
                (card as HTMLDivElement).style.display = 'inline-flex'
            }
        }
    },
    {
        deep: true
    }
)
</script>

<style scoped lang="scss">

</style>