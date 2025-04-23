// 定义通用的分页结果类型
export interface PageResult<T> {
  records: T[]; // 当前页数据列表 (与后端 PageResult.java 匹配)
  total: number;  // 总记录数
  // 可以根据后端返回结构添加其他字段，如 pages, current, size 等
  pages?: number; 
  current?: number;
  size?: number;
} 