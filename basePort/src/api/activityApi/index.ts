import httpSerive from "@/utils/http-request";
import qs from "qs";
import { pagingActivittyParams } from "./type";
import { CustomType } from "@/types"


//分页获取活动中心列表
export const getActivityByPage = (params: CustomType) => {
    return httpSerive({
        url: "/activity/findByPage",
        method: "get",
        params
    });
};


// 分页获取我的活动列表
export const getActivityByMyPage = (params: pagingActivittyParams) => {
    return httpSerive({
        url: "/activity/findMyPage",
        method: "get",
        params
    });
};


//查看活动详情
export const getActivityDetailById = (params: {id:number |string}) => {
    return httpSerive({
        url: "/activity/findDetailById",
        method: "get",
        params
    });
};

//删除活动信息
export const deleteActivity = (params: {id:number}) => {
    return httpSerive({
        url: "/activity/delete",
        method: "PUT",
        data: qs.stringify(params),
    });
};


//新增活动信息
export const createActivity = (params: CustomType) => {
    return httpSerive({
        url: "/activity/create",
        method: "POST",
        data: qs.stringify(params),
    });
};


//编辑活动信息
export const updateActivity = (params: CustomType) => {
    return httpSerive({
        url: "/activity/update",
        method: "PUT",
        data: qs.stringify(params),
    });
};


