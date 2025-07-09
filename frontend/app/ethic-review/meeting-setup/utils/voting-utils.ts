import { VoteOption, VotingProject, VoteStats, MeetingParticipant, VotingResultStats } from "../types/voting"

/**
 * 计算投票通过率
 * @param votes 投票统计
 * @returns 通过率百分比
 */
export const calculatePassRate = (votes: VoteStats): number => {
  if (votes.total === 0) return 0
  return (votes.agree / votes.total) * 100
}

/**
 * 获取投票状态颜色类名
 * @param status 投票状态
 * @returns CSS类名字符串
 */
export const getVotingStatusColor = (status: string): string => {
  const colors = {
    "未开始": "bg-gray-100 text-gray-700 border-gray-300",
    "进行中": "bg-blue-100 text-blue-700 border-blue-300",
    "已暂停": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "已完成": "bg-green-100 text-green-700 border-green-300",
    "已结束": "bg-red-100 text-red-700 border-red-300"
  }
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-300"
}

/**
 * 获取投票选项颜色
 * @param vote 投票选项
 * @returns CSS类名字符串
 */
export const getVoteColor = (vote: VoteOption): string => {
  const colors = {
    "agree": "text-green-600",
    "disagree": "text-red-600",
    "modify": "text-amber-600"
  }
  return colors[vote] || "text-gray-600"
}

/**
 * 获取投票选项标签
 * @param vote 投票选项
 * @returns 标签文本
 */
export const getVoteLabel = (vote: VoteOption): string => {
  const labels = {
    "agree": "同意",
    "disagree": "不同意",
    "modify": "需要修改"
  }
  return labels[vote] || "未知"
}

/**
 * 获取最终结果颜色
 * @param result 最终结果
 * @returns CSS类名字符串
 */
export const getResultColor = (result: string): string => {
  const colors = {
    "通过": "bg-green-50 text-green-700 border-green-200",
    "需修改": "bg-amber-50 text-amber-700 border-amber-200",
    "不通过": "bg-red-50 text-red-700 border-red-200"
  }
  return colors[result as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
}

/**
 * 计算项目投票进度
 * @param project 投票项目
 * @param totalParticipants 总参与者数量
 * @returns 进度百分比
 */
export const calculateProjectProgress = (project: VotingProject, totalParticipants: number): number => {
  if (totalParticipants === 0) return 0
  return (project.votes.total / totalParticipants) * 100
}

/**
 * 计算总体投票统计
 * @param projects 投票项目列表
 * @param participants 参与者列表
 * @returns 总体统计结果
 */
export const calculateOverallStats = (projects: VotingProject[], participants: MeetingParticipant[]): VotingResultStats => {
  const totalProjects = projects.length
  const totalVotes = projects.reduce((sum, project) => sum + project.votes.total, 0)
  const totalAgree = projects.reduce((sum, project) => sum + project.votes.agree, 0)
  const totalDisagree = projects.reduce((sum, project) => sum + project.votes.disagree, 0)
  const totalModify = projects.reduce((sum, project) => sum + project.votes.modify, 0)
  
  const passedProjects = projects.filter(p => p.finalResult === "通过").length
  const modifyProjects = projects.filter(p => p.finalResult === "需修改").length
  const rejectedProjects = projects.filter(p => p.finalResult === "不通过").length
  
  const averagePassRate = totalProjects > 0 ? 
    projects.reduce((sum, project) => sum + calculatePassRate(project.votes), 0) / totalProjects : 0
  
  const participationRate = participants.length > 0 ? 
    (participants.filter(p => p.hasVoted).length / participants.length) * 100 : 0

  return {
    totalProjects,
    totalVotes,
    totalAgree,
    totalDisagree,
    totalModify,
    passedProjects,
    modifyProjects,
    rejectedProjects,
    averagePassRate,
    participationRate
  }
}

/**
 * 计算总体投票进度
 * @param projects 投票项目列表
 * @returns 进度百分比
 */
export const calculateOverallProgress = (projects: VotingProject[]): number => {
  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.votingStatus === "已完成").length
  return totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
}

/**
 * 检查用户是否已投票
 * @param project 投票项目
 * @param userId 用户ID
 * @returns 是否已投票
 */
export const hasUserVoted = (project: VotingProject, userId: string): boolean => {
  return project.voterDetails.some(v => v.voterId === userId)
}

/**
 * 获取用户的投票详情
 * @param project 投票项目
 * @param userId 用户ID
 * @returns 投票详情或undefined
 */
export const getUserVoteDetail = (project: VotingProject, userId: string) => {
  return project.voterDetails.find(v => v.voterId === userId)
}

/**
 * 验证投票权限
 * @param userId 用户ID
 * @param participants 参与者列表
 * @returns 是否有投票权限
 */
export const canUserVote = (userId: string, participants: MeetingParticipant[]): boolean => {
  return participants.some(p => p.id === userId)
}

/**
 * 格式化投票时间
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串
 */
export const formatVoteTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 生成投票报告数据
 * @param meetingData 会议数据
 * @param projects 投票项目列表
 * @returns 报告数据对象
 */
export const generateVotingReport = (meetingData: any, projects: VotingProject[]) => {
  const stats = calculateOverallStats(projects, meetingData.participants)
  
  return {
    meeting: {
      id: meetingData.meetingId,
      title: meetingData.title,
      date: meetingData.date,
      venue: meetingData.venue,
      organizer: meetingData.organizer.name,
      committee: meetingData.committee,
      participants: meetingData.participants.length
    },
    summary: stats,
    projects: projects.map(project => ({
      id: project.acceptanceNumber,
      title: project.title,
      leader: project.projectLeader,
      department: project.department,
      votes: project.votes,
      result: project.finalResult,
      passRate: calculatePassRate(project.votes)
    })),
    timestamp: new Date().toISOString()
  }
}

/**
 * 计算投票趋势
 * @param projects 投票项目列表
 * @returns 趋势数据
 */
export const calculateVotingTrends = (projects: VotingProject[]) => {
  const trends = projects.map((project, index) => ({
    projectIndex: index + 1,
    projectName: project.title,
    passRate: calculatePassRate(project.votes),
    totalVotes: project.votes.total,
    timestamp: project.voterDetails[0]?.timestamp || new Date().toISOString()
  }))
  
  return trends.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

/**
 * 检查投票是否完成
 * @param project 投票项目
 * @param requiredVotes 所需投票数
 * @returns 是否完成
 */
export const isVotingComplete = (project: VotingProject, requiredVotes: number): boolean => {
  return project.votes.total >= requiredVotes
}

/**
 * 获取投票建议
 * @param votes 投票统计
 * @returns 建议文本
 */
export const getVotingSuggestion = (votes: VoteStats): string => {
  const passRate = calculatePassRate(votes)
  
  if (passRate >= 70) {
    return "建议通过"
  } else if (passRate >= 40) {
    return "建议修改后重新审查"
  } else {
    return "建议不通过"
  }
} 