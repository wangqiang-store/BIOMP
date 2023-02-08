import httpSerive from "@/utils/http-request";
import qs from "qs";

//  获取用户信息
export const getUserInfo = () => {
  return httpSerive({
    url: "/sysUserArea/info",
    method: "GET",
  });
};

//  获取token
export const getAuthToken = (params: {
  inputCode: string;
  username: string;
  password: string;
}) => {
  return httpSerive({
    url: "/sysUserArea/token",
    method: "POST",
    params,
  });
};

//  刷新token
export const refreshToken = (params: { refreshToken: string }) => {
  return httpSerive({
    url: "/sysUserArea/refreshToken",
    method: "GET",
    params,
  });
};

//  修改密码
export const updatePwd = (params: { newPwd: string; oldPwd: string }) => {
  return httpSerive({
    url: "/sysUserArea/updatePwd",
    method: "PUT",
    data: qs.stringify(params),
  });
};
