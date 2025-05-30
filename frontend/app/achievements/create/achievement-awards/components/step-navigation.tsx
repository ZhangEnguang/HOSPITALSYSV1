"use client"

import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"
import { BookOpen, Users, Award, Upload, CheckCircle } from "lucide-react"

// 定义步骤类型
export interface Step {
  id: number
  name: string
  description?: string
  icon: React.ReactNode
}

// 定义步骤列表
export const STEPS: Step[] = [
  { id: 0, name: "基本信息", description: "填写奖励基本信息", icon: <BookOpen className="h-4 w-4" /> },
  { id: 1, name: "获奖人信息", description: "添加获奖人员信息", icon: <Users className="h-4 w-4" /> },
  { id: 2, name: "奖励信息", description: "填写奖励详细信息", icon: <Award className="h-4 w-4" /> },
  { id: 3, name: "文档上传", description: "上传相关证明文档", icon: <Upload className="h-4 w-4" /> },
  { id: 4, name: "完成", description: "确认并提交", icon: <CheckCircle className="h-4 w-4" /> },
]

interface StepNavigationProps {
  currentStep: number
  goToStep: (step: number) => void
  validationErrors: Record<string, boolean>
  completedSteps: number[]
  steps?: Step[]
}

export function StepNavigation({
  currentStep,
  goToStep,
  validationErrors = {},
  completedSteps = [],
  steps = STEPS,
}: StepNavigationProps) {
  // 检查步骤是否有错误
  const hasStepError = (stepIndex: number): boolean => {
    if (stepIndex === 0) {
      return !!(
        validationErrors["奖励名称"] ||
        validationErrors["奖励级别"] ||
        validationErrors["获奖日期"] ||
        validationErrors["颁奖单位"]
      )
    } else if (stepIndex === 1) {
      return !!(
        validationErrors["第一获奖人"] ||
        validationErrors["本人贡献"]
      )
    } else if (stepIndex === 2) {
      return !!(
        validationErrors["奖励类别"] ||
        validationErrors["奖励等级"] ||
        validationErrors["证书编号"]
      )
    }
    return false
  }

  // 检查步骤是否已完成
  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step)
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative w-full">
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-1/2 w-full h-[2px]",
                  currentStep > index ? "bg-primary" : isStepCompleted(index) ? "bg-primary" : "bg-muted-foreground/20",
                )}
              />
            )}

            {/* 步骤圆点 */}
            <button
              onClick={() => goToStep(index)}
              disabled={currentStep < index && !isStepCompleted(currentStep)}
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                currentStep === index
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep > index || isStepCompleted(index)
                  ? "bg-primary border-primary text-primary-foreground"
                  : hasStepError(index)
                  ? "bg-white border-destructive text-destructive"
                  : "bg-white border-muted-foreground/30 text-muted-foreground/70",
              )}
              type="button"
            >
              {hasStepError(index) ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : currentStep > index || isStepCompleted(index) ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </button>

            {/* 步骤名称 */}
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                currentStep === index
                  ? "text-primary"
                  : currentStep > index || isStepCompleted(index)
                    ? "text-primary"
                    : "text-muted-foreground",
              )}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
