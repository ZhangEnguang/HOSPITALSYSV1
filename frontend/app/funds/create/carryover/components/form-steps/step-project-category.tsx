"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, FolderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProjectCategoryProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
  projects: Array<{ id: string; name: string }>
  categories: string[]
}

export function StepProjectCategory({ 
  formData, 
  updateFormData, 
  validationErrors,
  projects,
  categories
}: StepProjectCategoryProps) {
  const handleSelectChange = (name: string, value: string) => {
    updateFormData(name, value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FolderIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">项目与分类信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="projectId" className="text-sm font-medium flex items-center">
            所属项目 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.projectId || ""} 
            onValueChange={(value) => handleSelectChange("projectId", value)}
          >
            <SelectTrigger 
              className={cn(
                "h-10", 
                validationErrors["所属项目"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="选择所属项目" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["所属项目"] && (
            <p className="text-sm text-red-500 mt-1">请选择所属项目</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium flex items-center">
            结转类别 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.category || ""} 
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger 
              className={cn(
                "h-10", 
                validationErrors["结转类别"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="选择结转类别" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["结转类别"] && (
            <p className="text-sm text-red-500 mt-1">请选择结转类别</p>
          )}
        </div>
      </div>
    </div>
  )
}
