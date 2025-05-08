/**
 * 伦理项目数据适配器
 * 将伦理项目数据转换为通用详情页面组件所需格式
 */

interface EthicProject {
  id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  animalType?: string;
  animalCount?: string;
  ethicsCommittee: string;
  facilityUnit: string;
  leader: string | { name: string; title?: string; email?: string; phone?: string };
  source: string;
  projectNumber: string;
  priority: string;
  auditStatus: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  members: number;
  tasks: { completed: number; total: number };
  createDate?: string;
}

/**
 * 将伦理项目数据转换为详情页组件所需格式
 */
export function adaptEthicProjectForDetail(project: EthicProject) {
  // 处理leader信息，可能是字符串或对象
  const leaderName = typeof project.leader === 'string' 
    ? project.leader 
    : project.leader.name;
  
  const leaderTitle = typeof project.leader === 'object' && project.leader.title 
    ? project.leader.title 
    : '';
  
  const leaderEmail = typeof project.leader === 'object' && project.leader.email 
    ? project.leader.email 
    : '';
  
  const leaderPhone = typeof project.leader === 'object' && project.leader.phone 
    ? project.leader.phone 
    : '';

  return {
    id: project.id,
    title: project.name,
    description: project.description,
    status: project.status,
    auditStatus: project.auditStatus,
    priority: project.priority,
    source: project.source,
    progress: project.progress,
    dueDate: project.endDate,
    startDate: project.startDate,
    applicant: leaderName,
    leaderName: leaderName,
    leaderTitle: leaderTitle,
    leaderPhone: leaderPhone,
    leaderEmail: leaderEmail,
    totalBudget: project.budget,
    // 动物伦理项目特有字段
    animalType: project.animalType || '',
    animalCount: project.animalCount || '',
    ethicsCommittee: project.ethicsCommittee,
    facilityUnit: project.facilityUnit,
    projectNumber: project.projectNumber,
    members: project.members,
    tasks: project.tasks,
    type: project.type
  };
} 