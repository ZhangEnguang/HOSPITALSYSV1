"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AISidebarProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  currentStep: number
}

export function AISidebar({ formData, handleInputChange, currentStep }: AISidebarProps) {
  const [activeTab, setActiveTab] = useState<"ai-fill" | "ai-analysis">("ai-fill")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  // 模拟 AI 分析过程
  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisComplete(false)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsAnalyzing(false)
            setAnalysisComplete(true)
            setAnalysisResults({
              score: 85,
              suggestions: [
                "建议增加项目预算详细说明",
                "可以补充更多团队成员的专业背景",
                "建议添加项目预期成果的量化指标",
              ],
              strengths: ["项目目标明确", "团队结构合理", "预算规划符合要求"],
            })
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 800)
  }

  // 智能填充字段
  const handleAIFill = (field: string) => {
    // 模拟 AI 填充
    const aiSuggestions: Record<string, string> = {
      项目名称: "基于人工智能的农业灌溉优化系统研究",
      所属单位: "计算机科学与技术学院",
      项目分类: "基础研究",
      项目级别: "国家级",
      经费来源: "国家自然科学基金",
      项目状态: "申请中",
      开始日期: "2025-01-01",
      结束日期: "2027-12-31",
      项目负责人: "张教授",
      职称: "教授",
      联系电话: "13800138000",
      电子邮箱: "zhang@example.edu.cn",
      预算金额: "500000",
    }

    if (aiSuggestions[field]) {
      // 模拟加载效果
      toast({
        title: "AI 智能填充",
        description: `正在为您填充"${field}"...`,
        duration: 1500,
      })

      setTimeout(() => {
        handleInputChange(field, aiSuggestions[field])
        toast({
          title: "填充完成",
          description: `已为您填充"${field}"`,
          duration: 2000,
        })
      }, 1500)
    }
  }

  return (
    <Card className="sticky top-4 border-blue-200/50">
      <div className="flex border-b border-muted/30">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === "ai-fill"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("ai-fill")}
        >
          AI 智能填充
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === "ai-analysis"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("ai-analysis")}
        >
          AI 分析
        </button>
      </div>

      <CardContent className="p-4">
        {activeTab === "ai-fill" && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              AI 可以帮助您快速填充表单字段，提高效率。
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">推荐填充字段</h3>

              <div className="grid gap-2">
                {currentStep === 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => handleAIFill("项目名称")}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">项目名称</span>
                        <span className="text-xs text-muted-foreground">根据项目类型生成合适名称</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => handleAIFill("所属单位")}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">所属单位</span>
                        <span className="text-xs text-muted-foreground">根据项目内容推荐合适单位</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => handleAIFill("项目分类")}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">项目分类</span>
                        <span className="text-xs text-muted-foreground">智能推荐合适的项目分类</span>
                      </div>
                    </Button>
                  </>
                )}

                {currentStep === 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2"
                    onClick={() => handleAIFill("预算金额")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">预算金额</span>
                      <span className="text-xs text-muted-foreground">根据项目类型推荐合理预算</span>
                    </div>
                  </Button>
                )}

                <Button variant="default" size="sm" className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500">
                  一键智能填充所有字段
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">上传文件智能提取</h3>
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-4 text-center">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground/70" />
                <p className="text-sm mt-2 text-muted-foreground">拖放或点击上传项目申请书，AI 将自动提取信息</p>
                <Button variant="outline" size="sm" className="mt-2">
                  选择文件
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai-analysis" && (
          <div className="space-y-4">
            {!isAnalyzing && !analysisComplete && (
              <>
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                  AI 可以分析您的项目信息，提供改进建议和评分。
                </div>

                <Button onClick={startAnalysis} className="w-full bg-gradient-to-r from-blue-600 to-blue-500">
                  开始 AI 分析
                </Button>
              </>
            )}

            {isAnalyzing && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                  AI 正在分析您的项目信息，请稍候...
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>分析进度</span>
                    <span>{Math.round(analysisProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>

                  <div className="text-xs text-muted-foreground animate-pulse">正在分析项目可行性...</div>
                </div>
              </div>
            )}

            {analysisComplete && analysisResults && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">项目评分</h3>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-blue-600">{analysisResults.score}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">改进建议</h4>
                    <ul className="space-y-1">
                      {analysisResults.suggestions.map((suggestion: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">项目优势</h4>
                    <ul className="space-y-1">
                      {analysisResults.strengths.map((strength: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={startAnalysis}>
                  重新分析
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

