import httpSerive from "@/utils/http-request";



// 获取活动类型枚举
export const getActivityType = () => {
  return httpSerive({
    url: "/enum/findActivityEnum",
    method: "GET",
  });
};

// 获取基地类型枚举
export const getBaseType = () => {
  return httpSerive({
    url: "/enum/findIncubationBaseTypeEnum",
    method: "GET",
  });
};

// 获取基地等级类型枚举
export const getBaseLevel = () => {
  return httpSerive({
    url: "/enum/findIncubationLevelEnum",
    method: "GET",
  });
};

// 获取基地权属枚举
export const getBaseOwnership = () => {
  return httpSerive({
    url: "/enum/findIncubationOwnershipEnum",
    method: "GET",
  });
};

// 获取基地状态类型枚举
export const getBaseStatus = () => {
  return httpSerive({
    url: "/enum/findIncubationStatusEnum",
    method: "GET",
  });
};

//获取实体的类型枚举
export const getEntityType = () => {
  return httpSerive({
    url: "/enum/findIncubationTypeEnum",
    method: "GET",
  });
};

// 获取实体孵化状态类型枚举
export const getIncubationStatusType = () => {
  return httpSerive({
    url: "/enum/findInTheEntityStatusEnum",
    method: "GET",
  });
};

// 获取web客户端类型枚举
export const getWebType = () => {
  return httpSerive({
    url: "/enum/findIncubationStatusEnum",
    method: "GET",
  });
};


// 获取专家导师类型枚举
export const getMentorType = () => {
  return httpSerive({
    url: "/enum/findMentorTypeEnum",
    method: "GET",
  });
};


//获取通知类型枚举
export const getNoticeType = () => {
  return httpSerive({
    url: "/enum/findNoticeTypeEnum",
    method: "GET",
  });
};