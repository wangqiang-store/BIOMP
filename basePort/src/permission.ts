import router from "./route";
import useStore from "@/store";
import { getToken } from "./utils/auth";
import { storeToRefs } from "pinia";
import NProgress from "nprogress";
// 权限白名单
const authWhiteList = ["/login"];

router.beforeEach(async (to, form, next) => {
  const { commonStore, moduleStore } = useStore();
  const { setUserInfo } = commonStore;
  const { baseUserInfo } = storeToRefs(commonStore);
  const { currmentUserId } = storeToRefs(moduleStore);
  NProgress.start();
  // 判断是否存在认证令牌
  if (getToken()) {
    // 判断是否为登录页
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      // 判断是否存在用户信息
      if (currmentUserId.value.length===0) {
        await setUserInfo();
        next();
      } else {
        next();
      }
    }
  } else {
    if (authWhiteList.includes(to.path)) {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});

router.afterEach((to, form, next) => {
  NProgress.done();
});
