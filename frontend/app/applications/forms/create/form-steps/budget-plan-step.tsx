"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BudgetPlanStepProps {
  formData: Record<string, any>
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
}

export function BudgetPlanStep({
  formData,
  handleInputChange,
  validationErrors,
}: BudgetPlanStepProps) {
  // 初始化经费明细列表
  const [budgetItems, setBudgetItems] = useState<Array<{ name: string; amount: string; description: string }>>(
    formData["经费明细"] || []
  )

  // 计算总预算
  const totalBudget = budgetItems.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0
    return sum + amount
  }, 0)

  // 添加经费项
  const addBudgetItem = () => {
    const newItems = [...budgetItems, { name: "", amount: "", description: "" }]
    setBudgetItems(newItems)
    handleInputChange("经费明细", newItems)
  }

  // 删除经费项
  const removeBudgetItem = (index: number) => {
    const newItems = budgetItems.filter((_, i) => i !== index)
    setBudgetItems(newItems)
    handleInputChange("经费明细", newItems)
  }

  // 更新经费项
  const updateBudgetItem = (index: number, field: string, value: string) => {
    const newItems = [...budgetItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setBudgetItems(newItems)
    handleInputChange("经费明细", newItems)
    
    // 同时更新总预算
    const newTotal = newItems.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0
      return sum + amount
    }, 0)
    handleInputChange("总预算", newTotal.toString())
  }

  return (
    <div className="space-y-6">

      {/* 经费明细表格 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <Label className="flex items-center">
            经费明细
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addBudgetItem}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            添加经费项
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">经费项目</TableHead>
                <TableHead className="w-[20%]">金额 (元)</TableHead>
                <TableHead className="w-[40%]">说明</TableHead>
                <TableHead className="w-[10%]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    请添加经费项目
                  </TableCell>
                </TableRow>
              ) : (
                budgetItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input 
                        placeholder="经费项目名称"
                        value={item.name}
                        onChange={(e) => updateBudgetItem(index, "name", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        placeholder="金额"
                        type="number"
                        min="0"
                        value={item.amount}
                        onChange={(e) => updateBudgetItem(index, "amount", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        placeholder="简要说明用途"
                        value={item.description}
                        onChange={(e) => updateBudgetItem(index, "description", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeBudgetItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 经费用途说明 */}
      <div className="space-y-2">
        <Label htmlFor="budgetDescription" className="flex items-center">
          经费用途说明
        </Label>
        <Textarea
          id="budgetDescription"
          placeholder="请详细说明项目经费的整体用途和规划"
          value={formData["经费用途说明"] || ""}
          onChange={(e) => handleInputChange("经费用途说明", e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
} 