"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface BudgetItem {
  id: string
  name: string
  code: string
  category: string
  limitAmount: string | number
  limitPercent: string | number
  isRequired: boolean
  description?: string
  adjustmentLimit?: string
  parentId?: string | null
}

interface BudgetItemsFormProps {
  data?: {
    budgetItems?: BudgetItem[]
  }
  onUpdate: (data: { budgetItems: BudgetItem[] }) => void
  validationErrors?: Record<string, boolean>
}

export default function BudgetItemsForm({ data, onUpdate, validationErrors }: BudgetItemsFormProps) {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(
    data?.budgetItems || [
      {
        id: `item-${Date.now()}`,
        name: "",
        code: "",
        category: "直接费用",
        limitAmount: "",
        limitPercent: "",
        isRequired: true
      }
    ]
  )

  // When items change, notify parent
  useEffect(() => {
    onUpdate({ budgetItems })
  }, [budgetItems, onUpdate])

  // Add new budget item
  const handleAddItem = () => {
    setBudgetItems([
      ...budgetItems,
      {
        id: `item-${Date.now()}`,
        name: "",
        code: "",
        category: "直接费用",
        limitAmount: "",
        limitPercent: "",
        isRequired: false
      }
    ])
  }

  // Remove a budget item
  const handleRemoveItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id))
  }

  // Update a budget item
  const handleUpdateItem = (id: string, field: keyof BudgetItem, value: string | number | boolean) => {
    setBudgetItems(budgetItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <div className="space-y-6">
      <Card className="border border-muted/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium">预算科目列表</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddItem}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    添加科目
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>添加新的预算科目</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">科目名称</TableHead>
                  <TableHead className="w-[120px]">编码</TableHead>
                  <TableHead className="w-[120px]">类别</TableHead>
                  <TableHead className="w-[120px]">限额(元)</TableHead>
                  <TableHead className="w-[120px]">比例(%)</TableHead>
                  <TableHead className="w-[90px]">必填</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      暂无科目，请添加预算科目
                    </TableCell>
                  </TableRow>
                ) : (
                  budgetItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.name}
                          onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                          placeholder="请输入科目名称"
                          className={cn(
                            "w-full",
                            validationErrors?.["预算科目"] && !item.name && "border-destructive"
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.code}
                          onChange={(e) => handleUpdateItem(item.id, "code", e.target.value)}
                          placeholder="请输入编码"
                          className={cn(
                            "w-full",
                            validationErrors?.["预算科目"] && !item.code && "border-destructive"
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.category}
                          onValueChange={(value) => handleUpdateItem(item.id, "category", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="直接费用">直接费用</SelectItem>
                            <SelectItem value="间接费用">间接费用</SelectItem>
                            <SelectItem value="其他费用">其他费用</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.limitAmount}
                          onChange={(e) => handleUpdateItem(item.id, "limitAmount", e.target.value)}
                          placeholder="请输入限额"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.limitPercent}
                          onChange={(e) => handleUpdateItem(item.id, "limitPercent", e.target.value)}
                          placeholder="请输入比例"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Select
                          value={item.isRequired ? "true" : "false"}
                          onValueChange={(value) => handleUpdateItem(item.id, "isRequired", value === "true")}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">是</SelectItem>
                            <SelectItem value="false">否</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={budgetItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {validationErrors?.["预算科目"] && (
            <p className="text-xs text-destructive mt-2">
              请添加至少一个预算科目并填写完整信息
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 