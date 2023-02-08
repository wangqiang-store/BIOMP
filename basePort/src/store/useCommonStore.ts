import { defineStore } from "pinia";
import { userStoreState } from "./type";
import { getBaseUserInfo } from "@/api/basePortApi/index"
import useModuleStore from "./useModuleStore";
import { getActivityType, getEntityType, getIncubationStatusType, getBaseType, getBaseStatus, getBaseLevel, getBaseOwnership, getMentorType, getNoticeType } from "@/api/enum"
const useUserStore = defineStore("bp", {
  state(): userStoreState {
    return {
      baseUserInfo: {}, //登录的用户信息
      isCollapse: false, //侧边栏的收缩
      menuActivePath: "", //侧边菜单高亮的path
      twoMenuActivePath: "", //侧边菜单高亮的path
      companyId: "", //当前要查看的入住实体id
      activityId: "", //当前要查看的活动沙龙id
      baseTypeList: [], // 基地类型列表
      baseStatusList: [], // 基地状态列表
      basesLevelList: [], // 基地等级列表
      activityTypeList: [], //活动类型列表
      entityTypeList: [], //实体类型列表
      incubationStatusList: [], //实体孵化状态列表
      baseOwnershipList: [], //基地权属列表
      mentorTypeList: [], //专家导师类型列表
      notifyTypeList: [], //通知类型列表
    };
  },
  actions: {
    // 获取用户信息
    async setUserInfo() {
      const moduleStore = useModuleStore();
      const { data } = await getBaseUserInfo()
      if (data.code === 200) {
        this.baseUserInfo = data.data
        moduleStore.$patch((state) => {
          state.currmentUserId = [data.data.id];
        });
      }
    },
    // 获取基地类型列表
    async getBaseTypeFn() {
      const { data } = await getBaseType()
      if (data.code === 200) {
        this.baseTypeList = data.data
      }
    },
    // 获取基地状态列表
    async getBaseStatusFn() {
      const { data } = await getBaseStatus()
      if (data.code === 200) {
        this.baseStatusList = data.data
      }
    },
    // 获取基地等级列表
    async getBaseLevelFn() {
      const { data } = await getBaseLevel()
      if (data.code === 200) {
        this.basesLevelList = data.data
      }
    },
    // 获取基地权属列表列表
    async getBaseOwnershipFn() {
      const { data } = await getBaseOwnership()
      if (data.code === 200) {
        this.baseOwnershipList = data.data
      }
    },
    // 获取活动类型列表
    async getActivityTypeFn() {
      const { data } = await getActivityType()
      if (data.code === 200) {
        this.activityTypeList = data.data
      }
    },
    // 获取实体类型列表
    async getEntityTypeFn() {
      const { data } = await getEntityType()
      if (data.code === 200) {
        this.entityTypeList = data.data
      }
    },
    // 获取实体孵化状态列表
    async getIncubationStatusTypeFn() {
      const { data } = await getIncubationStatusType()
      if (data.code === 200) {
        this.incubationStatusList = data.data
      }
    },
    // 获取专家导师类型列表
    async getMentorTypeFn() {
      const { data } = await getMentorType()
      if (data.code === 200) {
        this.mentorTypeList = data.data
      }
    },
    // 获取通知类型列表
    async getNotifyTypeFn() {
      const { data } = await getNoticeType()
      if (data.code === 200) {
        this.notifyTypeList = data.data
      }
    },
  },
  getters: {},
  persist: {
    key: "pinia-user",
    storage: sessionStorage,
  },
});

export default useUserStore;
