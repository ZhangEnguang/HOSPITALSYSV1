"use client"

import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"

// 定义步骤类型
export interface Step {
  id: number
  name: string
  description?: string
}

// 定义步骤列表，按要求修改步骤名称
export const STEPS: Step[] = [
  {
    id: 0,
    name: "基本信息",
    description: "填写合同基本信息",
  },
  {
    id: 1,
    name: "用章信息",
    description: "填写用章申请信息",
  },
  {
    id: 2,
    name: "供方信息",
    description: "填写供应商相关信息",
  },
  {
    id: 3,
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
        (key) => [
          "项目名称", 
          "合同标题", 
          "合同金额", 
          "负责人电话", 
          "所属部门", 
          "支付方式", 
          "开始日期", 
          "结束日期",
          "签订日期",
          "合同状态",
          "合同电子版"
        ].includes(key) && validationErrors[key],
      )
    }
    if (step === 1) {
      return Object.keys(validationErrors).some(
        (key) => ["用章类型", "用章用途", "用章数量", "申请人", "申请日期"].includes(key) && validationErrors[key],
      )
    }
    if (step === 2) {
      return Object.keys(validationErrors).some(
        (key) => ["供应商名称", "联系人", "联系电话", "供应商地址", "营业执照"].includes(key) && validationErrors[key],
      )
    }
    return false
  }

  // 检查步骤是否已完成
  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step)
  }

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
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
                "mt-2 text-xs font-medium text-center",
                currentStep === index
                  ? "text-primary"
                  : currentStep > index || isStepCompleted(index)
                    ? "text-primary"
                    : "text-muted-foreground",
                "hidden sm:block"
              )}
            >
              {step.name}
            </span>
            <span
              className={cn(
                "mt-2 text-xs font-medium text-center",
                currentStep === index
                  ? "text-primary"
                  : currentStep > index || isStepCompleted(index)
                    ? "text-primary"
                    : "text-muted-foreground",
                "sm:hidden"
              )}
            >
              {index === currentStep ? step.name : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 