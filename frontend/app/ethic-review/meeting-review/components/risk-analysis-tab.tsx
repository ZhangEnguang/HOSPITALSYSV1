"use client"

import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Shield,
  MessageCircle,
  LightbulbIcon,
  Brain,
  Activity,
  BarChart3,
  RotateCw,
  Timer,
  BrainCircuit,
  Calculator,
  Users,
  FileText,
  Calendar,
  MapPin,
  Zap,
  Eye,
  Heart,
  TrendingUp,
  Target,
  Clock,
  HelpCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useState } from "react"

// 风险等级组件
function RiskLevelBadge({ level }: { level: string }) {
  const getColorClass = () => {
    switch (level) {
      case "低":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "中":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "中高":
      case "高":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    }
  }

  const getIcon = () => {
    switch (level) {
      case "低":
        return <CheckCircle2 className="h-3 w-3 mr-1" />
      case "中":
        return <AlertCircle className="h-3 w-3 mr-1" />
      case "中高":
      case "高":
        return <AlertTriangle className="h-3 w-3 mr-1" />
      default:
        return <AlertCircle className="h-3 w-3 mr-1" />
    }
  }

  return (
    <Badge className={cn("flex items-center text-xs", getColorClass())}>
      {getIcon()}
      <span>{level}风险</span>
    </Badge>
  )
}

// 简化的风险维度卡片
function RiskDimensionCard({ 
  icon, 
  title, 
  score, 
  level, 
  description
}: {
  icon: React.ReactNode;
  title: string;
  score: number;
  level: string;
  description: string;
}) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "低":
        return "text-green-600"
      case "中":
        return "text-amber-600"
      case "高":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-1.5 rounded ${getLevelColor(level)} bg-white`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-sm">{title}</h3>
            <Badge variant="outline" className={`text-xs ${getLevelColor(level)}`}>
              {level}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold">{score}</div>
        <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// 基于项目信息生成风险分析
function generateRiskAnalysis(project: any) {
  const isAnimal = project.projectType === "动物"
  const isHuman = project.projectType === "人体"
  const hasFiles = project.files && project.files.length > 0
  const fileCount = hasFiles ? project.files.length : 0
  const isComplexDepartment = ["神经科学研究院", "肿瘤医学中心"].includes(project.department)
  
  // 基础风险评估
  let baseRiskLevel = "中"
  let baseScore = 70
  
  // 根据项目类型调整风险
  if (isAnimal) {
    if (project.animalType === "非人灵长类" || project.title?.includes("灵长类")) {
      baseRiskLevel = "高"
      baseScore = 50
    } else if (project.animalType === "小鼠" || project.title?.includes("小鼠")) {
      baseRiskLevel = "中"
      baseScore = 75
    }
  } else if (isHuman) {
    if (project.title?.includes("临床试验") || project.title?.includes("药物")) {
      baseRiskLevel = "中高"
      baseScore = 60
    } else if (project.title?.includes("问卷") || project.title?.includes("认知")) {
      baseRiskLevel = "低"
      baseScore = 85
    }
  }
  
  // 根据文件完整性调整
  if (fileCount >= 4) baseScore += 10
  else if (fileCount <= 2) baseScore -= 15
  
  // 根据项目状态调整
  if (project.status === "已退回" || project.status === "形审退回") {
    baseScore -= 20
  }
  
  baseScore = Math.max(30, Math.min(95, baseScore))
  
  return {
    level: baseRiskLevel,
    score: baseScore,
    analysis: generateAnalysisText(project, isAnimal, isHuman),
    suggestions: generateSuggestions(project, isAnimal, isHuman),
    riskDimensions: generateRiskDimensions(project, isAnimal, isHuman)
  }
}

function generateAnalysisText(project: any, isAnimal: boolean, isHuman: boolean) {
  let analysis = ""
  
  // 会议审查通常是对已通过初审的项目进行会议讨论和评议
  if (isAnimal) {
    if (project.title?.includes("转基因")) {
      analysis = `该项目已通过初审进入会议审查阶段。转基因动物模型的伦理风险主要集中在动物福利保障和3R原则实施方面。会议将重点讨论转基因技术对动物的长期影响、实验设计的科学性以及动物痛苦控制措施的完善性。`
    } else if (project.title?.includes("灵长类")) {
      analysis = `该项目使用非人灵长类动物，已进入会议审查阶段。灵长类动物的特殊认知能力和社会性使其成为高敏感性研究对象。会议将重点评议福利保障措施的特殊性、环境丰容方案的合理性以及实验必要性的充分论证。`
    } else {
      analysis = `该项目为动物实验研究，已通过初审进入会议审查阶段。会议将重点评议实验设计的伦理合规性、动物福利保障措施的完善性以及3R原则的具体实施方案。项目所在的${project.department}具有相关研究经验，有助于风险控制。`
    }
  } else if (isHuman) {
    if (project.title?.includes("临床试验")) {
      analysis = `该项目为人体临床试验研究，已进入会议审查阶段。会议将重点讨论试验的风险效益评估、受试者安全保障措施以及知情同意程序的完善性。临床试验的伦理风险主要体现在受试者保护和数据安全方面。`
    } else if (project.title?.includes("药物")) {
      analysis = `该项目涉及药物相关的人体研究，已进入会议审查阶段。会议将重点评议药物安全性评估、不良反应监测机制以及受试者退出机制的完善性。药物研究的特殊性要求更严格的安全监测措施。`
    } else {
      analysis = `该项目为人体研究，已通过初审进入会议审查阶段。会议将重点讨论受试者知情同意的充分性、隐私保护措施的完善性以及研究方案的伦理合规性。相比高风险研究，该类项目的伦理风险相对可控。`
    }
  }
  
  // 根据文件情况补充分析
  const fileCount = project.files?.length || 0
  if (fileCount < 3) {
    analysis += ` 提交的研究文件较少（${fileCount}份），会议可能要求补充相关支撑材料以便全面评估。`
  } else if (fileCount >= 4) {
    analysis += ` 项目提交了${fileCount}份研究文件，材料相对完整，为会议评议提供了充分的信息基础。`
  }
  
  return analysis
}

function generateSuggestions(project: any, isAnimal: boolean, isHuman: boolean) {
  const suggestions = []
  
  // 会议审查的建议更侧重于讨论重点和评议要点
  if (isAnimal) {
    suggestions.push("会议应重点讨论3R原则实施的具体措施和效果评估")
    suggestions.push("详细评议动物福利监测体系的建立和运行机制")
    suggestions.push("审议动物痛苦评估标准和人道终点的设定合理性")
    
    if (project.title?.includes("转基因")) {
      suggestions.push("讨论转基因操作的长期影响监测和风险控制措施")
      suggestions.push("评议转基因动物特殊饲养管理制度的建立")
    }
    
    if (project.title?.includes("灵长类")) {
      suggestions.push("重点审议灵长类动物环境丰容和社交需求保障方案")
      suggestions.push("讨论灵长类动物特殊福利评估指标的设置")
    }
  } else if (isHuman) {
    suggestions.push("会议应重点讨论知情同意程序的完善性和可操作性")
    suggestions.push("详细评议受试者安全监测和保护措施的有效性")
    suggestions.push("审议数据隐私保护机制的技术可行性")
    
    if (project.title?.includes("临床试验") || project.title?.includes("药物")) {
      suggestions.push("重点讨论独立数据安全监测委员会的设立和运行")
      suggestions.push("评议不良事件快速报告和处理机制的完善性")
      suggestions.push("审议试验中止标准和受试者退出程序的合理性")
    }
    
    if (project.title?.includes("心理") || project.title?.includes("认知")) {
      suggestions.push("讨论心理风险评估和干预措施的专业性")
      suggestions.push("评议敏感心理信息保护的特殊要求")
    }
  }
  
  // 根据项目状态添加会议重点
  if (project.status === "已退回" || project.status === "形审退回") {
    suggestions.push("重点讨论前期审查意见的回应和改进措施")
    suggestions.push("评议补充材料的充分性和针对性")
  }
  
  const fileCount = project.files?.length || 0
  if (fileCount < 3) {
    suggestions.push("要求申请人补充提交必要的研究支撑文件")
  }
  
  return suggestions
}

function generateRiskDimensions(project: any, isAnimal: boolean, isHuman: boolean) {
  const dimensions = []
  
  // 会议可接受性评估（替代实验设计合规性）
  let acceptabilityScore = 75
  if (project.completion >= 100) acceptabilityScore += 10
  if (project.status === "已退回") acceptabilityScore -= 20
  
  dimensions.push({
    icon: <Target className="h-4 w-4" />,
    title: "会议可接受性",
    score: Math.max(30, Math.min(95, acceptabilityScore)),
    level: acceptabilityScore >= 80 ? "低" : acceptabilityScore >= 60 ? "中" : "高",
    description: "评估项目在伦理委员会会议中的可接受程度"
  })
  
  // 伦理争议点评估（保持受试对象保护但改名称）
  let controversyScore = 70
  if (isAnimal) {
    if (project.title?.includes("小鼠")) controversyScore += 15
    if (project.title?.includes("灵长类")) controversyScore -= 25
  } else if (isHuman) {
    if (project.title?.includes("问卷") || project.title?.includes("认知")) controversyScore += 20
    if (project.title?.includes("药物") || project.title?.includes("临床试验")) controversyScore -= 15
  }
  
  dimensions.push({
    icon: isAnimal ? <Heart className="h-4 w-4" /> : <Users className="h-4 w-4" />,
    title: "伦理争议点",
    score: Math.max(30, Math.min(95, controversyScore)),
    level: controversyScore >= 80 ? "低" : controversyScore >= 60 ? "中" : "高",
    description: isAnimal ? "评估动物伦理方面可能引起会议争议的问题" : "评估受试者伦理方面可能引起会议争议的问题"
  })
  
  // 会议材料充分性（保持研究文件完整性）
  const fileCount = project.files?.length || 0
  let materialScore = Math.min(95, 40 + fileCount * 15)
  
  dimensions.push({
    icon: <FileText className="h-4 w-4" />,
    title: "会议材料充分性",
    score: materialScore,
    level: materialScore >= 80 ? "低" : materialScore >= 60 ? "中" : "高",
    description: "评估提交给会议的审查材料是否充分完整"
  })
  
  // 专家评议风险（替代风险预防措施）
  let expertScore = 65
  if (project.department === "神经科学研究院") expertScore += 15
  if (project.department === "肿瘤医学中心") expertScore += 10
  if (project.priority === "高") expertScore += 5
  
  dimensions.push({
    icon: <Shield className="h-4 w-4" />,
    title: "专家评议风险",
    score: Math.max(30, Math.min(95, expertScore)),
    level: expertScore >= 80 ? "低" : expertScore >= 60 ? "中" : "高",
    description: "评估项目在专家评议过程中可能遇到的风险"
  })
  
  return dimensions
}

// 风险分析标签页组件
export default function RiskAnalysisTab({
  project
}: { 
  project: any 
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState("2024-05-25 10:30");

  // 生成风险分析
  const riskAnalysis = generateRiskAnalysis(project)

  // 处理刷新AI分析
  const handleRefreshAnalysis = () => {
    setIsRefreshing(true);
    // 模拟AI分析过程，增加延时以显示加载效果
    setTimeout(() => {
      setIsRefreshing(false);
      setLastAnalyzed(new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'));
    }, 3000); // 增加到3秒以便观察效果
  }

  return (
    <div className="space-y-4">
      {/* 综合风险评估 */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-base font-semibold">综合风险评估</CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                <BrainCircuit className="h-3 w-3 mr-1" />
                AI分析
              </Badge>
              {isRefreshing && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-xs animate-pulse">
                  <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                  分析中
                </Badge>
              )}
            </div>
            <RiskLevelBadge level={riskAnalysis.level} />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>基于项目信息的智能风险分析</span>
            <span className="flex items-center text-xs">
              <Timer className="h-3 w-3 mr-1" />
              {lastAnalyzed}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* AI置信度 */}
          <div className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg transition-all duration-300 ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`}>
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">AI分析置信度</span>
              {isRefreshing && <RotateCw className="h-3 w-3 text-blue-600 animate-spin" />}
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-blue-200 rounded-full h-2">
                <div 
                  className={`h-2 bg-blue-600 rounded-full transition-all duration-500 ${isRefreshing ? 'animate-pulse' : ''}`}
                  style={{ width: `${riskAnalysis.score}%` }}
                />
              </div>
              <span className="text-sm font-bold text-blue-700">{riskAnalysis.score}%</span>
            </div>
          </div>

          {/* 风险分析 */}
          <div className={`transition-all duration-300 ${isRefreshing ? 'opacity-50' : ''}`}>
            <h3 className="text-sm font-medium flex items-center text-gray-700 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              风险分析
            </h3>
            <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
              {riskAnalysis.analysis}
            </div>
          </div>

          {/* 风险缓解建议 */}
          <div className={`transition-all duration-300 ${isRefreshing ? 'opacity-50' : ''}`}>
            <h3 className="text-sm font-medium flex items-center text-gray-700 mb-2">
              <Shield className="h-4 w-4 text-blue-500 mr-2" />
              风险缓解建议
            </h3>
            <ul className="space-y-2">
              {riskAnalysis.suggestions.slice(0, 4).map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <LightbulbIcon className="h-3 w-3 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className={`text-xs h-8 transition-all duration-200 ${
                isRefreshing 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-not-allowed' 
                  : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
              }`} 
              onClick={handleRefreshAnalysis}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                  <span className="animate-pulse">分析中...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="h-3 w-3 mr-1" />
                  刷新分析
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 多维度风险评估 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-amber-600" />
            多维度风险评估
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskAnalysis.riskDimensions.map((dimension, index) => (
              <RiskDimensionCard 
                key={index}
                icon={dimension.icon}
                title={dimension.title}
                score={dimension.score}
                level={dimension.level}
                description={dimension.description}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 专项评估 - 会议审查特色评估卡片 */}
      {(() => {
        const reviewType = project.reviewType || "初始审查"
        const projectSubType = project.projectSubType || project.projectType
        
        // 根据审查类型显示不同的专项评估卡片
        switch (reviewType) {
          case "人遗采集审批":
            return (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-emerald-600" />
                    人类遗传资源采集专项评估
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <Shield className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                      <h4 className="text-xs font-medium">采集标准规范</h4>
                      <p className="text-xs text-gray-500 mt-1">采集流程合规性</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <FileText className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                      <h4 className="text-xs font-medium">样本保存管理</h4>
                      <p className="text-xs text-gray-500 mt-1">保存条件标准</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <Users className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                      <h4 className="text-xs font-medium">知情同意质量</h4>
                      <p className="text-xs text-gray-500 mt-1">同意程序完善性</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <Shield className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                      <h4 className="text-xs font-medium">遗传信息保护</h4>
                      <p className="text-xs text-gray-500 mt-1">隐私安全措施</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
            
          case "修正案审查":
            return (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                    修正案审查专项评估
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <FileText className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                      <h4 className="text-xs font-medium">修改内容评估</h4>
                      <p className="text-xs text-gray-500 mt-1">变更合理性分析</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <Target className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                      <h4 className="text-xs font-medium">风险影响评估</h4>
                      <p className="text-xs text-gray-500 mt-1">修改对风险影响</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                      <h4 className="text-xs font-medium">合规性维持</h4>
                      <p className="text-xs text-gray-500 mt-1">伦理标准保持</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <Shield className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                      <h4 className="text-xs font-medium">保护措施更新</h4>
                      <p className="text-xs text-gray-500 mt-1">安全措施完善</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
            
          case "国际合作科学研究审批":
            return (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-600" />
                    国际合作研究专项评估
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <FileText className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                      <h4 className="text-xs font-medium">合作协议评估</h4>
                      <p className="text-xs text-gray-500 mt-1">协议完整性审查</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Shield className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                      <h4 className="text-xs font-medium">数据传输安全</h4>
                      <p className="text-xs text-gray-500 mt-1">跨境数据保护</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Target className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                      <h4 className="text-xs font-medium">多国标准协调</h4>
                      <p className="text-xs text-gray-500 mt-1">伦理标准统一</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                      <h4 className="text-xs font-medium">知识产权保护</h4>
                      <p className="text-xs text-gray-500 mt-1">权益保障机制</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
            
          case "复审":
            return (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center">
                    <RotateCw className="h-4 w-4 mr-2 text-indigo-600" />
                    复审专项评估
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <MessageCircle className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                      <h4 className="text-xs font-medium">意见回应质量</h4>
                      <p className="text-xs text-gray-500 mt-1">问题解决完整性</p>
                    </div>
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                      <h4 className="text-xs font-medium">改进措施验证</h4>
                      <p className="text-xs text-gray-500 mt-1">整改效果评估</p>
                    </div>
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <Shield className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                      <h4 className="text-xs font-medium">质量控制评估</h4>
                      <p className="text-xs text-gray-500 mt-1">质控体系完善</p>
                    </div>
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                      <h4 className="text-xs font-medium">持续改进机制</h4>
                      <p className="text-xs text-gray-500 mt-1">长期监督保障</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
            
          default:
            // 初始审查或其他审查类型
            if (projectSubType === "动物") {
              return (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-blue-600" />
                      会议审查 - 动物伦理专项评估
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Target className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <h4 className="text-xs font-medium">会议讨论焦点</h4>
                        <p className="text-xs text-gray-500 mt-1">3R原则实施评估</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Activity className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <h4 className="text-xs font-medium">专家评议重点</h4>
                        <p className="text-xs text-gray-500 mt-1">福利保障措施审议</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <h4 className="text-xs font-medium">会议决议要素</h4>
                        <p className="text-xs text-gray-500 mt-1">痛苦控制方案评议</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <h4 className="text-xs font-medium">监督执行机制</h4>
                        <p className="text-xs text-gray-500 mt-1">人员资质管理审查</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            } else {
              return (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      会议审查 - 人体研究专项评估
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <MessageCircle className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <h4 className="text-xs font-medium">会议讨论焦点</h4>
                        <p className="text-xs text-gray-500 mt-1">知情同意程序评议</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <h4 className="text-xs font-medium">专家评议重点</h4>
                        <p className="text-xs text-gray-500 mt-1">受试者保护措施</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <h4 className="text-xs font-medium">会议决议要素</h4>
                        <p className="text-xs text-gray-500 mt-1">风险效益平衡性</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Activity className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <h4 className="text-xs font-medium">监督执行机制</h4>
                        <p className="text-xs text-gray-500 mt-1">安全监测机制审查</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            }
        }
      })()}
    </div>
  )
} 