export interface coreAccountParams {
  id?: number;
  username: string;
  name: string;
  password?: string;
  phone?: string | null;
  email?: string | null;
  [key: string]: any;
}

export interface baseAccountParams {
  id?: number;
  username: string;
  name: string;
  password?: string;
  phone?: string | null;
  email?: string | null;
  incubationBaseId?: number | null | undefined;
  incubationBaseName?: string;
  [key: string]: any;
}

export interface searchCoreParams {
  content?: string;
  isAsc?: boolean;
  limit: number;
  page: number;
}

export interface searchLogParams {
  content?: string;
  startTime?: string;
  endTime?: string;
  limit: number;
  page: number;
}

// 基地数据
export interface baseData {
  id?: number;
  address?: string;
  area?: string;
  companyNum?: number;
  fileIds?: string | Array<string>;
  latitude?: number;
  longitude?: number;
  level?: number;
  name?: string;
  principal?: string;
  status?: number;
  telephone?: number;
  [key: string]: any;
}

// 分页搜索基地参数
export interface pagingSearchBaseParams {
  content?: string;
  isAsc?: boolean;
  level?: number;
  limit: number;
  page: number;
}

// 实体数据
export interface entityData {
  id?: number;
  businessLicense?: string;
  baseTime?: string;
  fileIds?: string;
  incubationBaseId?: number;
  name?: string;
  peopleNum?: string | number;
  protocolNum?: number;
  protocolTime?: string;
  register?: string;
  status?: number;
  type?: number;
  [key: string]: any;
}

// 分页搜索实体参数
export interface entityPagingParams {
  content?: string;
  isAsc?: boolean;
  incubationBaseId?: number;
  type?: number;
  status?: number;
  limit: number;
  page: number;
}

// 分页搜索日志
export interface pagingSearchLog {
  content?: string;
  endTime?: string;
  startTime?: string;
  limit: number;
  page: number;
}

// 活动参数
export interface activityData {
  id?: number;
  introduction: string;
  latitude?: number;
  longitude?: number;
  activityTime: string;
  activityType: number;
  address: string;
  content: string;
  cover: number;
  fileIds: string;
  source?: number;
  title: string;
}

// 分页获取活动参数
export interface pagingActivityParams {
  activityType?: number;
  content?: string;
  limit: number;
  page: number;
}

// 区级数据
export interface areaAccountParams {
  id?: number;
  username: string;
  name: string;
  password?: string;
  phone?: string | null;
  email?: string | null;
  countyCode?: string | number | null;
  cityCode?: string | number | null;
  provinceCode?: string | number;
  [key: string]: any;
}

// 专家信息
export interface ExpertInfo {
  id?: number;
  areasOfExpertise?: string;
  education?: string;
  fileId?: number | string;
  gender?: string;
  graduatedMajor?: string;
  graduatedSchool?: string;
  guidanceWorkExperience?: string;
  idCard?: string;
  jobTitle?: string;
  jobs?: string;
  mentorType?: string;
  name?: string;
  political?: string;
  serviceAndHonors?: string;
  skillLevel?: string;
  workExperience?: string;
  workUnit?: string;
  weight?: number;
  [key: string]: any;
}

// 专家分页参数
export interface ExpertPaging {
  content?: string;
  limit: number;
  mentorType?: string;
  page: number;
}
