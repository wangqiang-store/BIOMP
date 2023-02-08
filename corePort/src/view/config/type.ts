export interface CoreTableRow {
  id?: number;
  username: string;
  name: string;
  phone?: string;
  email?: string;
  isEnable?: boolean;
  createName?: string;
  createTime?: string;
  [key: string]: any;
}

export interface BaseTableRow extends CoreTableRow {
  incubationBaseId: number | null;
}

export interface ReginalTableRow extends CoreTableRow {
  reginal?: string;
  countyCode?: string | number | null;
  cityCode?: string | number | null;
  provinceCode?: string | number;
}

export interface LogTableRow {
  id?: number;
  username: string;
  operation: string;
  createTime: string;
  ip: string;
}
