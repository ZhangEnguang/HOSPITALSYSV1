import { de } from 'date-fns/locale';
import { get, post, put, del } from '../api';
import { Dict } from '@/types/dict';

// 项目类型
export type ProjectType = 'horizontal';

// 项目状态
export type ProjectStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

// 项目表单数据
export interface ProjectFormData {
  // 英文字段
  id?: string;
  name: string;
  projectNumber?: string;
  type: ProjectType;
  description?: string;
  level?: string;
  fundingSource?: string;
  leaderTitle?: string;
  leaderPhone?: string;
  leaderEmail?: string;
  leaderIdCard?: string;
  managerName?: string;
  managerPhone?: string;
  totalBudget?: number;
  progress?: number;
  priority?: string;
  contractNumber?: string;
  partnerCompany?: string;
  intellectualProperty?: string;
  confidentialityLevel?: string;
  members?: string[];
  budgets?: {
    category: string;
    amount: number;
    description?: string;
  }[];
  department?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  leader?: {
    name: string;
    title?: string;
    phone?: string;
    email?: string;
    idNumber?: string;
  };
  manager?: {
    name: string;
    phone?: string;
  };

  // 中文字段
  项目名称: string;
  批准号?: string;
  项目类型: string;
  项目描述?: string;
  项目级别?: string;
  经费来源?: string;
  职称?: string;
  联系电话?: string;
  电子邮箱?: string;
  身份证号?: string;
  项目经办人?: string;
  经办人电话?: string;
  预算金额?: string;
  合同编号?: string;
  合作企业?: string;
  知识产权归属?: string;
  保密等级?: string;
  团队成员?: string[];
  所属单位?: string;
  项目分类?: string;
  项目负责人?: string;
  开始日期?: string;
  结束日期?: string;
  项目状态?: string;
}

// 创建横向项目
export async function createHorizontalProject(data: ProjectFormData) {
  console.log('createHorizontalProject API 被调用，数据:', data);
  try {
    // 使用更完整的映射函数转换数据
    const apiData = mapFormDataToApiRequest(data);
    console.log('createHorizontalProject API 处理后的数据:', apiData);
    
    const result = await post('/api/project/horizontal', apiData);
    
    console.log('createHorizontalProject API 返回结果:', result);
    return result;
  } catch (error) {
    console.error('createHorizontalProject API 出错:', error);
    throw error;
  }
}

// 提交横向项目
export async function submitHorizontalProject(data: ProjectFormData) {
  console.log('submitHorizontalProject API 被调用，数据:', data);
  try {
    // 使用完整映射函数转换数据
    const apiData = mapFormDataToApiRequest(data);
    
    console.log('submitHorizontalProject API 处理后的数据:', apiData);
    
    const result = await post('/api/project/horizontal/submit', apiData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('submitHorizontalProject API 返回结果:', result);
    return result;
  } catch (error) {
    console.error('submitHorizontalProject API 出错:', error);
    throw error;
  }
}

// 更新横向项目
export async function updateHorizontalProject(id: string, data: ProjectFormData) {
  console.log('updateHorizontalProject API 被调用, ID:', id, '数据:', data);
  try {
    // 确保ID字段存在
    if (!data.id) {
      data.id = id;
    }
    
    // 使用完整映射函数
    const apiData = mapFormDataToApiRequest(data);
    console.log('updateHorizontalProject API 处理后的数据:', apiData);
    
    const result = await put(`/api/project/horizontal/${id}`, apiData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('updateHorizontalProject API 返回结果:', result);
    return result;
  } catch (error) {
    console.error('updateHorizontalProject API 出错:', error);
    throw error;
  }
}

// 删除横向项目
export async function deleteHorizontalProject(id: string) {
  return del(`/api/project/horizontal/${id}`);
}

// 获取横向项目详情
export async function getHorizontalProject(id: string) {
  return get(`/api/project/horizontal/${id}`);
}

// 获取横向项目列表
export async function getHorizontalProjects(params?: {
  name?: string;
  status?: string;
  auditStatus?: string;
  leaderId?: string;
  unitId?: string;
}) {
  return get('/api/project/horizontal', { params });
}

// 审核横向项目
export async function checkHorizontalProject(id: string, status: 'pass' | 'refuse', comment?: string) {
  return post(`/api/project/horizontal/${id}/check`, null, {
    params: {
      status,
      comment
    }
  });
}

// 字段映射函数
export function mapFormDataToHorizontalProject(formData: Record<string, any>): ProjectFormData {
  return {
    // 英文字段
    id: formData.id,
    name: formData.项目名称,
    projectNumber: formData.批准号,
    type: 'horizontal',
    description: formData.项目描述,
    level: formData.项目级别,
    fundingSource: formData.经费来源,
    leaderTitle: formData.职称,
    leaderPhone: formData.联系电话,
    leaderEmail: formData.电子邮箱,
    leaderIdCard: formData.身份证号,
    managerName: formData.项目经办人,
    managerPhone: formData.经办人电话,
    totalBudget: Array.isArray(formData.budgets)
      ? formData.budgets.reduce((sum, budget) => sum + (parseFloat(budget.amount) || 0), 0)
      : formData.预算金额
        ? parseFloat(formData.预算金额)
        : 0,
    progress: formData.progress || 0,
    priority: formData.priority || 'medium',
    contractNumber: formData.合同编号,
    partnerCompany: formData.合作企业,
    intellectualProperty: formData.知识产权归属,
    confidentialityLevel: formData.保密等级,
    members: formData.团队成员 || [],
    budgets: Array.isArray(formData.budgets) 
      ? formData.budgets.map(budget => ({
          category: budget.category,
          amount: parseFloat(budget.amount) || 0,
          description: budget.description || ''
        }))
      : formData.预算金额 
        ? [{
            category: '总预算',
            amount: parseFloat(formData.预算金额),
            description: '项目总预算'
          }] 
        : [],
    department: formData.所属单位,
    category: formData.项目分类,
    status: formData.项目状态,
    startDate: formData.开始日期 ? formData.开始日期.replace(/\//g, '-') : null,
    endDate: formData.结束日期 ? formData.结束日期.replace(/\//g, '-') : null,
    leader: {
      name: formData.项目负责人,
      title: formData.职称,
      phone: formData.联系电话,
      email: formData.电子邮箱,
      idNumber: formData.身份证号
    },
    manager: {
      name: formData.项目经办人,
      phone: formData.经办人电话
    },

    // 中文字段
    项目名称: formData.项目名称,
    批准号: formData.批准号,
    项目类型: 'horizontal',
    项目描述: formData.项目描述,
    项目级别: formData.项目级别,
    经费来源: formData.经费来源,
    职称: formData.职称,
    联系电话: formData.联系电话,
    电子邮箱: formData.电子邮箱,
    身份证号: formData.身份证号,
    项目经办人: formData.项目经办人,
    经办人电话: formData.经办人电话,
    预算金额: formData.预算金额,
    合同编号: formData.合同编号,
    合作企业: formData.合作企业,
    知识产权归属: formData.知识产权归属,
    保密等级: formData.保密等级,
    团队成员: formData.团队成员 || [],
    所属单位: formData.所属单位,
    项目分类: formData.项目分类,
    项目负责人: formData.项目负责人,
    开始日期: formData.开始日期,
    结束日期: formData.结束日期,
    项目状态: formData.项目状态
  }
}

// 创建一个专用于API请求的映射函数，包含所有需要的字段
export function mapFormDataToApiRequest(formData: Record<string, any>): Record<string, any> {
  const apiData: Record<string, any> = {
    // 基本信息 (ProjectVO基础字段)
    id: formData.id,
    name: formData.项目名称 || '',
    projectNumber: formData.批准号 || '',
    type: 'horizontal', // 固定为横向项目类型
    
    // 基本项目信息
    description: formData.项目描述 || '',
    category: formData.项目分类 || '',
    level: formData.项目级别 || '',
    status: formData.项目状态 || 'draft', // 默认为草稿状态
    fundingSource: formData.经费来源 || '',
    
    // 日期字段 - 保持原始的YYYY-MM-DD格式
    startDate: formData.开始日期 ? formData.开始日期.replace(/\//g, '-') : null,
    endDate: formData.结束日期 ? formData.结束日期.replace(/\//g, '-') : null,
    
    // 单位相关信息
    unitId: formData.所属单位 || '',
    
    // 项目负责人信息
    leaderId: formData.leaderId || '',
    leaderName: formData.项目负责人 || '',
    leaderTitle: formData.职称 || '',
    leaderPhone: formData.联系电话 || '',
    leaderEmail: formData.电子邮箱 || '',
    leaderIdCard: formData.身份证号 || '',
    
    // 项目经办人信息
    managerName: formData.项目经办人 || '',
    managerPhone: formData.经办人电话 || '',
    
    // 横向项目特有字段
    contractNumber: formData.合同编号 || '',
    partnerCompany: formData.合作企业 || '',
    intellectualProperty: formData.知识产权归属 || '',
    confidentialityLevel: formData.保密等级 || '普通',
    
    // 项目状态字段
    priority: formData.priority || 'medium',
    progress: formData.progress || 0,
    
    // 复杂对象 - 项目负责人
    leader: {
      userId: formData.leaderId || '',
      name: formData.项目负责人 || '',
      title: formData.职称 || '',
      phone: formData.联系电话 || '',
      email: formData.电子邮箱 || '',
      isLeader: 1 // 表示是负责人
    }
  };
  
  // 处理团队成员 - 修改这部分代码
  const members = Array.isArray(formData.团队成员) 
    ? formData.团队成员
      .filter((member: any) => {
        // 如果是字符串，检查是否为空
        if (typeof member === 'string') {
          return member && member.trim() !== '';
        }
        // 如果是对象，检查name属性是否为空
        return member && member.name && typeof member.name === 'string' && member.name.trim() !== '';
      })
      .map((member: any, index: number) => {
        // 如果是字符串类型的成员，转换为对象
        if (typeof member === 'string') {
          return {
            name: member.trim(),
            role: '', // 默认角色为空
            title: '', // 职称
            email: '', // 电子邮箱
            phone: '',
            unit: '',
            orderId: (index + 1).toString(), // 添加排序字段
            isLeader: 0 // 默认非负责人
          };
        }
        
        // 保留成员对象中的所有字段，不进行替换
        // 确保关键字段存在，其他字段保持原样
        return {
          ...member, // 保留所有原始字段
          name: member.name.trim(),
          role: member.role || '',
          unit: member.unit || '',
          title: member.title || '', 
          email: member.email || '',
          phone: member.phone || '',
          orderId: member.orderId || (index + 1).toString(),
          isLeader: 0 // 默认非负责人
        };
      })
    : [];
  
  apiData.members = members;
  
  // 处理预算明细
  apiData.budgets = Array.isArray(formData.budgets) 
    ? formData.budgets
        .filter(budget => budget.category && (parseFloat(budget.amount) > 0)) // 过滤掉不完整或金额为0的预算项
        .map((budget, index) => ({
          id: budget.id || null,
          projectId: formData.id || null,
          category: budget.category,
          amount: parseFloat(budget.amount) || 0,
          description: budget.description || '',
          orderId: budget.orderId || (index + 1).toString() // 添加排序字段
        }))
    : formData.预算金额
      ? [{
          id: null,
          projectId: formData.id || null,
          category: '总预算',
          amount: parseFloat(formData.预算金额),
          description: '项目总预算',
          orderId: "1" // 默认排序为1
        }]
      : [],

  // 计算总预算 - 只基于有效的预算项计算
  apiData.totalBudget = Array.isArray(formData.budgets)
    ? formData.budgets
        .filter(budget => budget.category && (parseFloat(budget.amount) > 0))
        .reduce((total: number, budget: any) => 
          total + (parseFloat(budget.amount) || 0), 0)
    : parseFloat(formData.预算金额) || 0;
  
  console.log('最终API请求数据:', apiData);
  return apiData;
}

// 反向映射函数
export function mapHorizontalProjectToFormData(project: any): Record<string, any> {
  // 如果项目对象不存在或为空，返回空对象
  if (!project) return {};
  
  const formData: Record<string, any> = {
    id: project.id,
    项目名称: project.name,
    批准号: project.projectNumber,
    项目类型: '横向',
    项目描述: project.description,
    项目级别: project.level,
    经费来源: project.fundingSource,
    职称: project.leaderTitle,
    联系电话: project.leaderPhone,
    电子邮箱: project.leaderEmail,
    身份证号: project.leaderIdCard,
    项目经办人: project.managerName,
    经办人电话: project.managerPhone,
    预算金额: project.totalBudget?.toString(),
    合同编号: project.contractNumber,
    合作企业: project.partnerCompany,
    知识产权归属: project.intellectualProperty,
    保密等级: project.confidentialityLevel,
    项目状态: project.status,
    所属单位: project.unitId,
    项目分类: project.category,
    开始日期: project.startDate ? project.startDate.replace(/-/g, '/') : '',
    结束日期: project.endDate ? project.endDate.replace(/-/g, '/') : '',
  };
  
  // 处理团队成员 - 如果是对象数组，提取名称
  if (Array.isArray(project.members)) {
    if (project.members.length > 0 && typeof project.members[0] === 'object') {
      // 对象数组情况 - 保留所有字段，不仅是名称
      formData.团队成员 = project.members.map((member: any) => ({
        name: member.name || '',
        role: member.role || '',
        unit: member.unit || '',
        title: member.title || '',
        email: member.email || '',
        phone: member.phone || '',
        orderId: member.orderId || '',
        isLeader: member.isLeader || 0,
        // 保留其他可能存在的字段
        ...member
      }));
    } else {
      // 字符串数组情况 - 转换为对象数组
      formData.团队成员 = project.members.map((memberName: string, index: number) => ({
        name: memberName || '',
        role: '',
        unit: '',
        title: '',
        email: '',
        phone: '',
        orderId: (index + 1).toString(),
        isLeader: index === 0 ? 1 : 0
      }));
    }
  } else {
    formData.团队成员 = [];
  }
  // 处理预算明细
  if (Array.isArray(project.budgets) && project.budgets.length > 0) {
    // 转换预算明细数据结构
    formData.budgets = project.budgets.map((budget: any) => ({
      id: budget.id || null,
      category: budget.category || '其他',
      amount: budget.amount || 0,
      description: budget.description || ''
    }));
    
    // 确保总预算与预算明细一致
    const totalBudget = project.budgets.reduce((sum: number, budget: any) => 
      sum + (parseFloat(budget.amount) || 0), 0);
    
    // 设置预算金额字段
    formData.预算金额 = totalBudget.toString();
    
    console.log('从API响应中提取的预算明细:', formData.budgets);
  } else if (project.totalBudget) {
    // 如果没有预算明细但有总预算，创建一个默认的预算明细
    formData.budgets = [{
      category: '总预算',
      amount: parseFloat(project.totalBudget),
      description: '项目总预算'
    }];
    
    formData.预算金额 = project.totalBudget.toString();
  }
  
  // 处理负责人信息
  if (project.leader) {
    formData.项目负责人 = project.leader.name;
    
    // 只在尚未设置的情况下，从leader对象获取详细信息
    if (!formData.职称 && project.leader.title) formData.职称 = project.leader.title;
    if (!formData.联系电话 && project.leader.phone) formData.联系电话 = project.leader.phone;
    if (!formData.电子邮箱 && project.leader.email) formData.电子邮箱 = project.leader.email;
    if (!formData.身份证号 && project.leader.idNumber) formData.身份证号 = project.leader.idNumber;
  } else {
    // 如果leader对象不存在，尝试直接使用leaderName字段
    formData.项目负责人 = project.leaderName || '';
  }
  
  // 处理经办人信息
  if (project.manager) {
    if (!formData.项目经办人) formData.项目经办人 = project.manager.name;
    if (!formData.经办人电话 && project.manager.phone) formData.经办人电话 = project.manager.phone;
  }
  
  return formData;
} 