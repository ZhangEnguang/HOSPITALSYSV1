"use client"

import { useState, useEffect } from "react"
import { ChevronDown, CheckCircle, Clock, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface AuditStep {
  id: number
  name: string
  status: "completed" | "current" | "pending" | "rejected"
  date?: string
  operator?: string
  comment?: string
}

interface AuditStepsDropdownProps {
  currentStepLabel?: string
  className?: string
}

export default function AuditStepsDropdown({ currentStepLabel = "科研院退回", className }: AuditStepsDropdownProps) {
  const [open, setOpen] = useState(false)

  // 审核步骤数据
  const [steps, setSteps] = useState<AuditStep[]>([
    {
      id: 1,
      name: "提交",
      status: "completed",
      date: "2024-03-10 09:30",
      operator: "张三",
      comment: "项目已提交，等待科研院审核",
    },
    {
      id: 2,
      name: "科研院审核",
      status: "rejected",
      date: "2024-03-15 14:20",
      operator: "李四",
      comment: "预算部分需要调整，请修改后重新提交",
    },
    {
      id: 3,
      name: "管理员审核",
      status: "pending",
    },
    {
      id: 4,
      name: "开发部主任审核",
      status: "pending",
    },
    {
      id: 5,
      name: "完成",
      status: "pending",
    },
  ])

  // 根据当前步骤标签更新审核流程状态
  useEffect(() => {
    const updatedSteps = [...steps]

    // 根据当前步骤标签更新审核流程
    if (currentStepLabel.includes("管理员审核通过")) {
      // 管理员审核通过
      updatedSteps[2] = {
        ...updatedSteps[2],
        status: "completed",
        date: new Date().toLocaleString(),
        operator: "当前用户",
        comment: "审核通过，项目可以继续",
      }
      // 下一步变为当前步骤
      updatedSteps[3] = {
        ...updatedSteps[3],
        status: "current",
      }
    } else if (currentStepLabel.includes("管理员审核退回")) {
      // 管理员审核退回
      updatedSteps[2] = {
        ...updatedSteps[2],
        status: "rejected",
        date: new Date().toLocaleString(),
        operator: "当前用户",
        comment: "项目需要修改，请按要求调整后重新提交",
      }
    } else if (currentStepLabel.includes("科研院退回")) {
      // 保持默认状态，科研院退回
      updatedSteps[2] = {
        ...updatedSteps[2],
        status: "pending",
      }
    }

    setSteps(updatedSteps)
  }, [currentStepLabel])

  // 获取步骤状态对应的图标和样式
  const getStepStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          lineColor: "bg-green-500",
        }
      case "current":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          lineColor: "bg-blue-500",
        }
      case "rejected":
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          lineColor: "bg-red-500",
        }
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "text-slate-300",
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
          lineColor: "bg-slate-200",
        }
    }
  }

  // 根据当前步骤标签获取对应的样式
  const getLabelStyle = (label: string) => {
    if (label.includes("退回")) {
      return "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
    } else if (label.includes("通过")) {
      return "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
    } else {
      return "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Badge
          className={cn(getLabelStyle(currentStepLabel), "flex items-center gap-1 ml-1 cursor-pointer", className)}
        >
          {currentStepLabel}
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform duration-200", open ? "transform rotate-180" : "")}
          />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-80 p-4 z-50"
        sideOffset={5}
        forceMount
        style={{ zIndex: 9999 }}
        portal={true}
      >
        <div className="text-base font-medium mb-3">审核流程</div>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const statusInfo = getStepStatusInfo(step.status)
            const isLast = index === steps.length - 1

            return (
              <div key={step.id} className="relative">
                {/* 连接线 */}
                {!isLast && (
                  <div
                    className={cn("absolute left-[10px] top-[20px] w-0.5 h-[calc(100%+2px)]", statusInfo.lineColor)}
                  ></div>
                )}

                <div className="flex items-start">
                  {/* 步骤图标 */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full border z-10",
                      statusInfo.bgColor,
                      statusInfo.borderColor,
                      statusInfo.color,
                    )}
                  >
                    {statusInfo.icon}
                  </div>

                  {/* 步骤内容 */}
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={cn(
                          "font-medium text-sm",
                          step.status === "pending" ? "text-slate-400" : "text-slate-800",
                        )}
                      >
                        {step.name}
                      </h3>
                      {step.date && <span className="text-xs text-slate-500">{step.date}</span>}
                    </div>

                    {step.status !== "pending" && (
                      <div
                        className={cn(
                          "mt-1 p-2 rounded-md text-xs",
                          statusInfo.bgColor,
                          "border",
                          statusInfo.borderColor,
                        )}
                      >
                        {step.operator && (
                          <div className="mb-1">
                            <span className="font-medium">操作人：</span>
                            <span>{step.operator}</span>
                          </div>
                        )}
                        {step.comment && (
                          <div>
                            <span className="font-medium">备注：</span>
                            <span>{step.comment}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

