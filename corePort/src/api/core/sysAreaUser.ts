import httpSerive from "@/utils/http-request";
import qs from "qs";
import { areaAccountParams } from "../type";

//  添加用户
export const createAreaUser = (params: areaAccountParams) => {
  return httpSerive({
    url: "/sysUserArea/addUser",
    method: "POST",
    data: qs.stringify(params),
  });
};

//  编辑用户
export const updateAreaUser = (params: areaAccountParams) => {
  return httpSerive({
    url: "/sysUserArea/updateUser",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//   用户名查重
export const usernameCheckRepeat = (params: { username: string }) => {
  return httpSerive({
    url: "/sysUserArea/checkRepeat",
    method: "GET",
    params,
  });
};

//  邮箱查重
export const emailCheckRepeat = (params: { email: string }) => {
  return httpSerive({
    url: "/sysUserArea/checkRepeatByEmail",
    method: "GET",
    params,
  });
};

//  手机查重
export const phoneCheckRepeat = (params: { phone: string }) => {
  return httpSerive({
    url: "/sysUserArea/checkRepeatByPhone",
    method: "GET",
    params,
  });
};

//  删除用户
export const deleteUser = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUserArea/delete",
    method: "DELETE",
    params,
  });
};

//  用户是否启用
export const enableUser = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUserArea/enableUser",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  重置用户密码
export const resetPassword = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUserArea/resetPassword",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  关键字分页获取所有用户
export const getPagingData = (params: {
  content?: string;
  isAsc?: boolean;
  limit: number;
  page: number;
}) => {
  return httpSerive({
    url: "/sysUserArea/search",
    method: "GET",
    params,
  });
};
