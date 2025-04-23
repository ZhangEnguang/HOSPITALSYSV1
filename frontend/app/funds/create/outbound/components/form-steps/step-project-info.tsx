"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepProjectInfoProps {
  formData: {
    projectId: string
    category: string
  }
  validationErrors: Record<string, string>
  handleSelectChange: (name: string, value: string) => void
  projects: { id: string; name: string }[]
  categories: string[]
}

export function StepProjectInfo({
  formData,
  validationErrors,
  handleSelectChange,
  projects,
  categories,
}: StepProjectInfoProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <h3 className="text-base font-medium">项目与分类信息</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectId">
            所属项目 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.projectId}
            onValueChange={(value) => handleSelectChange("projectId", value)}
          >
            <SelectTrigger id="projectId" className={validationErrors.projectId ? "border-red-500" : ""}>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            外拨类别 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger id="category" className={validationErrors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="请选择外拨类别" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
