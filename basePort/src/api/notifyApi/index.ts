import httpSerive from "@/utils/http-request";
import qs from "qs";
import { CustomType } from "@/types";

//分页获取基地通知列表
export const getNoticeByPage = (params: CustomType) => {
  return httpSerive({
    url: "/noticeBase/findByPage",
    method: "get",
    params,
  });
};

//查看基地通知详情
export const getNoticeDetailById = (params: { noticeBaseId: number }) => {
  return httpSerive({
    url: "/noticeBase/findDetailById",
    method: "get",
    params,
  });
};

//基地通知上报/修改上报
export const noticeBaseReport = (params: CustomType) => {
  return httpSerive({
    url: "/noticeBase/report",
    method: "PUT",
    params,
  });
};

//获取所有未读的消息（通知、任务）和未上报的任务通知
export const getStatusNoticeBase = () => {
  return httpSerive({
    url: "/noticeBase/getStatusNoticeBase",
    method: "get",
  });
};

//修改通知数据状态->已读
export const updateNoticeStatus = (params: { id: CustomType }) => {
  return httpSerive({
    url: "/noticeBase/updateStatus",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//全部修改通知数据状态->已读
export const updateAllNoticeStatus = (params: { type: number }) => {
  return httpSerive({
    url: "/noticeBase/updateStatusAll",
    method: "PUT",
    data: qs.stringify(params),
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