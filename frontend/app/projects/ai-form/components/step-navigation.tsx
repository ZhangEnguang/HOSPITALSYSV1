"use client"

import { cn } from "@/lib/utils"
import { Check, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const STEPS = [
  {
    id: "info",
    name: "项目信息",
  },
  {
    id: "members",
    name: "团队成员",
  },
  {
    id: "budget",
    name: "预算规划",
  },
  {
    id: "documents",
    name: "相关文档",
  },
  {
    id: "complete",
    name: "提交确认",
  },
]

interface StepNavigationProps {
  currentStep: number
  goToStep: (step: number) => void
  validationErrors?: Record<string, boolean>
  completedSteps?: number[] // 添加已完成步骤的数组
}

export function StepNavigation({
  currentStep,
  goToStep,
  validationErrors = {},
  completedSteps = [],
}: StepNavigationProps) {
  // 检查当前步骤是否有验证错误
  const hasCurrentStepErrors = Object.keys(validationErrors).length > 0

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isActive = currentStep === index
          const isCompleted = completedSteps.includes(index) || currentStep > index
          const isClickable = isCompleted || index === currentStep // 已完成的步骤或当前步骤可点击
          const nextStepIndex = index + 1

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* 连接线 - 修改为连接到下一步 */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "absolute top-[14px] h-[2px]",
                    "left-[50%] w-[calc(100%)]", // 调整宽度确保连接到下一个圆圈
                    isCompleted ? "bg-blue-500" : "bg-gray-200",
                  )}
                />
              )}

              {/* 步骤圆圈 */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "relative z-10 flex items-center justify-center rounded-full border-2 transition-all",
                        "w-7 h-7",
                        isActive
                          ? "border-blue-500 bg-white text-blue-500" // 当前步骤：白色背景，蓝色边框和文字
                          : isCompleted
                            ? "border-blue-500 bg-blue-500 text-white" // 已完成步骤：蓝色填充
                            : "border-gray-200 bg-gray-50 text-gray-400", // 未完成步骤：浅灰色
                        isClickable ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-70",
                      )}
                      onClick={() => isClickable && goToStep(index)}
                      disabled={!isClickable}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{!isClickable ? "请先完成当前步骤" : step.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 步骤名称 */}
              <div className="mt-2 text-sm font-medium text-gray-900">{step.name}</div>

              {/* 步骤状态 */}
              <div
                className={cn(
                  "mt-1 text-xs",
                  isCompleted ? "text-blue-500" : isActive ? "text-green-500 font-medium" : "text-gray-500",
                )}
              >
                {isCompleted ? "已完成" : isActive ? "进行中" : "待完成"}
              </div>

              {/* 错误指示器 */}
              {isActive && hasCurrentStepErrors && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  <AlertTriangle className="h-3 w-3" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

