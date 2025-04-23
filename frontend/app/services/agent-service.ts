import type { Agent, UserRole } from "@/app/types/ai-assistant-types"

// 获取智能体数据
export const getAgentsByRole = (userRole: UserRole): Agent[] => {
  // 系统管理员智能体
  const adminAgents: Agent[] = [
    {
      id: "1",
      title: "权限管理助手",
      description: "快速配置用户权限，批量处理权限申请",
      icon: "🔐",
      type: "专用型",
      tags: ["新用户入职", "权限变更"],
      isFavorite: true,
      useFrequency: 87,
      addedDate: new Date(2023, 10, 15),
    },
    {
      id: "2",
      title: "系统日志分析Agent",
      description: "自动分析系统日志，检测异常行为",
      icon: "📊",
      type: "专用型",
      tags: ["安全审计", "故障排查"],
      useFrequency: 65,
      addedDate: new Date(2023, 11, 20),
    },
    {
      id: "3",
      title: "数据备份机器人",
      description: "定时备份关键数据，确保数据安全",
      icon: "💾",
      type: "专用型",
      tags: ["系统升级前备份", "定期备份"],
      useFrequency: 42,
      addedDate: new Date(2024, 0, 5),
    },
    {
      id: "4",
      title: "语音/文本交互助手",
      description: "支持多模态交互，提供智能回复",
      icon: "🎤",
      type: "通用型",
      tags: ["新手引导", "日常交流"],
      isFavorite: true,
      useFrequency: 120,
      addedDate: new Date(2023, 9, 10),
    },
    {
      id: "5",
      title: "批量操作机器人",
      description: "一键执行批量任务，提高工作效率",
      icon: "🤖",
      type: "通用型",
      tags: ["批量审核", "数据处理"],
      useFrequency: 95,
      addedDate: new Date(23, 8, 25),
    },
  ]

  // 业务办理员智能体
  const businessAgents: Agent[] = [
    {
      id: "6",
      title: "项目申报助手",
      description: "自动校验申报书格式，推荐模板",
      icon: "📝",
      type: "专用型",
      tags: ["项目集中申报期", "材料准备"],
      isFavorite: true,
      useFrequency: 98,
      addedDate: new Date(2023, 10, 5),
    },
    {
      id: "7",
      title: "经费合规校验Agent",
      description: "检查经费使用合规性，提供优化建议",
      icon: "💰",
      type: "专用型",
      tags: ["季度审计", "报销审核"],
      useFrequency: 76,
      addedDate: new Date(2023, 11, 12),
    },
    {
      id: "8",
      title: "数据可视化生成器",
      description: "一键生成专业数据图表，支持多种格式",
      icon: "📊",
      type: "通用型",
      tags: ["汇报材料制作", "数据展示"],
      isFavorite: true,
      useFrequency: 110,
      addedDate: new Date(2023, 9, 20),
    },
    {
      id: "9",
      title: "合同审查助手",
      description: "智能识别合同风险点，提供修改建议",
      icon: "📄",
      type: "专用型",
      tags: ["校企合作签约", "合同管理"],
      useFrequency: 45,
      addedDate: new Date(2024, 0, 15),
      isNew: true,
    },
    {
      id: "10",
      title: "跨模块检索工具",
      description: "一站式搜索多个系统模块的数据",
      icon: "🔍",
      type: "通用型",
      tags: ["跨模块查询", "信息检索"],
      useFrequency: 88,
      addedDate: new Date(2023, 8, 30),
    },
  ]

  // 科研人员智能体
  const researcherAgents: Agent[] = [
    {
      id: "11",
      title: "文献分析助手",
      description: "智能分析文献关键内容，生成研究摘要",
      icon: "📚",
      type: "专用型",
      tags: ["文献综述", "研究方向分析"],
      isFavorite: true,
      useFrequency: 105,
      addedDate: new Date(2023, 10, 8),
    },
    {
      id: "12",
      title: "实验数据处理Agent",
      description: "自动清洗实验数据，生成分析报告",
      icon: "🧪",
      type: "专用型",
      tags: ["实验结果分析", "数据处理"],
      useFrequency: 92,
      addedDate: new Date(2023, 11, 18),
    },
    {
      id: "13",
      title: "科研项目管理助手",
      description: "跟踪项目进度，智能提醒关键节点",
      icon: "📅",
      type: "专用型",
      tags: ["项目管理", "进度跟踪"],
      isFavorite: true,
      useFrequency: 115,
      addedDate: new Date(2023, 9, 25),
    },
    {
      id: "14",
      title: "论文写作助手",
      description: "智能润色论文语言，检查格式规范",
      icon: "✍️",
      type: "专用型",
      tags: ["论文写作", "格式检查"],
      useFrequency: 88,
      addedDate: new Date(2024, 1, 10),
      isNew: true,
    },
    {
      id: "15",
      title: "学术合作推荐器",
      description: "基于研究方向智能推荐潜在合作伙伴",
      icon: "🤝",
      type: "专用型",
      tags: ["学术合作", "团队组建"],
      useFrequency: 65,
      addedDate: new Date(2024, 0, 20),
      isNew: true,
    },
  ]

  // 根据用户角色选择对应的智能体列表
  switch (userRole) {
    case "系统管理员":
      return adminAgents
    case "业务办理员":
      return businessAgents
    case "科研人员":
    default:
      return researcherAgents
  }
}

