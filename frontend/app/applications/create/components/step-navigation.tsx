"use client"

import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"

// 定义步骤类型
export interface Step {
  id: number
  name: string
  description?: string
}

// 定义步骤列表
export const STEPS: Step[] = [
  {
    id: 0,
    name: "基本信息",
    description: "填写申报计划基本信息",
  },
  {
    id: 1,
    name: "申报材料",
    description: "添加申报材料和附件",
  },
  {
    id: 2,
    name: "时间节点",
    description: "设置关键时间节点",
  },
  {
    id: 3,
    name: "特殊要求",
    description: "添加特殊要求和限制",
  },
  {
    id: 4,
    name: "完成",
    description: "确认并提交",
  },
]

interface StepNavigationProps {
  currentStep: number
  goToStep: (step: number) => void
  validationErrors?: Record<string, boolean>
  completedSteps?: number[]
}

export function StepNavigation({
  currentStep,
  goToStep,
  validationErrors = {},
  completedSteps = [],
}: StepNavigationProps) {
  // 检查步骤是否有错误
  const hasStepError = (step: number) => {
    if (step === 0) {
      return Object.keys(validationErrors).some(
        (key) => ["name", "category", "startDate", "endDate", "guide"].includes(key) && validationErrors[key],
      )
    }
    if (step === 1) {
      return validationErrors["materials"] === true
    }
    if (step === 2) {
      return validationErrors["keyDates"] === true
    }
    if (step === 3) {
      return validationErrors["requirements"] === true
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
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative w-full">
            {/* 连接线 */}
            {index < STEPS.length - 1 && (
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
                    : "bg-background border-muted-foreground/30 text-muted-foreground",
                hasStepError(index) && "border-destructive bg-destructive/10",
              )}
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
