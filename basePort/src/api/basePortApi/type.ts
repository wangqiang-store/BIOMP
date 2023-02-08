//获取token(登录)
export interface getAuthTokenParams {
  username: string;
  password: string;
  inputCode: string;
}

// 修改密码
export interface updateBasePwdParams {
  newPwd: string;
  oldPwd: string;
}

// 基地数据
export interface baseData {
  id?: number;
  address?: string;
  area?: string;
  companyNum?: number;
  fileIds?: string;
  latitude?: string;
  longitude?: string;
  level?: number;
  name?: string;
  principal?: string;
  status?: number;
  telephone?: number;
  [key: string]: any;
}
