<template>
  <div class="loginPage">
    <div class="loginFrame">
      <div class="left">
        <h2>穗创汇</h2>
        <h3>广州市创业孵化基地管理平台</h3>
        <el-image class="image" :src="loginImg"></el-image>
      </div>
      <div class="right">
        <h2>基地端用户登录</h2>
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" size="large">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入账户/手机/邮箱">
              <template #prefix>
                <el-icon :size="22" color="#3394fe">
                  <UserFilled />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :type="pwdtype" v-model="loginForm.password" placeholder="请输入登录密码" @keydown.enter="onLogin">
              <template #prefix>
                <el-icon :size="22" color="#3394fe">
                  <Lock />
                </el-icon>
              </template>
              <template #suffix>
                <el-icon :size="22" color="#3394fe" @click="onTogglePwd">
                  <Hide v-show="!isShowPwd" />
                  <View v-show="isShowPwd" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="inputCode">
            <div class="verCode">
              <el-input style="width: 60%" v-model="loginForm.inputCode" placeholder="请输入验证码"
                @keydown.enter="onLogin" />
              <el-image @click="getVerCodeData" style="width: 30%" :src="verCode" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" round @click="onLogin" :loading="loginLoading">登录
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" round @click="onReset">重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { setToken, setRefToken } from "@/utils/auth";
import { localWrite } from "@/utils";
import loginImg from "@/assets/bpLogin.svg";
import { CustomType } from "@/types";
import md5 from "js-md5";
import axios from "axios";
import { getAuthToken, getBaseUserInfo } from "@/api/basePortApi/index";
import { storeToRefs } from "pinia";
import useStore from "@/store/index";
const { commonStore } = useStore();
const { setUserInfo } = commonStore;

const loginFormRef: CustomType = ref<FormInstance>();
const Router = useRouter();

// 登录参数
const loginLoading = ref(false);
const isShowPwd = ref(false)
const pwdtype = ref("password");
let loginForm = reactive({
  username: "",
  password: "",
  inputCode: "",
});
const rules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  inputCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});
const onTogglePwd = () => {
  isShowPwd.value = !isShowPwd.value
  pwdtype.value = isShowPwd.value ? "text" : "password"
}
// 登录
const onLogin = () => {
  loginFormRef.value
    .validate()
    .then(async () => {
      loginLoading.value = true;
      let obj = { ...loginForm, password: md5(loginForm.password) };
      const { data } = await getAuthToken(obj);
      if (data.code === 200) {
        ElMessage({
          message: "登录成功",
          type: "success",
        });
        setToken(data.data.accessToken);
        setRefToken(data.data.refreshToken);
        await setUserInfo()
        localWrite("ExpirationTime", data.data.expirationTime);
        Router.push("/");
        setTimeout(() => {
          ElMessage.closeAll()
        }, 2000)
      } else {
        getVerCodeData()
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
      }
      loginLoading.value = false;
    })
    .catch(() => { });
};
let onReset = () => {
  if (!loginFormRef.value) return;
  loginFormRef.value.resetFields();
};

// 验证码
const verCode: any = ref("");
const getVerCodeData = async () => {
  axios
    .get("/api/common/getVerCode", { responseType: "blob" })
    .then((response) => {
      verCode.value = window.URL.createObjectURL(response.data);
    });
};

onMounted(() => {
  getVerCodeData();
});
</script>

<style scoped lang="scss">
.loginPage {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 500px;
  background-color: #3394fe;

  .loginFrame {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    min-width: 760px;
    max-width: 1000px;
    height: 60%;
    min-height: 450px;
    padding: 50px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    border-radius: 10px;
    box-shadow: $pageBoxShadow;

    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 60%;

      h2 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 28px;
        margin-bottom: 20px;
      }
    }

    .right {
      width: 40%;

      h2 {
        font-size: 18px;
        color: #999;
        margin-bottom: 30px;
      }

      :deep(.el-input__wrapper) {
        border-radius: 20px;
      }

      .verCode {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .el-image {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
