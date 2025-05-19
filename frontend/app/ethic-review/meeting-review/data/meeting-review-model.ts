// 会议审查项目类型
export interface MeetingReviewProject {
  id: string;
  projectId?: string;
  name: string;
  description?: string;
  department?: string;
  status: string;
  projectType?: string;
  projectSubType?: string;
  reviewType: string;
  reviewResult?: string;
  submissionDate: string;
  meetingDate: string;
  completionDate?: string;
  dueDate?: string;
  createdAt: string;
  projectLeader?: {
    id: string;
    name: string;
    title?: string;
    department?: string;
    contactInfo?: string;
  };
  mainReviewers?: Expert[];
  reviewers?: Expert[];
  aiAnalysis?: AIAnalysis;
  files?: ProjectFile[];
  risks?: Risk[];
  expertOpinions?: ExpertOpinion[];
  advisorResponses?: AdvisorResponse[];
  aiSummary?: AISummary;
}

// 专家类型
export interface Expert {
  id: string;
  name: string;
  title?: string;
  department?: string;
  specialty?: string;
  expertise?: string[];
  contactInfo?: string;
}

// AI分析类型
export interface AIAnalysis {
  riskLevel: string;
  riskScore: number;
  aiConfidence: number;
  analysis: string;
  suggestions: string[];
  lastAnalyzed: string;
  aiModelName: string;
  aiModelVersion: string;
}

// 项目文件类型
export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  version?: string;
  description?: string;
  status?: string;
  url?: string;
}

// 风险项类型
export interface Risk {
  id: string;
  title: string;
  description: string;
  level: "high" | "medium" | "low";
  impact: string;
  probability: string;
  status: "已解决" | "进行中" | "未解决";
  solution?: string;
  date: string;
  category: string;
}

// 专家意见类型
export interface ExpertOpinion {
  id: string;
  expertId: string;
  expertName: string;
  department: string;
  title: string;
  date: string;
  opinion: string;
  detailedOpinion?: string;
  rating: number;
  result: string;
  category: string;
  specialty?: string;
  expertise?: string[];
  key_points?: string[];
  follow_up_questions?: string[];
  aiSummary?: string;
}

// 独立顾问回复类型
export interface AdvisorResponse {
  id: string;
  advisorId: string;
  advisorName: string;
  organization: string;
  title: string;
  date: string;
  responseType: string;
  question: string;
  response: string;
  expertise?: string[];
  recommendations?: string[];
}

// AI意见汇总类型
export interface AISummary {
  overallOpinion: string;
  keyPoints: string[];
  expertConsensus: string;
  recommendations: string;
  ethicalConsiderations: string;
  date: string;
  version: string;
}

// 数据适配器 - 将API响应转换为内部数据模型
export class MeetingReviewAdapter {
  // 将API响应转换为内部数据模型
  static fromApiResponse(apiData: any): MeetingReviewProject {
    return {
      id: apiData.id || '',
      projectId: apiData.projectId || `EC${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      name: apiData.name || apiData.title || '',
      description: apiData.description || '',
      department: apiData.department || '',
      status: apiData.status || '待审查',
      projectType: apiData.projectType || '人体研究',
      projectSubType: apiData.projectSubType || '',
      reviewType: apiData.reviewType || '会议审查',
      reviewResult: apiData.reviewResult || '待定',
      submissionDate: apiData.submissionDate || apiData.createdAt || new Date().toISOString().split('T')[0],
      meetingDate: apiData.meetingDate || '',
      completionDate: apiData.completionDate || '',
      dueDate: apiData.dueDate || '',
      createdAt: apiData.createdAt || new Date().toISOString(),
      projectLeader: apiData.projectLeader || null,
      mainReviewers: apiData.mainReviewers || [],
      reviewers: apiData.reviewers || [],
      aiAnalysis: apiData.aiAnalysis || null,
      files: apiData.files || [],
      risks: apiData.risks || [],
      expertOpinions: apiData.expertOpinions || [],
      advisorResponses: apiData.advisorResponses || [],
      aiSummary: apiData.aiSummary || null
    };
  }

  // 将内部数据模型转换为API请求
  static toApiRequest(project: MeetingReviewProject): any {
    return {
      id: project.id,
      projectId: project.projectId,
      name: project.name,
      description: project.description,
      department: project.department,
      status: project.status,
      projectType: project.projectType,
      projectSubType: project.projectSubType,
      reviewType: project.reviewType,
      reviewResult: project.reviewResult,
      submissionDate: project.submissionDate,
      meetingDate: project.meetingDate,
      completionDate: project.completionDate,
      dueDate: project.dueDate,
      createdAt: project.createdAt,
      projectLeader: project.projectLeader,
      mainReviewers: project.mainReviewers,
      reviewers: project.reviewers,
      // 不包含分析数据，这些通常由服务器生成
    };
  }

  // 创建新的会议审查项目
  static createNew(partialData: Partial<MeetingReviewProject> = {}): MeetingReviewProject {
    const now = new Date();
    const projectId = `EC${now.getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    return {
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      projectId: projectId,
      name: partialData.name || '',
      description: partialData.description || '',
      department: partialData.department || '',
      status: '待审查',
      projectType: partialData.projectType || '人体研究',
      projectSubType: partialData.projectSubType || '',
      reviewType: '会议审查',
      reviewResult: '待定',
      submissionDate: now.toISOString().split('T')[0],
      meetingDate: partialData.meetingDate || '',
      createdAt: now.toISOString(),
      ...partialData
    } as MeetingReviewProject;
  }
} 