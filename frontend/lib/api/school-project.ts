import { get, post, put, del } from '../api';

// 项目类型
export type ProjectType = 'school';

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

// 创建校级项目
export async function createSchoolProject(data: ProjectFormData) {
  console.log('createSchoolProject API 被调用，数据:', data);
  try {
    // 使用更完整的映射函数转换数据
    const apiData = mapFormDataToApiRequest(data);
    console.log('createSchoolProject API 处理后的数据:', apiData);
    
    const result = await post('/api/project/school', apiData);
    
    console.log('createSchoolProject API 返回结果:', result);
    return result;
  } catch (error) {
    console.error('createSchoolProject API 出错:', error);
    throw error;
  }
}

// 提交校级项目
export async function submitSchoolProject(data: ProjectFormData) {
  console.log('submitSchoolProject API 被调用，数据:', data);
  try {
    // 使用完整映射函数转换数据
    const apiData = mapFormDataToApiRequest(data);
    // 设置状态为"已提交"
    apiData.status = 'submitted';
    apiData.checkStatus = '已提交';
    
    console.log('submitSchoolProject API 处理后的数据:', apiData);
    
    const result = await post('/api/project/school/submit', apiData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('submitSchoolProject API 返回结果:', result);
    return result;
  } catch (error) {
    console.error('submitSchoolProject API 出错:', error);
    throw error;
  }
}

// 更新校级项目
export async function updateSchoolProject(id: string, data: ProjectFormData) {
  console.log('updateSchoolProject API 被调用, ID:', id, '数据:', data);
  try {
    // 确保ID字段存在
    if (!data.id) {
      data.id = id;
    }
    
    // 使用完整映射函数
    const apiData = mapFormDataToApiRequest(data);
    console.log('updateSchoolProject API 处理后的数据:', apiData);
    
    const result = await put(`/api/project/school/${id}`, apiData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('updateSchoolProject API 返回结果:', result);
    return result;
  } catch (error) {
    console.error('updateSchoolProject API 出错:', error);
    throw error;
  }
}

// 删除校级项目
export async function deleteSchoolProject(id: string) {
  return del(`/api/project/school/${id}`);
}

// 获取校级项目详情
export async function getSchoolProject(id: string) {
  return get(`/api/project/school/${id}`);
}

// 获取校级项目列表
export async function getSchoolProjects(params?: {
  name?: string;
  status?: string;
  auditStatus?: string;
  leaderId?: string;
  unitId?: string;
}) {
  return get('/api/project/school', { params });
}

// 审核校级项目
export async function checkSchoolProject(id: string, status: 'pass' | 'refuse', comment?: string) {
  return post(`/api/project/school/${id}/check`, null, {
    params: {
      status,
      comment
    }
  });
}

// 字段映射函数 - 表单数据到校级项目对象
export function mapFormDataToSchoolProject(formData: Record<string, any>): ProjectFormData {
  return {
    // 英文字段
    id: formData.id,
    name: formData.项目名称,
    projectNumber: formData.批准号,
    type: 'school',
    description: formData.项目描述,
    level: formData.项目级别,
    fundingSource: formData.经费来源,
    leaderTitle: formData.职称,
    leaderPhone: formData.联系电话,
    leaderEmail: formData.电子邮箱,
    leaderIdCard: formData.身份证号,
    managerName: formData.项目经办人,
    managerPhone: formData.经办人电话,
    totalBudget: formData.预算金额 ? parseFloat(formData.预算金额) : undefined,
    contractNumber: formData.合同编号,
    partnerCompany: formData.合作企业,
    intellectualProperty: formData.知识产权归属,
    confidentialityLevel: formData.保密等级,
    members: formData.团队成员 || [],
    budgets: formData.预算金额 ? [{
      category: '总预算',
      amount: parseFloat(formData.预算金额),
      description: '项目总预算'
    }] : [],
    department: formData.所属单位,
    category: formData.项目分类,
    status: formData.项目状态,
    startDate: formData.开始日期,
    endDate: formData.结束日期,
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
    项目类型: '校级',
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
  };
}

// 字段映射函数 - 表单数据到API请求数据
export function mapFormDataToApiRequest(formData: Record<string, any>): Record<string, any> {
  return {
    id: formData.id,
    name: formData.项目名称,
    projectNumber: formData.批准号,
    type: 'school',
    description: formData.项目描述,
    level: formData.项目级别,
    fundingSource: formData.经费来源,
    status: formData.项目状态 || 'draft',
    startDate: formData.开始日期,
    endDate: formData.结束日期,
    leader: {
      name: formData.项目负责人,
      title: formData.职称,
      phone: formData.联系电话,
      email: formData.电子邮箱,
      idNumber: formData.身份证号,
    },
    manager: {
      name: formData.项目经办人,
      phone: formData.经办人电话,
    },
    members: Array.isArray(formData.团队成员) ? formData.团队成员.filter((m: string) => m.trim() !== '') : [],
    budget: formData.预算金额 ? parseFloat(formData.预算金额) : 0,
    department: formData.所属单位,
    category: formData.项目分类,
    contractNumber: formData.合同编号,
    partnerCompany: formData.合作企业,
    intellectualProperty: formData.知识产权归属,
    confidentialityLevel: formData.保密等级,
  };
}

// 字段映射函数 - API返回的项目数据到表单数据
export function mapSchoolProjectToFormData(project: any): Record<string, any> {
  if (!project) {
    console.error('mapSchoolProjectToFormData 接收到空项目数据');
    return {
      项目名称: '',
      项目类型: '校级',
    };
  }

  try {
    console.log('mapSchoolProjectToFormData - 原始数据:', project);

    // 提取团队成员（确保处理各种可能的格式）
    let members: string[] = [];
    if (project.members) {
      if (Array.isArray(project.members)) {
        members = project.members.map((m: any) => {
          if (typeof m === 'object' && m.name) {
            return m.name;
          }
          return String(m);
        }).filter(Boolean);
      } else if (typeof project.members === 'string') {
        members = project.members.split(',').map((m: string) => m.trim()).filter(Boolean);
      }
    }

    // 确保至少有一个空成员（用于表单）
    if (members.length === 0) {
      members = [''];
    }

    // 构建表单数据对象
    const formData = {
      id: project.id?.toString(),
      批准号: project.projectNumber || '',
      项目名称: project.name || '',
      项目描述: project.description || '',
      项目类型: '校级',
      项目级别: project.level || '',
      经费来源: project.fundingSource || '',
      项目状态: project.status || 'draft',
      开始日期: project.startDate || '',
      结束日期: project.endDate || '',
      项目负责人: project.leader?.name || '',
      职称: project.leader?.title || '',
      联系电话: project.leader?.phone || '',
      电子邮箱: project.leader?.email || '',
      身份证号: project.leader?.idNumber || '',
      项目经办人: project.manager?.name || '',
      经办人电话: project.manager?.phone || '',
      团队成员: members,
      预算金额: project.budget?.toString() || '',
      所属单位: project.department || '',
      项目分类: project.category || '',
      合同编号: project.contractNumber || '',
      合作企业: project.partnerCompany || '',
      知识产权归属: project.intellectualProperty || '',
      保密等级: project.confidentialityLevel || '',
    };

    console.log('mapSchoolProjectToFormData - 格式化后的表单数据:', formData);
    return formData;
  } catch (error) {
    console.error('mapSchoolProjectToFormData 处理出错:', error);
    return {
      项目名称: project.name || '',
      项目类型: '校级',
    };
  }
} 