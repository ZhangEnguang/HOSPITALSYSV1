// 预算科目类型
export interface BudgetSubject {
  id?: string;
  budgetStandardId?: string;
  code?: string;
  name: string;
  adjustmentLimit?: string;
  description?: string;
  parentId?: string;
  children?: BudgetSubject[];
}

// 预算标准类型
export interface BudgetStandard {
  id: string;
  name: string;
  projectClass: string;
  prefix?: string;
  indirectCost?: string;
  note?: string;
  createUserId?: string;
  createUserName?: string;
  createDate?: string;
  lastEditUserId?: string;
  lastEditUserName?: string;
  lastEditDate?: string;
  budgetSubjects?: BudgetSubject[];
}

// 预算标准查询参数类型
export interface BudgetStandardQueryParams {
  page: number;
  pageSize: number;
  name?: string;
  projectClass?: string;
}

// 预算标准表单数据类型
export interface BudgetStandardFormData {
  id?: string;
  name: string;
  projectClass: string;
  prefix?: string;
  indirectCost?: string;
  note?: string;
  budgetSubjects?: BudgetSubject[];
}

// 预算标准表单数据类型
export interface BudgetStandardFormData {
  id?: string;
  name: string;
  projectClass: string;
  prefix?: string;
  indirectCost?: string;
  note?: string;
  budgetSubjects?: BudgetSubject[];
}
 