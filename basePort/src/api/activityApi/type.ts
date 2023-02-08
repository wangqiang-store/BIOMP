//分页获取活动中心列表
export interface pagingActivittyParams {
    page: number;
    limit: number;
    content?: string;
    activityType?: number | string;
}

// 活动数据
export interface activityData {
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
