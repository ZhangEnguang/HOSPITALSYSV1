import { get, post, put, del } from '@/lib/api';
import { ProjectType, ProjectTypeQueryParams, ProjectTypeFormData } from '@/types/project-type';
import { PageResult } from '@/types/page';

/**
 * 项目分类API
 * 使用全局API工具类实现，统一API调用方式
 */

// 获取项目分类列表
export async function getProjectTypeList(params: ProjectTypeQueryParams): Promise<PageResult<ProjectType>> {
  // 将ProjectTypeQueryParams转换为Record<string, string | number | boolean | undefined | null>
  const queryParams: Record<string, string | number | boolean | undefined | null> = {
    page: params.page,
    pageSize: params.pageSize,
    name: params.name,
    category: params.category
  };
  
  return get<PageResult<ProjectType>>('/api/project/projectType/list', { params: queryParams });
}

// 获取项目分类详情
export async function getProjectTypeById(id: string): Promise<ProjectType> {
  return get<ProjectType>(`/api/project/projectType/detail/${id}`);
}

// 创建项目分类
export async function createProjectType(data: ProjectTypeFormData): Promise<boolean> {
  return post<boolean>('/api/project/projectType/add', data);
}

// 更新项目分类
export async function updateProjectType(data: ProjectTypeFormData): Promise<boolean> {
  return put<boolean>('/api/project/projectType/update', data);
}

// 删除项目分类
export async function deleteProjectType(id: string): Promise<boolean> {
  return del<boolean>(`/api/project/projectType/delete/${id}`);
}

// 获取子分类列表
export async function getProjectTypeByParentId(parentId: string): Promise<ProjectType[]> {
  return get<ProjectType[]>(`/api/project/projectType/sub/${parentId}`);
}

/**
 * 生成项目分类编号
 * 根据项目类别和父级ID自动生成编号
 * 规则：
 * - 纵向项目: ZX开头
 * - 横向项目: YF开头
 * - 校级项目: XJ开头
 * - 父级从01开始，子类为0101等
 * 
 * @param category 项目类别
 * @param parentId 父级ID（可选）
 * @returns 生成的项目编号
 */
export async function generateProjectTypeCode(category: string, parentId?: string): Promise<string> {
  const params: Record<string, string | undefined> = {
    category,
    parentId
  };
  
  return get<string>('/api/project/projectType/generateCode', { params });
} 