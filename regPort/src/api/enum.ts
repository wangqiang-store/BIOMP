import httpSerive from "@/utils/http-request";

//  获取基地等级类型枚举
export const getBaseLevel = () => {
  return httpSerive({
    url: "/enum/findIncubationLevelEnum",
    method: "GET",
  });
};

//  获取基地状态类型枚举
export const getBaseStatus = () => {
  return httpSerive({
    url: "/enum/findIncubationStatusEnum",
    method: "GET",
  });
};

//  获取web客户端类型枚举
export const getWebType = () => {
  return httpSerive({
    url: "/enum/findIncubationStatusEnum",
    method: "GET",
  });
};

//  获取基地权属枚举
export const getBaseOwnership = () => {
  return httpSerive({
    url: "/enum/findIncubationOwnershipEnum",
    method: "GET",
  });
};

//  获取基地类型枚举
export const getBaseType = () => {
  return httpSerive({
    url: "/enum/findIncubationBaseTypeEnum",
    method: "GET",
  });
};

// 获取所有省接口
export const getAllProvince = () => {
  return httpSerive({
    url: "/province/getAll",
    method: "GET",
  });
};

//  根据省代码查询市
export const getByCity = (params: { code: number }) => {
  return httpSerive({
    url: "/city/getByProvinceCode",
    method: "GET",
    params,
  });
};

//  根据代码查询省
export const getByProvinceCode = (params: { code: number }) => {
  return httpSerive({
    url: "/province/getByCode",
    method: "GET",
    params,
  });
};

//  根据代码获取市
export const getByCityCode = (params: { code: number }) => {
  return httpSerive({
    url: "/city/get",
    method: "GET",
    params,
  });
};

//  根据市代码查询区
export const getByCounty = (params: { code: number }) => {
  return httpSerive({
    url: "/county/getByCityCode",
    method: "GET",
    params,
  });
};

//  根据代码获取区
export const getByCountyCode = (params: { code: number }) => {
  return httpSerive({
    url: "/county/get",
    method: "GET",
    params,
  });
};

//  获取实体的类型类型枚举
export const getEntityType = () => {
  return httpSerive({
    url: "/enum/findIncubationTypeEnum",
    method: "GET",
  });
};

//  获取实体孵化状态类型枚举
export const getEntityStatus = () => {
  return httpSerive({
    url: "/enum/findInTheEntityStatusEnum",
    method: "GET",
  });
};

//  获取活动类型枚举
export const getActivityType = () => {
  return httpSerive({
    url: "/enum/findActivityEnum",
    method: "GET",
  });
};

//  获取专家导师类型枚举
export const getMentorType = () => {
  return httpSerive({
    url: "/enum/findMentorTypeEnum",
    method: "GET",
  });
};

// 获取性别类型枚举
export const getGenderType = () => {
  return httpSerive({
    url: "/enum/findGenderEnum",
    method: "GET",
  });
};

// 获取通知类型枚举
export const getNoticeType = () => {
  return httpSerive({
    url: "/enum/findNoticeTypeEnum",
    method: "GET",
  });
};

//  获取全市行政区类型枚举
export const getAllCounty = () => {
  return httpSerive({
    url: "/enum/findCountyCodeEnum",
    method: "GET",
  });
};
