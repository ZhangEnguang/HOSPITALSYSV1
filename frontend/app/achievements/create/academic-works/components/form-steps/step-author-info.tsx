"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

// 示例数据
const authors = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十"]

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">作者信息</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstAuthor" className="text-sm font-medium flex items-center">
              第一作者 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={formData.firstAuthor || ""} 
              onValueChange={(value) => handleSelectChange("firstAuthor", value)}
            >
              <SelectTrigger 
                id="firstAuthor"
                className={cn(
                  validationErrors["第一作者"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder="请选择第一作者" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>{author}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors["第一作者"] && (
              <p className="text-sm text-destructive">请选择第一作者</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="editor" className="text-sm font-medium flex items-center">
              主编 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={formData.editor || ""} 
              onValueChange={(value) => handleSelectChange("editor", value)}
            >
              <SelectTrigger 
                id="editor"
                className={cn(
                  validationErrors["主编"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder="请选择主编" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>{author}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors["主编"] && (
              <p className="text-sm text-destructive">请选择主编</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherAuthors" className="text-sm font-medium">
              其他作者
            </Label>
            <Input 
              id="otherAuthors" 
              placeholder="请输入其他作者，用逗号分隔" 
              value={formData.otherAuthors || ""}
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
      </div>
    </div>
  )
}
