<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header d_flex d_flex_sb d_flex_ac">
                <span>{{ formData.id ? '编辑' : '新建' }}</span>
            </div>
        </template>
        <el-row>
            <el-col :span="14">
                <reuse-form ref="formRef" class="bpForm" :formData="formData" :formOption="formOption"
                    :radios="radioOptions" :formItemOption="selectOption" :rules="rules" label-width="140px"
                    labelPosition="right">
                    <template #file>
                        <ReuseUpload :file-list="fileList" :multiple="true" hint-text="可上传多个文件,且单个文件不超过200MB"
                            @on-upload-success="handleUploadSuccess" :before-upload="onBeforeUpload"
                            @on-remove="handleRemove" />
                    </template>
                </reuse-form>
                <div class="btn">
                    <el-button class="button mr-20" type="primary" @click="onSubmit">提交</el-button>
                    <el-button class="button" @click="onGoBack">返回</el-button>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<script lang="ts" setup>
import { shallowRef, ref, watch, onMounted } from 'vue';
import { entityData } from '@/api/type'
import { ElMessage, FormRules } from 'element-plus';
import ReuseForm from "@/components/reuseForm/index.vue";
import ReuseUpload from '@/components/reuseUpload/index.vue';
import { CustomType } from "@/types";
import { useRouter } from 'vue-router';
import useStore from "@/store";
import { storeToRefs } from 'pinia';
import { createEntity, updateEntity, checkRepeatProtocolNum } from "@/api/core/hatchEntity";
import dayjs from "dayjs";
import { verifyBusiness } from "@/utils/verify";
const { commonStore } = useStore();
let { entityStatus, entityType, allBaseList } = storeToRefs(commonStore)
interface Props {
    formData: entityData, // 表单数据
}
const props = withDefaults(defineProps<Props>(), {
    formData: () => {
        return {}
    }
})
const ROUTER = useRouter()
let formData = ref<entityData>({});
let formRef = ref();
const validProtocolNum = (rule: CustomType, value: string, callback: Function) => {
    if (formData.value.incubationBaseId) {
        if (formData.value.incubationBaseId === incubationBaseId.value && formData.value.protocolNum === protocolNum.value) {
            callback()
        } else {
            checkRepeatProtocolNum({
                incubationBaseId: formData.value.incubationBaseId,
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
const validIncubationBase = (rule: CustomType, value: string, callback: Function) => {
    if (formData.value.protocolNum) {
        formRef.value.ruleFormRef().validateField("protocolNum");
        callback()
    } else {
        callback()
    }
}
// 表单数据
let protocolNum = ref();//备份协议号 用作重复判断
let incubationBaseId = ref();//备份入驻基地id 用作重复判断
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
        type: "select",
        value: "id",
        optionLabel: "name",
        filterable: true,
        isOpsDisabled(row: entityData) {
            return row.status === 2
        }
    },
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
const rules = shallowRef<FormRules>({
    name: [
        { required: true, message: '请输入入驻实体名称', trigger: 'blur' },
    ],
    businessLicense: [
        { pattern: verifyBusiness, message: "请输入正确的营业执照号", trigger: "blur" }
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
        { required: true, message: '请选择入驻基地', trigger: 'change' },
        { validator: validIncubationBase, trigger: "change" }
    ],
    baseTime: [
        { required: true, message: '请选择入驻基地时间', trigger: 'change' },
    ],
    status: [
        { required: true, message: '请选择孵化状态', trigger: 'blur' },
    ],
})

const radioOptions = ref<CustomType>({});
const selectOption = ref<CustomType>({})
// 文件列表
let fileIds = ref<Array<number>>([]);

let fileList = ref<Array<{ id?: number, name: string, url: string }>>([]);
//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: Array<any>) => {
    if (res.code !== 200) {
        ElMessage({
            message: res.msg
        })
        return
    }
    let result: Array<number> = [];
    fileList.forEach(item => {
        if (item.status === 'success') {
            if (item.response) {
                result.push(item.response.data.id)
            } else {
                if (props.formData.fileList && props.formData.fileList.length > 0) {
                    props.formData.fileList.forEach((val: { id: number, path: string }) => {
                        if (item.url === import.meta.env.VITE_BASE_URL + val.path) {
                            result.push(val.id)
                        }
                    })
                }
            }
        }
    })
    fileIds.value = result;
}

const onBeforeUpload = (file: any) => {
    const isLt200M = file.size / 1024 / 1024 > 200;
    if (isLt200M) {
        ElMessage.error("上传的文件大小不能超过 200MB!");
        return false;
    }
}
// 移除
const handleRemove = (res: any, fileList: Array<any>) => {
    let result: Array<number> = [];
    fileList.forEach(item => {
        if (item.status === 'success') {
            if (item.response) {
                result.push(item.response.data.id)
            } else {
                if (props.formData.fileList && props.formData.fileList.length > 0) {
                    props.formData.fileList.forEach((val: { id: number, path: string }) => {
                        if (item.url === import.meta.env.VITE_BASE_URL + val.path) {
                            result.push(val.id)
                        }
                    })
                }
            }
        }
    })
    fileIds.value = result;
}

// 提交按钮
const onSubmit = () => {
    formData.value.fileIds = fileIds.value.length > 0 ? fileIds.value.join(',') : '';
    formRef.value.ruleFormRef().validate().then(async (res: CustomType) => {
        if (res) {
            formData.value.protocolTime = dayjs(formData.value.protocolTime).format("YYYY/MM/DD");
            formData.value.baseTime = dayjs(formData.value.baseTime).format("YYYY/MM/DD");
            formData.value.register = dayjs(formData.value.baseTime).format("YYYY/MM/DD");
            if (formData.value.id) {
                // 编辑
                let { id,
                    name,
                    businessLicense,
                    type,
                    protocolNum,
                    peopleNum,
                    incubationBaseId,
                    status,
                    protocolTime,
                    baseTime,
                    register,
                    fileIds
                } = formData.value;
                let { data } = await updateEntity({
                    id,
                    name,
                    businessLicense,
                    register,
                    type,
                    protocolNum,
                    protocolTime,
                    peopleNum,
                    incubationBaseId,
                    baseTime,
                    status,
                    fileIds
                });
                if (data.code !== 200) return;
                ROUTER.push({ name: "company" });
                ElMessage({
                    message: '入驻实体信息修改成功',
                    type: 'success',
                })
            } else {
                // 添加
                let { data } = await createEntity(formData.value);
                if (data.code !== 200) return;
                ROUTER.push({ name: "company" });
                ElMessage({
                    message: '入驻实体数据新建成功',
                    type: 'success',
                })
            }
        }
    }).catch((err: CustomType) => { })
}
// 返回按钮
const onGoBack = () => {
    ROUTER.go(-1)
}

let stop = watch(() => props.formData, async (newData) => {
    formData.value = newData;
    protocolNum.value = newData.protocolNum;
    incubationBaseId.value = newData.incubationBaseId;
    let fileId: Array<number> = [];
    if (newData.fileList !== null) {
        newData.fileList.forEach((item: { id: number, name: string, path: string }, index: number) => {
            fileList.value[index] = {
                name: item.name,
                url: import.meta.env.VITE_BASE_URL + item.path
            }
            fileId.push(item.id)
        })
        fileIds.value = fileId
    }
    stop()
}, { deep: true })

onMounted(async () => {
    // 获取所有基地列表
    await commonStore.onGetAllBaseData()
    selectOption.value.incubationBaseId = allBaseList.value as Array<any>;
    // 获取实体类型
    if (entityType.value.length === 0) await commonStore.onGetEntityType()
    radioOptions.value.type = entityType.value;
    // 获取实体状态
    if (entityStatus.value.length === 0) await commonStore.onGetEntityStatus()
    radioOptions.value.status = entityStatus.value;
})
</script>

<style scoped lang="scss">
.btn {
    text-align: center;
}
</style>