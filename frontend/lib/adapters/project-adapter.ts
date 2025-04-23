/**
 * 项目数据适配器
 * 将后端API返回的数据转换为前端组件所需的格式
 */

import { Project } from "../api/project";

/**
 * 将API返回的项目数据转换为项目列表组件所需格式
 */
export function adaptProjectForList(project: Project) {
  // 处理成员数量 - 支持多种可能的数据结构
  let membersCount = 0;
  if (typeof project.members === 'number') {
    // 如果members直接是一个数字
    membersCount = project.members;
  } else if (Array.isArray(project.members)) {
    // 如果members是数组
    membersCount = project.members.length;
  } else if (project.members && typeof project.members === 'object' && 'length' in project.members) {
    // 如果members是类数组对象
    membersCount = (project.members as any).length;
  }

  return {
    id: project.id,
    name: project.name,
    projectNumber: project.projectNumber,
    description: project.description,
    type: project.type,
    source: project.source,
    status: project.status,
    // 将checkStatus映射为auditStatus
    auditStatus: project.checkStatus,
    // 构造leader对象
    leader: {
      id: project.leaderId,
      name: project.leaderName,
      title: project.leaderTitle,
      phone: project.leaderPhone,
      email: project.leaderEmail
    },
    progress: project.progress,
    // 将totalBudget映射为budget
    budget: project.totalBudget,
    startDate: project.startDate,
    endDate: project.endDate,
    // 使用处理后的成员数量
    members: membersCount,
    priority: project.priority,
    // 构造tasks对象
    tasks: {
      completed: 0, // 默认值，实际应从任务数据中获取
      total: 0 // 默认值，实际应从任务数据中获取
    },
    unitId: project.unitId,
    createTime: project.createDate
  };
}

/**
 * 将API返回的项目数据转换为项目详情组件所需格式
 */
export function adaptProjectForDetail(project: Project) {
  return {
    id: project.id,
    title: project.name,
    description: project.description,
    status: project.status,
    auditStatus: project.checkStatus,
    priority: project.priority,
    source: project.source,
    progress: project.progress,
    dueDate: project.endDate,
    applicant: project.leaderName,
    leaderName: project.leaderName,
    leaderTitle: project.leaderTitle,
    leaderPhone: project.leaderPhone,
    leaderEmail: project.leaderEmail,
    totalBudget: project.totalBudget
  };
}