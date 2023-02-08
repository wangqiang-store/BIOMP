import httpSerive from "@/utils/http-request";
import qs from "qs";
import { entityPagingParams, entityData } from "../type";

//  分页获取实体列表
export const getPagingEntity = (params: entityPagingParams) => {
  return httpSerive({
    url: "/inTheEntity/findByPage",
    method: "GET",
    params,
  });
};

//  查看实体详情
export const getEntityDetails = (params: { id: number }) => {
  return httpSerive({
    url: "/inTheEntity/findDetailById",
    method: "GET",
    params,
  });
};

//  获取所有状态的实体
export const getAllEntity = () => {
  return httpSerive({
    url: "/inTheEntity/getAllInTheEntity",
    method: "GET",
  });
};

//  获取所有未关闭的实体
export const getRunEntity = () => {
  return httpSerive({
    url: "/inTheEntity/getRunInTheEntity",
    method: "GET",
  });
};

//  新增实体信息
export const createEntity = (params: entityData) => {
  return httpSerive({
    url: "/inTheEntity/createInTheEntity",
    method: "POST",
    data: qs.stringify(params),
  });
};

//  编辑实体信息
export const updateEntity = (params: entityData) => {
  return httpSerive({
    url: "/inTheEntity/updateInTheEntity",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  关闭实体
export const closeEntity = (params: { id: number }) => {
  return httpSerive({
    url: "/inTheEntity/closeStatus",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  批量关闭实体
export const batchCloseEntity = (params: { ids: string }) => {
  return httpSerive({
    url: "/inTheEntity/closeBatch",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//   孵化协议号查重
export const checkRepeatProtocolNum = (params: {
  incubationBaseId: number;
  protocolNum: string;
}) => {
  return httpSerive({
    url: "/inTheEntity/checkRepeatByProtocolNum",
    method: "GET",
    params,
  });
};
