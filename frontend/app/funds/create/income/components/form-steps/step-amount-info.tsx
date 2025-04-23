"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StepAmountInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export function StepAmountInfo({ formData, updateFormData }: StepAmountInfoProps) {
  // 经费来源
  const sources = ["国家自然科学基金委员会", "省科技厅", "教育部", "某企业", "学校科研基金"]

  // 格式化金额输入，添加千分位分隔符
  const formatAmount = (value: string) => {
    // 移除非数字字符
    const numericValue = value.replace(/[^\d.]/g, '')
    // 格式化数字
    const parts = numericValue.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  // 处理金额输入变化
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '')
    updateFormData("amount", rawValue)
  }

  return (
    <Card className="w-full border border-gray-100 shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg font-medium">金额信息</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="amount">
              入账金额 (元) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="amount"
                placeholder="请输入入账金额"
                value={formData.amount ? formatAmount(formData.amount) : ""}
                onChange={handleAmountChange}
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-muted-foreground">¥</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">
              经费来源 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.source || ""}
              onValueChange={(value) => updateFormData("source", value)}
            >
              <SelectTrigger id="source">
                <SelectValue placeholder="请选择经费来源" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium">经费分配</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="directAmount">直接费用 (元)</Label>
              <Input
                id="directAmount"
                placeholder="请输入直接费用"
                value={formData.directAmount ? formatAmount(formData.directAmount) : ""}
                onChange={(e) => updateFormData("directAmount", e.target.value.replace(/,/g, ''))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="indirectAmount">间接费用 (元)</Label>
              <Input
                id="indirectAmount"
                placeholder="请输入间接费用"
                value={formData.indirectAmount ? formatAmount(formData.indirectAmount) : ""}
                onChange={(e) => updateFormData("indirectAmount", e.target.value.replace(/,/g, ''))}
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            注：直接费用与间接费用之和应等于入账总金额
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amountNotes">金额说明</Label>
          <textarea
            id="amountNotes"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="请输入金额相关说明"
            value={formData.amountNotes || ""}
            onChange={(e) => updateFormData("amountNotes", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
