"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepAmountCarryoverProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
  reasons: string[]
}

export function StepAmountCarryover({ 
  formData, 
  updateFormData, 
  validationErrors,
  reasons
}: StepAmountCarryoverProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData(name, value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <DollarSign className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">金额与结转信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium flex items-center">
            结转金额 (元) <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="请输入结转金额"
            value={formData.amount || ""}
            onChange={handleInputChange}
            required
            className={cn(
              "h-10", 
              validationErrors["结转金额"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["结转金额"] && (
            <p className="text-sm text-red-500 mt-1">请输入结转金额</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromYear" className="text-sm font-medium flex items-center">
            结转年度 (从) <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="fromYear"
            name="fromYear"
            placeholder="请输入结转起始年度"
            value={formData.fromYear || ""}
            onChange={handleInputChange}
            required
            className={cn(
              "h-10", 
              validationErrors["结转年度(从)"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["结转年度(从)"] && (
            <p className="text-sm text-red-500 mt-1">请输入结转起始年度</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="toYear" className="text-sm font-medium flex items-center">
            结转年度 (至) <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="toYear"
            name="toYear"
            placeholder="请输入结转目标年度"
            value={formData.toYear || ""}
            onChange={handleInputChange}
            required
            className={cn(
              "h-10", 
              validationErrors["结转年度(至)"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["结转年度(至)"] && (
            <p className="text-sm text-red-500 mt-1">请输入结转目标年度</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="carryoverReason" className="text-sm font-medium flex items-center">
            结转原因 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.carryoverReason || ""}
            onValueChange={(value) => handleSelectChange("carryoverReason", value)}
          >
            <SelectTrigger 
              className={cn(
                "h-10", 
                validationErrors["结转原因"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="选择结转原因" />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["结转原因"] && (
            <p className="text-sm text-red-500 mt-1">请选择结转原因</p>
          )}
        </div>
      </div>
    </div>
  )
}
