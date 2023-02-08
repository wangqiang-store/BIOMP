<template>
    <el-row>
        <el-col :span="24">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>配置中心</el-breadcrumb-item>
                <el-breadcrumb-item>用户中心</el-breadcrumb-item>
                <el-breadcrumb-item>区级账号</el-breadcrumb-item>
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
                <reuse-form :formData="formData" :formOption="formOption" ref="formRef" :rules="rules"
                    v-loading="formLoading">
                    <template #regional>
                        <div class="d_flex">
                            <el-select v-model="formData.provinceCode" class="mr-10" placeholder="请选择省"
                                @change="onChangeProvince">
                                <el-option v-for="item in allProvinceList" :key="item.code" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                            <el-select v-model="formData.cityCode" class="mr-10" placeholder="请选择市"
                                @change="onChangeCity">
                                <el-option v-for="item in cityList" :key="item.code" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                            <el-select v-model="formData.countyCode" class="mr-10" placeholder="请选择区"
                                @change="onChangeCounty">
                                <el-option v-for="item in countyList" :key="item.code" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </div>
                    </template>
                </reuse-form>
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
import md5 from 'js-md5';
import ReuseTable from "@/components/reuseTable/index.vue";
import ReusePagination from "@/components/reusePagination/index.vue";
import { ArrowRight } from '@element-plus/icons-vue';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { ReginalTableRow } from '../type';
import { CustomType } from '@/types';
import ReuseForm from '@/components/reuseForm/index.vue';
import { ElMessage, FormRules } from 'element-plus';
import { verifyRelation, verifyPwd, verifyEmail, verifyEN } from '@/utils/verify';
import {
    createAreaUser,
    updateAreaUser,
    usernameCheckRepeat,
    emailCheckRepeat,
    phoneCheckRepeat,
    resetPassword,
    getPagingData,
    enableUser,
    deleteUser
} from '@/api/core/sysAreaUser';
import dayjs from 'dayjs';
import useStore from '@/store';
import { storeToRefs } from 'pinia';
import { getByCity, getByCounty } from "@/api/enum";
const { commonStore } = useStore();
let { allProvinceList } = storeToRefs(commonStore);
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
        formatter: (row: ReginalTableRow, column: TableColumnCtx<CustomType>, cellValue: CustomType, index: number) => {
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
        label: "管辖区域",
        props: "showAddress",
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
        offColor: "#d4d4ff",
        isDisabled(row: ReginalTableRow) {
            return row.id === 1
        }
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
        formatter: (row: ReginalTableRow) => {
            return dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    {
        label: "操作",
        type: "handle",
        width: 350,
        btns: [
            {
                text: "重置密码",
                handleType: "reset",
                type: "primary",
                textBtn: true,
                isPopConfirm: true,
                width: 200,
                title: "重置密码，是否继续？",
                isDisabled(row: ReginalTableRow) {
                    return row.id === 1
                }
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
                title: "是否确定删除该区级账号？",
                isDisabled(row: ReginalTableRow) {
                    return row.id === 1
                }
            }
        ]
    },
]);
// 添加、编辑模态框
let formDataStore = ref();
const formRef = ref();
let cityList = ref<Array<{ code: number; name: string }>>();
let countyList = ref<Array<{ code: number; name: string }>>();
let dialogVisible = ref(false);
let dialogTitle = ref('');
let dialogType = ref('');
let formLoading = ref(false);
// 表单数据
let formData = ref<ReginalTableRow>({
    username: "",
    name: "",
    countyCode: null,
    provinceCode: 440000000000,
    cityCode: 440100000000,
});
let formOption = shallowRef<{}[]>([]);
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
    countyCode: [
        { required: true, message: '请选择管辖区域', trigger: 'change' },
    ],
    phone: [
        { pattern: verifyRelation, message: "联系电话格式不正确", trigger: "blur" },
        { validator: validatePhone, trigger: "blur" }
    ],
    email: [
        { pattern: verifyEmail, message: "邮箱格式不正确", trigger: "blur" },
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
const onCreate = async () => {
    dialogTitle.value = "添加区级账号";
    dialogVisible.value = true;
    dialogType.value = "create";
    formData.value = {
        username: "",
        name: "",
        countyCode: null,
        provinceCode: 440000000000,
        cityCode: 440100000000,
    };
    await onGetCityList(formData.value.provinceCode as number)
    await onGetCountyList(formData.value.cityCode as number);
    nextTick(() => {
        let { clearValidate } = formRef.value.ruleFormRef();
        clearValidate();
    })
};


// 切换省
let onChangeProvince = async () => {
    // 清空市、区
    cityList.value = [];
    countyList.value = [];
    formData.value.countyCode = null;
    formData.value.cityCode = null;
    if (!formData.value.provinceCode) return;
    onGetCityList(formData.value.provinceCode as number)
}
// 切换市
const onChangeCity = async () => {
    formData.value.countyCode = null;
    countyList.value = [];
    if (!formData.value.cityCode) return;
    onGetCountyList(formData.value.cityCode as number);
}

const onGetCityList = async (code: number) => {
    let { data } = await getByCity({ code });
    if (data.code !== 200) return;
    cityList.value = data.data;
}

const onGetCountyList = async (code: number) => {
    let { data } = await getByCounty({ code });
    if (data.code !== 200) return
    countyList.value = data.data;
}

// 切换区
const onChangeCounty = () => {
}

// 切换switch
const onChangeSwitch = async ({ rowData }: { rowData: ReginalTableRow }) => {
    let message = rowData.isEnable ? '账号启用成功' : '账号不启用成功';
    let { data } = await enableUser({ userId: rowData.id as number });
    if (data.code! !== 200) return;
    ElMessage({
        message,
        type: "success"
    })
};
const onHandleRow = async ({ rowData, type }: { rowData: ReginalTableRow, type: string }) => {
    switch (type) {
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
            formLoading.value = true;
            dialogTitle.value = "编辑区级账号";
            dialogVisible.value = true;
            dialogType.value = "edit";
            formDataStore.value = JSON.parse(JSON.stringify(rowData));
            await onGetCityList(formData.value.provinceCode as number)
            await onGetCountyList(formData.value.cityCode as number);
            formLoading.value = false;

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
            let { username, name, email, phone, provinceCode, cityCode, countyCode } = formData.value;
            let { data } = await createAreaUser({
                username, name, password: md5Pwd, email: email ? email : undefined, phone: phone ? phone : undefined, provinceCode, cityCode, countyCode
            });
            if (data.code !== 200) return;
            dialogVisible.value = false;
            onGetPagingData(pagingParams);
            ElMessage({
                type: "success",
                message: "添加区级账号成功"
            });
        } else if (dialogType.value === "edit") {
            let { id, username, name, email, phone, provinceCode, cityCode, countyCode } = formData.value;
            let { data } = await updateAreaUser({
                id, username, name, email: email ? email : undefined, phone: phone ? phone : undefined, provinceCode, cityCode, countyCode
            });
            if (data.code !== 200) return;
            dialogVisible.value = false;
            onGetPagingData(pagingParams);
            ElMessage({
                type: "success",
                message: "编辑区级账号成功"
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
        {
            label: "管辖区域",
            props: "countyCode",
            type: "slot",
            slotName: "regional",
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
    // 获取省列表
    if (allProvinceList.value.length === 0) await commonStore.onGetAllProvince()
    onGetPagingData(pagingParams)
})
</script>

<style scoped lang="scss">

</style>