import httpSerive from "@/utils/http-request";
import qs from "qs";
import { activityData, pagingActivityParams } from "../type";
//   新增活动信息
export const createActivity = (params: activityData) => {
  return httpSerive({
    url: "/activity/create",
    method: "POST",
    data: qs.stringify(params),
  });
};

//  删除活动信息
export const deleteActivity = (params: { id: number }) => {
  return httpSerive({
    url: "/activity/delete",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  分页获取活动中心列表
export const getPagingActivity = (params: pagingActivityParams) => {
  return httpSerive({
    url: "/activity/findByPage",
    method: "GET",
    params,
  });
};

//  查看活动详情
export const getActivityDetails = (params: { id: number }) => {
  return httpSerive({
    url: "/activity/findDetailById",
    method: "GET",
    params,
  });
};

//  分页获取我的活动列表
export const getPagingMyActivity = (params: pagingActivityParams) => {
  return httpSerive({
    url: "/activity/findMyPage",
    method: "GET",
    params,
  });
};

//  编辑活动信息
export const updateActivity = (params: activityData) => {
  return httpSerive({
    url: "/activity/update",
    method: "PUT",
    data: qs.stringify(params),
  });
};
