"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, InfoIcon, UserIcon, CheckCircle2, CalendarIcon, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { addDays, format } from "date-fns"
import { Dict } from "@/components/dict"

interface StepInfoProps {
  formData: any
  fillingField: string | null
  filledFields: string[]
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
  analysisResult: Record<string, any>
  handleRefill: (field: string) => void
  handleUserEdit: (field: string) => void
}

export function StepInfo({
  formData,
  fillingField,
  filledFields,
  handleInputChange,
  validationErrors,
  analysisResult,
  handleRefill,
  handleUserEdit,
}: StepInfoProps) {
  const formItemHeight = "min-h-[68px]";

  // 添加项目分类选项
  const projectCategories = [
    "工程技术",
    "自然科学",
    "人文社科",
    "医学健康",
    "农业科学",
    "信息技术",
    "环境科学",
    "材料科学",
    "能源科学",
    "其他",
  ]

  // 添加项目级别选项
  const projectLevels = ["国家级", "省级", "市级", "区县级", "校级", "院级"]

  // 添加项目状态选项
  const projectStatuses = ["申请中", "已立项", "进行中", "已结题", "已验收", "已终止"]

  // 添加保密等级选项
  const confidentialityLevels = ["普通", "内部", "秘密", "机密", "绝密"]

  return (
    <div className="space-y-6">
      {/* 基本信息区域 */}
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">基本信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 mt-3 rounded-md">
        {/* 批准号 */}
        <div className={`space-y-2 relative ${formItemHeight}`}>
          <Label htmlFor="approvalNumber" className="flex items-center">
            批准号
          </Label>
          <div className="relative">
            <Input
              id="approvalNumber"
              placeholder="请输入项目批准号"
              value={formData.批准号 || ""}
              onChange={(e) => {
                handleInputChange("批准号", e.target.value)
                handleUserEdit("批准号")
              }}
              className={cn(
                fillingField === "批准号" && "border-primary animate-pulse",
                filledFields.includes("批准号") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "批准号" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("批准号") && analysisResult.批准号 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("批准号")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 项目名称 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="projectName" className="flex items-center">
            项目名称
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="projectName"
              placeholder="请输入项目名称"
              value={formData.项目名称 || ""}
              onChange={(e) => {
                handleInputChange("项目名称", e.target.value)
                handleUserEdit("项目名称")
              }}
              className={cn(
                validationErrors.项目名称 && "border-destructive",
                fillingField === "项目名称" && "border-primary animate-pulse",
                filledFields.includes("项目名称") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "项目名称" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("项目名称") && analysisResult.项目名称 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("项目名称")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
          {validationErrors.项目名称 && <p className="text-destructive text-sm mt-1">请输入项目名称</p>}
        </div>

        {/* 所属单位 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="department" className="flex items-center">
            所属单位
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Dict
              dictCode="unit"
              displayType="select"
              value={formData.所属单位}
              field="所属单位"
              setFormData={(newFormData) => {
                const updatedState = newFormData(formData);
                handleInputChange("所属单位", updatedState.所属单位);
                handleUserEdit("所属单位");
              }}
              placeholder="请选择所属单位"
              className={cn(
                validationErrors.所属单位 && "border-destructive",
                fillingField === "所属单位" && "border-primary animate-pulse",
                filledFields.includes("所属单位") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "所属单位" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("所属单位") && analysisResult.所属单位 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("所属单位")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
          {validationErrors.所属单位 && <p className="text-destructive text-sm mt-1">请输入所属单位</p>}
        </div>

        {/* 项目分类 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="projectCategory" className="flex items-center">
            项目分类
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Dict
              dictCode="project_type_yf"
              displayType="tree"
              value={formData.项目分类}
              field="项目分类"
              setFormData={(newFormData) => {
                const updatedState = newFormData(formData);
                handleInputChange("项目分类", updatedState.项目分类);
                handleUserEdit("项目分类");
              }}
              placeholder="请选择项目分类"
              className={cn(
                validationErrors.项目分类 && "border-destructive",
                fillingField === "项目分类" && "border-primary animate-pulse",
                filledFields.includes("项目分类") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "项目分类" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("项目分类") && analysisResult.项目分类 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("项目分类")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
          {validationErrors.项目分类 && <p className="text-destructive text-sm mt-1">请选择项目分类</p>}
        </div>

        {/* 项目级别 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="projectLevel" className="flex items-center">
            项目级别
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Dict
              dictCode="project_level"
              displayType="select"
              value={formData.项目级别}
              field="项目级别"
              setFormData={(newFormData) => {
                const updatedState = newFormData(formData);
                handleInputChange("项目级别", updatedState.项目级别);
                handleUserEdit("项目级别");
              }}
              placeholder="请选择项目级别"
              className={cn(
                validationErrors.项目级别 && "border-destructive",
                fillingField === "项目级别" && "border-primary animate-pulse",
                filledFields.includes("项目级别") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "项目级别" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("项目级别") && analysisResult.项目级别 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("项目级别")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
          {validationErrors.项目级别 && <p className="text-destructive text-sm mt-1">请选择项目级别</p>}
        </div>

        {/* 经费来源 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="fundingSource">经费来源</Label>
          <div className="relative">
            <Input
              id="fundingSource"
              placeholder="请输入经费来源"
              value={formData.经费来源 || ""}
              onChange={(e) => {
                handleInputChange("经费来源", e.target.value)
                handleUserEdit("经费来源")
              }}
              className={cn(
                fillingField === "经费来源" && "border-primary animate-pulse",
                filledFields.includes("经费来源") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "经费来源" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("经费来源") && analysisResult.经费来源 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("经费来源")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 项目状态 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="projectStatus">项目状态</Label>
          <div className="relative">
            <Dict
              dictCode="project_status"
              displayType="select"
              value={formData.项目状态}
              field="项目状态"
              setFormData={(newFormData) => {
                const updatedState = newFormData(formData);
                handleInputChange("项目状态", updatedState.项目状态);
                handleUserEdit("项目状态");
              }}
              placeholder="请选择项目状态"
              className={cn(
                fillingField === "项目状态" && "border-primary animate-pulse",
                filledFields.includes("项目状态") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "项目状态" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("项目状态") && analysisResult.项目状态 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("项目状态")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 项目周期 */}
        <div className={`space-y-2 relative ${formItemHeight}`}>
          <Label className="flex items-center">
            项目周期
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10", // 添加高度类
                  !formData.开始日期 && !formData.结束日期 && "text-muted-foreground",
                  (validationErrors.开始日期 || validationErrors.结束日期) && "border-destructive",
                  (fillingField === "开始日期" || fillingField === "结束日期") && "border-primary animate-pulse",
                  (filledFields.includes("开始日期") || filledFields.includes("结束日期")) && "border-primary/50 bg-primary/5",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.开始日期 && formData.结束日期 ? (
                  <>
                    {formData.开始日期} 至 {formData.结束日期}
                  </>
                ) : (
                  <span>选择项目开始和结束日期</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 flex space-x-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">开始日期</Label>
                  <Calendar
                    id="startDate"
                    mode="single"
                    selected={formData.开始日期 ? new Date(formData.开始日期) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, "yyyy-MM-dd");
                        handleInputChange("开始日期", formattedDate);
                        handleUserEdit("开始日期");
                      }
                    }}
                    initialFocus
                  />
                </div>
                <div className="space-y-2 border-l pl-4">
                  <Label htmlFor="endDate">结束日期</Label>
                  <Calendar
                    id="endDate"
                    mode="single"
                    selected={formData.结束日期 ? new Date(formData.结束日期) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, "yyyy-MM-dd");
                        handleInputChange("结束日期", formattedDate);
                        handleUserEdit("结束日期");
                      }
                    }}
                    fromDate={formData.开始日期 ? new Date(formData.开始日期) : undefined}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {(validationErrors.开始日期 || validationErrors.结束日期) && (
            <p className="text-destructive text-sm mt-1">请选择项目周期</p>
          )}
          {fillingField === "开始日期" || fillingField === "结束日期" ? (
            <div className="absolute right-3 top-10 transform-none">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : null}
          {(filledFields.includes("开始日期") && analysisResult.开始日期) || 
           (filledFields.includes("结束日期") && analysisResult.结束日期) ? (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-10 transform-none h-7 w-7 p-0"
              onClick={() => {
                if (filledFields.includes("开始日期") && analysisResult.开始日期) {
                  handleRefill("开始日期");
                }
                if (filledFields.includes("结束日期") && analysisResult.结束日期) {
                  handleRefill("结束日期");
                }
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            </Button>
          ) : null}
        </div>

        {/* 身份证号 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="idCard">身份证号</Label>
          <div className="relative">
            <Input
              id="idCard"
              placeholder="请输入身份证号"
              value={formData.身份证号 || ""}
              onChange={(e) => {
                handleInputChange("身份证号", e.target.value)
                handleUserEdit("身份证号")
              }}
              className={cn(
                fillingField === "身份证号" && "border-primary animate-pulse",
                filledFields.includes("身份证号") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "身份证号" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("身份证号") && analysisResult.身份证号 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("身份证号")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 分割线和增加间距 */}
      <div className="border-t border-gray-100 my-6"></div>

      {/* 合作信息区域 */}
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Building2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">合作信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 mt-3 rounded-md">
        {/* 合作企业 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="partnerCompany">合作企业</Label>
          <div className="relative">
            <Input
              id="partnerCompany"
              placeholder="请输入合作企业名称"
              value={formData.合作企业 || ""}
              onChange={(e) => {
                handleInputChange("合作企业", e.target.value)
                handleUserEdit("合作企业")
              }}
              className={cn(
                fillingField === "合作企业" && "border-primary animate-pulse",
                filledFields.includes("合作企业") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "合作企业" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("合作企业") && analysisResult.合作企业 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("合作企业")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 合同编号 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="contractNumber">合同编号</Label>
          <div className="relative">
            <Input
              id="contractNumber"
              placeholder="请输入合同编号"
              value={formData.合同编号 || ""}
              onChange={(e) => {
                handleInputChange("合同编号", e.target.value)
                handleUserEdit("合同编号")
              }}
              className={cn(
                fillingField === "合同编号" && "border-primary animate-pulse",
                filledFields.includes("合同编号") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "合同编号" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("合同编号") && analysisResult.合同编号 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("合同编号")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 知识产权归属 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="intellectualProperty">知识产权归属</Label>
          <div className="relative">
            <Input
              id="intellectualProperty"
              placeholder="请输入知识产权归属"
              value={formData.知识产权归属 || ""}
              onChange={(e) => {
                handleInputChange("知识产权归属", e.target.value)
                handleUserEdit("知识产权归属")
              }}
              className={cn(
                fillingField === "知识产权归属" && "border-primary animate-pulse",
                filledFields.includes("知识产权归属") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "知识产权归属" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("知识产权归属") && analysisResult.知识产权归属 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("知识产权归属")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 保密等级 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="confidentialityLevel">保密等级</Label>
          <div className="relative">
            <Dict
              dictCode="security_level"
              displayType="select"
              value={formData.保密等级}
              field="保密等级"
              setFormData={(newFormData) => {
                const updatedState = newFormData(formData);
                handleInputChange("保密等级", updatedState.保密等级);
                handleUserEdit("保密等级");
              }}
              placeholder="请选择保密等级"
              className={cn(
                fillingField === "保密等级" && "border-primary animate-pulse",
                filledFields.includes("保密等级") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "保密等级" && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("保密等级") && analysisResult.保密等级 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-8 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("保密等级")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 分割线和增加间距 */}
      <div className="border-t border-gray-100 my-6"></div>

      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <UserIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">负责人信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 mt-3 rounded-md">
        {/* 项目负责人 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="projectLeader" className="flex items-center">
            项目负责人
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="projectLeader"
              placeholder="请输入项目负责人姓名"
              value={formData.项目负责人 || ""}
              onChange={(e) => {
                handleInputChange("项目负责人", e.target.value)
                handleUserEdit("项目负责人")
              }}
              className={cn(
                validationErrors.项目负责人 && "border-destructive",
                fillingField === "项目负责人" && "border-primary animate-pulse",
                filledFields.includes("项目负责人") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "项目负责人" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("项目负责人") && analysisResult.项目负责人 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("项目负责人")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
          {validationErrors.项目负责人 && <p className="text-destructive text-sm mt-1">请输入项目负责人</p>}
        </div>

        {/* 职称 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="title">职称</Label>
          <div className="relative">
            <Dict
              dictCode="title"
              displayType="select"
              value={formData.职称}
              field="职称"
              setFormData={(newFormData) => {
                const updatedState = newFormData(formData);
                handleInputChange("职称", updatedState.职称);
                handleUserEdit("职称");
              }}
              placeholder="请选择职称"
              className={cn(
                fillingField === "职称" && "border-primary animate-pulse",
                filledFields.includes("职称") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "职称" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("职称") && analysisResult.职称 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("职称")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 联系电话 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="phone">联系电话</Label>
          <div className="relative">
            <Input
              id="phone"
              placeholder="请输入联系电话"
              value={formData.联系电话 || ""}
              onChange={(e) => {
                handleInputChange("联系电话", e.target.value)
                handleUserEdit("联系电话")
              }}
              className={cn(
                fillingField === "联系电话" && "border-primary animate-pulse",
                filledFields.includes("联系电话") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "联系电话" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("联系电话") && analysisResult.联系电话 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("联系电话")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 电子邮箱 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="email">电子邮箱</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="请输入电子邮箱"
              value={formData.电子邮箱 || ""}
              onChange={(e) => {
                handleInputChange("电子邮箱", e.target.value)
                handleUserEdit("电子邮箱")
              }}
              className={cn(
                fillingField === "电子邮箱" && "border-primary animate-pulse",
                filledFields.includes("电子邮箱") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "电子邮箱" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("电子邮箱") && analysisResult.电子邮箱 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("电子邮箱")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 分割线和增加间距 */}
      <div className="border-t border-gray-100 my-6"></div>

      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <UserIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">经办人信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 mt-3 rounded-md">
        {/* 项目经办人 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="projectManager">项目经办人</Label>
          <div className="relative">
            <Input
              id="projectManager"
              placeholder="请输入项目经办人姓名"
              value={formData.项目经办人 || ""}
              onChange={(e) => {
                handleInputChange("项目经办人", e.target.value)
                handleUserEdit("项目经办人")
              }}
              className={cn(
                fillingField === "项目经办人" && "border-primary animate-pulse",
                filledFields.includes("项目经办人") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "项目经办人" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("项目经办人") && analysisResult.项目经办人 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("项目经办人")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>

        {/* 经办人电话 */}
        <div className={`space-y-2 ${formItemHeight}`}>
          <Label htmlFor="managerPhone">经办人电话</Label>
          <div className="relative">
            <Input
              id="managerPhone"
              placeholder="请输入经办人电话"
              value={formData.经办人电话 || ""}
              onChange={(e) => {
                handleInputChange("经办人电话", e.target.value)
                handleUserEdit("经办人电话")
              }}
              className={cn(
                fillingField === "经办人电话" && "border-primary animate-pulse",
                filledFields.includes("经办人电话") && "border-primary/50 bg-primary/5",
              )}
            />
            {fillingField === "经办人电话" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {filledFields.includes("经办人电话") && analysisResult.经办人电话 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => handleRefill("经办人电话")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 