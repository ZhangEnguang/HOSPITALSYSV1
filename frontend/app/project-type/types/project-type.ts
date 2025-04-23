// frontend/app/project-type/types/project-type.ts

// 项目分类基础类型
export interface ProjectType {
  id: string;
  name: string;
  category?: string;
  code?: string;
  financialCode?: string;
  educationStatistics?: string;
  projectSource?: string;
  projectLevel?: string;
  paymentSource?: string;
  isBudgetControl?: boolean;
  parentId?: string;
  // 可以根据后端实体类添加更多字段
}

// 项目分类查询参数类型
export interface ProjectTypeQueryParams {
  pageNum: number;
  pageSize: number;
  name?: string; // 示例：按名称查询
  category?: string; // 示例：按类别查询
  // 可以根据需要添加更多查询参数
}

// 项目分类表单数据类型 (用于创建/更新)
export type ProjectTypeFormData = Omit<ProjectType, 'id'>; // 通常不需要 id 