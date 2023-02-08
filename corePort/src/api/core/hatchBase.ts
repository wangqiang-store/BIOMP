import httpSerive from "@/utils/http-request";
import qs from "qs";
import { baseData, pagingSearchBaseParams } from "../type";

//  新增基地信息
export const createBase = (params: baseData) => {
  return httpSerive({
    url: "/incubationBase/create",
    method: "POST",
    data: qs.stringify(params),
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

//  分页获取基地列表
export const findByPageBase = (params: pagingSearchBaseParams) => {
  return httpSerive({
    url: "/incubationBase/findByPage",
    method: "GET",
    params,
  });
};

//  查看基地详情
export const getBaseDetails = (params: { id: number }) => {
  return httpSerive({
    url: "/incubationBase/findDetailById",
    method: "GET",
    params,
  });
};

//  获取所有状态为运营中的基地
export const getRunBase = () => {
  return httpSerive({
    url: "/incubationBase/getRunIncubationBase",
    method: "GET",
  });
};

//  获取所有状态的基地
export const getAllBase = () => {
  return httpSerive({
    url: "/incubationBase/getAllIncubationBase",
    method: "GET",
  });
};

//  批量关闭基地
export const batchCloseBase = (params: { ids: string }) => {
  return httpSerive({
    url: "/incubationBase/closeBatch",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//   关闭基地
export const closeBase = (params: { id: number }) => {
  return httpSerive({
    url: "/incubationBase/closeStatus",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  基地统计接口(缓存接口)
export const getBaseStat = (params: { incubationBaseId: number }) => {
  return httpSerive({
    url: "/incubationBase/getByStat",
    method: "GET",
    params,
  });
};

//  根据区获取所有状态为运营中的基地
export const getRunBaseByCounty = (params: { countyCode: number }) => {
  return httpSerive({
    url: "/incubationBase/getRunIncubationBaseByCode",
    method: "GET",
    params,
  });
};
