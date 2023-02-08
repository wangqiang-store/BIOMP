import axios from "axios";
import httpSerive from "@/utils/http-request";
// 加载静态配置文件
export const getConfigInfo = () => {
  return axios.get("/config/index.json");
};