import httpSerive from "@/utils/http-request";
import qs from "qs";
// import { pagingActivittyParams } from "./type";
import { CustomType } from "@/types"



//批量关闭实体
export const closeBatch = (params: { ids: CustomType }) => {
    return httpSerive({
        url: "/inTheEntity/closeBatch",
        method: "PUT",
        data: qs.stringify(params),
    });
};

//关闭实体
export const closeBatchById = (params: { id: number }) => {
    return httpSerive({
        url: "/inTheEntity/closeStatus",
        method: "PUT",
        data: qs.stringify(params),
    });
};


//分页获取实体列表
export const getInTheEntityByPage = (params: CustomType) => {
    return httpSerive({
        url: "/inTheEntity/findByPage",
        method: "get",
        params
    });
};

// 新增实体信息
export const createInTheEntity = (params: CustomType) => {
    return httpSerive({
        url: "/inTheEntity/createInTheEntity",
        method: "POST",
        data: qs.stringify(params),
    });
};


//查看实体详情
export const getDetailById = (params: { id: number }) => {
    return httpSerive({
        url: "/inTheEntity/findDetailById",
        method: "get",
        params
    });
};

// 获取所有状态的实体
export const getAllInTheEntity = (params: { id: number }) => {
    return httpSerive({
        url: "/inTheEntity/getAllInTheEntity",
        method: "get",
        params
    });
};

//根据基地id获取所有未关闭的实体
export const getRunInTheEntityByBaseId = (params: { incubationBaseId: number }) => {
    return httpSerive({
        url: "/inTheEntity/getRunInTheEntityByBaseId",
        method: "get",
        params
    });
};

// 编辑实体信息
export const updateInTheEntity = (params: { id: number }) => {
    return httpSerive({
        url: "/inTheEntity/updateInTheEntity",
        method: "PUT",
        data: qs.stringify(params),
    });
};

// 孵化协议号查重
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

