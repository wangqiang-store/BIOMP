<template>
    <div class="w-100">
        <h3 class="title mb-10">工作经历</h3>
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(item, index) of workList" :key="item.id" title="Consistency" :name="index">
                <template #title>
                    <div class="w-100 d_flex d_flex_sb d_flex_ac">
                        <h3 class="text-ellipsis" style="width: 200px;" :title="item.name">{{ item.name }}</h3>
                        <span class="text-ellipsis" style="width: 200px;" :title="item.position">{{ item.position
                        }}</span>
                        <span style="width: 120px;">
                            {{ item.workingTime ? dayjs(item.workingTime[0]).format("YYYY.MM") + '-' : '' }}
                            {{ item.isSToday ? '至今' : dayjs(item.workingTime[1]).format("YYYY.MM") }}
                        </span>
                        <el-button class="mr-5" text type="primary" @click="onCancel(item, index)">删除</el-button>
                    </div>
                </template>
                <reuse-form :form-ref="`formRef${index} `" :form-data="workListFormData[index]" class="workForm"
                    :form-option="formOption" :ref="`workRef${index}`" label-position="right" :rules="rules">
                    <template #workingTime>
                        <el-date-picker v-model="workListFormData[index].startTime" type="month"
                            @change="(val: any) => onTimeChange('startTime', val, workListFormData[index])"
                            placeholder="开始时间" :disabled-date="onDisabledDate" />

                        <span class="mr-10 ml-10">至</span>

                        <el-date-picker v-model="workListFormData[index].endTime" popper-class="workEndTime"
                            :format="onTimeFormat(workListFormData[index])" type="month"
                            @change="(val: any) => onTimeChange('endTime', val, workListFormData[index])"
                            placeholder="结束时间" :disabled-date="onDisabledDate" :shortcuts="shortcuts" />
                    </template>
                </reuse-form>
            </el-collapse-item>
        </el-collapse>
        <p class="w-100 mt-20 d_flex d_flex_ac d_flex_c createWork" @click="onCreate">
            <el-icon class="mr-5">
                <Plus />
            </el-icon>
            新增工作经历
        </p>
    </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, nextTick, ref, shallowRef, watch } from 'vue';
import ReuseForm from '@/components/reuseForm/index.vue';
import { CustomType } from "@/types"
import dayjs from 'dayjs';

interface Props {
    // 表单数据
    listData: CustomType;
}
const props = withDefaults(defineProps<Props>(), {
    listData: () => { return {} },
})
const emits = defineEmits<{
    (e: 'onSet', data: { index: number, data: CustomType }): void
}>()

interface workDataType {
    id?: number;
    name?: string;
    position?: string;
    workingTime?: Array<string>
}
const { proxy }: any = getCurrentInstance();
// 工作经历 折叠栏展示数据
let workList: any = ref<Array<workDataType>>([]);
// 折叠栏内容展示数据
let workListFormData: any = ref<Array<workDataType>>([]);
// 当前关闭的数据
let workData = ref();
const formOption = shallowRef([
    {
        label: "公司名称",
        props: "name",
        type: "input",
        span: 18
    },
    {
        label: "职位",
        props: "position",
        type: "input",
        span: 18
    },
    {
        label: "在职时间",
        props: "workingTime",
        type: "slot",
        slotName: "workingTime",
        span: 18
    },
]);
// 工作经历时间禁用
const onDisabledDate = (date: any) => {
    let nowDate = new Date().getTime()
    let ddate = new Date(date).getTime()
    return ddate > nowDate ? true : false
}
const onTimeFormat = (data: any) => {
    let date = dayjs(data.endTime).format("YYYY-MM")
    if (data.isSToday) {
        return "至今"
    } else {
        return date
    }
}
const shortcuts = [
    {
        text: '至今',
        value: () => {
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            return new Date(`${year}-${month}-${day}`)
        },
    },
]

// 工作经历时间切换
const onTimeChange = (type: string, val: any, row: any) => {

    if (type === "startTime") {
        row.workingTime[0] = val
    } else {
        let date = dayjs(val).format("YYYY-MM-DD")
        if (date === dayjs(new Date()).format("YYYY-MM-DD")) {
            row.isSToday = true
        } else {
            row.isSToday = false
        }
        row.workingTime[1] = val
    }
}
const validTime = (rule: CustomType, value: string, callback: Function) => {
    if (value[0] && value[1]) {
        let start = new Date(value[0]).getTime()
        let end = new Date(value[1]).getTime()
        if (start >= end) {
            callback(new Error("结束时间不能大于等于开始时间"))
        } else {
            callback()
        }
    } else {
        callback(new Error("请选择完整的在职时间"))
    }
}
const rules = shallowRef({
    name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
    position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
    workingTime: [{ required: true, message: '请选择在职时间', trigger: 'blur' },
    { validator: validTime }
    ],
})
const activeNames: CustomType = ref([]); //当前打开的index数组
let prevUnfoldIds = ref<Array<number>>([]);
const handleChange = async (val: Array<number>) => {
    // 获取当前关闭的id
    let idList = prevUnfoldIds.value.filter((item: any) => {
        return !val.includes(item)
    })
    if (idList.length > 0 && workListFormData.value[idList[0]]) {
        let submitFormRef = proxy.$refs[`workRef${idList[0]}`][0];
        await submitFormRef.ruleFormRef().validate(async (valid: boolean) => {
            if (valid) {
                workData.value = workListFormData.value[idList[0]];
                workData.value.workingTime[0] = [dayjs(workData.value.workingTime[0]).format("YYYY/MM")];
                workData.value.workingTime[1] = dayjs(workData.value.workingTime[1]).format("YYYY/MM");
                workList.value[idList[0]] = deepClone(workListFormData.value[idList[0]]) //折叠栏内容回显
                activeNames.value = [...val]
            } else {
                activeNames.value = [...val, ...idList]
            }
        })
    } else {
        activeNames.value = [...val]
    }
    prevUnfoldIds.value = [...activeNames.value];
}

const validateAll = () => {
    let array: any = []
    workListFormData.value.forEach((item: any, index: number) => {
        array.push(proxy.$refs[`workRef${index}`][0].ruleFormRef().validate())
    })
    return Promise.all(array)
}

// 深克隆
const deepClone = (obj: object) => {
    return JSON.parse(JSON.stringify(obj))
}
const onCreate = () => {
    workList.value.push({workingTime: []});
    workListFormData.value.push({ workingTime: [] });
    activeNames.value.push(workList.value.length - 1)
    prevUnfoldIds.value.push(workList.value.length - 1)
}

// 删除
const onCancel = (item: workDataType, index: number) => {
    workList.value.splice(index, 1);
    workListFormData.value.splice(index, 1);
    prevUnfoldIds.value.splice(index, 1)
}

watch(() => props.listData, (newVal) => {
    workList.value = newVal ? deepClone(newVal) : []
    workListFormData.value = newVal ? deepClone(newVal) : []
})

defineExpose({
    validateAll,
    workListFormData
})
</script>

<style scoped lang="scss">
.createWork {
    line-height: 40px;
    cursor: pointer;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.18);
    transition: all 0.3s;

    &:hover {
        color: $btnThemeColor;
        box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.18);
    }
}

.title {
    font-weight: bold;
    font-size: 18px;
    border-left: 5px solid #1890ff;
    padding-left: 10px;
}
</style>
<style lang="scss">
.workEndTime {
    width: 322px;

    .el-date-picker,
    .el-picker-panel__body-wrapper,
    .el-date-picker.has-sidebar {
        width: 100%;
    }

    .el-picker-panel__sidebar {
        position: absolute;
        width: 100%;
        top: auto;
        bottom: 5px;
        margin: auto;

        button {
            text-align: center;
        }
    }

    .el-picker-panel__body {
        margin-left: 0;
        padding-bottom: 16px;
    }
}
</style>