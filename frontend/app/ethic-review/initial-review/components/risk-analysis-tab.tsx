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
  
  if (isAnimal) {
    if (project.title?.includes("转基因")) {
      analysis = `该项目涉及转基因动物模型研究，在伦理风险方面需要重点关注动物福利保障。转基因技术本身相对成熟，但需要严格评估对动物的潜在影响。项目所在的${project.department}具有丰富的动物实验经验，有助于风险控制。`
    } else if (project.title?.includes("灵长类")) {
      analysis = `该项目使用非人灵长类动物，属于高风险伦理研究范畴。灵长类动物的认知能力和社会行为复杂，需要特别严格的福利保障措施。项目必须提供充分的3R原则实施方案和详细的实验设计论证。`
    } else {
      analysis = `该项目采用动物实验模型进行研究，整体伦理风险处于可控范围。项目设计应遵循3R原则（替代、减少、优化），确保动物福利得到充分保障。建议加强实验过程中的动物健康监测和痛苦控制措施。`
    }
  } else if (isHuman) {
    if (project.title?.includes("临床试验")) {
      analysis = `该项目为人体临床试验研究，涉及受试者安全和权益保护的重要伦理问题。临床试验的风险级别取决于干预措施的类型和强度。项目需要建立完善的知情同意程序、不良事件监测机制和受试者保护措施。`
    } else if (project.title?.includes("药物")) {
      analysis = `该项目涉及药物相关的人体研究，需要特别关注药物安全性和受试者风险。必须提供详细的药物安全性数据、剂量设计依据和不良反应处理预案。建议设立独立的数据安全监测委员会。`
    } else {
      analysis = `该项目为人体研究，重点关注受试者知情同意和隐私保护。相比药物试验，该类研究的直接身体风险较低，但仍需要严格遵循研究伦理规范，确保受试者的合法权益得到保护。`
    }
  }
  
  // 根据文件情况补充分析
  const fileCount = project.files?.length || 0
  if (fileCount < 3) {
    analysis += ` 当前提交的研究文件较少（${fileCount}份），可能存在材料不完整的风险，建议补充相关支撑文件。`
  } else if (fileCount >= 4) {
    analysis += ` 项目提交了${fileCount}份研究文件，材料相对完整，有利于全面评估项目的伦理风险。`
  }
  
  return analysis
}

function generateSuggestions(project: any, isAnimal: boolean, isHuman: boolean) {
  const suggestions = []
  
  if (isAnimal) {
    suggestions.push("严格执行3R原则，在实验设计中最大程度减少动物使用数量")
    suggestions.push("建立完善的动物健康监测和福利评估体系")
    suggestions.push("制定详细的痛苦评估标准和人道终点指标")
    
    if (project.title?.includes("转基因")) {
      suggestions.push("评估转基因操作对动物行为和生理的长期影响")
      suggestions.push("建立转基因动物的特殊饲养和监护标准")
    }
    
    if (project.title?.includes("灵长类")) {
      suggestions.push("制定适合灵长类动物的环境丰容方案")
      suggestions.push("建立灵长类动物的社交需求保障措施")
    }
  } else if (isHuman) {
    suggestions.push("优化知情同意书，确保语言通俗易懂且信息充分")
    suggestions.push("建立严格的受试者筛选和排除标准")
    suggestions.push("制定完善的数据隐私保护和管理方案")
    
    if (project.title?.includes("临床试验") || project.title?.includes("药物")) {
      suggestions.push("设立独立的数据安全监测委员会")
      suggestions.push("建立不良事件的快速报告和处理机制")
      suggestions.push("制定明确的试验中止标准和受试者退出程序")
    }
    
    if (project.title?.includes("心理") || project.title?.includes("认知")) {
      suggestions.push("加强心理风险评估和支持服务提供")
      suggestions.push("确保受试者心理隐私和敏感信息的保护")
    }
  }
  
  // 根据项目状态添加建议
  if (project.status === "已退回" || project.status === "形审退回") {
    suggestions.push("仔细审阅审核意见，针对性完善项目方案")
    suggestions.push("补充相关证明材料和风险控制措施说明")
  }
  
  const fileCount = project.files?.length || 0
  if (fileCount < 3) {
    suggestions.push("补充提交研究方案、知情同意书等必要文件")
  }
  
  return suggestions
}

function generateRiskDimensions(project: any, isAnimal: boolean, isHuman: boolean) {
  const dimensions = []
  
  // 实验设计合规性
  let designScore = 75
  if (project.completion >= 100) designScore += 10
  if (project.status === "已退回") designScore -= 20
  
  dimensions.push({
    icon: <Target className="h-4 w-4" />,
    title: "实验设计合规性",
    score: Math.max(30, Math.min(95, designScore)),
    level: designScore >= 80 ? "低" : designScore >= 60 ? "中" : "高",
    description: "评估实验设计的科学性和伦理合规性"
  })
  
  // 受试对象保护
  let protectionScore = 70
  if (isAnimal) {
    if (project.title?.includes("小鼠")) protectionScore += 15
    if (project.title?.includes("灵长类")) protectionScore -= 25
  } else if (isHuman) {
    if (project.title?.includes("问卷") || project.title?.includes("认知")) protectionScore += 20
    if (project.title?.includes("药物") || project.title?.includes("临床试验")) protectionScore -= 15
  }
  
  dimensions.push({
    icon: isAnimal ? <Heart className="h-4 w-4" /> : <Users className="h-4 w-4" />,
    title: isAnimal ? "动物福利保障" : "受试者保护",
    score: Math.max(30, Math.min(95, protectionScore)),
    level: protectionScore >= 80 ? "低" : protectionScore >= 60 ? "中" : "高",
    description: isAnimal ? "评估动物福利保障措施的完善性" : "评估受试者权益保护措施的充分性"
  })
  
  // 文件完整性
  const fileCount = project.files?.length || 0
  let fileScore = Math.min(95, 40 + fileCount * 15)
  
  dimensions.push({
    icon: <FileText className="h-4 w-4" />,
    title: "研究文件完整性",
    score: fileScore,
    level: fileScore >= 80 ? "低" : fileScore >= 60 ? "中" : "高",
    description: "评估提交文件的完整性和规范性"
  })
  
  // 风险预防措施
  let preventionScore = 65
  if (project.department === "神经科学研究院") preventionScore += 15
  if (project.department === "肿瘤医学中心") preventionScore += 10
  if (project.priority === "高") preventionScore += 5
  
  dimensions.push({
    icon: <Shield className="h-4 w-4" />,
    title: "风险预防措施",
    score: Math.max(30, Math.min(95, preventionScore)),
    level: preventionScore >= 80 ? "低" : preventionScore >= 60 ? "中" : "高",
    description: "评估项目风险预防和应急处理能力"
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

      {/* 专项评估 - 简化版 */}
      {project.projectType === "动物" ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center">
              <Heart className="h-4 w-4 mr-2 text-green-600" />
              动物福利专项评估
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Target className="h-5 w-5 mx-auto text-green-600 mb-1" />
                <h4 className="text-xs font-medium">3R原则实施</h4>
                <p className="text-xs text-gray-500 mt-1">替代、减少、优化</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Activity className="h-5 w-5 mx-auto text-green-600 mb-1" />
                <h4 className="text-xs font-medium">痛苦评估控制</h4>
                <p className="text-xs text-gray-500 mt-1">麻醉镇痛方案</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Shield className="h-5 w-5 mx-auto text-green-600 mb-1" />
                <h4 className="text-xs font-medium">环境与饲养</h4>
                <p className="text-xs text-gray-500 mt-1">饲养条件标准</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 mx-auto text-green-600 mb-1" />
                <h4 className="text-xs font-medium">人员资质管理</h4>
                <p className="text-xs text-gray-500 mt-1">培训认证情况</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : project.projectType === "人体" ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-600" />
              受试者保护专项评估
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <MessageCircle className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <h4 className="text-xs font-medium">知情同意质量</h4>
                <p className="text-xs text-gray-500 mt-1">信息披露充分性</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Shield className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <h4 className="text-xs font-medium">隐私数据保护</h4>
                <p className="text-xs text-gray-500 mt-1">数据安全措施</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <AlertCircle className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <h4 className="text-xs font-medium">风险获益评估</h4>
                <p className="text-xs text-gray-500 mt-1">平衡性分析</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Activity className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <h4 className="text-xs font-medium">安全监测机制</h4>
                <p className="text-xs text-gray-500 mt-1">应急处理预案</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
} 