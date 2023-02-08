export interface userStoreState {
  userInfo: {
    id?: number | undefined;
    roleId?: number | undefined;
    [key: string]: any;
  };
}

export interface useModuleStoreState {
  currmentUserId: Array<number>;
}

interface baseLevelType {
  status?: number;
  statusName?: string;
}

export interface baseListType {
  name: string;
  id: number;
}

export interface entityListType {
  name: string;
  id: number;
}

export interface useCommonStoreState {
  baseLevel: Array<baseLevelType>;
  baseStatus: [];
  baseOwnership: [];
  baseType: [];
  runBaseList: Array<baseListType> | null;
  allBaseList: Array<baseListType> | null;
  runEntityList: Array<entityListType> | null;
  allProvinceList: Array<{ code: number; name: string }>;
  entityType: [];
  entityStatus: [];
  activityType: [];
  mentorType: [];
  notifyType: Array<{ status: number; statusName: string }>;
  genderType: [];
  allCountylist: Array<{ status: number; statusName: string }>;
}
