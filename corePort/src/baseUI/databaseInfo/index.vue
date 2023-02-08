<template>
    <el-row class="databaseInfo">
        <el-col :span="21" :offset="1" class="mt-20">
            <h3 class="title mb-10">个人信息</h3>
        </el-col>
        <el-col :span="24">
            <reuse-form :form-data="personalInfo" :form-option="personalInfoFormOption" label-position="top"
                :form-item-option="formItemOption" :rules="rules" :check-boxs="checkBoxs" ref="personalInfoRef">
                <template #file>
                    <ReuseUpload :file-list="fileLists" list-type="picture-card" @on-upload-success="onUploadSuccess"
                        @on-remove="onRemove" :before-upload="onBeforeUpload" />
                </template>
                <template #mentorType>
                    <el-checkbox-group v-model="mentorTypeValue">
                        <el-checkbox v-for="val in checkBoxs.mentorType" :key="val.status" :label="val.status">
                            {{ val.statusName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>
                <template #weight>
                    <el-input-number v-model="personalInfo.sort"  size="large" :min="1" />
                </template>
            </reuse-form>
        </el-col>
        <el-col :span="21" :offset="1" class="mt-20">
            <Work :listData="personalInfo.workExperience" ref="work" />
        </el-col>
        <el-col :span="21" :offset="1" class="mt-20">
            <h3 class="title mb-10">社会服务及荣耀</h3>
            <el-input v-model="honourText" :autosize="{ minRows: 10, maxRows: 20 }" type="textarea" maxlength="800"
                show-word-limit placeholder="请输入内容" />
        </el-col>
        <el-col :span="21" :offset="1" class="mt-20">
            <h3 class="title mb-10">就业创业指导工作相关经历(必填)</h3>
            <el-input v-model="experience" :autosize="{ minRows: 10, maxRows: 20 }" type="textarea" maxlength="800"
                show-word-limit placeholder="请输入内容" />
        </el-col>
        <el-col :span="21" :offset="1" class="mt-20">
            <h3 class="title mb-10">擅长领域(必填)</h3>
            <el-input v-model="skilled" :autosize="{ minRows: 10, maxRows: 20 }" type="textarea" maxlength="800"
                show-word-limit placeholder="请输入内容" />
        </el-col>
        <el-col :span="21" :offset="1" class="mt-20 d_flex d_flex_c">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowRef, watch } from 'vue';
import ReuseForm from '@/components/reuseForm/index.vue';
import ReuseUpload from '@/components/reuseUpload/index.vue';
import Work from './work.vue';
import { CustomType } from '@/types'
import { ElMessage } from 'element-plus';
import { verifyIdCard, verifyPhone } from '@/utils/verify';
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { updateExpert, createExpert } from '@/api/core/database';
import { storeToRefs } from 'pinia';
import { ExpertInfo } from '@/api/type'
interface Props {
    formData: ExpertInfo
}

const props = withDefaults(defineProps<Props>(), {
    formData: () => {
        return {}
    }
})
const ROUTER = useRouter();
const { commonStore } = useStore();
let { mentorType, genderType } = storeToRefs(useStore().commonStore);
// 个人信息
let personalInfo = ref<ExpertInfo>({
    idCard: "",
    sort: 100
});
let mentorTypeValue = ref<Array<number>>([]);
let fileLists = ref<Array<{ url?: string; name?: string }>>([]);//照片列表
let personalInfoRef = ref();//个人信息表单实例
const personalInfoFormOption = shallowRef([
    {
        label: "姓名",
        props: "name",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "政治面貌",
        props: "political",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "性别",
        props: "gender",
        type: "select",
        value: "status",
        optionLabel: "statusName",
        span: 10,
        offset: 1
    },
    {
        label: "最高学历",
        props: "education",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "手机号码",
        props: "phone",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "毕业学校",
        props: "graduatedSchool",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "身份证号码",
        props: "idCard",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "毕业专业",
        props: "graduatedMajor",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "现工作单位",
        props: "workUnit",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "技能等级",
        props: "skillLevel",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "现任职务",
        props: "jobs",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "职称",
        props: "jobTitle",
        type: "input",
        span: 10,
        offset: 1
    },
    {
        label: "导师类型(可多选)",
        props: "mentorType",
        type: "slot",
        slotName: "mentorType",
        span: 10,
        offset: 1
    },
    {
        label: "排序优先级",
        props: "sort",
        type: "slot",
        slotName: "weight",
        span: 10,
        offset: 1
    },
    {
        label: "照片上传",
        props: "fileId",
        type: "slot",
        slotName: "file",
        span: 10,
        offset: 1
    },
]);
// 下拉框
let formItemOption = ref({ gender: [] });
// 复选框
let checkBoxs = ref<{ mentorType?: Array<{ status: number; statusName: string }> }>({})

const rules = shallowRef({
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: verifyPhone, message: "手机号码格式不正确", trigger: "blur" },
    ],
    idCard: [
        { pattern: verifyIdCard, message: "身份证号码格式不正确", trigger: "blur" },
    ],
    workUnit: [{ required: true, message: '请输入现工作单位', trigger: 'blur' }],
    jobs: [{ required: true, message: '请输入现任职务', trigger: 'blur' }],
    sort: [{ required: true, message: '请输入排序优先级', trigger: 'blur' }],
    mentorType: [{ required: true, message: '请选择导师类型', trigger: 'blur' }],
})
// 荣耀
let honourText = ref('');
// 工作经历
let experience = ref('');
// 擅长
let skilled = ref('');
// 图片上传成功
const onUploadSuccess = (res: CustomType, file: any, fileList: Array<any>) => {
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
                personalInfo.value.fileId = item.response.data.id
            }
        }
    })
};
// 移除图片
const onRemove = (fileList: Array<any>) => {
    fileLists.value = [];
    personalInfo.value.fileId = '';
};
// 上传前的判断
const onBeforeUpload = (file: any) => {
    const isJPG =
        file.type === "image/jpeg" || file.type === "image/png";
    const isLt5M = file.size / 1024 / 1024 > 5;
    if (!isJPG) {
        ElMessage.error("上传的图片文件只能是 JPG/PNG 格式!");
        return false;
    }
    if (isLt5M) {
        ElMessage.error("上传的图片文件大小不能超过 5MB!");
        return false;
    }
}
const work = ref()
// 提交
const onSubmit = async () => {
    personalInfo.value.serviceAndHonors = honourText.value;
    personalInfo.value.guidanceWorkExperience = experience.value;
    personalInfo.value.areasOfExpertise = skilled.value;
    personalInfo.value.mentorType = mentorTypeValue.value.length === 0 ? '' : mentorTypeValue.value.join(',');
    await personalInfoRef.value.ruleFormRef().validate(async (valid: boolean) => {
        if (!valid) return;
        if (experience.value.length === 0) {
            ElMessage({
                message: "就业创业指导工作相关经历不能为空",
                type: "warning"
            })
            return
        }
        if (skilled.value.length === 0) {
            ElMessage({
                message: "擅长领域不能为空",
                type: "warning"
            })
            return
        }
        let workValidate = await work.value.validateAll();
        if (workValidate) {
            let workExperience = JSON.stringify(work.value.workListFormData)
            if (personalInfo.value.id) {
                let {
                    id,
                    areasOfExpertise,
                    education,
                    fileId,
                    gender,
                    graduatedMajor,
                    graduatedSchool,
                    guidanceWorkExperience,
                    idCard,
                    jobTitle,
                    jobs,
                    mentorType,
                    name,
                    political,
                    serviceAndHonors,
                    skillLevel,
                    workUnit,
                    sort
                } = personalInfo.value;
                let { data } = await updateExpert({
                    id,
                    areasOfExpertise,
                    education,
                    fileId,
                    gender,
                    graduatedMajor,
                    graduatedSchool,
                    guidanceWorkExperience,
                    idCard,
                    jobTitle,
                    jobs,
                    mentorType,
                    name,
                    political,
                    serviceAndHonors,
                    skillLevel,
                    workExperience,
                    workUnit,
                    sort
                });
                if (data.code !== 200) return;
                ElMessage({
                    message: "专家导师信息编辑成功",
                    type: "success"
                });
                ROUTER.push({ name: "database" })
            } else {
                let { data } = await createExpert({ ...personalInfo.value, workExperience });
                if (data.code !== 200) return;
                ElMessage({
                    message: "专家导师信息添加成功",
                    type: "success"
                });
                ROUTER.push({ name: "database" })
            }
        }
    })
};
// 取消
const onCancel = () => {
    ROUTER.go(-1);
};

let stop = watch(() => props.formData, (newData) => {
    personalInfo.value = newData;
    honourText.value = personalInfo.value.serviceAndHonors as string;
    experience.value = personalInfo.value.guidanceWorkExperience as string;
    skilled.value = personalInfo.value.areasOfExpertise as string;
    personalInfo.value.workExperience = newData.workExperience ? JSON.parse(newData.workExperience) : []

    // 复选框数据
    if (personalInfo.value.mentorType) {
        mentorTypeValue.value = personalInfo.value.mentorType.split(',').map((item: any) => {
            return Number(item)
        })
    }
    // 照片
    if (personalInfo.value.filePath) {
        fileLists.value = [{
            url: import.meta.env.VITE_BASE_URL + personalInfo.value.filePath
        }]
    }
    stop()
})

onMounted(async () => {
    if (mentorType.value.length === 0) await commonStore.onGetMentorType();
    checkBoxs.value.mentorType = mentorType.value;

    // 获取性别列表
    if (genderType.value.length === 0) await commonStore.onGetGenderType();
    formItemOption.value.gender = genderType.value;
})
</script>

<style scoped lang="scss">
.databaseInfo {
    max-width: calc(1200px / (21 / 24));
    margin: 0 auto;

    .title {
        font-weight: bold;
        font-size: 18px;
        border-left: 5px solid #1890ff;
        padding-left: 10px;
    }
}
</style>