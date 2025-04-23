// 字典数据项
export interface DictData {
  id?: number;
  dictCode: string;
  dictLabel: string;
  dictValue: string;
  dictSort?: number;
  status: string;
  parentValue?: string;
  relatedValue?: string;
  remark?: string;
}

// 字典主表
export interface Dict {
  id?: number;
  dictName: string;
  dictCode: string;
  dictSort?: number;
  status: string;
  dictSource: string;
  tableName?: string;
  codeField?: string;
  nameField?: string;
  sortSql?: string;
  cascadeField?: string;
  relatedField?: string;
  remark?: string;
  dictDataList?: DictData[];
}

// 字典来源类型
export const DictSourceTypes = {
  CUSTOM: '0',    // 自定义
  JAVA: '1',      // Java代码
  TABLE: '2'      // 业务表
} as const;

// 状态类型
export const StatusTypes = {
  NORMAL: '0',    // 正常
  DISABLED: '1'   // 停用
} as const; 
/**
 * 字典数据项类型
 */
export interface DictDataDTO {
  id?: number;
  dictCode: string;
  dictLabel: string;
  dictValue: string;
  dictSort?: number;
  status?: string;
  parentValue?: string;
  relatedValue?: string;
  remark?: string;
  color?: string; // 用于前端展示的颜色属性
}

/**
 * 字典类型
 */
export interface DictDTO {
  id?: number;
  dictName: string;
  dictCode: string;
  dictSort?: number;
  status?: string;
  dictSource?: string;
  tableName?: string;
  codeField?: string;
  nameField?: string;
  sortSql?: string;
  cascadeField?: string;
  relatedField?: string;
  remark?: string;
  dictDataList?: DictDataDTO[];
}

/**
 * 字典缓存项类型
 */
export interface DictCacheItem {
  data: DictDataDTO[];
  timestamp: number;
}

export interface DictItem {
  dictCode: string;
  dictLabel: string;
  dictValue: string;
  cacheable: number;      // 1: 可缓存, 0: 不可缓存
  cacheExpireTime: number; // 缓存过期时间（小时）
} 