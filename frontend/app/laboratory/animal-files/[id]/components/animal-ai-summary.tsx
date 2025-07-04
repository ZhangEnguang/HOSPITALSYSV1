"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { 
  RefreshCw, 
  ChevronRight, 
  Copy, 
  BarChart3, 
  PieChart, 
  LineChart,
  LayoutGrid,
  Sparkles
} from "lucide-react"

interface AnimalAISummaryProps {
  animalData: any
}

export default function AnimalAISummary({ animalData }: AnimalAISummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false)
  const [isAnalysisUpdated, setIsAnalysisUpdated] = useState(false)
  const [hasAiWritten, setHasAiWritten] = useState(true)
  const [aiInputValue, setAiInputValue] = useState("已生成")
  
  // 获取动物图标
  const getAnimalIcon = (species: string) => {
    const icons: Record<string, string> = {
      "小鼠": "🐭",
      "大鼠": "🐀", 
      "兔": "🐰",
      "豚鼠": "🐹",
      "猴": "🐒",
      "犬": "🐕"
    };
    return icons[species] || "🐾";
  };
  
  // 处理更新分析
  const handleUpdateAnalysis = () => {
    setIsUpdatingAnalysis(true)
    
    // 模拟分析过程
    setTimeout(() => {
      setIsUpdatingAnalysis(false)
      setIsAnalysisUpdated(true)
      setHasAiWritten(true)
    }, 3000)
  }
  
  // 根据动物种类和状态生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const species = animalData.species || "未知物种"
    const status = animalData.status || "未知状态"
    const healthScore = animalData.healthScore || "良好"
    const age = animalData.age || "未知"
    const weight = animalData.weight || "未知"
    
    if (isUpdated) {
      if (species === "小鼠") {
        return `该${animalData.animalId}号小鼠为${animalData.strain}品系，${animalData.gender}性，年龄${age}周，体重${weight}g。最新分析显示，动物健康状态为${status}，健康评分${healthScore}，生长发育正常。该小鼠适应性良好，活动正常，食欲稳定，无明显应激反应。建议继续按照标准饲养程序管理，定期监测体重变化和行为表现。该动物在实验研究中表现稳定，数据可靠性高，为科研项目提供优质的实验对象。`
      } else if (species === "大鼠") {
        return `该${animalData.animalId}号大鼠为${animalData.strain}品系，${animalData.gender}性，年龄${age}周，体重${weight}g。最新分析显示，动物整体状况为${status}，健康评分${healthScore}，各项生理指标正常。大鼠活动能力强，反应敏捷，社交行为正常，无异常症状。建议继续保持良好的饲养环境，注意营养均衡和环境富集。该动物为实验研究提供可靠的数据支撑，实验价值较高。`
      } else if (species === "兔") {
        return `该${animalData.animalId}号兔为${animalData.strain}品系，${animalData.gender}性，年龄${age}周，体重${weight}g。最新分析显示，动物健康状况为${status}，健康评分${healthScore}，体型发育良好。兔子精神状态佳，食欲正常，毛色光泽，无呼吸道疾病症状。建议注意饲料质量和饮水清洁，定期检查牙齿和爪子健康。该动物符合实验标准，为相关研究提供高质量的实验支持。`
      } else if (species === "豚鼠") {
        return `该${animalData.animalId}号豚鼠为${animalData.strain}品系，${animalData.gender}性，年龄${age}周，体重${weight}g。最新分析显示，动物状态为${status}，健康评分${healthScore}，适应环境良好。豚鼠活泼好动，发声正常，社群行为稳定，无应激症状。建议补充维生素C，保持适宜的温湿度环境，提供充足的运动空间。该动物健康状况优良，为实验研究提供可靠保障。`
      } else {
        return `该${animalData.animalId}号${species}为${animalData.strain || "标准"}品系，${animalData.gender}性，年龄${age}周，体重${weight}g。最新分析显示，动物整体状况为${status}，健康评分${healthScore}，各项指标正常。建议按照标准动物福利要求进行饲养管理，定期健康检查。该动物为科研工作提供可靠的实验支持，数据质量良好。`
      }
    } else {
      if (species === "小鼠") {
        return `该${animalData.animalId}号小鼠为${animalData.strain}品系实验动物，具有良好的遗传稳定性和实验重现性。当前健康状态为${status}，年龄${age}周，体重${weight}g，适合用于多种生物医学研究。`
      } else if (species === "大鼠") {
        return `该${animalData.animalId}号大鼠为${animalData.strain}品系实验动物，具有较强的适应性和稳定的生理特征。当前状态为${status}，为行为学和生理学研究提供良好的实验对象。`
      } else if (species === "兔") {
        return `该${animalData.animalId}号兔为${animalData.strain}品系实验动物，体型适中，生理特征稳定。当前健康状态为${status}，适合用于药理学和毒理学研究。`
      } else if (species === "豚鼠") {
        return `该${animalData.animalId}号豚鼠为${animalData.strain}品系实验动物，具有独特的生理特征和良好的实验适应性。当前状态为${status}，为特定研究领域提供重要支持。`
      } else {
        return `该${animalData.animalId}号${species}为实验动物，具有稳定的遗传背景和良好的健康状况。当前状态为${status}，为科研项目提供可靠的实验支持。`
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const species = animalData.species || "未知物种"
    const status = animalData.status || "正常"
    const age = animalData.age || 0
    const weight = animalData.weight || 0
    
    if (isUpdated) {
      if (species === "小鼠") {
        return [
          "定期监测体重变化，确保营养状况良好",
          "观察日常行为活动，及时发现异常症状", 
          "保持饲养环境清洁，减少感染风险"
        ]
      } else if (species === "大鼠") {
        return [
          "加强环境富集，提供适当的运动空间",
          "定期健康检查，监测生理指标变化",
          "注意社群管理，避免打斗和应激"
        ]
      } else if (species === "兔") {
        return [
          "确保饲料新鲜，避免霉变和污染",
          "定期检查牙齿健康，预防牙齿过度生长",
          "保持适宜温度，避免热应激"
        ]
      } else if (species === "豚鼠") {
        return [
          "补充维生素C，预防坏血病发生",
          "保持环境安静，减少噪音应激",
          "定期清洁笼具，维护卫生环境"
        ]
      } else {
        return [
          "按照物种特性制定饲养管理方案",
          "定期进行健康评估和行为观察",
          "确保动物福利要求得到满足"
        ]
      }
    } else {
      if (status === "健康") {
        return [
          "继续保持良好的饲养管理状态",
          "定期进行健康监测和记录",
          "确保动物福利和实验质量"
        ]
      } else if (status === "观察中") {
        return [
          "加强健康监测，密切观察动物状态",
          "必要时进行兽医检查和治疗",
          "记录观察结果，制定后续方案"
        ]
      } else if (age > 52) { // 超过一年的动物
        return [
          "关注老龄动物的特殊需求",
          "调整饲养管理方案和营养配比",
          "定期评估实验适用性"
        ]
      } else {
        return [
          "建立完善的动物健康档案",
          "制定个性化的饲养管理计划",
          "确保动物在最佳状态下参与实验"
        ]
      }
    }
  }

  // 设置进度条动画
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
  @keyframes progress {
    0% { width: 0%; }
    10% { width: 10%; }
    30% { width: 40%; }
    50% { width: 60%; }
    70% { width: 75%; }
    90% { width: 90%; }
    100% { width: 100%; }
  }
  
  .animate-progress {
    animation: progress 3s ease-in-out;
  }
`
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm">
      {/* 添加渐变色线条 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <CardHeader className="pb-1 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span>AI智能分析</span>
                <Badge
                  variant="outline"
                  className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2 tracking-wide font-normal border border-primary/20"
                >
                  v2.4.1
                </Badge>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">AI模型: GPT-Animal 2023</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 relative bg-white hover:bg-primary/5 border border-slate-200 shadow-sm"
            onClick={handleUpdateAnalysis}
            disabled={isUpdatingAnalysis}
          >
            {isUpdatingAnalysis ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span className="text-xs">分析中...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-xs">更新分析</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="pl-9 relative">
          {isUpdatingAnalysis && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-opacity-20 border-t-primary animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-amber-400 border-opacity-20 border-r-amber-400 animate-spin"></div>
                </div>
                <div className="text-sm font-medium text-slate-700">AI模型分析中</div>
              </div>
              <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-progress rounded-full"></div>
              </div>
              <div className="text-xs text-slate-500 mt-2">正在分析动物档案数据并生成智能洞察...</div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-start gap-4 my-3 py-2"
              >
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <div className="text-xs text-slate-600">
                    <span>健康状态</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "优秀" : "良好"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <PieChart className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-slate-600">
                    <span>适应性评估</span>
                    <div className="font-semibold text-sm text-slate-900">
                      {isAnalysisUpdated ? (
                        <>
                          适应良好 <span className="text-green-600 text-xs">✓</span>
                        </>
                      ) : (
                        "稳定"
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <LineChart className="h-4 w-4 text-green-600" />
                  <div className="text-xs text-slate-600">
                    <span>实验价值</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "高价值" : "良好"}</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="prose prose-sm max-w-none text-slate-700 leading-relaxed"
              >
                {isAnalysisUpdated ? (
                  <>
                    <div className="flex items-center gap-2 mb-3 text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100">
                      <LayoutGrid className="h-4 w-4" />
                      <span className="font-medium">最新分析已更新 - 检测到动物健康和生长状态变化</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>健康状态</span>
                          <div className="font-semibold text-sm text-slate-900">优秀</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>适应性评估</span>
                          <div className="font-semibold text-sm text-slate-900">
                            适应良好 <span className="text-green-600 text-xs">✓</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>实验价值</span>
                          <div className="font-semibold text-sm text-slate-900">高价值</div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                      <span className="font-medium text-primary">AI建议：</span>
                      {generateAIRecommendations(true).map((recommendation, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 mt-1">
                          <ChevronRight className="h-3.5 w-3.5 text-primary" />
                          <span>{recommendation}</span>
                          <br />
                        </span>
                      ))}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      {generateAISummary(false)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>健康状态</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>适应性评估</span>
                          <div className="font-semibold text-sm text-slate-900">稳定</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>实验价值</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                      <span className="font-medium text-primary">AI建议：</span>
                      {generateAIRecommendations(false).map((recommendation, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 mt-1">
                          <ChevronRight className="h-3.5 w-3.5 text-primary" />
                          <span>{recommendation}</span>
                          <br />
                        </span>
                      ))}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-end items-center text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            <div className="flex-1 flex items-center gap-2">
              <div className="inline-flex h-5 items-center rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-900">
                可信度 94%
              </div>
              <span>分析时间: {isAnalysisUpdated ? "2024-04-03 17:45" : "2024-04-01 10:35"}</span>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-slate-500 hover:text-slate-900"
                onClick={() => {
                  // 复制文本到剪贴板
                  navigator.clipboard.writeText(
                    generateAISummary(isAnalysisUpdated)
                  )
                  toast({
                    title: "已复制到剪贴板",
                    description: "AI智能分析内容已复制",
                    duration: 2000,
                  })
                }}
              >
                <Copy className="h-3 w-3" />
                <span>复制</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 ml-1 gap-1 text-slate-500 hover:text-slate-900"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <motion.div animate={{ rotate: isCollapsed ? 90 : -90 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="h-3 w-3" />
                </motion.div>
                <span>{isCollapsed ? "展开" : "收起"}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* 隐藏的输入框，用于控制AI按钮的显示/隐藏 */}
      <input
        type="text"
        className="hidden"
        value={aiInputValue}
        onChange={(e) => {
          setAiInputValue(e.target.value)
          if (e.target.value.trim() === "") {
            setHasAiWritten(false)
          }
        }}
      />
    </Card>
  )
}