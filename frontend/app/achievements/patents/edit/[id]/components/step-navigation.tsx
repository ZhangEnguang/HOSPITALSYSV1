"use client"

import { CheckIcon } from "lucide-react"
import { BookOpen, Users, FileText, Upload, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// 定义步骤类型
export interface Step {
  id: number
  name: string
  icon: React.ReactNode
}

// 定义步骤列表
export const STEPS: Step[] = [
  { id: 1, name: "基本信息", icon: <BookOpen className="h-4 w-4" /> },
  { id: 2, name: "发明人信息", icon: <Users className="h-4 w-4" /> },
  { id: 3, name: "专利详情", icon: <FileText className="h-4 w-4" /> },
  { id: 4, name: "文档上传", icon: <Upload className="h-4 w-4" /> },
  { id: 5, name: "完成", icon: <CheckCircle className="h-4 w-4" /> },
]

interface StepNavigationProps {
  currentStep: number
  completedSteps: number[]
  validationErrors: Record<string, string>
  goToStep: (step: number) => void
}

export function StepNavigation({
  currentStep,
  completedSteps,
  validationErrors,
  goToStep,
}: StepNavigationProps) {
  // 检查当前步骤是否存在验证错误
  const hasCurrentStepError = Object.keys(validationErrors).length > 0

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
                  currentStep > step.id ? "bg-primary" : completedSteps.includes(step.id) ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}

            {/* 步骤圆点 */}
            <button
              type="button"
              onClick={() => goToStep(step.id)}
              disabled={!completedSteps.includes(step.id) && step.id !== currentStep && step.id !== currentStep + 1}
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                currentStep === step.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep > step.id || completedSteps.includes(step.id)
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.id === currentStep && hasCurrentStepError
                  ? "bg-white border-destructive text-destructive"
                  : "bg-white border-muted-foreground/30 text-muted-foreground/70"
              )}
            >
              {currentStep > step.id || completedSteps.includes(step.id) ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center text-xs">
                  {step.icon}
                </span>
              )}
            </button>

            {/* 步骤名称 */}
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                currentStep === step.id
                  ? "text-primary"
                  : currentStep > step.id || completedSteps.includes(step.id)
                  ? "text-primary"
                  : "text-muted-foreground"
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