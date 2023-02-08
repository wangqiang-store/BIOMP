// 基地表格数据
export interface HatchTableRow {
  name: string;
  acreage: string | number;
  address: string;
  principal: string;
  telephone: string;
  companyNum: string | number;
  level: number;
  status: number;
  createTime: string;
  [key: string]: any;
}

// 实体表格数据
export interface EntityTableRow {
  name: string;
  acreage: string | number;
  address: string;
  principal: string;
  telephone: string;
  companyNum: string | number;
  level: number;
  status: number;
  createTime: string;
  [key: string]: any;
}
