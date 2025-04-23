"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepPatentDetailsProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepPatentDetails({ formData, updateFormData, validationErrors }: StepPatentDetailsProps) {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target
    updateFormData(id, value)
  }

  const handleSelectChange = (field: string, value: string) => {
    updateFormData(field, value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">专利详情</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patentAbstract" className="text-sm font-medium flex items-center">
            专利摘要 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="patentAbstract"
            placeholder="请输入专利摘要"
            value={formData.patentAbstract || ""}
            onChange={handleTextareaChange}
            className={cn(
              "min-h-[100px]",
              validationErrors["专利摘要"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["专利摘要"] && (
            <p className="text-sm text-destructive">请输入专利摘要</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="disciplineCategory" className="text-sm font-medium flex items-center">
              学科类别 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={formData.disciplineCategory || ""} 
              onValueChange={(value) => handleSelectChange("disciplineCategory", value)}
            >
              <SelectTrigger 
                id="disciplineCategory"
                className={cn(
                  validationErrors["学科类别"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder="请选择学科类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">工学</SelectItem>
                <SelectItem value="science">理学</SelectItem>
                <SelectItem value="medicine">医学</SelectItem>
                <SelectItem value="agriculture">农学</SelectItem>
                <SelectItem value="management">管理学</SelectItem>
                <SelectItem value="economics">经济学</SelectItem>
                <SelectItem value="law">法学</SelectItem>
                <SelectItem value="education">教育学</SelectItem>
                <SelectItem value="literature">文学</SelectItem>
                <SelectItem value="history">历史学</SelectItem>
                <SelectItem value="philosophy">哲学</SelectItem>
                <SelectItem value="art">艺术学</SelectItem>
                <SelectItem value="military">军事学</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors["学科类别"] && (
              <p className="text-sm text-destructive">请选择学科类别</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationArea" className="text-sm font-medium flex items-center">
              应用领域 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={formData.applicationArea || ""} 
              onValueChange={(value) => handleSelectChange("applicationArea", value)}
            >
              <SelectTrigger 
                id="applicationArea"
                className={cn(
                  validationErrors["应用领域"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder="请选择应用领域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="information">信息技术</SelectItem>
                <SelectItem value="manufacturing">制造业</SelectItem>
                <SelectItem value="energy">能源环保</SelectItem>
                <SelectItem value="materials">材料科学</SelectItem>
                <SelectItem value="biomedical">生物医药</SelectItem>
                <SelectItem value="agriculture">农业技术</SelectItem>
                <SelectItem value="transportation">交通运输</SelectItem>
                <SelectItem value="construction">建筑工程</SelectItem>
                <SelectItem value="other">其他领域</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors["应用领域"] && (
              <p className="text-sm text-destructive">请选择应用领域</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
