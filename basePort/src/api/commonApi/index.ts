import httpSerive from "@/utils/http-request";
import qs from "qs";
import { CustomType } from "@/types"
export let fileUploadUrl = "/file/upload"

//  手机查重
export const phoneCheckRepeat = (params: { phone: string }) => {
  return httpSerive({
    url: "/sysUserBase/checkRepeatByPhone",
    method: "GET",
    params,
  });
};



//查询所有市
export const getAllCity = () => {
  return httpSerive({
    url: "/city/getAll",
    method: "GET",
  });
};

// 根据代码获取市
export const getCityByCode = (params:{code:number}) => {
  return httpSerive({
    url: "/city/get",
    method: "GET",
    params
  });
};

// 根据省代码查询市
export const getCityByProvinceCode = (params:{code:number}) => {
  return httpSerive({
    url: "/city/getByProvinceCode",
    method: "GET",
    params
  });
};



// 查询所有省列表
export const getAllProvince = () => {
  return httpSerive({
    url: "/province/getAll",
    method: "GET",
  });
};


// 根据代码查询省
export const getProvinceByCode = (params:{code:number}) => {
  return httpSerive({
    url: "/province/getByCode",
    method: "GET",
    params
  });
};

//  根据代码获取区
export const getCountyByCode = (params: { code: number }) => {
  return httpSerive({
    url: "/county/get",
    method: "GET",
    params,
  });
};

// 根据市代码查询区
export const getCountyByCityCode = (params:{code:number}) => {
  return httpSerive({
    url: "/county/getByCityCode",
    method: "GET",
    params
  });
};

