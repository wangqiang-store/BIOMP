<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header d_flex d_flex_sb d_flex_ac">
                <span>{{ formData?.id ? '编辑' : '新建' }}</span>
            </div>
        </template>
        <el-row>
            <el-col :span="14">
                <reuse-form ref="formRef" class="bpForm" :formData="formData" :formOption="formOption"
                    :radios="radioOptions" :rules="rules" label-width="140px" labelPosition="right">
                    <template #incubationBase>
                        <el-input v-model.trim="baseName" disabled />
                    </template>
                    <template #file>
                        <el-upload v-model:file-list="fileLists" :headers="headerOption" multiple
                            :action="fileUploaadUrl" :on-success="handleUploadSuccess" :on-remove="handleRemove">
                            <el-button type="primary">点击上传</el-button>
                            <template #tip>
                                <div class="el-upload__tip">
                                    可上传多个文件, 且单个文件不超过200MB
                                </div>
                            </template>
                        </el-upload>
                    </template>
                </reuse-form>
                <div class="editBtn">
                    <el-button class="button mr-20" type="primary" @click="onSubmit">提交</el-button>
                    <el-button class="button" @click="onGoBack">返回</el-button>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<script lang="ts" setup>
import { shallowRef, ref, computed, watch, toRefs, onMounted, nextTick } from 'vue';
import { ElMessage, FormRules, dayjs } from 'element-plus';
import { CustomType } from "@/types";
import { getToken } from '@/utils/auth';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { verifyBusinessLicenseNumber } from "@/utils/verify"
import { createInTheEntity, updateInTheEntity, checkRepeatProtocolNum } from "@/api/companyApi"
import { getAllIncubationBase } from "@/api/basePortApi"
import useStore from '@/store';
import { storeToRefs } from 'pinia';
const { commonStore } = useStore()
const { baseUserInfo } = commonStore
const Router = useRouter()
interface Props {
    formData: CustomType, // 表单数据
}
const props = withDefaults(defineProps<Props>(), {
    formData: () => {
        return {}
    }
})

// 表单数据
let protocolNum = ref();//备份协议号 用作重复判断
let formData: CustomType = ref({});
let formRef = ref();
const formOption = shallowRef([
    {
        label: "入驻实体名称",
        props: "name",
        type: "input"
    },
    {
        label: "营业执照编号",
        props: "businessLicense",
        type: "input"
    },
    {
        label: "注册日期",
        props: "register",
        type: "date"
    },
    {
        label: "实体类型",
        props: "type",
        type: "radio",
        value: "status",
        text: "statusName"
    },
    {
        label: "孵化协议号",
        props: "protocolNum",
        type: "input"
    },
    {
        label: "孵化协议期限",
        props: "protocolTime",
        type: "date"
    },
    {
        label: "用工人数",
        props: "peopleNum",
        type: "input"
    },
    {
        label: "入驻基地",
        props: "incubationBaseId",
        type: "slot",
        slotName: "incubationBase"
    },
    // {
    //     label: "入驻基地",
    //     props: "incubationBaseId",
    //     type: "input",
    //     isdisadled: true
    // },
    {
        label: "入驻基地时间",
        props: "baseTime",
        type: "date"
    },
    {
        label: "孵化状态",
        props: "status",
        type: "radio",
        value: "status",
        text: "statusName"
    },
    {
        label: "相关协议附件",
        props: "fileIds",
        type: "slot",
        slotName: "file"
    },
])
const validProtocolNum = (rule: CustomType, value: string, callback: Function) => {
    if (formData.value.incubationBaseId) {
        if (formData.value.protocolNum === protocolNum.value) {
            callback()
        } else {
            checkRepeatProtocolNum({
                incubationBaseId: baseUserInfo.incubationBaseId,
                protocolNum: value
            }).then(({ data }) => {
                if (data.code !== 200) {
                    callback(new Error("孵化协议号重复"))
                } else {
                    callback()
                }
            })
        }
    } else {
        callback()
    }
}
const rules = shallowRef<FormRules>({
    name: [
        { required: true, message: '请输入入驻实体名称', trigger: 'blur' },
    ],
    businessLicense: [
        { pattern: verifyBusinessLicenseNumber, message: "请输入正确的营业执照编号", trigger: "blur" }
    ],
    type: [
        { required: true, message: '请选择实体类型', trigger: 'blur' },
    ],
    protocolNum: [
        { required: true, message: '请输入孵化协议号', trigger: 'blur' },
        { validator: validProtocolNum, trigger: "blur" }
    ],
    protocolTime: [
        { required: true, message: '请选择孵化协议期限', trigger: 'change' },
    ],
    peopleNum: [
        { required: true, message: '请输入用工人数', trigger: 'blur' },
        { pattern: /^[0-9]\d*$/, message: "数据为正整数", trigger: "blur" }
    ],
    incubationBaseId: [
        { required: true, message: '请选择入驻基地', trigger: 'blur' },
    ],
    baseTime: [
        { required: true, message: '请选择入驻基地时间', trigger: 'change' },
    ],
    status: [
        { required: true, message: '请选择孵化状态', trigger: 'blur' },
    ],
    // fileIds: [
    //     { required: true, message: '请上传 相关协议附件', trigger: 'change' },
    // ],
})
const radioOptions = ref<CustomType>({
    status: [],
    type: [],
});
// 获取所有状态的基地
const baseName = ref("")
const allBaseList = ref([])
const getAllIncubationBaseFn = async () => {
    let { data } = await getAllIncubationBase()
    if (data.code === 200) {
        allBaseList.value = data.data
        let list: any = allBaseList.value.filter((item: any) => item.id === baseUserInfo.incubationBaseId)
        baseName.value = list[0]?.name
    }
}

// 文件数据
let fileIdss = ref<Array<number>>([]);
let fileLists = ref<Array<{ id?: number, name: string, url: string }>>([]);
//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: Array<any>) => {
    if (res.code !== 200) {
        ElMessage.error('上传失败')
        return
    }
    fileIdss.value.push(res.data.id)
}
// 移除
const handleRemove = (res: any, fileList: Array<any>) => {
    //获取要删除的文件id
    let deleteId = res.response ? res.response.data.id : res.id;
    // 获取剩余的文件
    fileIdss.value = fileIdss.value.filter((item: any) => item !== deleteId);
}

// 提交按钮
const onSubmit = () => {
    formData.value.fileIds = fileIdss.value.join(',');
    formRef.value.ruleFormRef().validate().then(async (res: CustomType) => {
        if (res) {
            formData.value.baseTime = dayjs(formData.value.baseTime).format("YYYY/MM/DD HH:mm:ss")
            formData.value.protocolTime = dayjs(formData.value.protocolTime).format("YYYY/MM/DD HH:mm:ss")
            formData.value.register = dayjs(formData.value.register).format("YYYY/MM/DD HH:mm:ss")

            let { id, name, businessLicense, baseTime, protocolTime, register, type, status, protocolNum, peopleNum, incubationBaseId, fileIds } = JSON.parse(JSON.stringify(formData.value))
            let obj = { id, name, businessLicense, baseTime, protocolTime, register, type, status, protocolNum, peopleNum, incubationBaseId, fileIds }
            if (formData.value.id) {
                // 编辑
                let { data } = await updateInTheEntity(obj);
                if (data.code === 200) {
                    ElMessage({
                        message: '入驻实体信息修改成功',
                        type: 'success',
                    })
                    setTimeout(() => {
                        Router.go(-1);
                    }, 500);
                };

            } else {
                // 添加
                let { data } = await createInTheEntity(obj);
                if (data.code === 200) {
                    ElMessage({
                        message: '入驻实体数据新建成功',
                        type: 'success',
                    })
                    setTimeout(() => {
                        Router.go(-1);
                    }, 500);
                };
            }

        }
    }).catch((err: CustomType) => { })
}
// 返回按钮
const onGoBack = () => {
    Router.go(-1)
}


//获取token
const headerOption = computed(() => {
    return {
        Authorization: getToken()
    }
});
//获取上传url
const fileUploaadUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}/file/upload`
})


let stop = watch(() => props.formData, (newData) => {
    formData.value = newData;
    protocolNum.value = newData.protocolNum;
    let oldFileIds = newData.fileIds
    fileIdss.value = typeof oldFileIds === "string" ? oldFileIds.split(",").map(item => +item) : []

    // 提取文件列表
    let oldFileList = newData.fileList
    if (oldFileList && oldFileList.length > 0) {
        fileLists.value = oldFileList.map((item: any) => {
            item.id = item.id;
            item.name = item.name;
            item.url = import.meta.env.VITE_BASE_URL + item.path;
            return item;
        });
    }
    formData.value.incubationBaseId = baseUserInfo.incubationBaseId
    formData.value.incubationBaseName = baseUserInfo.incubationBaseName
    stop()
}, { deep: true })

onMounted(async () => {
    // 获取孵化状态列表
    if (commonStore.incubationStatusList.length === 0) {
        await commonStore.getIncubationStatusTypeFn()
    }
    radioOptions.value.status = commonStore.incubationStatusList
    // 获取实体类型列表
    if (commonStore.entityTypeList.length === 0) {
        await commonStore.getEntityTypeFn()
    }
    radioOptions.value.type = commonStore.entityTypeList

    getAllIncubationBaseFn()// 获取所有状态的基地

})
onBeforeRouteLeave(() => {
    commonStore.$patch({
        menuActivePath: ""
    })
})


</script>

<style scoped lang="scss">
.editBtn {
    text-align: center;
}
</style>