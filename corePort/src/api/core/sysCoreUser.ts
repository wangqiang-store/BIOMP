import httpSerive from "@/utils/http-request";
import qs from "qs";
import { searchCoreParams, coreAccountParams } from "../type";

//  获取用户信息
export const getUserInfo = () => {
  return httpSerive({
    url: "/sysUser/info",
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
    url: "/sysUser/token",
    method: "POST",
    params,
  });
};

//  刷新token
export const refreshToken = (params: { refreshToken: string }) => {
  return httpSerive({
    url: "/sysUser/refreshToken",
    method: "GET",
    params,
  });
};

//  关键字分页获取中心账号
export const searchUser = (params: searchCoreParams) => {
  return httpSerive({
    url: "/sysUser/search",
    method: "GET",
    params,
  });
};

//  添加中心账号
export const createUser = (params: coreAccountParams) => {
  return httpSerive({
    url: "/sysUser/addUser",
    method: "POST",
    data: qs.stringify(params),
  });
};

//  编辑中心账号
export const updateUser = (params: coreAccountParams) => {
  return httpSerive({
    url: "/sysUser/updateUser",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  删除用户
export const deleteUser = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUser/delete",
    method: "DELETE",
    params,
  });
};

//  重置用户密码
export const resetPassword = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUser/resetPassword",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  用户是否启用
export const enableUser = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUser/enableUser",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  修改密码
export const updatePwd = (params: { newPwd: string; oldPwd: string }) => {
  return httpSerive({
    url: "/sysUser/updatePwd",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  用户名查重
export const usernsmeCheckRepeat = (params: { username: string }) => {
  return httpSerive({
    url: "/sysUser/checkRepeat",
    method: "GET",
    params,
  });
};

//  邮箱查重
export const emailCheckRepeat = (params: { email: string }) => {
  return httpSerive({
    url: "/sysUser/checkRepeatByEmail",
    method: "GET",
    params,
  });
};

//  手机查重
export const phoneCheckRepeat = (params: { phone: string }) => {
  return httpSerive({
    url: "/sysUser/checkRepeatByPhone",
    method: "GET",
    params,
  });
};
