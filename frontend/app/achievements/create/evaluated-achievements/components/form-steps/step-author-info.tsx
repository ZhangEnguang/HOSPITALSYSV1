"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

// 示例数据
const members = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十"]

interface StepAuthorInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepAuthorInfo({ formData, updateFormData, validationErrors }: StepAuthorInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    updateFormData(id, value)
    
    // 清除验证错误
    if (validationErrors[id]) {
      const newErrors = { ...validationErrors }
      delete newErrors[id]
      updateFormData("validationErrors", newErrors)
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    updateFormData(field, value)
    
    // 清除验证错误
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors }
      delete newErrors[field]
      updateFormData("validationErrors", newErrors)
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    updateFormData("rankingConfirmed", checked)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">完成人信息</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstCompleter" className="text-sm font-medium flex items-center">
              第一完成人 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={formData.firstCompleter || ""} 
              onValueChange={(value) => handleSelectChange("firstCompleter", value)}
            >
              <SelectTrigger 
                id="firstCompleter"
                className={cn(
                  validationErrors["第一完成人"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder="请选择第一完成人" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member} value={member}>{member}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors["第一完成人"] && (
              <p className="text-sm text-destructive">请选择第一完成人</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondCompleter" className="text-sm font-medium">
              第二完成人
            </Label>
            <Select 
              value={formData.secondCompleter || ""} 
              onValueChange={(value) => handleSelectChange("secondCompleter", value)}
            >
              <SelectTrigger id="secondCompleter">
                <SelectValue placeholder="请选择第二完成人" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member} value={member}>{member}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherCompleters" className="text-sm font-medium">
              其他完成人
            </Label>
            <Input 
              id="otherCompleters" 
              placeholder="请输入其他完成人，用逗号分隔" 
              value={formData.otherCompleters || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contribution" className="text-sm font-medium flex items-center">
            本人贡献 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input 
            id="contribution" 
            placeholder="请描述本人贡献" 
            value={formData.contribution || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["本人贡献"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["本人贡献"] && (
            <p className="text-sm text-destructive">请描述本人贡献</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">完成人排名确认</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="rankingConfirmed" 
              checked={formData.rankingConfirmed || false}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="rankingConfirmed" className="text-sm font-normal">
              我确认上述完成人排名与鉴定证书一致
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
