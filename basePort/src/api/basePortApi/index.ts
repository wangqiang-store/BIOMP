import httpSerive from "@/utils/http-request";
import qs from "qs";
import { getAuthTokenParams, updateBasePwdParams, baseData } from "./type";
import { CustomType } from "@/types"


//  获取token
export const getAuthToken = (params: getAuthTokenParams) => {
  return httpSerive({
    url: "/sysUserBase/token",
    method: "POST",
    params,
  });
};

//刷新token
export const refreshToken = (params: { refreshToken: string }) => {
  return httpSerive({
    url: "/sysUserBase/refreshToken",
    method: "GET",
    params,
  });
};

// 获取用户信息
export const getBaseUserInfo = () => {
  return httpSerive({
    url: "/sysUserBase/info",
    method: "get",
  });
};


//修改密码
export const updateBasePwd = (params: updateBasePwdParams) => {
  return httpSerive({
    url: "/sysUserBase/updatePwd",
    method: "PUT",
    data: qs.stringify(params),
  });
};


// 查看基地详情
export const getBasePortDetail = (params: CustomType) => {
  return httpSerive({
    url: "/incubationBase/findDetailById",
    method: "get",
    params
  });
};

//  编辑基地信息
export const updateBase = (params: baseData) => {
  return httpSerive({
    url: "/incubationBase/update",
    method: "PUT",
    data: qs.stringify(params),
  });
};


//基地统计接口-单独查询当前实有入孵创业实体数(缓存接口)
export const getIncubationBaseByAddInTheEntity = (params: { incubationBaseId: number }) => {
  return httpSerive({
    url: "/incubationBase/getAddInTheEntity",
    method: "get",
    params
  });
};

//基地统计接口(缓存接口)
export const getIncubationBaseByStat = (params: { incubationBaseId: number }) => {
  return httpSerive({
    url: "/incubationBase/getByStat",
    method: "get",
    params
  });
};


// 获取所有状态的基地
export const getAllIncubationBase = () => {
  return httpSerive({
    url: "/incubationBase/getAllIncubationBase",
    method: "get",
  });
};
