import { defineStore } from "pinia";

const usePageStore = defineStore("page", {
  state() {
    return {
      baseDetails: {}, // 基地编辑添加数据
      entityDetails: {}, //实体编辑添加数据
      activityDetails: {}, // 活动编辑添加数据
      expertDetails: {}, //专家数据
    };
  },
  persist: {
    key: "pinia-page",
    storage: sessionStorage,
  },
});

export default usePageStore;
