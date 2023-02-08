import httpSerive from "@/utils/http-request";
import { pagingSearchLog } from "../type";

//  关键字分页获取日志(没有时间参数时不传时间字段，而不是传null值)
export const getLog = (params: pagingSearchLog) => {
  return httpSerive({
    url: "/sysLog/getPage",
    method: "GET",
    params,
  });
};
