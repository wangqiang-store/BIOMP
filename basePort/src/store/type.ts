import { CustomType } from "@/types"

export interface userStoreState {
  baseUserInfo: CustomType,
  isCollapse: boolean,
  menuActivePath: string,
  twoMenuActivePath: string,
  companyId: number | string,
  activityId: number | string,
  baseTypeList: Array<any>,
  baseStatusList: Array<any>,
  basesLevelList: Array<any>,
  activityTypeList: Array<any>,
  entityTypeList: Array<any>,
  incubationStatusList: Array<any>,
  baseOwnershipList: Array<any>,
  mentorTypeList: Array<any>,
  notifyTypeList: Array<any>,
}

export interface useModuleStoreState {
  currmentUserId: Array<number>;
}
