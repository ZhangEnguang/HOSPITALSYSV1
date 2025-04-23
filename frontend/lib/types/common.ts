/**
 * 分页结果类型
 */
export interface PageResult<T> {
  // 总记录数
  total: number;
  // 当前页数据
  records: T[];
  // 总页数
  pages: number;
  // 当前页码
  current: number;
  // 每页记录数
  size: number;
} 