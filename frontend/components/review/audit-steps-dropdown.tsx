"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export type AuditStep = {
  label: string
  value: string
}

export type AuditStepsDropdownProps = {
  currentStepLabel: string
  steps?: AuditStep[]
  onStepChange?: (step: AuditStep) => void
}

// 默认的审核步骤
const defaultSteps: AuditStep[] = [
  { label: "待审核", value: "pending" },
  { label: "管理员审核通过", value: "admin_approved" },
  { label: "管理员审核退回", value: "admin_rejected" },
  { label: "科研院退回", value: "research_rejected" },
]

export default function AuditStepsDropdown({
  currentStepLabel,
  steps = defaultSteps,
  onStepChange,
}: AuditStepsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 处理步骤选择
  const handleSelectStep = (step: AuditStep) => {
    if (onStepChange) {
      onStepChange(step)
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
          {currentStepLabel || "审核状态"}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {steps.map((step) => (
          <DropdownMenuItem
            key={step.value}
            className={`text-sm cursor-pointer ${
              currentStepLabel === step.label ? "bg-muted" : ""
            }`}
            onClick={() => handleSelectStep(step)}
          >
            {step.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
