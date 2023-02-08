<template>
    <div>
        <el-breadcrumb :separator-icon="ArrowRight" class="mb-10">
            <el-breadcrumb-item>活动沙龙</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'activityMine' }">我的活动</el-breadcrumb-item>
            <el-breadcrumb-item>发布活动</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <template #header>
                <div class="card-header d_flex d_flex_sb d_flex_ac">
                    <span>{{ formData.id ? '编辑活动' : '发布活动' }}</span>
                </div>
            </template>
            <div class="activityInfoPage" v-loading="loading">
                <reuse-form ref="formRef" class="formClass" :formData="formData" :formOption="formOption"
                    :radios="radios" :rules="rules" labelPosition="right" formSize="large">
                    <template #address>
                        <div class="address">
                            <el-input style="width: 80%" @change="onAddressChange" v-model.trim="formData.address" />
                            <el-button style="width: 18%" type="primary" @click="onPickLocation">选取位置</el-button>
                        </div>
                    </template>
                    <template #content>
                        <Editor style="height:600px" :valueHtml="formData.content" @onChangeVal="onChangeContent" @onBlur="onBlur"></Editor>
                    </template>
                    <template #cover>
                        <ReuseUpload :file-list="coverFile" :multiple="false" hint-text="只能上传jpg/png文件, 且单个文件不超过5MB"
                            list-type="picture-card" :before-upload="(file: any) => beforeUpload(file, 'cover')"
                            @on-upload-success="handleUploadCoveSuccess" @on-remove="handleCoveRemove" />
                    </template>

                    <template #file>
                        <ReuseUpload :file-list="fileList" :multiple="true" hint-text="可上传多个文件, 且单个文件不超过200MB"
                            :before-upload="(file: any) => beforeUpload(file, 'file')"
                            @on-upload-success="handleUploadSuccess" @on-remove="handleRemove" />
                    </template>
                </reuse-form>
                <div class="btn">
                    <el-button class="button mr-20" type="primary" @click="onSubmit">提交</el-button>
                    <el-button class="button" @click="onGoBack">返回</el-button>
                </div>

                <!-- 地图 -->
                <position-map v-if="dialogVisible" :positon="formData.positon" @onClose="onClose"
                    :address="formData.address" @onMapConfirm="onMapConfirm">
                </position-map>
            </div>
        </el-card>
    </div>

</template>
  
<script setup lang="ts">
import reuseForm from "@/components/reuseForm/index.vue";
import positionMap from "@/baseUI/positionMap/index.vue";
import Editor from "@/baseUI/editor/index.vue"
import { ArrowRight } from '@element-plus/icons-vue';
import { CustomType } from "@/types";
import { ref, reactive, onMounted, toRefs, watch } from "vue";
import { dayjs, ElMessage, FormInstance, FormRules } from "element-plus";
import ReuseUpload from '@/components/reuseUpload/index.vue';
import { useRouter } from "vue-router";
import useStore from "@/store";
import axios from "axios";
import { createActivity, updateActivity } from "@/api/core/activity";
import { storeToRefs } from "pinia";
const ROUTER = useRouter();
let { commonStore } = useStore();
let { activityType } = storeToRefs(commonStore)
interface Props {
    // 表单数据
    formData: CustomType;
    type?: string;
}

const props = withDefaults(defineProps<Props>(), {
    formData: () => { return {} },
    type: "create"
})

let { formData } = toRefs(props)

// 表单数据
const loading = ref(false);
const formRef: CustomType = ref<FormInstance>();
const formOption = reactive([
    { type: "input", props: "title", label: "活动标题" },
    { type: "input", props: "introduction", label: "活动简介" },
    { type: "date", props: "activityTime", label: "活动时间", dateType: "datetime" },
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
const validateContent = (rule: any, value: string, callback: Function) => {
    if (value === '<p><br></p>') {
        callback(new Error("请输入活动内容"))
    } else {
        callback()
    }
}
const rules = reactive<FormRules>({
    title: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
    introduction: [{ required: true, message: "请输入活动简介", trigger: "blur" }],
    address: [{ required: true, message: "请输入活动地址", trigger: "blur" }],
    activityTime: [{ required: true, message: "请选择活动时间", trigger: "blur" }],
    activityType: [
        { required: true, message: "请选择活动类型", trigger: "blur" },
    ],
    content: [
        { required: true, message: "请输入活动内容", trigger: "blur" },
        { validator: validateContent, trigger: "blur" }
    ],
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
                    message: "该地址暂未找到经纬度,请正确输入",
                    type: "error",
                });
            }
        });
    }
};
// 编辑器失去焦点
const onBlur = () => {
    formRef.value.ruleFormRef().validateField('content')
}
// 编辑提交按钮
const onSubmit = () => {
    formRef.value.ruleFormRef().validate().then(async (res: CustomType) => {
        loading.value = true;
        // 编辑
        formData.value.fileIds = fileIds.value.length > 0 ? fileIds.value.join(',') : ''
        formData.value.activityTime = dayjs(formData.value.activityTime).format("YYYY/MM/DD HH:mm:ss")
        if (formData.value.id) {
            let {
                id,
                introduction,
                activityTime,
                activityType,
                address,
                content,
                cover,
                fileIds,
                title,
            } = formData.value
            let { data } = await updateActivity({
                id,
                introduction,
                activityTime,
                activityType,
                address,
                content,
                cover,
                fileIds,
                title,
            });
            if (data.code !== 200) return;
            ElMessage({
                message: "活动修改成功",
                type: "success"
            })
            ROUTER.push({ name: "activityMine" })
        } else {
            let { data } = await createActivity(formData.value);
            if (data.code !== 200) return;
            ElMessage({
                message: "活动发布成功",
                type: "success"
            })
            ROUTER.push({ name: "activityMine" })
        }
        loading.value = false;
    })
        .catch((err: CustomType) => { });
};
// 返回按钮
const onGoBack = () => {
    ROUTER.go(-1)
}

// 富文本值的改变
const onChangeContent = (val: string) => {
    formData.value.content = val
}

//上传数据
let coverFile: CustomType = ref([]);
let fileList = ref<Array<{ url: string, name: string }>>([]);
let fileIds = ref<Array<number>>([]);
// 上传前的判断
const beforeUpload = (file: any, type: string) => {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    const isLt5M = file.size / 1024 / 1024 > 5;
    const isLt200M = file.size / 1024 / 1024 > 200;
    switch (type) {
        case 'file':
            if (isLt200M) {
                ElMessage.error("上传的图片文件大小不能超过 200MB!");
                return false;
            }
            break;
        case 'cover':
            if (!isJPG) {
                ElMessage.error("上传的图片文件只能是 JPG/PNG 格式!");
                return false;
            }
            if (isLt5M) {
                ElMessage.error("上传的图片文件大小不能超过 5MB!");
                return false;
            }
            break
        default:
            break;
    }
}
//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: Array<any>) => {
    if (res.code !== 200) {
        ElMessage({
            message: "上传失败",
            type: "error"
        })
        return
    }
    let result: Array<number> = [];
    fileList.forEach(item => {
        if (item.status === 'success') {
            if (item.response) {
                result.push(item.response.data.id)
            } else {
                if (formData.value.fileList && formData.value.fileList.length > 0) {
                    formData.value.fileList.forEach((val: { id: number, path: string }) => {
                        if (item.url === import.meta.env.VITE_BASE_URL + val.path) {
                            result.push(val.id)
                        }
                    })
                }
            }
        }
    })
    fileIds.value = result;
};
const handleUploadCoveSuccess = (res: any, file: any, fileList: Array<any>) => {
    if (res.code !== 200) {
        ElMessage({
            message: "上传失败",
            type: "error"
        })
        return
    }
    fileList.forEach(item => {
        if (item.status === 'success') {
            if (item.response) {
                formData.value.cover = item.response.data.id
            }
        }
    })
};
// 移除
const handleRemove = (res: any, fileList: Array<any>) => {
    let result: Array<number> = [];
    fileList.forEach(item => {
        if (item.status === 'success') {
            if (item.response) {
                result.push(item.response.data.id)
            } else {
                if (formData.value.fileList && formData.value.fileList.length > 0) {
                    formData.value.fileList.forEach((val: { id: number, path: string }) => {
                        if (item.url === import.meta.env.VITE_BASE_URL + val.path) {
                            result.push(val.id)
                        }
                    })
                }
            }
        }
    })
    fileIds.value = result;
};
const handleCoveRemove = (res: any, fileList: any) => {
    formData.value.cover = '';
    coverFile.value = [];
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

let stop = watch(formData, () => {
    if (formData.value.coverPath) {
        coverFile.value = [{
            url: import.meta.env.VITE_BASE_URL + formData.value.coverPath
        }]
    }
    if (formData.value.fileList) {
        formData.value.fileList.forEach((item: { id: number, name: string, path: string }, index: number) => {
            fileList.value[index] = {
                name: item.name,
                url: import.meta.env.VITE_BASE_URL + item.path
            }
            fileIds.value.push(item.id)
        })
    }
    stop()
})
onMounted(async () => {
    // 获取活动类型
    activityType.value.length === 0 && await commonStore.onGetActivityType();
    radios.value.activityType = activityType.value;
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

.btn {
    text-align: center;
}
</style>
  