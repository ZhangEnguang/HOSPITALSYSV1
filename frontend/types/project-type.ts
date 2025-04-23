// 预算标准类型
export interface BudgetStandard {
  standard: string;
  startDate: string;
  endDate: string;
}

// 项目分类类型 (保持与后端实体一致)
export interface ProjectType {
  id: string;
  name: string;
  category?: string; // 保持可选
  code?: string; // 保持可选
  feeCode?: string; // 统一为 feeCode
  eduStatistics?: string; // 统一为 eduStatistics
  projectSource?: string;
  projectLevel?: string;
  paymentSource?: string;
  budgetControl?: boolean; // 统一为 budgetControl
  note?: string; // 添加 note
  parentId?: string;
  isUsed?: boolean;
  children?: ProjectType[];
  budgetStandards?: BudgetStandard[];
}

// 项目分类查询参数类型 (保持不变)
export interface ProjectTypeQueryParams {
  page: number;
  pageSize: number;
  name?: string;
  category?: string;
  parentId?: string;
}

// 项目分类表单数据类型 (匹配后端所需字段)
export interface ProjectTypeFormData {
  id?: string;
  name: string;
  category?: string;
  code?: string; // 添加 code
  feeCode?: string; // 使用 feeCode
  eduStatistics?: string; // 使用 eduStatistics
  projectSource?: string;
  projectLevel?: string;
  paymentSource?: string;
  budgetControl?: boolean; // 使用 budgetControl
  note?: string; // 添加 note
  parentId?: string;
  budgetStandards?: BudgetStandard[];
} 