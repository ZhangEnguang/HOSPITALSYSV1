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
  const reviewType = project.reviewType || "初始审查"
  
  // 根据审查类型进行不同的分析
  switch (reviewType) {
    case "初始审查":
      if (isAnimal) {
        if (project.title?.includes("转基因")) {
          analysis = `该初始审查项目采用转基因动物模型，需要重点评估实验设计的科学性和动物福利保障措施。转基因技术相对成熟，但需要严格评估对动物的潜在影响。项目所在的${project.department}具有丰富的动物实验经验，有助于风险控制。`
        } else if (project.title?.includes("灵长类")) {
          analysis = `该初始审查项目使用非人灵长类动物，属于高风险伦理研究范畴。灵长类动物的认知能力和社会行为复杂，需要特别严格的福利保障措施。项目必须提供充分的3R原则实施方案和详细的实验设计论证。`
        } else if (project.title?.includes("基因编辑")) {
          analysis = `该初始审查项目涉及CRISPR基因编辑技术，存在一定的技术风险和动物福利风险。基因编辑的安全性和有效性需要严格验证，动物痛苦评估和控制方案需要详细说明。`
        } else {
          analysis = `该初始审查项目采用动物实验模型进行研究，整体伦理风险处于可控范围。项目设计应遵循3R原则（替代、减少、优化），确保动物福利得到充分保障。建议加强实验过程中的动物健康监测和痛苦控制措施。`
        }
      } else if (isHuman) {
        if (project.title?.includes("临床试验")) {
          analysis = `该初始审查项目为人体临床试验研究，涉及受试者安全和权益保护的重要伦理问题。临床试验的风险级别取决于干预措施的类型和强度。项目需要建立完善的知情同意程序、不良事件监测机制和受试者保护措施。`
        } else if (project.title?.includes("药物")) {
          analysis = `该初始审查项目涉及药物相关的人体研究，需要特别关注药物安全性和受试者风险。必须提供详细的药物安全性数据、剂量设计依据和不良反应处理预案。建议设立独立的数据安全监测委员会。`
        } else if (project.title?.includes("基因") || project.title?.includes("遗传")) {
          analysis = `该初始审查项目涉及基因检测和遗传信息研究，主要伦理风险集中在遗传信息隐私保护、心理风险告知和数据安全方面。项目需要建立完善的知情同意程序、遗传咨询支持和数据保护措施。基因诊断结果的告知需要专业的遗传咨询团队支持。`
        } else {
          analysis = `该初始审查项目为人体研究，重点关注受试者知情同意和隐私保护。相比药物试验，该类研究的直接身体风险较低，但仍需要严格遵循研究伦理规范，确保受试者的合法权益得到保护。`
        }
      }
      break;
      
    case "人遗采集审批":
      analysis = `该人遗采集审批项目需要重点关注遗传资源的采集、保存和使用规范。`
      if (project.title?.includes("儿科") || project.title?.includes("儿童")) {
        analysis += `项目涉及儿童受试者，需要特别加强未成年人保护措施，建立专门的知情同意程序。儿科遗传病的紧急采集需要平衡医疗需求和伦理保护的关系。`
      } else if (project.title?.includes("家族性")) {
        analysis += `家族性遗传病样本采集涉及多个家庭成员，需要考虑家庭内部的伦理关系和隐私保护。样本采集应建立标准化流程，确保知情同意的充分性和有效性。`
      } else {
        analysis += `项目需要建立完善的样本采集标准和保存规范，确保遗传资源的合理使用和长期保存。知情同意程序应充分告知样本用途和潜在风险。`
      }
      break;
      
    case "修正案审查":
      analysis = `该修正案审查项目主要评估原研究方案的变更内容是否合理可行。`
      if (project.title?.includes("系统") || project.title?.includes("信息")) {
        analysis += `信息系统的修正涉及数据处理流程和安全保护机制的变更，需要重新评估数据隐私保护措施的充分性。修正案应明确说明变更对受试者权益的影响。`
      } else {
        analysis += `修正案的内容应基于科学依据和实际需要，变更不应增加受试者的风险或损害其权益。需要评估修正后的研究方案是否仍符合伦理要求。`
      }
      break;
      
    case "国际合作科学研究审批":
      analysis = `该国际合作项目涉及跨境研究合作，面临多国法规协调和数据跨境传输的复杂挑战。`
      if (project.title?.includes("数据共享")) {
        analysis += `跨境数据共享需要符合各国的数据保护法规，建立完善的数据安全传输机制。各参与国的伦理审查标准差异需要充分协调，确保符合最高标准的伦理要求。`
      } else {
        analysis += `国际合作需要建立统一的伦理标准和监督机制，明确各方责任和义务。知识产权保护和数据所有权问题需要在合作协议中明确约定。`
      }
      break;
      
    case "复审":
      analysis = `该复审项目是对前期审查意见的回应和改进。`
      if (project.title?.includes("繁育")) {
        analysis += `动物繁育计划的复审需要评估前期意见的落实情况和改进措施的有效性。转基因动物的繁育质量控制和福利保障措施应得到进一步完善。`
      } else {
        analysis += `复审项目应针对前期审查意见进行有针对性的改进，证明问题已得到有效解决。改进措施的科学性和可行性是复审的重点评估内容。`
      }
      break;
      
    default:
      analysis = `该${reviewType}项目需要根据具体的审查要求进行相应的伦理评估，确保符合相关法规和伦理标准。`
      break;
  }
  
  // 根据文件情况补充分析
  const fileCount = project.files?.length || 0
  if (fileCount < 3) {
    analysis += ` 当前提交的文件较少（${fileCount}份），可能存在材料不完整的风险，建议补充相关支撑文件。`
  } else if (fileCount >= 6) {
    analysis += ` 项目提交了${fileCount}份文件，材料相对完整，有利于全面评估项目的伦理风险。`
  }
  
  return analysis
}

function generateSuggestions(project: any, isAnimal: boolean, isHuman: boolean) {
  const suggestions = []
  const reviewType = project.reviewType || "初始审查"
  
  // 根据审查类型提供不同建议
  switch (reviewType) {
    case "初始审查":
      if (isAnimal) {
        suggestions.push("严格执行3R原则，在实验设计中最大程度减少动物使用数量")
        suggestions.push("建立完善的动物健康监测和福利评估体系")
        suggestions.push("制定详细的痛苦评估标准和人道终点指标")
        
        if (project.title?.includes("转基因")) {
          suggestions.push("评估转基因操作对动物行为和生理的长期影响")
          suggestions.push("建立转基因动物的特殊饲养和监护标准")
        }
        
        if (project.title?.includes("基因编辑")) {
          suggestions.push("完善基因编辑的安全性和有效性验证")
          suggestions.push("建立基因编辑动物的特殊管理制度")
        }
      } else if (isHuman) {
        suggestions.push("优化知情同意书，确保语言通俗易懂且信息充分")
        suggestions.push("建立严格的受试者筛选和排除标准")
        suggestions.push("制定完善的数据隐私保护和管理方案")
        
        if (project.title?.includes("基因") || project.title?.includes("遗传")) {
          suggestions.push("加强遗传咨询团队的专业培训和资质认证")
          suggestions.push("建立基因数据脱敏和加密存储的技术措施")
          suggestions.push("制定标准化的遗传风险告知和心理支持流程")
        }
      }
      break;
      
    case "人遗采集审批":
      suggestions.push("建立标准化的遗传资源采集和保存流程")
      suggestions.push("完善知情同意书中关于样本用途的详细说明")
      suggestions.push("制定遗传信息隐私保护和数据安全管理制度")
      
      if (project.title?.includes("儿科") || project.title?.includes("儿童")) {
        suggestions.push("建立儿童患者专用的知情同意流程")
        suggestions.push("完善紧急情况下的伦理审查快速通道")
        suggestions.push("加强儿科遗传咨询师的专业培训")
      }
      
      if (project.title?.includes("家族性")) {
        suggestions.push("制定家族成员知情同意的协调机制")
        suggestions.push("建立家族遗传信息的分级保护制度")
      }
      break;
      
    case "修正案审查":
      suggestions.push("明确说明修正案的科学依据和必要性")
      suggestions.push("评估修正内容对受试者权益的潜在影响")
      suggestions.push("完善修正后的研究方案和操作流程")
      
      if (project.title?.includes("系统") || project.title?.includes("信息")) {
        suggestions.push("确保系统修正后的数据安全性")
        suggestions.push("完善知情同意书的相关条款")
        suggestions.push("建立数据访问权限管理机制")
      }
      break;
      
    case "国际合作科学研究审批":
      suggestions.push("完善跨境数据传输的安全保障机制")
      suggestions.push("建立多国伦理审查协调机制")
      suggestions.push("明确知识产权和数据所有权条款")
      suggestions.push("制定统一的伦理标准和监督制度")
      suggestions.push("建立国际合作风险评估和应急处理机制")
      break;
      
    case "复审":
      suggestions.push("针对前期审查意见制定具体的改进措施")
      suggestions.push("提供改进措施实施效果的证明材料")
      suggestions.push("完善质量控制和监督机制")
      
      if (project.title?.includes("繁育")) {
        suggestions.push("完善转基因小鼠的遗传质量监测")
        suggestions.push("建立繁育过程中的福利评估制度")
        suggestions.push("优化繁育环境和饲养条件")
      }
      break;
      
    default:
      suggestions.push("根据具体审查要求完善相关材料")
      suggestions.push("确保符合相关法规和伦理标准")
      break;
  }
  
  // 通用建议
  const fileCount = project.files?.length || 0
  if (fileCount < 4) {
    suggestions.push("补充提交必要的支撑文件和证明材料")
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
    if (project.title?.includes("基因") || project.title?.includes("遗传")) protectionScore += 5 // 基因研究风险适中
  }
  
  dimensions.push({
    icon: isAnimal ? <Heart className="h-4 w-4" /> : <Users className="h-4 w-4" />,
    title: isAnimal ? "动物福利保障" : "受试者保护",
    score: Math.max(30, Math.min(95, protectionScore)),
    level: protectionScore >= 80 ? "低" : protectionScore >= 60 ? "中" : "高",
    description: isAnimal ? "评估动物福利保障措施的完善性" : "评估受试者权益保护措施的充分性"
  })
  
  // 研究文件完整性
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
  if (project.department === "基因组学中心") preventionScore += 12 // 基因组学中心经验丰富
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

      {/* 专项评估 - 根据审查类型显示不同内容 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Eye className="h-4 w-4 mr-2 text-blue-600" />
            {project.reviewType === "人遗采集审批" ? "人遗采集专项评估" :
             project.reviewType === "修正案审查" ? "修正案专项评估" :
             project.reviewType === "国际合作科学研究审批" ? "国际合作专项评估" :
             project.reviewType === "复审" ? "复审专项评估" :
             "初始审查专项评估"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.reviewType === "人遗采集审批" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <FileText className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                <h4 className="text-xs font-medium">采集标准评估</h4>
                <p className="text-xs text-gray-500 mt-1">采集流程规范性</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Shield className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                <h4 className="text-xs font-medium">样本保存规范</h4>
                <p className="text-xs text-gray-500 mt-1">存储条件标准</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Users className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                <h4 className="text-xs font-medium">知情同意完善性</h4>
                <p className="text-xs text-gray-500 mt-1">告知内容充分性</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Brain className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                <h4 className="text-xs font-medium">遗传信息保护</h4>
                <p className="text-xs text-gray-500 mt-1">隐私安全措施</p>
              </div>
            </div>
          ) : project.reviewType === "修正案审查" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <FileText className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                <h4 className="text-xs font-medium">修正内容评估</h4>
                <p className="text-xs text-gray-500 mt-1">变更合理性</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <AlertCircle className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                <h4 className="text-xs font-medium">风险影响评估</h4>
                <p className="text-xs text-gray-500 mt-1">对受试者影响</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                <h4 className="text-xs font-medium">合规性维持</h4>
                <p className="text-xs text-gray-500 mt-1">伦理要求符合性</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <Shield className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                <h4 className="text-xs font-medium">保护措施更新</h4>
                <p className="text-xs text-gray-500 mt-1">安全保障完善</p>
              </div>
            </div>
          ) : project.reviewType === "国际合作科学研究审批" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <FileText className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <h4 className="text-xs font-medium">合作协议评估</h4>
                <p className="text-xs text-gray-500 mt-1">协议条款完善性</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Shield className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <h4 className="text-xs font-medium">数据传输安全</h4>
                <p className="text-xs text-gray-500 mt-1">跨境保护机制</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <h4 className="text-xs font-medium">多国标准协调</h4>
                <p className="text-xs text-gray-500 mt-1">伦理要求统一</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Brain className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <h4 className="text-xs font-medium">知识产权保护</h4>
                <p className="text-xs text-gray-500 mt-1">权益分配明确</p>
              </div>
            </div>
          ) : project.reviewType === "复审" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <FileText className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <h4 className="text-xs font-medium">意见回应评估</h4>
                <p className="text-xs text-gray-500 mt-1">问题解决充分性</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <h4 className="text-xs font-medium">改进措施验证</h4>
                <p className="text-xs text-gray-500 mt-1">有效性确认</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <Shield className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <h4 className="text-xs font-medium">质量控制完善</h4>
                <p className="text-xs text-gray-500 mt-1">监督机制建立</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <TrendingUp className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <h4 className="text-xs font-medium">持续改进机制</h4>
                <p className="text-xs text-gray-500 mt-1">长期质量保障</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <h4 className="text-xs font-medium">方案设计评估</h4>
                <p className="text-xs text-gray-500 mt-1">科学性与合理性</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <h4 className="text-xs font-medium">伦理风险评估</h4>
                <p className="text-xs text-gray-500 mt-1">风险识别与控制</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <h4 className="text-xs font-medium">合规性审查</h4>
                <p className="text-xs text-gray-500 mt-1">法规标准符合性</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <h4 className="text-xs font-medium">保护措施评估</h4>
                <p className="text-xs text-gray-500 mt-1">受试对象权益保障</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
      ) : project.projectType === "人体" && (project.title?.includes("基因") || project.title?.includes("遗传") || project.title?.includes("诊断")) ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center">
              <Brain className="h-4 w-4 mr-2 text-indigo-600" />
              基因检测专项评估
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <MessageCircle className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <h4 className="text-xs font-medium">知情同意质量</h4>
                <p className="text-xs text-gray-500 mt-1">遗传风险告知</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <Shield className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <h4 className="text-xs font-medium">数据安全保护</h4>
                <p className="text-xs text-gray-500 mt-1">基因信息加密</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <Users className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <h4 className="text-xs font-medium">遗传咨询支持</h4>
                <p className="text-xs text-gray-500 mt-1">专业团队配置</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <Heart className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <h4 className="text-xs font-medium">心理风险评估</h4>
                <p className="text-xs text-gray-500 mt-1">结果告知支持</p>
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