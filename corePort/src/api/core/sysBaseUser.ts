import httpSerive from "@/utils/http-request";
import qs from "qs";
import { baseAccountParams } from "../type";

//  添加用户
export const createBaseUser = (params: baseAccountParams) => {
  return httpSerive({
    url: "/sysUserBase/addUser",
    method: "POST",
    data: qs.stringify(params),
  });
};

//  编辑用户
export const updateUser = (params: baseAccountParams) => {
  return httpSerive({
    url: "/sysUserBase/updateUser",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//   用户名查重
export const usernameCheckRepeat = (params: { username: string }) => {
  return httpSerive({
    url: "/sysUserBase/checkRepeat",
    method: "GET",
    params,
  });
};

//  邮箱查重
export const emailCheckRepeat = (params: { email: string }) => {
  return httpSerive({
    url: "/sysUserBase/checkRepeatByEmail",
    method: "GET",
    params,
  });
};

//  手机查重
export const phoneCheckRepeat = (params: { phone: string }) => {
  return httpSerive({
    url: "/sysUserBase/checkRepeatByPhone",
    method: "GET",
    params,
  });
};

//  删除用户
export const deleteUser = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUserBase/delete",
    method: "DELETE",
    params,
  });
};

//  用户是否启用
export const enableUser = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUserBase/enableUser",
    method: "PUT",
    data: qs.stringify(params),
  });
};

//  重置用户密码
export const resetPassword = (params: { userId: number }) => {
  return httpSerive({
    url: "/sysUserBase/resetPassword",
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
    url: "/sysUserBase/search",
    method: "GET",
    params,
  });
};
