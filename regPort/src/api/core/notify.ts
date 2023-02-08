import httpSerive from "@/utils/http-request";
import qs from "qs";
import { CustomType } from "@/types";

//分页获取区级通知列表
export const getNoticeByPage = (params: CustomType) => {
  return httpSerive({
    url: "/noticeArea/findByPage",
    method: "GET",
    params,
  });
};

// 查看区级通知详情
export const getNoticeDetailsById = (params: { noticeAreaId: number }) => {
  return httpSerive({
    url: "/noticeArea/findDetailById",
    method: "GET",
    params,
  });
};

//查询区级通知已转发的基地列表
export const getNoticeAreaForwarding = (params: { noticeAreaId: number }) => {
  return httpSerive({
    url: "/noticeArea/findForwarding",
    method: "GET",
    params,
  });
};

//区级通知转发
export const noticeAreaForwardingFn = (params: any) => {
  return httpSerive({
    url: "/noticeArea/forwarding",
    method: "PUT",
    data: params,
  });
};

//获取所有未读的消息（通知、任务）和未上报的任务通知
export const getStatusNoticeArea = () => {
  return httpSerive({
    url: "/noticeArea/getStatusNoticeArea",
    method: "GET",
  });
};

//区级通知上报/修改上报
export const noticeAreaReport = (params: any) => {
  return httpSerive({
    url: "/noticeArea/report",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//修改通知数据状态->已读
export const updateNoticeAreaStatus = (params: { id: number }) => {
  return httpSerive({
    url: "/noticeArea/updateStatus",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//根据区获取所有状态为运营中的基地
export const getRunIncubationBaseByCode = (params: { countyCode: number }) => {
  return httpSerive({
    url: "/incubationBase/getRunIncubationBaseByCode",
    method: "GET",
    params,
  });
};

//查询区级通知修改记录列表
export const getNoticeAreaRecordById = (params: { noticeAreaId : number }) => {
  return httpSerive({
    url: "/noticeAreaRecord/findRecordById",
    method: "get",
    params,
  });
};

//查询基地通知修改记录列表
export const getNoticeBaseRecordById = (params: { noticeBaseId: number }) => {
  return httpSerive({
    url: "/noticeBaseRecord/findRecordById",
    method: "get",
    params,
  });
};
