"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { MousePointer, BarChart3, LineChart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface StepDataAnalysisProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepDataAnalysis({ formData, updateFormData, validationErrors }: StepDataAnalysisProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
  }

  const handleSelectChange = (field: string, value: string) => {
    updateFormData(field, value)
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    updateFormData(field, checked)
  }

  // 统计方法选项
  const statisticalMethods = [
    "t检验",
    "方差分析（ANOVA）",
    "Mann-Whitney U检验",
    "卡方检验",
    "相关分析",
    "回归分析",
    "生存分析",
    "非参数检验",
    "其他"
  ]

  // 显著性水平选项
  const significanceLevels = [
    "p < 0.001",
    "p < 0.01",
    "p < 0.05",
    "p < 0.1",
    "不适用"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <MousePointer className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">数据分析</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dataAnalysisMethod" className="text-sm font-medium">
            数据分析方法
          </Label>
          <Select 
            value={formData.dataAnalysisMethod || ""} 
            onValueChange={(value) => handleSelectChange("dataAnalysisMethod", value)}
          >
            <SelectTrigger id="dataAnalysisMethod">
              <SelectValue placeholder="请选择统计分析方法" />
            </SelectTrigger>
            <SelectContent>
              {statisticalMethods.map((method) => (
                <SelectItem key={method} value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="significanceLevel" className="text-sm font-medium">
            显著性水平
          </Label>
          <Select 
            value={formData.significanceLevel || ""} 
            onValueChange={(value) => handleSelectChange("significanceLevel", value)}
          >
            <SelectTrigger id="significanceLevel">
              <SelectValue placeholder="请选择显著性水平" />
            </SelectTrigger>
            <SelectContent>
              {significanceLevels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="softwareUsed" className="text-sm font-medium">
            分析软件
          </Label>
          <Input
            id="softwareUsed"
            name="softwareUsed"
            placeholder="请输入使用的分析软件，如：SPSS 25、GraphPad Prism 9等"
            value={formData.softwareUsed || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataAnalysis" className="text-sm font-medium">
            数据分析过程
          </Label>
          <Textarea
            id="dataAnalysis"
            name="dataAnalysis"
            placeholder="请详细描述数据分析的过程和方法"
            value={formData.dataAnalysis || ""}
            onChange={handleInputChange}
            className="min-h-[150px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-2">
            <div>
              <Switch
                id="hasCharts"
                checked={formData.hasCharts || false}
                onCheckedChange={(checked) => handleSwitchChange("hasCharts", checked)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hasCharts" className="text-sm font-medium cursor-pointer">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> 
                  包含图表分析
                </div>
              </Label>
              <p className="text-xs text-muted-foreground">
                勾选此项表示在上传的实验数据中包含图表分析
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <div>
              <Switch
                id="hasTrends"
                checked={formData.hasTrends || false}
                onCheckedChange={(checked) => handleSwitchChange("hasTrends", checked)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hasTrends" className="text-sm font-medium cursor-pointer">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-primary" /> 
                  包含趋势分析
                </div>
              </Label>
              <p className="text-xs text-muted-foreground">
                勾选此项表示在实验结果中包含数据趋势分析
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="conclusion" className="text-sm font-medium">
            结论
          </Label>
          <Textarea
            id="conclusion"
            name="conclusion"
            placeholder="请输入基于数据分析得出的结论"
            value={formData.conclusion || ""}
            onChange={handleInputChange}
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="limitations" className="text-sm font-medium">
            研究局限性
          </Label>
          <Textarea
            id="limitations"
            name="limitations"
            placeholder="请描述本次实验的局限性"
            value={formData.limitations || ""}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="furtherResearch" className="text-sm font-medium">
            后续研究建议
          </Label>
          <Textarea
            id="furtherResearch"
            name="furtherResearch"
            placeholder="请提出后续研究的建议"
            value={formData.furtherResearch || ""}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>
      </div>
    </div>
  )
} 