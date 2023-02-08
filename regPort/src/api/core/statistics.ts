import httpSerive from "@/utils/http-request";

//  入孵创业实体相关统计
export const getEntityStat = (params: {
  countyCode: number | null;
  time: string;
}) => {
  return httpSerive({
    url: "/statistical/getByEntity",
    method: "GET",
    params,
  });
};

//  获取基地级别数量
export const getBaseLevelNum = (params: {
  countyCode: number | null;
  time: string | null;
}) => {
  return httpSerive({
    url: "/statistical/getIncubationLevel",
    method: "GET",
    params,
  });
};

//  获取基地类型的数量统计与基地孵化总面积
export const getTotalAreaDto = (params: {
  countyCode: number | null;
  time: string;
}) => {
  return httpSerive({
    url: "/statistical/getTotalAreaDto",
    method: "GET",
    params,
  });
};
