<template>
    <el-row>
        <el-col :span="24">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>配置中心</el-breadcrumb-item>
                <el-breadcrumb-item>用户中心</el-breadcrumb-item>
                <el-breadcrumb-item>基地账号</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="d_flex d_flex_ac mt-20">
            <el-input style="width:200px" class="mr-10" v-model="searchContent" placeholder="请输入账户名或姓名"></el-input>
            <el-button type="primary" @click="onSearch">
                <el-icon class="mr-5">
                    <Search />
                </el-icon>
                查询
            </el-button>
            <el-button type="primary" @click="onCreate">
                <el-icon class="mr-5">
                    <Plus />
                </el-icon>
                新建
            </el-button>
        </el-col>
        <el-col :span="24" class="mt-20" v-loading="baseLoading">
            <ReuseTable :table-data="tableData" :table-options="tableOptions" @on-handle-row="onHandleRow"
                @on-change-switch="onChangeSwitch" />
            <ReusePagination :total="tableTotal" :page-size="pagingParams.limit" :current-page="pagingParams.page"
                @current-change="onCurrentChange" @size-change="onSizeChange" />
        </el-col>
        <el-col :span="24">
            <el-dialog class="custom-class" v-model="dialogVisible" :title="dialogTitle" width="40%" destroy-on-close>
                <reuse-form :formData="formData" :formOption="formOption" ref="formRef"
                    :form-item-option="formItemOption" :rules="rules"></reuse-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="onCancel">取消</el-button>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, shallowRef, watch } from "vue";
// import ReuseTable from "@/components/reuseTable/index.vue";
import md5 from 'js-md5';
import { ArrowRight } from '@element-plus/icons-vue';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { BaseTableRow } from '../type';
import { CustomType } from '@/types';
import { useRouter } from "vue-router";
import { resetPassword, getPagingData, enableUser, deleteUser } from '@/api/core/sysBaseUser';
import ReuseForm from '@/components/reuseForm/index.vue';
import { ElMessage, FormRules } from 'element-plus';
import { verifyRelation, verifyPwd, verifyEmail, verifyEN } from '@/utils/verify';
import { createBaseUser, updateUser, usernameCheckRepeat, emailCheckRepeat, phoneCheckRepeat } from '@/api/core/sysBaseUser';
import dayjs from 'dayjs';
import useStore from '@/store';
import { storeToRefs } from 'pinia';
let { commonStore, userStore } = useStore();
let { allCodeBaseList } = storeToRefs(commonStore);
let { userInfo } = storeToRefs(userStore);
const ROUTER = useRouter();
interface pagingParamsType {
    content?: string;
    limit: number;
    page: number;
}
let baseLoading = ref(false);
let tableTotal = ref(0);
let searchContent = ref('');
let pagingParams = reactive({
    content: "",
    limit: 10,
    page: 1
})
let tableData = ref([]);
const tableOptions = ref([
    {
        label: "序号",
        type: "text",
        formatter: (row: BaseTableRow, column: TableColumnCtx<CustomType>, cellValue: CustomType, index: number) => {
            return index + 1
        }
    },
    {
        label: "账号名",
        props: "username",
        type: "text"
    },
    {
        label: "姓名",
        props: "name",
        type: "text"
    },
    {
        label: "关联基地",
        props: "incubationBaseName",
        type: "text"
    },
    {
        label: "联系电话",
        props: "phone",
        type: "text"
    },
    {
        label: "邮箱",
        props: "email",
        type: "text"
    },
    {
        label: "是否开启",
        props: "isEnable",
        type: "switch",
        onColor: "#9999ff",
        offColor: "#d4d4ff"
    },
    {
        label: "创建者",
        props: "createUser",
        type: "text"
    },
    {
        label: "创建时间",
        props: "createTime",
        type: "text",
        sortable: true,
        formatter: (row: BaseTableRow) => {
            return dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    {
        label: "操作",
        type: "handle",
        width: 350,
        btns: [
            {
                text: "基地详情",
                handleType: "details",
                type: "primary",
                textBtn: true,
            },
            {
                text: "重置密码",
                handleType: "reset",
                type: "primary",
                textBtn: true,
                isPopConfirm: true,
                width: 200,
                title: "重置密码，是否继续？"
            },
            {
                text: "编辑",
                handleType: "edit",
                type: "primary",
                textBtn: true
            },
            {
                text: "删除",
                handleType: "delete",
                textBtn: true,
                type: "primary",
                isPopConfirm: true,
                width: 220,
                title: "是否确定删除该基地账号？"
            }
        ]
    },
]);
// 添加、编辑模态框
let formDataStore = ref();
const formRef = ref();
let dialogVisible = ref(false);
let dialogTitle = ref('');
let dialogType = ref('');
// 表单数据
let formData = ref<BaseTableRow>({
    incubationBaseId: null,
    username: "",
    name: "",
});
let formOption = shallowRef<{}[]>([]);
let formItemOption: {
    incubationBaseId: Array<{
        name?: string;
        id?: number;
    }>
} = reactive({
    incubationBaseId: [{}]
});
// 自定义验证规则
const validateUsername = (rule: any, value: string, callback: Function) => {
    if (dialogType.value === 'edit' && formData.value.username === formDataStore.value.username) {
        callback();
    } else {
        usernameCheckRepeat({ username: value }).then(({ data }) => {
            if (data.code === 500) {
                callback(new Error("用户名已存在,请重新输入"))
            } else {
                callback()
            }
        });
    }
};
const validatePhone = (rule: any, value: string, callback: Function) => {
    if ((dialogType.value === 'edit' && formData.value.phone === formDataStore.value.phone) || ['', null, undefined].includes(value)) {
        callback()
    } else {
        phoneCheckRepeat({ phone: value }).then(({ data }) => {
            if (data.code === 500) {
                callback(new Error("联系电话已存在,请重新输入"))
            } else {
                callback()
            }
        });
    }
};
const validateEmail = (rule: any, value: string, callback: Function) => {
    if ((dialogType.value === 'edit' && formData.value.email === formDataStore.value.email) || ['', null, undefined].includes(value)) {
        callback();
    } else {
        emailCheckRepeat({ email: value }).then(({ data }) => {
            if (data.code === 500) {
                callback(new Error("邮箱已存在,请重新输入"))
            } else {
                callback()
            }
        });
    }
};
const validatePass = (rule: any, value: string, callback: Function) => {
    if (value.length < 8) {
        callback(new Error("密码长度至少8位"));
    } else {
        if (verifyPwd.test(value)) {
            callback();
        } else {
            callback(new Error("密码至少包含数字、字母、特殊字符两种"));
        }
    }
};

const validateConfirmPwd = (rule: any, value: string, callback: Function) => {
    if (value === "") {
        callback(new Error("请再次输入密码"));
    } else if (value !== formData.value.password) {
        callback(new Error("两次输入密码不一致!"));
    } else {
        callback();
    }
};

const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入账号名', trigger: 'blur' },
        { pattern: verifyEN, message: "账号名只支持英文数字并已英文开头", trigger: "blur" },
        { validator: validateUsername, trigger: "blur" }
    ],
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: ["change", 'blur'] },
        { validator: validatePass },
    ],
    confirmPwd: [
        { validator: validateConfirmPwd, trigger: "blur", required: true },
    ],
    incubationBaseId: [
        { required: true, message: '请选择基地', trigger: 'change' },
    ],
    phone: [{ pattern: verifyRelation, message: "联系电话格式不正确", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" }
    ],
    email: [{ pattern: verifyEmail, message: "邮箱格式不正确", trigger: "blur" },
    { validator: validateEmail, trigger: "blur" }
    ],
});
// 分页获取表格数据
const onGetPagingData = async (params: pagingParamsType) => {
    baseLoading.value = true;
    let { data } = await getPagingData(params);
    if (data.code !== 200) { baseLoading.value = false; return };
    baseLoading.value = false;
    tableData.value = data.data?.records;
    tableTotal.value = data.data?.total;
};
// 搜索
const onSearch = () => {
    pagingParams.page = 1;
    pagingParams.content = searchContent.value;
    onGetPagingData(pagingParams);
};
// 点击新建
const onCreate = () => {
    dialogTitle.value = "添加基地账号";
    dialogVisible.value = true;
    dialogType.value = "create";
    formData.value = {
        incubationBaseId: null,
        username: "",
        name: "",
    };
    nextTick(() => {
        let { clearValidate } = formRef.value.ruleFormRef();
        clearValidate();
    })
};
// 切换switch
const onChangeSwitch = async ({ rowData }: { rowData: BaseTableRow }) => {
    let message = rowData.isEnable ? '账号启用成功' : '账号不启用成功';
    let { data } = await enableUser({ userId: rowData.id as number });
    if (data.code! !== 200) return;
    ElMessage({
        message,
        type: "success"
    })
};
const onHandleRow = async ({ rowData, type }: { rowData: BaseTableRow, type: string }) => {
    switch (type) {
        case 'details':
            ROUTER.push({ name: "hatchDetails", query: { id: rowData.incubationBaseId } });
            break;
        case 'reset':
            let { data } = await resetPassword({ userId: rowData.id as number });
            if (data.code !== 200) return;
            ElMessage({
                type: "success",
                message: "密码重置成功"
            })
            break;
        case "edit":
            formData.value = Object.assign({}, rowData);
            dialogTitle.value = "编辑基地账号";
            dialogVisible.value = true;
            dialogType.value = "edit";
            formDataStore.value = JSON.parse(JSON.stringify(rowData));
            nextTick(() => {
                let { clearValidate } = formRef.value.ruleFormRef();
                clearValidate();
            })
            break;
        case "delete":
            let { data: deleteData } = await deleteUser({ userId: rowData.id as number });
            if (deleteData.code !== 200) return;
            ElMessage({
                type: "success",
                message: "账号删除成功"
            });
            onGetPagingData(pagingParams);
        default:
            break;
    }
}
const onCurrentChange = (page: number) => {
    pagingParams.page = page;
    onGetPagingData(pagingParams);
}
const onSizeChange = (size: number) => {
    pagingParams.page = 1;
    pagingParams.limit = size;
    onGetPagingData(pagingParams);
}

// 确认提交表单
const onSubmit = async () => {
    await formRef.value.ruleFormRef().validate(async (valid: boolean) => {
        if (!valid) return;
        if (dialogType.value === "create") {
            let md5Pwd = md5(formData.value.password);
            let { username, name, email, phone, incubationBaseId } = formData.value;
            let { data } = await createBaseUser({
                username, name, password: md5Pwd, email: email ? email : undefined, phone: phone ? phone : undefined, incubationBaseId
            });
            if (data.code !== 200) return;
            dialogVisible.value = false;
            onGetPagingData(pagingParams);
            ElMessage({
                type: "success",
                message: "添加基地账号成功"
            });
        } else if (dialogType.value === "edit") {
            let { id, username, name, email, phone, incubationBaseId } = formData.value;
            let { data } = await updateUser({ id, username, name, email: email ? email : undefined, phone: phone ? phone : undefined, incubationBaseId });
            if (data.code !== 200) return;
            dialogVisible.value = false;
            onGetPagingData(pagingParams);
            ElMessage({
                type: "success",
                message: "编辑基地账号成功"
            });
        }
    })
};
// 取消添加、编辑
const onCancel = () => {
    dialogVisible.value = false
};

watch(dialogType, () => {
    formOption.value = [
        {
            label: "账号名",
            props: "username",
            type: "input",
            isDisabled() {
                return dialogType.value === 'edit'
            }
        },
        {
            label: "姓名",
            props: "name",
            type: "input",
        },
        dialogType.value === 'create' && {
            label: "密码",
            props: "password",
            inputType: "password",
            type: "input"
        },
        dialogType.value === 'create' && {
            label: "确认密码",
            props: "confirmPwd",
            inputType: "password",
            type: "input"
        },
        {
            label: "基地",
            props: "incubationBaseId",
            type: "select",
            value: "id",
            optionLabel: "name",
            isOpsDisabled(row: { status: number }) {
                return row.status === 2
            }
        },
        {
            label: "联系电话",
            props: "phone",
            type: "input"
        },
        {
            label: "邮箱",
            props: "email",
            type: "input"
        },
    ]
})

onMounted(async () => {
    onGetPagingData(pagingParams)

    await commonStore.onGetAllBaseData(userInfo.value.countyCode)
    formItemOption.incubationBaseId = allCodeBaseList.value as Array<{
        name: string;
        id: number;
    }>
})
</script>

<style scoped lang="scss">

</style>