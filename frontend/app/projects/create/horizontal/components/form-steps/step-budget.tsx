"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 定义预算项接口以解决TypeScript错误
interface BudgetItem {
  category: string;
  amount: string;
  description: string;
  orderId: string;
}

interface StepBudgetProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepBudget({ formData, handleInputChange, validationErrors }: StepBudgetProps) {
  // 预算类别
  const budgetCategories = [
    "设备费",
    "材料费",
    "测试化验加工费",
    "燃料动力费",
    "差旅费",
    "会议费",
    "国际合作与交流费",
    "出版/文献/信息传播/知识产权事务费",
    "劳务费",
    "专家咨询费",
    "其他支出",
  ]

  // 初始化预算项，优先使用表单中已有的预算明细
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    // 如果表单中有预算明细数据则使用，否则创建一个默认项
    if (Array.isArray(formData.budgets) && formData.budgets.length > 0) {
      console.log('从表单数据中加载预算明细:', formData.budgets);
      return formData.budgets.map((item: any, index: number) => ({
        category: item.category || '设备费',
        amount: typeof item.amount === 'number' ? item.amount.toString() : item.amount || '',
        description: item.description || '',
        orderId: item.orderId || (index + 1).toString() // 确保有排序字段
      }));
    }
    return [{ category: "设备费", amount: "", description: "", orderId: "1" }];
  });
  
  // 当表单数据中的预算明细更新时，同步更新组件状态
  useEffect(() => {
    if (Array.isArray(formData.budgets) && formData.budgets.length > 0) {
      const newBudgetItems = formData.budgets.map((item: any, index: number) => ({
        category: item.category || '设备费',
        amount: typeof item.amount === 'number' ? item.amount.toString() : item.amount || '',
        description: item.description || '',
        orderId: item.orderId || (index + 1).toString() // 确保有排序字段
      }));
      
      // 只有当数据实际有变化时才更新状态，避免无限循环
      if (JSON.stringify(newBudgetItems) !== JSON.stringify(budgetItems)) {
        console.log('更新预算明细:', newBudgetItems);
        setBudgetItems(newBudgetItems);
      }
    }
  }, [formData.budgets]);

  // 添加预算项，并设置排序字段
  const addBudgetItem = () => {
    const newItem = { 
      category: "", 
      amount: "", 
      description: "", 
      orderId: (budgetItems.length + 1).toString() // 新项的排序号
    };
    setBudgetItems([...budgetItems, newItem]);
  }

  // 移除预算项并重新计算排序
  const removeBudgetItem = (index: number) => {
    const updatedItems = budgetItems
      .filter((_: BudgetItem, i: number) => i !== index)
      .map((item: BudgetItem, newIndex: number) => ({
        ...item,
        orderId: (newIndex + 1).toString() // 重新计算排序
      }));
    
    setBudgetItems(updatedItems);
    
    // 计算总预算
    const totalBudget = updatedItems.reduce((sum: number, item: BudgetItem) => {
      const amount = Number.parseFloat(item.amount) || 0
      return sum + amount
    }, 0)

    // 更新预算明细和总预算
    handleInputChange("budgets", updatedItems)
    handleInputChange("预算金额", totalBudget.toString())
  }

  // 更新预算项
  const updateBudgetItem = (index: number, field: string, value: string) => {
    const updatedItems = [...budgetItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setBudgetItems(updatedItems)

    // 计算总预算
    const totalBudget = updatedItems.reduce((sum: number, item: BudgetItem) => {
      const amount = Number.parseFloat(item.amount) || 0
      return sum + amount
    }, 0)

    // 更新预算明细和总预算
    handleInputChange("budgets", updatedItems)
    handleInputChange("预算金额", totalBudget.toString())
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center">
            预算明细
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addBudgetItem} className="flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            添加预算项
          </Button>
        </div>

        {validationErrors.预算金额 && <p className="text-destructive text-sm">请添加预算明细</p>}

        <div className="space-y-3">
          {budgetItems.map((item: BudgetItem, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-start">
              {/* 序号列 - 宽度调整 */}
              <div className="col-span-1">
                <div className="flex items-center justify-center h-10 bg-slate-100 rounded-md border font-medium text-center text-sm">
                  {index + 1}
                </div>
              </div>
              
              {/* 类别列 */}
              <div className="col-span-3">
                <Select value={item.category} onValueChange={(value) => updateBudgetItem(index, "category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 金额列 */}
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="金额"
                  value={item.amount}
                  onChange={(e) => updateBudgetItem(index, "amount", e.target.value)}
                  className={cn(validationErrors.预算金额 && !item.amount && "border-destructive")}
                />
              </div>
              
              {/* 说明列 */}
              <div className="col-span-5">
                <Input
                  placeholder="说明"
                  value={item.description}
                  onChange={(e) => updateBudgetItem(index, "description", e.target.value)}
                />
              </div>
              
              {/* 删除按钮列 */}
              <div className="col-span-1">
                {budgetItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBudgetItem(index)}
                    className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
          <span className="font-medium">总预算:</span>
          <span className="text-lg font-bold">
            ¥{" "}
            {budgetItems
              .reduce((sum: number, item: BudgetItem) => {
                const amount = Number.parseFloat(item.amount) || 0
                return sum + amount
              }, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          请详细列出项目所需的各项预算。预算明细将用于项目评审和资金管理。
        </p>
      </div>
    </div>
  )
} 