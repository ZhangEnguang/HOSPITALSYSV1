// 投票选项类型
export type VoteOption = "agree" | "disagree" | "modify"

// 投票状态类型
export type VotingStatus = "未开始" | "进行中" | "已暂停" | "已完成" | "已结束"

// 投票详情接口
export interface VoteDetail {
  voterId: string
  voterName: string
  vote: VoteOption
  timestamp: string
  comment?: string
}

// 投票统计接口
export interface VoteStats {
  agree: number
  disagree: number
  modify: number
  total: number
}

// 会议参与者接口
export interface MeetingParticipant {
  id: string
  name: string
  role: string
  department: string
  email?: string
  phone?: string
  hasVoted: boolean
}

// 投票项目接口
export interface VotingProject {
  id: string
  title: string
  acceptanceNumber: string
  projectLeader: string
  department: string
  email?: string
  phone?: string
  type: string
  description?: string
  researchObjectives?: string[]
  ethicalConsiderations?: string[]
  votingStatus: VotingStatus
  votes: VoteStats
  voterDetails: VoteDetail[]
  finalResult?: "通过" | "不通过" | "需修改"
  passRate?: number
}

// 会议数据接口
export interface MeetingData {
  id: string
  meetingId: string
  title: string
  date: string
  time: string
  venue: string
  organizer: {
    name: string
    avatar?: string
  }
  committee: string
  participants: MeetingParticipant[]
  status: string
  votingStatus: VotingStatus
}

// 投票设置接口
export interface VotingSettings {
  isAnonymous: boolean
  allowChangeVote: boolean
  showRealTimeResults: boolean
  requireAllVotes: boolean
}

// 投票统计结果接口
export interface VotingResultStats {
  totalProjects: number
  totalVotes: number
  totalAgree: number
  totalDisagree: number
  totalModify: number
  passedProjects: number
  modifyProjects: number
  rejectedProjects: number
  averagePassRate: number
  participationRate: number
}

// 投票选项配置接口
export interface VoteOptionConfig {
  value: VoteOption
  label: string
  icon: React.ReactNode
  color: string
}

// 投票历史记录接口
export interface VotingHistory {
  id: string
  meetingId: string
  meetingTitle: string
  date: string
  totalProjects: number
  totalVotes: number
  participationRate: number
  results: {
    passed: number
    modified: number
    rejected: number
  }
}

// 投票通知接口
export interface VotingNotification {
  id: string
  type: "vote_started" | "vote_ended" | "vote_reminder" | "result_published"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  meetingId: string
  projectId?: string
}

// 投票权限接口
export interface VotingPermission {
  canVote: boolean
  canManageVoting: boolean
  canViewResults: boolean
  canExportResults: boolean
  reason?: string
}

// 导出报告配置接口
export interface ExportReportConfig {
  format: "pdf" | "excel" | "word"
  includeVoteDetails: boolean
  includeComments: boolean
  includeTimestamps: boolean
  includeParticipants: boolean
  language: "zh" | "en"
} 