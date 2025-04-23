"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { InfoIcon, Settings, FileEdit, ListFilter, Building, Layers, Upload, PaperclipIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BatchConfigStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
}

interface DepartmentLimit {
  部门名称: string;
  申报数量限制: number;
}

export function BatchConfigStep({
  formData,
  handleInputChange,
  validationErrors,
}: BatchConfigStepProps) {
  // 部门列表
  const departments = [
    "物理学院",
    "化学学院",
    "生命科学学院",
    "计算机学院",
    "数学学院",
    "外国语学院",
    "经济管理学院",
    "人文学院",
    "艺术学院",
    "医学院",
    "教育学院"
  ]

  // 职称要求选项
  const titleRequirements = ["不限", "助教及以上", "讲师及以上", "副高及以上", "正高"]

  // 申报书配置选项
  const applicationFormOptions = [
    { value: "全流程在线生成", description: "申请人在线填写所有信息，系统自动生成申报书" },
    { value: "智能协同生成", description: "在线填写基础信息，线下编写正文内容" },
    { value: "模板化线下填报", description: "申请人下载模板，线下填写后上传" }
  ]

  // 模板库数据
  const templateLibrary = [
    { id: "template1", name: "基础科研项目申报书模板" },
    { id: "template2", name: "教育教学项目申报书模板" },
    { id: "template3", name: "人文社科项目申报书模板" },
    { id: "template4", name: "创新创业项目申报书模板" },
  ];

  // 获取部门限制数据，并设置默认值
  const getDepartmentLimits = (): DepartmentLimit[] => {
    if (!formData.部门申报限制 || !Array.isArray(formData.部门申报限制)) {
      // 如果没有部门限制数据，初始化一个包含所有部门的数组
      return departments.map(dept => ({
        部门名称: dept,
        申报数量限制: 2
      }));
    }
    
    // 确保所有部门都存在，如果不存在则添加
    const existingDepts = formData.部门申报限制.map((dept: { 部门名称: string }) => dept.部门名称);
    const missingDepts = departments.filter(dept => !existingDepts.includes(dept));
    
    // 返回合并后的数组，包含现有部门限制和缺失的部门
    return [
      ...formData.部门申报限制,
      ...missingDepts.map(dept => ({
        部门名称: dept,
        申报数量限制: 2  // 为缺失的部门设置默认值
      }))
    ];
  };

  // 部门限制数据
  const [departmentLimits, setDepartmentLimits] = useState<DepartmentLimit[]>(getDepartmentLimits());

  // 处理部门限制变化
  const handleDepartmentLimitChange = (deptName: string, value: number) => {
    const newLimits = departmentLimits.map(dept => {
      if (dept.部门名称 === deptName) {
        return { ...dept, 申报数量限制: value };
      }
      return dept;
    });
    setDepartmentLimits(newLimits);
    handleInputChange("部门申报限制", newLimits);
  };

  // 处理申报书生成方式点击
  const handleFormGenerationClick = (value: string) => {
    handleInputChange("申报书生成方式", value);
  };

  // 文件上传处理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // 这里只是模拟上传，实际项目中需要处理文件上传逻辑
      const fileName = e.target.files[0].name;
      handleInputChange("申报书模板", fileName);
    }
  };

  // 批量设置部门限制
  const [batchLimitValue, setBatchLimitValue] = useState<number>(2);
  
  const handleBatchLimit = () => {
    const newLimits = departmentLimits.map(dept => ({
      ...dept,
      申报数量限制: batchLimitValue
    }));
    setDepartmentLimits(newLimits);
    handleInputChange("部门申报限制", newLimits);
  };

  return (
    <div className="space-y-6">
      {/* 申报书配置 */}
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileEdit className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">申报书配置</h3>
      </div>

      <div className="bg-white p-4 rounded-md">
        <div className="space-y-4">
          <Label htmlFor="applicationFormConfig" className="flex items-center">
            申报书生成方式
            <span className="text-destructive ml-1">*</span>
          </Label>
          
          <RadioGroup
            value={formData.申报书生成方式 || ""}
            onValueChange={(value) => handleInputChange("申报书生成方式", value)}
            className="space-y-3"
          >
            {applicationFormOptions.map(option => (
              <div 
                key={option.value} 
                className={cn(
                  "flex items-start space-x-2 bg-slate-50 p-3 rounded-md border transition-colors cursor-pointer",
                  formData.申报书生成方式 === option.value 
                       ? "border-primary bg-blue-50" 
                        : "border-gray-200 hover:bg-muted"
                )}
                onClick={() => handleFormGenerationClick(option.value)}
              >
                <RadioGroupItem value={option.value} id={`application-form-${option.value}`} className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor={`application-form-${option.value}`} className="cursor-pointer font-medium">
                    {option.value}
                  </Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
          {validationErrors.申报书生成方式 && <p className="text-destructive text-sm mt-1">{validationErrors.申报书生成方式}</p>}
          
          {/* 根据申报书生成方式显示不同的模板选择/上传选项 */}
          {formData.申报书生成方式 === "全流程在线生成" && (
            <div className="mt-4 space-y-4">
              <h4 className="text-sm font-medium">选择申报书模板</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateLibrary.map((template) => (
                  <div 
                    key={template.id} 
                    onClick={() => handleInputChange("申报书模板ID", template.id)}
                    className={cn(
                      "flex cursor-pointer rounded-lg border p-4 transition-colors",
                      formData.申报书模板ID === template.id 
                        ? "border-primary bg-blue-50" 
                        : "border-gray-200 hover:bg-muted"
                    )}
                  >
                    <div className="flex w-full items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center",
                          formData.申报书模板ID === template.id 
                            ? "border-primary" 
                            : "border-gray-300"
                        )}>
                          {formData.申报书模板ID === template.id && (
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{template.name}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs py-0 px-1">标准模板</Badge>
                          <Badge variant="outline" className="text-xs py-0 px-1">可定制</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.申报书生成方式 === "智能协同生成" && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="contentTemplateUpload" className="text-sm font-medium">上传申报书(正文)模板</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label htmlFor="contentTemplateUpload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      <span>上传文档</span>
                    </div>
                    <Input
                      id="contentTemplateUpload"
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Label>
                  <span className="text-sm text-muted-foreground">支持上传PDF、Word等文档格式</span>
                </div>
                {formData.申报书模板 && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formData.申报书模板}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.申报书生成方式 === "模板化线下填报" && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="fullTemplateUpload" className="text-sm font-medium">上传申请书模板</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label htmlFor="fullTemplateUpload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      <span>上传文档</span>
                    </div>
                    <Input
                      id="fullTemplateUpload"
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Label>
                  <span className="text-sm text-muted-foreground">支持上传PDF、Word等文档格式</span>
                </div>
                {formData.申报书模板 && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formData.申报书模板}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {/* 限项配置 */}
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <ListFilter className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">限项配置</h3>
      </div>

      <div className="bg-white p-4 rounded-md space-y-6">
        {/* 每人最大申报数量 */}
        <div className="space-y-2">
          <Label htmlFor="maxApplications" className="flex items-center">
            每人最大申报数量
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="maxApplications"
              type="number"
              min="1"
              placeholder="请输入每人最大申报数量"
              value={formData.每人最大申报数量 || ""}
              onChange={(e) => handleInputChange("每人最大申报数量", e.target.value)}
              className={cn(
                validationErrors.每人最大申报数量 && "border-destructive",
              )}
            />
          </div>
          {validationErrors.每人最大申报数量 && <p className="text-destructive text-sm mt-1">{validationErrors.每人最大申报数量}</p>}
        </div>

        {/* 职称要求 */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Switch
              checked={formData.要求_职称要求 || false}
              onCheckedChange={(checked) => handleInputChange("要求_职称要求", checked)}
              className="mr-2"
            />
            <Label htmlFor="titleRequirement" className="flex items-center">
              职称要求
            </Label>
          </div>
          {formData.要求_职称要求 && (
            <Select
              value={formData.职称要求 || ""}
              onValueChange={(value) => handleInputChange("职称要求", value)}
              disabled={!formData.要求_职称要求}
            >
              <SelectTrigger id="titleRequirement">
                <SelectValue placeholder="请选择职称要求" />
              </SelectTrigger>
              <SelectContent>
                {titleRequirements.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* 年龄要求 - 修改为出生日期范围 */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Switch
              checked={formData.要求_年龄要求 || false}
              onCheckedChange={(checked) => handleInputChange("要求_年龄要求", checked)}
              className="mr-2"
            />
            <Label htmlFor="ageRequirement" className="flex items-center">
              出生日期要求
            </Label>
          </div>
          {formData.要求_年龄要求 && (
            <div className="flex space-x-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="minBirthDate">出生日期不得早于</Label>
                <Input
                  id="minBirthDate"
                  type="date"
                  placeholder="出生日期下限"
                  value={formData.出生日期下限 || ""}
                  onChange={(e) => handleInputChange("出生日期下限", e.target.value)}
                  disabled={!formData.要求_年龄要求}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="maxBirthDate">出生日期不得晚于</Label>
                <Input
                  id="maxBirthDate"
                  type="date"
                  placeholder="出生日期上限"
                  value={formData.出生日期上限 || ""}
                  onChange={(e) => handleInputChange("出生日期上限", e.target.value)}
                  disabled={!formData.要求_年龄要求}
                />
              </div>
            </div>
          )}
        </div>

        {/* 部门限制 */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Switch
              checked={formData.要求_部门限制 || false}
              onCheckedChange={(checked) => handleInputChange("要求_部门限制", checked)}
              className="mr-2"
            />
            <Label htmlFor="departmentLimit" className="flex items-center">
              部门限制
            </Label>
          </div>
          {formData.要求_部门限制 && (
            <div className="mt-3 border rounded-md">
              <div className="bg-slate-50 p-3 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">批量设置</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    value={batchLimitValue}
                    onChange={(e) => setBatchLimitValue(parseInt(e.target.value) || 0)}
                    className="w-20 text-center h-8"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBatchLimit}
                    className="h-8"
                  >
                    应用到全部
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部门名称</TableHead>
                    <TableHead className="w-[180px] text-center">申报数量限制</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentLimits.map((dept) => (
                    <TableRow key={dept.部门名称}>
                      <TableCell className="font-medium flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        {dept.部门名称}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={dept.申报数量限制}
                          onChange={(e) => handleDepartmentLimitChange(dept.部门名称, parseInt(e.target.value) || 0)}
                          className="w-full text-center"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {/* 批次配置 */}
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Settings className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">批次配置</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
 

        {/* 批次状态 */}
        <div className="space-y-2">
          <Label className="flex items-center">
            批次状态
            <span className="text-destructive ml-1">*</span>
          </Label>
          <RadioGroup
            value={formData.批次状态 || "草稿"}
            onValueChange={(value) => handleInputChange("批次状态", value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="草稿" id="draft" />
              <Label htmlFor="draft" className="cursor-pointer">草稿（仅管理员可见）</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="已发布" id="published" />
              <Label htmlFor="published" className="cursor-pointer">已发布（所有用户可见）</Label>
            </div>
          </RadioGroup>
          {validationErrors.批次状态 && <p className="text-destructive text-sm mt-1">{validationErrors.批次状态}</p>}
        </div>

        {/* 是否公开 */}
        <div className="space-y-2">
          <Label className="flex items-center">
            是否公开
            <span className="text-destructive ml-1">*</span>
          </Label>
          <RadioGroup
            value={formData.是否公开 || "是"}
            onValueChange={(value) => handleInputChange("是否公开", value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="是" id="public" />
              <Label htmlFor="public" className="cursor-pointer">是（所有人可查看申报情况）</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="否" id="private" />
              <Label htmlFor="private" className="cursor-pointer">否（仅管理员可查看申报情况）</Label>
            </div>
          </RadioGroup>
          {validationErrors.是否公开 && <p className="text-destructive text-sm mt-1">{validationErrors.是否公开}</p>}
        </div>
      </div>
    </div>
  )
}
