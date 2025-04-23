"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, RefreshCw, Sparkles, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AIAnalysisContentProps {
  hasAnalyzed: boolean
  isAnalyzing: boolean
  confidence: number
  showProjectType: boolean
  showSuggestions: boolean
  showCompletion: boolean
  handleStartAnalysis: () => void
  handleReanalyze: () => void
}

export const AIAnalysisContent = ({
  hasAnalyzed,
  isAnalyzing,
  confidence,
  showProjectType,
  showSuggestions,
  showCompletion,
  handleStartAnalysis,
  handleReanalyze,
}: AIAnalysisContentProps) => {
  // 分析结果数据
  const analysisResults = {
    projectType: "科研项目",
    projectCategory: "基础研究",
    riskLevel: "中等",
    suggestions: [
      "建议增加项目预算说明文档",
      "建议明确项目成员分工",
      "建议添加项目里程碑计划",
      "建议补充相关领域研究背景",
    ],
  }

  return (
    <div className="space-y-6">
      {!hasAnalyzed ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <BrainCircuit className="h-10 w-10 text-blue-500" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">AI项目分析</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI将分析您的项目信息，提供项目类型识别、风险评估和优化建议
            </p>
          </div>

          <Button
            className="w-full relative overflow-hidden transition-all duration-500 bg-gradient-to-r from-blue-600 via-primary to-red-500 hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
          >
            {/* 发光效果 */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine"></div>

            <div className="relative flex items-center justify-center">
              {isAnalyzing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  分析中...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  开始分析
                </>
              )}
            </div>
          </Button>
        </div>
      ) : isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center relative">
            <BrainCircuit className="h-10 w-10 text-blue-500" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">正在分析项目</h3>
            <p className="text-sm text-muted-foreground">AI正在分析您的项目信息，请稍候...</p>
          </div>

          <Progress value={65} className="w-full h-2" />

          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>项目类型识别</span>
              <span>完成</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>项目风险评估</span>
              <span>进行中...</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>生成优化建议</span>
              <span>等待中...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 分析结果头部 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
              <h3 className="font-medium">分析结果</h3>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              置信度: {confidence}%
            </Badge>
          </div>

          {/* 项目类型识别 */}
          {showProjectType && (
            <div className="space-y-3 animate-in fade-in-50 duration-500">
              <div className="flex items-center">
                <div className="w-1 h-5 bg-blue-500 rounded-full mr-2"></div>
                <h4 className="text-sm font-medium">项目类型识别</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/80 border border-muted/30 shadow-sm">
                  <div className="text-xs text-muted-foreground mb-1">项目类型</div>
                  <div className="font-medium">{analysisResults.projectType}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/80 border border-muted/30 shadow-sm">
                  <div className="text-xs text-muted-foreground mb-1">项目分类</div>
                  <div className="font-medium">{analysisResults.projectCategory}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/80 border border-muted/30 shadow-sm">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
                  <div className="text-sm font-medium">风险评估</div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <Progress
                      value={60}
                      className="h-2"
                      indicatorClassName="bg-gradient-to-r from-green-500 to-amber-500"
                    />
                  </div>
                  <div className="ml-3 text-sm font-medium text-amber-600">{analysisResults.riskLevel}</div>
                </div>
              </div>
            </div>
          )}

          {/* 优化建议 */}
          {showSuggestions && (
            <div className="space-y-3 animate-in fade-in-50 duration-500">
              <div className="flex items-center">
                <div className="w-1 h-5 bg-indigo-500 rounded-full mr-2"></div>
                <h4 className="text-sm font-medium">优化建议</h4>
              </div>

              <div className="p-3 rounded-lg bg-white/80 border border-muted/30 shadow-sm space-y-2">
                {analysisResults.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <Lightbulb className="h-4 w-4 mr-2 text-indigo-500 mt-0.5 shrink-0" />
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 完成提示 */}
          {showCompletion && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-100 animate-in fade-in-50 duration-500">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                <h4 className="font-medium text-green-800">分析完成</h4>
              </div>
              <p className="text-sm text-green-700">
                AI已完成项目分析，您可以根据以上建议优化您的项目信息，提高项目成功率。
              </p>
            </div>
          )}

          {/* 重新分析按钮 */}
          {showCompletion && (
            <Button
              className="w-full relative overflow-hidden transition-all duration-500 bg-gradient-to-r from-blue-600 via-primary to-red-500 hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleReanalyze}
            >
              {/* 发光效果 */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine"></div>

              <div className="relative flex items-center justify-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                重新分析
              </div>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

