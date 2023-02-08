<template>
    <div class="loginWrapper">
        <div class="loginFrame">
            <el-row class="w-100 h-100">
                <el-col :span="10">
                    <div class="cp-login-left">
                        <div class="title">
                            <h1 class="mb-10">穗创汇</h1>
                            <h3>广州市创业孵化基地管理平台</h3>
                        </div>
                    </div>
                </el-col>
                <el-col :span="14">
                    <div class="cp-login-right">
                        <h3>区局端•用户登录</h3>
                        <el-form ref="loginFormRef" :model="loginForm" class="cp-login-form" :rules="loginRules">
                            <el-form-item prop="username">
                                <el-input v-model="loginForm.username" placeholder="用户名" @keydown.enter="onSubmitLogin">
                                    <template #prefix>
                                        <el-icon :size="22" color="#6478b6">
                                            <UserFilled />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item l prop="password">
                                <el-input v-model="loginForm.password" :type="inputType" placeholder="密码"
                                    @keydown.enter="onSubmitLogin">
                                    <template #prefix>
                                        <el-icon :size="22" color="#6478b6">
                                            <Lock />
                                        </el-icon>
                                    </template>
                                    <template #suffix>
                                        <el-icon :size="22" color="#6478b6" @click="onTogglePwd">
                                            <Hide v-show="isHide" />
                                            <View v-show="!isHide" />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="code">
                                <el-input class="code-input mr-20" maxlength="4" v-model="loginForm.inputCode"
                                    placeholder="验证码" @keydown.enter="onSubmitLogin">
                                    <template #prefix>
                                        <el-icon :size="22" color="#6478b6">
                                            <Lock />
                                        </el-icon>
                                    </template>
                                </el-input>
                                <Code ref="code" />
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="onSubmitLogin">登录</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="onReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import md5 from 'js-md5'
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { getAuthToken } from '@/api/core/sysAreaUser';
import useStore from '@/store';
import { setRefToken, setToken } from '@/utils/auth';
import { localWrite } from '@/utils';
import Code from '@/baseUI/code/index.vue';
const loginFormRef = ref<FormInstance>();
const ROUTER = useRouter();
let { userStore } = useStore();
let isHide = ref(true);//密码显示隐藏

let loginForm = reactive({
    username: "",
    password: "",
    inputCode: ""
});
const code = ref();
let inputType = ref('password');
const loginRules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
});

// 切换密码框
const onTogglePwd = () => {
    isHide.value = !isHide.value;
    inputType.value = isHide.value ? 'password' : "text";
}

// 确认登录
const onSubmitLogin = async () => {
    if (!loginFormRef.value) return;
    await loginFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            let md5Pwd = md5(loginForm.password);
            let { data } = await getAuthToken({ username: loginForm.username, password: md5Pwd, inputCode: loginForm.inputCode });
            if (data.code !== 200) {
                if (data.code === 500) {
                    if (data.msg.includes("验证码")) {
                        ElMessage({
                            message: "验证码错误, 请重新填写验证码再试",
                            type: "error",
                        });
                    } else {
                        ElMessage({
                            message: data.msg,
                            type: "error",
                        });
                    }
                }
                code.value.onGetCode();
                return;
            };
            // 判断用户是否绑定
            ElMessage({
                type: "success",
                message: "登录成功"
            })
            setToken(data.data.accessToken);
            setRefToken(data.data.refreshToken)
            localWrite("ExpirationTime", data.data.expirationTime);
            await userStore.getUserInfo();

            ROUTER.push({ path: "/" });
            setTimeout(() => {
                ElMessage.closeAll()
            }, 2000)
        } else {
            console.log('error submit!', fields)
        }
    })
}

// 重置
let onReset = () => {
    if (!loginFormRef.value) return;
    loginFormRef.value.resetFields()
}

</script>

<style scoped lang="scss">
.loginWrapper {
    width: 100vw;
    height: 100vh;
    min-height: 500px;
    background-image: linear-gradient(135deg, rgba(241, 242, 246, 0.5), rgba(241, 242, 246, 0.3));
    position: relative;
    overflow: hidden;

    .loginFrame {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 800px;
        height: 600px;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #e0e0e0;
        box-shadow: 20px 20px 60px #bebebe,
            -20px -20px 60px #ffffff;

        .cp-login-left {
            position: relative;
            height: 100%;
            background: #2b324e url("@/assets/login/cp_loginBg.png") no-repeat;
            background-position: center 75%;
            background-size: 75%;

            .title {
                width: 100%;
                position: absolute;
                top: 30%;
                text-align: center;
                font-size: 18px;
                font-weight: 700;

                h1 {
                    font-size: 28px;
                }

                h3 {
                    text-align: center;
                }
            }
        }

        .cp-login-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            &>h3 {
                color: black;
                height: 200px;
                line-height: 200px;
                font-size: 20px;
                font-weight: 700;
            }

            .cp-login-form {
                flex: 1;
                width: 70%;

                & :deep(.el-input__wrapper) {
                    border-radius: 45px;
                    box-shadow:
                        0px 0px 16px rgba(0, 0, 0, 0.13);
                }

                & :deep(.el-input__inner) {
                    padding: 20px 10px;

                    &::-webkit-input-placeholder {
                        color: #99a2ba;
                    }
                }

                .code-input {
                    width: 70%;
                }

                .el-button {
                    width: 100%;
                    border-radius: 45px;
                    padding: 20px 10px;
                    background-color: #98a7ba;
                    color: #fff;
                    font-weight: bold;
                    box-shadow:
                        0px 0px 16px rgba(0, 0, 0, 0.13);
                    border: none;

                    &:active {
                        background-color: #3c495a;
                    }
                }
            }
        }
    }
}
</style>