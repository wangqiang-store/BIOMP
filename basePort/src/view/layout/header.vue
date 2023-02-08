<template>
    <div class="headerPage">
        <div class="left">
            <el-icon :size="25" @click="onToggle">
                <Expand v-if="isCollapse" />
                <Fold v-else />
            </el-icon>
        </div>
        <el-dropdown class="right" trigger="hover">
            <div class="avatar">
                <el-avatar :src="avatarImg" />
                <p>{{ baseUserInfo.username }}</p>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="onUpdatePwd">修改密码</el-dropdown-item>
                    <el-dropdown-item @click="onGoHelp">帮助</el-dropdown-item>
                    <el-dropdown-item @click="onAbout">关于</el-dropdown-item>
                    <el-dropdown-item @click="onExit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>


        <!-- 修改密码框 -->
        <el-dialog v-model="dialogVisible" title="修改密码" class="pwdDialog">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" status-icon>
                <el-form-item label="原密码" prop="oldPwd">
                    <el-input type="password" v-model="formData.oldPwd" />
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input type="password" v-model="formData.newPwd" />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPwd">
                    <el-input type="password" v-model="formData.confirmPwd" />
                </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="onConfirm">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>



</template>
  
<script setup lang="ts">
import { reactive, ref, nextTick } from "vue"
import { Expand, Fold } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import avatarImg from "@/assets/avatar.png"
import { verifyPwd } from "@/utils/verify"
import axios from "axios"
import md5 from "js-md5"
import { useRouter } from "vue-router"
import { updateBasePwd } from "@/api/basePortApi/index"
import { storeToRefs } from "pinia"
import useStore from "@/store/index"
const { commonStore } = useStore()
const { isCollapse, baseUserInfo } = storeToRefs(commonStore)

const Router = useRouter()


// 侧边栏切换
const onToggle = () => {
    isCollapse.value = !isCollapse.value
}



// 修改密码参数
const dialogVisible = ref(false)
const formRef: any = ref<FormInstance>()
const formData = reactive({
    oldPwd: "",
    newPwd: "",
    confirmPwd: ""
})
// 自定义规则
const validatePass1 = (rule: any, value: any, callback: any) => {
    if (!formData.newPwd || !formData.confirmPwd) {
        callback()
    } else {
        if (formData.newPwd === formData.confirmPwd) {
            callback()
        }
        callback(new Error('新密码和确认密码输入不一致'))
    }
}
const validatePass2 = (rule: any, value: string, callback: Function) => {
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
const rules = reactive<FormRules>({
    oldPwd: [
        { required: true, message: '原密码不能为空', trigger: 'blur' },
        { validator: validatePass1, trigger: 'blur' },
    ],
    newPwd: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { validator: validatePass1, trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
    ],
    confirmPwd: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { validator: validatePass1, trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
    ],
})
// 修改密码按钮
const onUpdatePwd = () => {
    dialogVisible.value = true
    nextTick(() => {
        formRef.value.resetFields()
    })
}
// 修改密码确认提交
const onConfirm = () => {
    formRef.value.validate().then(async () => {
        const obj = { oldPwd: md5(formData.oldPwd), newPwd: md5(formData.newPwd) }
        const { data } = await updateBasePwd(obj)

        if (data.code === 200) {
            ElMessage({
                message: '密码修改成功',
                type: 'success',
            })
            dialogVisible.value = false
        }
    }).catch(() => { })
}


// 关于
const aboutData: any = ref({})
const onAbout = () => {
    axios({
        method: "get",
        url: "/config/index.json"
    }).then((res) => {
        aboutData.value = res.data
        ElNotification({
            title: '关于',
            message: `client: ${res.data.CLIENT_VERSION}   server: ${res.data.SERVER_VERSION}`,
        })
    }).catch(() => {
    })

}

let pdfBlobUrl = ref<string>();
// 帮助按钮
const onGoHelp = async () => {
    let a = document.createElement("a");
    if (!pdfBlobUrl.value) {
        try {
            let { data } = await axios.get(import.meta.env.VITE_BASE_URL + '/img/穗创汇基地用户手册.pdf', {
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


// 退出按钮
const onExit = () => {
    ElMessageBox.confirm(
        '您确定要退出吗?',
        '退出管理平台',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            draggable: true,
        }
    )
        .then(() => {
            baseUserInfo.value = {}
            localStorage.clear();
            sessionStorage.clear();
            ElMessage({
                type: 'success',
                message: '成功退出',
            })
            setTimeout(() => {
                Router.push("/login")
            }, 500);
        })
        .catch(() => { })
}

</script>
  
<style scoped lang="scss">
.headerPage {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 50px;
    border: 1px solid $boxBorderColor;

    .left {
        display: flex;
        align-items: center;

        .el-icon {
            margin-right: 10px;
            cursor: pointer;
        }
    }

    .right {
        .avatar {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .el-avatar {
                width: 30px;
                height: 30px;
            }

            p {
                margin: 0 20px 0 10px;
            }
        }


    }
}
</style>
<style lang="scss">
.pwdDialog {
    width: 500px !important;

    .el-dialog__body {
        padding: 30px 40px 5px 40px;
    }

    .el-dialog__footer {
        border-top: 1px solid $borderColor;
        padding-bottom: 10px;
    }
}
</style>
  