import { defineStore } from "pinia";
import { userStoreState } from "./type";
import { getUserInfo } from "@/api/core/sysAreaUser";
import useModuleStore from "./useModuleStore";

const useUserStore = defineStore("user", {
  state(): userStoreState {
    return {
      userInfo: {},
    };
  },
  actions: {
    async getUserInfo() {
      const moduleStore = useModuleStore();
      let { data } = await getUserInfo();
      if (data.code !== 200) return;
      this.userInfo = data.data;
      moduleStore.$patch((state) => {
        state.currmentUserId = [data.data.id];
      });
    },
  },
  getters: {},
  persist: {
    key: "pinia-user",
    storage: sessionStorage,
  },
});

export default useUserStore;
