"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Check, Cpu, FileUp, Database, BrainCircuit, Sparkles, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface AnalysisStep {
  name: string
  fields: string[]
}

interface AnalysisProgressProps {
  analysisProgress: number
  currentAnalysisStep: number
  analysisSteps: AnalysisStep[]
  renderAnalyzedFieldsList: () => React.ReactNode
}

export const AnalysisProgress = ({
  analysisProgress,
  currentAnalysisStep,
  analysisSteps,
  renderAnalyzedFieldsList,
}: AnalysisProgressProps) => {
  // 分析步骤图标
  const analysisStepIcons = [
    <FileUp key="fileup" className="h-3.5 w-3.5" />,
    <Database key="database" className="h-3.5 w-3.5" />,
    <BrainCircuit key="brain" className="h-3.5 w-3.5" />,
    <Cpu key="cpu" className="h-3.5 w-3.5" />,
    <Sparkles key="sparkles" className="h-3.5 w-3.5" />,
  ]

  return (
    <div className="space-y-4 mt-6">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between text-sm">
          <span>分析进度</span>
          <span>{analysisProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${analysisProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      <motion.div
        className="border rounded-lg p-4 bg-muted/5 border-muted/50 mb-4 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="font-medium mb-3 flex items-center">
          <Loader2 className="h-4 w-4 mr-2 text-primary animate-spin" />
          文件扫描中
        </div>
        <div className="relative h-40 border border-dashed border-muted/70 rounded-md bg-muted/5 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              正在扫描文档内容...
            </motion.div>
          </div>

          {/* 扫描线动画 */}
          <motion.div
            className="absolute top-0 left-0 w-full h-0.5 bg-primary/40"
            initial={{ scaleX: 0, transformOrigin: "left", y: 0 }}
            animate={{
              scaleX: [0, 1, 1, 0],
              y: [0, 0, "100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              times: [0, 0.4, 0.6, 1],
            }}
          />

          <div className="absolute inset-0 p-3">
            <motion.div className="space-y-2 text-xs text-muted-foreground/90 font-mono">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex items-center"
              >
                <div className="w-16 text-primary/70">标题:</div>
                <div>基于人工智能的科研数据分析平台</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.3 }}
                className="flex items-center"
              >
                <div className="w-16 text-primary/70">项目类型:</div>
                <div>技术研发</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
                className="flex items-center"
              >
                <div className="w-16 text-primary/70">负责人:</div>
                <div>张明</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.3 }}
                className="flex items-start"
              >
                <div className="w-16 text-primary/70">研究目标:</div>
                <div className="flex-1">开发一套智能化科研数据处理系统，提高数据分析效率和准确性</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.3 }}
                className="flex items-start"
              >
                <div className="w-16 text-primary/70">关键词:</div>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-primary/10 px-1.5 rounded text-primary/80">人工智能</span>
                  <span className="bg-primary/10 px-1.5 rounded text-primary/80">数据分析</span>
                  <span className="bg-primary/10 px-1.5 rounded text-primary/80">科研平台</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.0, duration: 0.3 }}
                className="flex items-start"
              >
                <div className="w-16 text-primary/70">预算:</div>
                <div>￥500,000</div>
              </motion.div>
            </motion.div>
          </div>

          {/* 扫描完成指示 */}
          <motion.div
            className="absolute bottom-2 right-2 text-xs text-primary flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.3 }}
          >
            <Check className="h-3 w-3 mr-1" />
            文档扫描完成
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="border rounded-lg p-4 bg-muted/5 border-muted/50 relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-grid-small-white/[0.2] bg-[length:16px_16px] dark:bg-grid-small-white/[0.05] opacity-30" />

        <div className="font-medium mb-3 flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-primary" />
          AI分析进度
        </div>
        <div className="space-y-4 text-sm relative">
          {analysisSteps.map((step, index) => {
            const isCompleted = analysisProgress >= (index + 1) * 20
            const isActive = analysisProgress >= index * 20 && analysisProgress < (index + 1) * 20

            return (
              <div className="flex items-center" key={index}>
                <motion.div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-colors",
                    isCompleted
                      ? "bg-primary text-white"
                      : isActive
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground",
                  )}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : analysisStepIcons[index]}
                </motion.div>
                <div className="flex-1">
                  <div
                    className={cn(
                      "font-medium transition-colors",
                      isCompleted ? "text-primary" : isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.name}
                  </div>
                  {isActive && (
                    <motion.div
                      className="h-1 bg-primary/20 mt-1 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  )}
                </div>
                {isCompleted && (
                  <Badge variant="outline" className="ml-auto bg-primary/10 text-primary border-primary/20">
                    完成
                  </Badge>
                )}
                {isActive && (
                  <Badge variant="outline" className="ml-auto bg-muted/50 text-muted-foreground animate-pulse">
                    处理中
                  </Badge>
                )}
              </div>
            )
          })}
        </div>

        {/* 已分析字段滚动列表 */}
        {renderAnalyzedFieldsList()}
      </motion.div>
    </div>
  )
}

