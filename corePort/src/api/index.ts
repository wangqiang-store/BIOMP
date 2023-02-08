import axios from "axios";
import httpSerive from "@/utils/http-request";
import qs from "qs";
import { CustomType } from "@/types";

// 加载静态配置文件
export const getConfigInfo = () => {
  return axios.get("/config/index.json");
};

//  获取验证码
export const getCode = () => {
  return httpSerive({
    url: "/common/getVerCode",
    method: "get",
    responseType: "blob",
  });
};

//  统计汇总导出为excel
export const exportStatisticsExcel = (params: CustomType) => {
  return httpSerive({
    url: "/fileExport/exportStatistics",
    method: "POST",
    responseType: "blob",
    data: qs.stringify(params),
  });
};
