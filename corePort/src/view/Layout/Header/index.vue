<template>
    <el-header class="header d_flex d_flex_sb">
        <h3 class="nowrap">穗创汇</h3>

        <Menu />

        <div class="d_flex d_flex_ac">
            <el-dropdown class="mr-5">
                <span class="userIcon " title="用户">
                    <el-icon>
                        <UserFilled />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="onUpdatePwd">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="onHelp">帮助</el-dropdown-item>
                        <el-dropdown-item @click="onRegards">关于</el-dropdown-item>
                        <el-dropdown-item @click="onLogout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <span class="mr-10" :title="userInfo.name">{{ userInfo.username }}</span>
        </div>
        <!-- 添加、编辑模态框 -->
        <el-dialog class="custom-class" v-model="updatePwdDialogVisible" title="修改密码" width="30%" destroy-on-close>
            <reuse-form :formData="updatePwdFormData" :formOption="updatePwdFormOption" ref="formRef"
                :rules="updatePwdRules"></reuse-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="updatePwdDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </el-header>
</template>
<script lang="ts" setup>
import { nextTick, reactive, ref, onMounted, shallowRef } from 'vue';
import md5 from 'js-md5';
import ReuseForm from '@/components/reuseForm/index.vue';
import { FormRules, ElMessage, ElNotification, ElMessageBox } from 'element-plus';
import { verifyPwd } from '@/utils/verify';
import { updatePwd } from "@/api/core/sysCoreUser";
import { getConfigInfo } from '@/api';
import { useRouter } from 'vue-router';
import Menu from '../Menu/index.vue';
import useStore from '@/store';
import { storeToRefs } from 'pinia';
import axios from 'axios';
const ROUTER = useRouter();
const { userInfo } = storeToRefs(useStore().userStore);
const { currmentUserId } = storeToRefs(useStore().moduleStore);
// 自定义验证规则
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
    } else if (value !== updatePwdFormData.newPwd) {
        callback(new Error("两次输入密码不一致!"));
    } else {
        callback();
    }
};
// 修改密码
let updatePwdDialogVisible = ref(false);
const formRef = ref();
// 配置信息
const configInfo = shallowRef<{ CLIENT_VERSION: string; SERVER_VERSION: string }>({
    CLIENT_VERSION: "",
    SERVER_VERSION: "",
})
// 修改密码表单数据
let updatePwdFormData = reactive({
    newPwd: '',
    oldPwd: '',
    confirmPwd: ""
});
// 修改密码表单配置项
let updatePwdFormOption = ref([
    {
        label: "原密码",
        props: "oldPwd",
        type: "input",
        inputType: "password"
    },
    {
        label: "新密码",
        props: "newPwd",
        type: "input",
        inputType: "password"
    },
    {
        label: "确认密码",
        props: "confirmPwd",
        type: "input",
        inputType: "password"
    }
])
// 修改密码验证规则
let updatePwdRules = reactive<FormRules>({
    oldPwd: [
        { required: true, message: '请输入旧密码', trigger: "blur" },
    ],
    newPwd: [
        { required: true, message: '请输入新密码', trigger: ["change", 'blur'] },
        { validator: validatePass },
    ],
    confirmPwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { validator: validateConfirmPwd, trigger: 'blur' }
    ]
})
const onUpdatePwd = () => {
    updatePwdDialogVisible.value = true;
    updatePwdFormData.newPwd = '';
    updatePwdFormData.oldPwd = '';
    updatePwdFormData.confirmPwd = '';
    nextTick(() => {
        let { clearValidate } = formRef.value.ruleFormRef();
        clearValidate();
    })
}
// 帮助
let pdfBlobUrl = ref<string>();
const onHelp = async () => {
    // 帮助按钮
    let a = document.createElement("a");
    if (!pdfBlobUrl.value) {
        try {
            let { data } = await axios.get(import.meta.env.VITE_BASE_URL + '/img/穗创汇中心用户手册.pdf', {
                responseType: "blob"
            })
            let blob = new Blob([data], {
                type: "application/pdf",
            });
            pdfBlobUrl.value = URL.createObjectURL(blob);
        } catch (error: any) {
            ElMessage({
                message: error?.message || "request error",
                type: "error"
            })
            return
        }
    }
    a.href = pdfBlobUrl.value;
    a.target = "_blank";
    a.click()
}
const onRegards = () => {
    ElNotification({
        title: '关于',
        message: `client ${configInfo.value.CLIENT_VERSION}  server ${configInfo.value.SERVER_VERSION}`,
        type: 'info',
    })
}
const onLogout = () => {
    ElMessageBox.confirm(
        '您确定要退出吗？',
        '退出管理平台',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            localStorage.clear();
            sessionStorage.clear();
            currmentUserId.value = [];
            ROUTER.push({ path: "/login" });
        })
        .catch(() => { })
}
// 确认修改密码
const onSubmit = async () => {
    await formRef.value.ruleFormRef().validate(async (valid: boolean) => {
        if (!valid) return;
        let md5NewPwd = md5(updatePwdFormData.newPwd);
        let md5OldPwd = md5(updatePwdFormData.oldPwd);
        let { data } = await updatePwd({ oldPwd: md5OldPwd, newPwd: md5NewPwd });
        if (data.code !== 200) return;
        ElMessage({
            type: "success",
            message: "密码修改成功"
        });
        updatePwdDialogVisible.value = false;
    })
}
// 加载静态配置文件
const config = async () => {
    let { data } = await getConfigInfo();
    configInfo.value = data;
}

onMounted(() => {
    config()
})
</script>

<style scoped lang="scss">
.header {
    align-items: center;

    .userIcon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgb(78 65 65);
        font-size: 14px;
        color: white;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
}
</style>