import { get, post, del } from '../api';
import type { ApiResponse } from '../api';
import { PageResult } from '../types/common';

/**
 * 项目列表查询参数
 */
export interface ProjectQueryParams {
  // 当前页码
  current?: number;
  // 每页数量
  size?: number;
  // 项目名称，支持模糊查询
  name?: string;
  // 项目编号，支持模糊查询
  projectNumber?: string;
  // 项目类型：纵向项目、横向项目、校级项目
  type?: string;
  // 项目状态：规划中、进行中、已完成、已暂停、已取消
  status?: string;
  // 审核状态：待审核、已通过、已退回
  auditStatus?: string;
  // 负责人ID
  leaderId?: string;
  // 优先级：高、中、低
  priority?: string;
  // 开始日期范围-开始
  startDateFrom?: string;
  // 开始日期范围-结束
  startDateTo?: string;
  // 所属单位ID
  unitId?: string;
  // 排序字段
  orderBy?: string;
  // 排序方向：asc-升序，desc-降序
  orderDirection?: string;
}

/**
 * 项目数据类型
 */
export interface Project {
  // 项目ID
  id: string;
  // 项目名称
  name: string;
  // 项目编号
  projectNumber: string;
  // 项目描述
  description: string;
  // 项目类型：纵向项目、横向项目、校级项目
  type: string;
  // 项目状态：规划中、进行中、已完成、已暂停、已取消
  status: string;
  // 项目来源
  source: string;
  // 审核状态：待审核、已通过、已退回
  checkStatus: string;
  // 项目负责人ID
  leaderId: string;
  // 项目负责人姓名
  leaderName: string;
  // 项目负责人职称
  leaderTitle: string;
  // 项目负责人电话
  leaderPhone: string;
  // 项目负责人邮箱
  leaderEmail: string;
  // 项目负责人身份证号
  leaderIdCard: string;
  // 项目进度：0-100
  progress: number;
  // 总预算金额
  totalBudget: number;
  // 开始日期
  startDate: string;
  // 结束日期
  endDate: string;
  // 项目成员
  members: any[];
  // 优先级：高、中、低
  priority: string;
  // 所属单位
  unitId: string;
  // 创建时间
  createDate: string;
}

/**
 * 查询项目列表
 */
export async function getProjectList(params: ProjectQueryParams): Promise<PageResult<Project>> {
  const response = await post<ApiResponse<PageResult<Project>>>('/api/project/list', params);
  return response.data;
}

/**
 * 查询我负责的项目列表
 */
export async function getMyProjects(params: ProjectQueryParams): Promise<PageResult<Project>> {
  const response = await post<ApiResponse<PageResult<Project>>>('/api/project/my', params);
  return response.data;
}

/**
 * 根据ID查询项目详情
 */
export async function getProjectById(id: string): Promise<Project> {
  const response = await get<ApiResponse<Project>>(`/api/project/${id}`);
  return response.data;
}

/**
 * 删除项目
 * 
 * @param id 项目ID
 * @returns 删除结果
 */
export async function deleteProject(id: string) {
  return del(`/api/project/${id}`);
}

/**
 * 批量删除项目
 * 
 * @param ids 项目ID列表
 * @returns 删除结果
 */
export async function batchDeleteProjects(ids: string[]) {
  return post('/api/project/batch/delete', ids);
}