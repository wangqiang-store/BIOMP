import { defineStore } from "pinia";
import { useCommonStoreState } from "./type";
import {
  getBaseLevel,
  getBaseStatus,
  getBaseOwnership,
  getBaseType,
  getAllProvince,
  getEntityStatus,
  getEntityType,
  getActivityType,
  getMentorType,
  getGenderType,
  getNoticeType,
  getAllCounty,
} from "@/api/enum";
import { getRunBase, getAllBase } from "@/api/core/hatchBase";
import { getRunEntity } from "@/api/core/hatchEntity";

const useCommonStore = defineStore("common", {
  state(): useCommonStoreState {
    return {
      baseLevel: [], //基地等级
      baseStatus: [], //基地状态
      baseOwnership: [], //基地权属
      baseType: [], //基地权属
      runBaseList: null, //正在运行基地列表
      allBaseList: null, //所有基地列表
      allProvinceList: [], //所有省列表
      entityType: [], //实体类型
      entityStatus: [], //实体状态
      runEntityList: null, //孵化中实体
      activityType: [], //活动类型
      mentorType: [], //导师类型
      genderType: [], //性别类型
      notifyType: [], //通告类型
      allCountylist: [], //广州全区列表
    };
  },
  actions: {
    async onGetBaseLevel() {
      let { data } = await getBaseLevel();
      if (data.code !== 200) return;
      this.baseLevel = data?.data;
    },
    async onGetBaseStatus() {
      let { data } = await getBaseStatus();
      if (data.code !== 200) return;
      this.baseStatus = data?.data;
    },
    // 获取还在运营中的基地
    async onGetRunBaseData() {
      let { data } = await getRunBase();
      if (data.code !== 200) return;
      // 根据创建时间排序
      data?.data.sort(
        (a: { createTime: string }, b: { createTime: string }) =>
          new Date(b["createTime"]).getTime() -
          new Date(a["createTime"]).getTime()
      );
      this.runBaseList = data?.data;
    },
    // 获取所有基地
    async onGetAllBaseData() {
      let { data } = await getAllBase();
      if (data.code !== 200) return;
      // 根据创建时间排序
      data?.data.sort(
        (a: { createTime: string }, b: { createTime: string }) =>
          new Date(b["createTime"]).getTime() -
          new Date(a["createTime"]).getTime()
      );
      this.allBaseList = data?.data;
    },
    // 获取还在孵化中的实体
    async onGetRunEntityData() {
      let { data } = await getRunEntity();
      if (data.code !== 200) return;
      this.runEntityList = data?.data;
    },
    // 获取基地权属
    async onGetBaseOwnership() {
      let { data } = await getBaseOwnership();
      if (data.code !== 200) return;
      this.baseOwnership = data?.data;
    },
    // 获取基地类型
    async onGetBaseType() {
      let { data } = await getBaseType();
      if (data.code !== 200) return;
      this.baseType = data?.data;
    },
    // 获取所有省列表
    async onGetAllProvince() {
      let { data } = await getAllProvince();
      if (data.code !== 200) return;
      this.allProvinceList = data?.data;
    },
    // 获取实体类型
    async onGetEntityType() {
      let { data } = await getEntityType();
      if (data.code !== 200) return;
      this.entityType = data?.data;
    },
    // 获取实体状态
    async onGetEntityStatus() {
      let { data } = await getEntityStatus();
      if (data.code !== 200) return;
      this.entityStatus = data?.data;
    },
    // 获取活动类型
    async onGetActivityType() {
      let { data } = await getActivityType();
      if (data.code !== 200) return;
      this.activityType = data?.data;
    },
    // 获取导师类型
    async onGetMentorType() {
      let { data } = await getMentorType();
      if (data.code !== 200) return;
      this.mentorType = data?.data;
    },
    // 获取性别类型
    async onGetGenderType() {
      let { data } = await getGenderType();
      if (data.code !== 200) return;
      this.genderType = data?.data;
    },
    // 获取通告类型
    async onGetNotifyType() {
      let { data } = await getNoticeType();
      if (data.code !== 200) return;
      this.notifyType = data?.data;
    },
    // 获取全区列表
    async onGetAllCounty() {
      let { data } = await getAllCounty();
      if (data.code !== 200) return;
      this.allCountylist = data?.data;
    },
  },
});

export default useCommonStore;
