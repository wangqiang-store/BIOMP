import httpSerive from "@/utils/http-request";
import qs from "qs";
// import { pagingActivittyParams } from "./type";
import { CustomType } from "@/types"


// 分页获取专家列表
export const getExpertByPage = (params: CustomType) => {
    return httpSerive({
        url: "/expertInfo/findByPage",
        method: "get",
        params
    });
};



// 查看专家详情
export const getExpertDetailById = (params: { id: number }) => {
    return httpSerive({
        url: "/expertInfo/findDetailById",
        method: "get",
        params
    });
};