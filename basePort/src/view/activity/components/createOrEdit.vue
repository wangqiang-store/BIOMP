<template>
    <div class="activityInfoPage" v-loading="loading">
        <div class="title" v-show="type === 'create'">发布活动</div>
        <reuse-form ref="formRef" class="formClass" :formData="formData" :formOption="formOption" :radios="radios"
            :rules="rules" labelPosition="right" formSize="large">
            <template #address>
                <div class="address">
                    <el-input style="width: 80%" @change="onAddressChange" v-model.trim="formData.address" />
                    <el-button style="width: 18%" type="primary" @click="onPickLocation">选取位置</el-button>
                </div>
            </template>
            <template #content>
                <Editor style="height:600px" :valueHtml="formData.content" @onChangeVal="onChangeContent" @onBlur="onBlur"></Editor>
            </template>
            <!-- 封面 -->
            <template #cover>
                <el-upload v-loading="imgLoading" v-model:file-list="imgFileLists" :action="fileUploaadUrl"
                    :headers="headerOption" list-type="picture-card" :on-preview="handlePictureCardPreview"
                    :on-success="handleCoverUploadSuccess" :on-remove="handleCoverRemove"
                    :before-upload="(file: any) => beforeUpload(file, 'cover')">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <!-- 图片预览 -->
                    <el-dialog v-model="ImgVisible">
                        <img w-full :src="dialogImageUrl" style="width: 100%" alt="图片" />
                    </el-dialog>
                    <template #tip>
                        <div class="el-upload__tip">
                            只能上传jpg/png文件, 且单个文件不超过5MB
                        </div>
                    </template>
                </el-upload>
            </template>
            <!-- 附件 -->
            <template #file>
                <el-upload v-model:file-list="fileLists" multiple :action="fileUploaadUrl" :headers="headerOption"
                    :on-success="handleUploadSuccess" :on-remove="handleRemove"
                    :before-upload="(file: any) => beforeUpload(file, 'file')">
                    <el-button type="primary">点击上传</el-button>
                    <template #tip>
                        <div class="el-upload__tip">
                            可上传多个文件, 且单个文件不超过200MB
                        </div>
                    </template>
                </el-upload>
            </template>
        </reuse-form>
        <div class="btn">
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="onCancel">返回</el-button>
        </div>

        <!-- 地图 -->
        <position-map v-if="dialogVisible" @onClose="onClose" :address="formData.address" @onMapConfirm="onMapConfirm">
        </position-map>
    </div>
</template>
  
<script setup lang="ts">
import reuseForm from "@/components/reuseForm/index.vue";
import positionMap from "@/baseUI/positionMap/index.vue";
import Editor from "@/baseUI/editor/index.vue"
import { CustomType } from "@/types";
import { ref, reactive, onMounted, computed, watch } from "vue";
import { dayjs, ElMessage, FormInstance, FormRules } from "element-plus";
import type { UploadProps } from "element-plus";
import { createActivity, updateActivity } from "@/api/activityApi/index"
import { getToken } from "@/utils/auth";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import axios from "axios";
import useStore from "@/store/index"
const { commonStore } = useStore()
const Router = useRouter();

interface Props {
    // 表单数据
    formData: CustomType;
    type?: string;
}

const props = withDefaults(defineProps<Props>(), {
    formData: () => { return {} },
    type: "create"
})

// 表单数据
let formData: CustomType = ref({});
const loading = ref(false);
const formRef: CustomType = ref<FormInstance>();
const formOption = reactive([
    { type: "input", props: "title", label: "活动标题" },
    { type: "input", props: "introduction", label: "活动简介" },
    { type: "date", props: "activityTime", dateType: "datetime", label: "活动时间" },
    { type: "slot", slotName: "address", props: "address", label: "活动地点" },
    {
        type: "radio",
        props: "activityType",
        label: "活动类型",
        value: "status",
        text: "statusName",
    },
    { type: "slot", slotName: "content", props: "content", label: "活动内容" },
    { type: "slot", slotName: "cover", label: "封面" },
    { type: "slot", slotName: "file", label: "附件" },
]);
const radios = ref<CustomType>({});
const validateContent = (rule: any, value: any, callback: any) => {
    if (value === "<p><br></p>") {
        callback(new Error("请输入活动内容"));
    } else {
        callback();
    }
};
const rules = reactive<FormRules>({
    title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
    introduction: [{ required: true, message: "请输入活动简介", trigger: "blur" }],
    address: [{ required: true, message: "请输入活动地址", trigger: "blur" }],
    activityTime: [{ required: true, message: "请选择活动时间", trigger: "blur" }],
    activityType: [
        { required: true, message: "请选择活动类型", trigger: "blur" },
    ],
    content: [{ required: true, message: "请输入活动内容" }, { validator: validateContent }],
});
// 根据地址获取经纬度
const onAddressChange = (val: string) => {
    if (val) {
        axios({
            method: "get",
            url: `https://restapi.amap.com/v3/geocode/geo?key=aabd87e173364ec736b3a708f8eec7ba&address=${val}`,
        }).then((res) => {
            const { data } = res;
            if (data.status === "1" && data.infocode === "10000") {
                const location = data.geocodes[0].location.split(",");
                formData.value.longitude = location[0];
                formData.value.latitude = location[1];
            } else {
                ElMessage({
                    showClose: true,
                    message: "该活动地点暂未找到经纬度,请正确输入",
                    type: "error",
                });
                formData.value.longitude = "";
                formData.value.latitude = ""
            }
        });
    }
};



// 编辑提交按钮
const onSubmit = () => {
    //判断是否有经纬度
    if (!formData.value.longitude) {
        ElMessage({
            showClose: true,
            message: "该活动地点暂未找到经纬度,请正确输入",
            type: "error",
        });
        return
    }
    formRef.value
        .ruleFormRef()
        .validate()
        .then(async (res: CustomType) => {
            loading.value = true;
            formData.value.activityTime = dayjs(formData.value.activityTime).format("YYYY/MM/DD HH:mm:ss")
            formData.value.fileIds = fileIdss.value.join(",")
            // 编辑
            let { id, activityTime, activityType, address, content, cover, fileIds, introduction, latitude, longitude, title } = formData.value
            let obj = { id, activityTime, activityType, address, content, cover, fileIds, introduction, latitude, longitude, title }
            if (formData.value.id) {
                let { data } = await updateActivity(obj)
                if (data.code === 200) {
                    ElMessage({
                        message: '编辑成功',
                        type: 'success',
                    })
                    setTimeout(() => {
                        Router.go(-1);
                    }, 500);
                }
            } else {
                let { data } = await createActivity(obj)
                if (data.code === 200) {
                    ElMessage({
                        message: '添加成功',
                        type: 'success',
                    })
                    setTimeout(() => {
                        Router.go(-1);
                    }, 500);
                }
            }
            loading.value = false;
        })
        .catch((err: CustomType) => { });
};
// 返回
const onCancel = () => {
    Router.go(-1);
};

// 富文本值的改变
const onChangeContent = (val: string) => {
    formData.value.content = val
}
// 富文本编辑器失去焦点
const onBlur = () => {
    formRef.value.ruleFormRef().validateField('content')
}

//上传 - 封面数据
const imgLoading = ref(false)
const imgFileLists: CustomType = ref([]);
const ImgVisible = ref(false);
const dialogImageUrl = ref("");
// 预览图片
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!;
    ImgVisible.value = true;
};
// 上传成功
const handleCoverUploadSuccess = (res: any, file: any, fileList: any) => {
    imgLoading.value = true
    formData.value.cover = res.data.id;
    if (fileList.length > 0) {
        imgFileLists.value = [fileList[fileList.length - 1]];
    }
    setTimeout(() => {
        imgLoading.value = false
    }, 500);
}
//移除
const handleCoverRemove = (res: any, fileList: any) => {
    formData.value.cover = "";
}

//上传 - 附件数据
let fileIdss: any = ref<Array<number>>([]); //文件ids
const fileLists: CustomType = ref([]); //文件列表
// 上传前的判断
const beforeUpload = (file: any, type: string) => {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    const isLt5M = file.size / 1024 / 1024 > 5;
    const isLt200M = file.size / 1024 / 1024 > 200;
    if (type === "cover") {
        if (!isJPG) {
            ElMessage.error("上传的图片文件只能是 JPG/PNG 格式!");
            return false;
        }
        if (isLt5M) {
            ElMessage.error("上传的图片文件大小不能超过 5MB!");
            return false;
        }
    } else {
        if (isLt200M) {
            ElMessage.error("上传的附件文件大小不能超过 200MB!");
            return false;
        }
    }

}
//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: any) => {
    if (res.code !== 200) {
        ElMessage.error('上传失败')
        return
    }
    fileIdss.value.push(res.data.id)
};
// 移除
const handleRemove = (res: any, fileList: any) => {
    //获取要删除的文件id
    let deleteId = res.response ? res.response.data.id : res.id;
    // 获取剩余的文件
    fileIdss.value = fileIdss.value.filter((item: any) => item !== deleteId);
};


// 地图操作
const dialogVisible = ref(false); // 地图显示隐藏
// 选取位置按钮
const onPickLocation = () => {
    dialogVisible.value = true;
    formRef.value.ruleFormRef().clearValidate(["address", "longitude"]);
};
//关闭
const onClose = () => {
    dialogVisible.value = false;
};
//确认
const onMapConfirm = ({ address, position }: CustomType) => {
    formData.value.address = address;
    formData.value.longitude = position[0];
    formData.value.latitude = position[1];
};


const headerOption = computed(() => {
    return {
        Authorization: getToken()
    }
});
const fileUploaadUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}/file/upload`
})
onBeforeRouteLeave(() => {
    commonStore.$patch({
        menuActivePath: "",
        activityId: ""
    })
})
let stop = watch(() => props.formData, (newData) => {
    formData.value = newData;
    // 提取文件ids
    let oldFileIds = newData.fileIds
    fileIdss.value = typeof oldFileIds === "string" ? oldFileIds.split(",").map(item => +item) : []


    // 提取文件列表
    let oldFileList = newData.fileList
    if (oldFileList && oldFileList.length > 0) {
        fileLists.value = oldFileList.map((item: any) => {
            item.url = import.meta.env.VITE_BASE_URL + item.path;
            return item;
        });
    }
    if (newData.coverPath) {
        imgFileLists.value = [{ url: import.meta.env.VITE_BASE_URL + newData.coverPath }]
    }

    stop()
}, { deep: true })
onMounted(async () => {
    //获取活动类型列表
    if (commonStore.activityTypeList.length === 0) {
        await commonStore.getActivityTypeFn()
    }
    radios.value.activityType = commonStore.activityTypeList
});
</script>
  
<style scoped lang="scss">
.activityInfoPage {
    padding: 20px 80px;

    .title {
        font-size: 16px;
        font-weight: 700;
    }

    .formClass {
        padding: 20px 0;
        margin: auto;
        max-width: 1100px;
        min-width: 700px;
    }

    .btn {
        display: flex;
        justify-content: center;
    }

    .address {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
}
</style>
  