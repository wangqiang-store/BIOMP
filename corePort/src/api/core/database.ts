import httpSerive from "@/utils/http-request";
import qs from "qs";
import { ExpertInfo, ExpertPaging } from "../type";

//  新增专家信息
export const createExpert = (params: ExpertInfo) => {
  return httpSerive({
    url: "/expertInfo/create",
    method: "POST",
    data: qs.stringify(params),
  });
};

//  编辑专家信息
export const updateExpert = (params: ExpertInfo) => {
  return httpSerive({
    url: "/expertInfo/update",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  删除专家信息
export const deleteExpert = (params: { id: number }) => {
  return httpSerive({
    url: "/expertInfo/delete",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  分页获取专家列表
export const getPagingExpertData = (params: ExpertPaging) => {
  return httpSerive({
    url: "/expertInfo/findByPage",
    method: "GET",
    params,
  });
};

//  查看专家详情
export const getExpertDetails = (params: { id: number }) => {
  return httpSerive({
    url: "/expertInfo/findDetailById",
    method: "GET",
    params,
  });
};
