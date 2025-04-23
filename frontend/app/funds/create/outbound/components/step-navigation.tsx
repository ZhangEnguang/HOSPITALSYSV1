"use client"

import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"

// 定义步骤类型
export interface Step {
  id: number
  name: string
  description?: string
}

// 定义经费外拨步骤列表
export const STEPS: Step[] = [
  {
    id: 0,
    name: "基本信息",
    description: "填写外拨基本信息",
  },
  {
    id: 1,
    name: "项目与分类",
    description: "选择项目和外拨类别",
  },
  {
    id: 2,
    name: "金额与收款",
    description: "填写金额和收款信息",
  },
  {
    id: 3,
    name: "附件上传",
    description: "上传相关附件",
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
  validationErrors?: Record<string, string>
  completedSteps?: number[]
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
  const hasStepError = (step: number) => {
    if (step === 0) {
      return Object.keys(validationErrors).some(
        (key) => ["name", "date"].includes(key) && validationErrors[key]
      )
    }
    if (step === 1) {
      return Object.keys(validationErrors).some(
        (key) => ["projectId", "category"].includes(key) && validationErrors[key]
      )
    }
    if (step === 2) {
      return Object.keys(validationErrors).some(
        (key) => ["amount", "recipient", "recipientAccount", "recipientBank"].includes(key) && validationErrors[key]
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
                  : "bg-background border-muted-foreground/20 text-muted-foreground",
                hasStepError(index) && "border-destructive",
              )}
            >
              {hasStepError(index) ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : currentStep > index || isStepCompleted(index) ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </button>

            {/* 步骤名称 */}
            <div className="mt-2 text-center">
              <p
                className={cn(
                  "text-sm font-medium",
                  currentStep === index
                    ? "text-primary"
                    : currentStep > index || isStepCompleted(index)
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {step.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
