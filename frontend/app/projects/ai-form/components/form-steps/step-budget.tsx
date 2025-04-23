"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface StepBudgetProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  validationErrors?: Record<string, boolean>
}

export const StepBudget = ({ formData, handleInputChange, validationErrors = {} }: StepBudgetProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">项目预算配置</h3>
      <p className="text-muted-foreground">请设置项目资金预算，包括各类支出项目</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="totalBudget" className="flex items-center">
            项目总预算 <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex">
            <Input
              id="totalBudget"
              placeholder="请输入项目总预算"
              value={formData.预算金额 || ""}
              onChange={(e) => handleInputChange("预算金额", e.target.value)}
              className={cn(validationErrors.预算金额 && "border-red-500 focus-visible:ring-red-500")}
            />
            <Select value={formData.预算单位 || "元"} onValueChange={(value) => handleInputChange("预算单位", value)}>
              <SelectTrigger className="w-[100px] ml-2">
                <SelectValue placeholder="单位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="元">元</SelectItem>
                <SelectItem value="万元">万元</SelectItem>
                <SelectItem value="千元">千元</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {validationErrors.预算金额 && <p className="text-sm text-red-500 mt-1">请输入项目总预算</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fundingSource">经费来源</Label>
          <Input
            id="fundingSource"
            placeholder="请输入经费来源"
            value={formData.经费来源 || ""}
            onChange={(e) => handleInputChange("经费来源", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetDescription">预算说明</Label>
          <Textarea
            id="budgetDescription"
            placeholder="请详细说明预算使用计划"
            value={formData.预算说明 || ""}
            onChange={(e) => handleInputChange("预算说明", e.target.value)}
            rows={4}
          />
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-700">
            <strong>提示：</strong> 项目预算将作为后续经费申请和报销的依据，请确保预算合理且符合相关规定。
          </p>
        </div>
      </div>
    </div>
  )
}

