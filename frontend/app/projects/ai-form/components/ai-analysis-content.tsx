"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, Sparkles, MessageSquare, RefreshCw, Loader2 } from "lucide-react"

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
  return (
    <>
      {!hasAnalyzed ? (
        <div className="flex flex-col items-center justify-center h-full space-y-6 py-8">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center">
            <BrainCircuit className="h-12 w-12 text-primary/50" />
          </div>

          <div className="text-center space-y-2 max-w-[250px]">
            <h3 className="font-medium">AI项目分析</h3>
            <p className="text-sm text-muted-foreground">点击下方按钮开始分析您的项目，AI将提供专业建议和优化方向</p>
          </div>

          <Button
            className="bg-gradient-to-r from-blue-600 via-primary to-red-500 hover:opacity-90 relative overflow-hidden"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer"></div>
            <div className="relative flex items-center justify-center">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  开始智能分析
                </>
              )}
            </div>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2 bg-muted/5 p-3 rounded-lg border border-muted/30 mb-4">
            <p className="flex items-start">
              <Sparkles className="h-3.5 w-3.5 mr-2 mt-0.5 text-primary" />
              AI已分析您的项目内容并提供专业建议
            </p>
            <p className="flex items-start">
              <Sparkles className="h-3.5 w-3.5 mr-2 mt-0.5 text-primary" />
              点击"重新分析"可获取更新的评估结果
            </p>
          </div>

          <AnimatePresence>
            {showProjectType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-primary/5 to-transparent p-4 rounded-lg border border-primary/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-grid-small-white/[0.2] bg-[length:16px_16px] dark:bg-grid-small-white/[0.05] opacity-30" />

                <div className="flex justify-between items-center mb-3 relative">
                  <h3 className="font-medium text-sm flex items-center">
                    <BrainCircuit className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    项目类型分析
                  </h3>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    置信度: {confidence}%
                  </Badge>
                </div>

                <div className="p-3 bg-background/50 rounded-md mb-4">
                  <p className="text-sm">
                    根据您上传的文件内容，AI判断这是一个
                    <span className="font-semibold text-primary">纵向科研项目</span>
                    ，主要特征是政府资助、有明确的研究目标和时间节点。
                  </p>
                </div>
              </motion.div>
            )}

            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-primary/5 to-transparent p-4 rounded-lg border border-primary/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-grid-small-white/[0.2] bg-[length:16px_16px] dark:bg-grid-small-white/[0.05] opacity-30" />

                <div className="flex justify-between items-center mb-3 relative">
                  <h3 className="font-medium text-sm flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    关键要点建议
                  </h3>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    3项建议
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-background/50 rounded-md flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-2 shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-sm">建议在项目描述中强调创新点和技术路线，这对纵向项目评审非常重要。</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-md flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-2 shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-sm">项目预算应详细列出设备费、材料费和测试费，符合政府资助项目规范。</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-md flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-2 shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-sm">团队成员应包含不同专业背景的研究人员，体现多学科交叉特点。</p>
                  </div>
                </div>
              </motion.div>
            )}

            {showCompletion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-primary/5 to-transparent p-4 rounded-lg border border-primary/20 relative overflow-hidden mt-4"
              >
                <div className="absolute inset-0 bg-grid-small-white/[0.2] bg-[length:16px_16px] dark:bg-grid-small-white/[0.05] opacity-30" />

                <div className="flex justify-between items-center mb-3 relative">
                  <h3 className="font-medium text-sm flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    完善建议
                  </h3>
                </div>

                <div className="p-3 bg-background/50 rounded-md">
                  <p className="text-sm">
                    您的项目信息已完成<span className="font-semibold text-primary">68%</span>
                    ，建议补充以下内容以提高项目质量：
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></div>
                      项目风险评估
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></div>
                      预期成果的量化指标
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></div>
                      知识产权保护计划
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showCompletion && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed relative overflow-hidden"
                onClick={handleReanalyze}
                disabled={isAnalyzing}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer"></div>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    重新分析项目
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

