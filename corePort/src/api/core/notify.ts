import httpSerive from "@/utils/http-request";
import qs from "qs";
import { CustomType } from "@/types";

//新增中心通知信息-通知通告发布
export const createNotice = (params: CustomType) => {
  return httpSerive({
    url: "/noticeCenter/create",
    method: "POST",
    data: params,
  });
};

//分页获取中心通知列表
export const getNoticeByPage = (params: CustomType) => {
  return httpSerive({
    url: "/noticeCenter/findByPage",
    method: "GET",
    params,
  });
};

//查看中心通知详情
export const getNoticeDetails = (params: { id: number }) => {
  return httpSerive({
    url: "/noticeCenter/findDetailById",
    method: "GET",
    params,
  });
};

//  获取所有最新发布的10条通知
export const getNewNotice = () => {
  return httpSerive({
    url: "/noticeCenter/getLimitNoticeCenter",
    method: "GET",
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
