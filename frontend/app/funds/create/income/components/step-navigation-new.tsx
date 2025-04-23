"use client"

import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"

// 定义步骤类型
export interface Step {
  id: number
  name: string
  description?: string
}

// 定义经费入账步骤列表 - 已更新为新的步骤
export const INCOME_STEPS: Step[] = [
  {
    id: 0,
    name: "银行来款",
    description: "填写银行来款信息",
  },
  {
    id: 1,
    name: "经费认领",
    description: "填写经费认领信息",
  },
  {
    id: 2,
    name: "完成",
    description: "确认并提交",
  },
]

interface StepNavigationProps {
  currentStep: number
  goToStep: (step: number) => void
  validationErrors?: Record<string, boolean>
  completedSteps?: number[]
  steps?: Step[]
}

export function StepNavigation({
  currentStep,
  goToStep,
  validationErrors = {},
  completedSteps = [],
  steps = INCOME_STEPS,
}: StepNavigationProps) {
  // 检查步骤是否有错误
  const hasStepError = (step: number) => {
    if (step === 0) {
      return Object.keys(validationErrors).some(
        (key) => ["来款名称", "来款金额", "入账日期"].includes(key) && validationErrors[key],
      )
    }
    if (step === 1) {
      return Object.keys(validationErrors).some(
        (key) => ["关联项目", "入账类别", "经费来源"].includes(key) && validationErrors[key],
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
              disabled={currentStep < index && !isStepCompleted(index)}
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