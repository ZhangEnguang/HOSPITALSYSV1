// 智能表单助手

// 常见实验目的数据库
export const experimentPurposes = [
  // X射线衍射类实验
  {
    category: "X射线衍射",
    purposes: [
      "材料织构分析",
      "残余应力测量", 
      "相结构分析",
      "晶体结构解析",
      "定性分析",
      "定量分析",
      "薄膜分析",
      "粉末衍射",
      "单晶衍射",
      "小角散射",
      "晶格参数测定",
      "晶粒尺寸分析",
      "取向分布测量",
      "结晶度分析",
      "相变研究"
    ]
  },
  // 电镜类实验
  {
    category: "电子显微镜",
    purposes: [
      "形貌观察",
      "微观结构分析",
      "元素分析",
      "晶体缺陷观察",
      "界面分析",
      "纳米材料表征",
      "薄膜厚度测量",
      "表面粗糙度分析",
      "颗粒尺寸统计",
      "组织形貌分析"
    ]
  },
  // 光谱分析类
  {
    category: "光谱分析",
    purposes: [
      "成分分析",
      "分子结构分析",
      "化学键分析",
      "官能团识别",
      "纯度检测",
      "含量测定",
      "杂质分析",
      "反应动力学研究",
      "催化剂表征",
      "表面化学分析"
    ]
  }
]

// 模拟用户项目数据
export const userProjects = [
  {
    id: "PRJ001",
    name: "新型陶瓷材料开发",
    category: "材料科学",
    status: "进行中",
    endDate: "2024-06-30",
    relatedEquipment: ["X射线衍射仪", "扫描电镜"],
    team: ["张教授", "李博士", "王研究员"]
  },
  {
    id: "PRJ002", 
    name: "金属基复合材料研究",
    category: "复合材料",
    status: "进行中",
    endDate: "2024-08-15",
    relatedEquipment: ["X射线衍射仪", "万能试验机"],
    team: ["陈教授", "刘博士"]
  },
  {
    id: "PRJ003",
    name: "纳米材料表面改性",
    category: "纳米技术",
    status: "进行中", 
    endDate: "2024-12-20",
    relatedEquipment: ["原子力显微镜", "X射线光电子能谱"],
    team: ["王教授", "赵博士", "孙研究员"]
  },
  {
    id: "PRJ004",
    name: "生物医用材料评价",
    category: "生物材料",
    status: "准备中",
    endDate: "2024-09-30",
    relatedEquipment: ["红外光谱仪", "扫描电镜"],
    team: ["马教授", "钱博士"]
  }
]

// 样品信息模板
export const sampleTemplates = {
  "X射线衍射": {
    requiredInfo: [
      "样品名称",
      "样品形态（粉末/块体/薄膜）",
      "样品尺寸",
      "预期相组成",
      "是否含有轻元素"
    ],
    optionalInfo: [
      "制备方法",
      "热处理历史",
      "预期晶体结构",
      "可能的杂质"
    ],
    tips: [
      "粉末样品需过200目筛",
      "块体样品表面需抛光处理",
      "薄膜样品需提供基底信息",
      "避免样品中含有强烈荧光元素"
    ]
  },
  "电子显微镜": {
    requiredInfo: [
      "样品名称",
      "样品导电性",
      "观察部位",
      "预期倍数",
      "是否需要喷金"
    ],
    optionalInfo: [
      "样品硬度",
      "热敏感性",
      "化学稳定性",
      "特殊处理要求"
    ],
    tips: [
      "非导电样品需要喷金处理",
      "样品尺寸不超过样品台限制",
      "避免含水、含油样品",
      "易损样品需特别标注"
    ]
  },
  "光谱分析": {
    requiredInfo: [
      "样品名称", 
      "样品纯度",
      "分析目标",
      "样品状态（固体/液体/气体）",
      "预期组分"
    ],
    optionalInfo: [
      "溶剂信息",
      "浓度范围",
      "干扰组分",
      "保存条件"
    ],
    tips: [
      "液体样品需澄清透明",
      "固体样品需充分研磨",
      "避免样品污染",
      "注意样品的光稳定性"
    ]
  }
}

export interface ExperimentSuggestion {
  text: string
  category: string
  confidence: number
  relatedProjects: string[]
  estimatedDuration: number
}

export interface ProjectSuggestion {
  id: string
  name: string
  category: string
  relevanceScore: number
  reason: string
  team: string[]
}

export interface SampleInfo {
  required: string[]
  optional: string[]
  tips: string[]
  template: string
}

export interface SmartFormSuggestions {
  purpose: ExperimentSuggestion[]
  project: ProjectSuggestion[]
  sampleInfo: SampleInfo | null
  completionTips: string[]
}

// 获取实验目的建议
export function getExperimentSuggestions(
  input: string,
  equipmentType: string,
  userHistory: any[] = []
): ExperimentSuggestion[] {
  const suggestions: ExperimentSuggestion[] = []
  
  // 获取设备相关的实验目的
  const relevantCategory = experimentPurposes.find(cat => 
    equipmentType.includes(cat.category) || cat.category.includes(equipmentType)
  )
  
  if (relevantCategory) {
    // 模糊搜索匹配
    const matches = relevantCategory.purposes.filter(purpose =>
      purpose.toLowerCase().includes(input.toLowerCase()) ||
      input.toLowerCase().includes(purpose.toLowerCase())
    )
    
    matches.forEach(match => {
      // 计算置信度
      let confidence = 0.7
      if (match.toLowerCase() === input.toLowerCase()) confidence = 1.0
      else if (match.toLowerCase().includes(input.toLowerCase())) confidence = 0.9
      else if (input.toLowerCase().includes(match.toLowerCase())) confidence = 0.8
      
      // 查找相关项目
      const relatedProjects = userProjects
        .filter(project => project.relatedEquipment.some(eq => eq.includes(equipmentType)))
        .map(project => project.name)
      
      // 基于历史数据调整置信度
      const historyMatch = userHistory.find(h => h.purpose === match)
      if (historyMatch) confidence += 0.1
      
      suggestions.push({
        text: match,
        category: relevantCategory.category,
        confidence: Math.min(confidence, 1.0),
        relatedProjects: relatedProjects.slice(0, 2),
        estimatedDuration: getEstimatedDuration(match)
      })
    })
  }
  
  // 添加用户历史中的常用目的
  userHistory.forEach(history => {
    if (history.purpose.toLowerCase().includes(input.toLowerCase()) &&
        !suggestions.some(s => s.text === history.purpose)) {
      suggestions.push({
        text: history.purpose,
        category: "历史记录",
        confidence: 0.8,
        relatedProjects: [],
        estimatedDuration: history.duration || 2
      })
    }
  })
  
  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}

// 获取项目关联建议
export function getProjectSuggestions(
  experimentPurpose: string,
  equipmentType: string,
  currentInput: string = "",
  bookerName: string = ""
): ProjectSuggestion[] {
  const suggestions: ProjectSuggestion[] = []
  
  userProjects.forEach(project => {
    let relevanceScore = 0
    let reasons: string[] = []
    
    // 检查预约人是否在项目团队中
    if (bookerName && project.team.some(member => member.includes(bookerName.replace(/教授|博士|研究员/g, '')))) {
      relevanceScore += 0.5
      reasons.push("您是项目成员")
    }
    
    // 检查设备匹配
    if (project.relatedEquipment.some(eq => eq.includes(equipmentType))) {
      relevanceScore += 0.4
      reasons.push("设备匹配")
    }
    
    // 检查实验目的关键词匹配
    const purposeKeywords = experimentPurpose.toLowerCase().split(/[\s,]+/)
    const projectKeywords = project.name.toLowerCase().split(/[\s,]+/)
    
    const matchingKeywords = purposeKeywords.filter(pk =>
      projectKeywords.some(projk => projk.includes(pk) || pk.includes(projk))
    )
    
    if (matchingKeywords.length > 0) {
      relevanceScore += matchingKeywords.length * 0.2
      reasons.push("关键词匹配")
    }
    
    // 检查输入的项目名称模糊匹配
    if (currentInput && project.name.toLowerCase().includes(currentInput.toLowerCase())) {
      relevanceScore += 0.3
      reasons.push("名称匹配")
    }
    
    // 检查项目状态（进行中的项目优先级更高）
    if (project.status === "进行中") {
      relevanceScore += 0.1
    }
    
    if (relevanceScore > 0.2) {
      suggestions.push({
        id: project.id,
        name: project.name,
        category: project.category,
        relevanceScore,
        reason: reasons.join("、"),
        team: project.team
      })
    }
  })
  
  return suggestions
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 4)
}

// 获取样品信息助手
export function getSampleInfoAssistant(equipmentType: string): SampleInfo | null {
  // 根据设备类型匹配样品信息模板
  for (const [category, template] of Object.entries(sampleTemplates)) {
    if (equipmentType.includes(category) || category.includes(equipmentType)) {
      return {
        required: template.requiredInfo,
        optional: template.optionalInfo,
        tips: template.tips,
        template: generateSampleTemplate(template)
      }
    }
  }
  
  return null
}

// 生成样品信息模板
function generateSampleTemplate(template: typeof sampleTemplates["X射线衍射"]): string {
  const lines = [
    "样品信息：",
    "",
    "必填信息：",
    ...template.requiredInfo.map(info => `- ${info}: `),
    "",
    "可选信息：",
    ...template.optionalInfo.map(info => `- ${info}: `),
    "",
    "注意事项：",
    ...template.tips.map(tip => `• ${tip}`)
  ]
  
  return lines.join("\n")
}

// 获取预估实验时长
function getEstimatedDuration(experimentType: string): number {
  const durationMap: { [key: string]: number } = {
    "材料织构分析": 2,
    "残余应力测量": 3,
    "相结构分析": 2.5,
    "晶体结构解析": 4,
    "定性分析": 1.5,
    "定量分析": 2,
    "薄膜分析": 1.5,
    "粉末衍射": 2,
    "单晶衍射": 4,
    "小角散射": 3,
    "形貌观察": 1,
    "微观结构分析": 2,
    "元素分析": 1.5,
    "成分分析": 2,
    "分子结构分析": 2.5
  }
  
  return durationMap[experimentType] || 2
}

// 智能填写建议
export function getSmartFormSuggestions(formData: {
  purpose: string
  project: string
  notes: string
}, equipmentType: string): SmartFormSuggestions {
  const suggestions: SmartFormSuggestions = {
    purpose: getExperimentSuggestions(formData.purpose, equipmentType),
    project: getProjectSuggestions(formData.purpose, equipmentType, formData.project),
    sampleInfo: getSampleInfoAssistant(equipmentType),
    completionTips: []
  }
  
  // 生成补全提示
  const tips: string[] = []
  
  if (!formData.purpose) {
    tips.push("建议详细描述实验目的，这有助于设备管理员更好地为您准备设备")
  }
  
  if (!formData.project) {
    tips.push("关联项目信息可以帮助您管理实验记录和费用")
  }
  
  if (!formData.notes && suggestions.sampleInfo) {
    tips.push("建议在备注中填写样品信息，确保实验顺利进行")
  }
  
  suggestions.completionTips = tips
  
  return suggestions
} 