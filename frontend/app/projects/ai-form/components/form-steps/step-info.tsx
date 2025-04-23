"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Check, Sparkles, AlertCircle, User, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepInfoProps {
  formData: any
  fillingField: string | null
  filledFields: string[]
  handleInputChange: (field: string, value: any) => void
  validationErrors?: Record<string, boolean>
  analysisResult?: Record<string, any>
  handleRefill?: (field: string) => void
  handleUserEdit?: (field: string) => void
}

export function StepInfo({
  formData,
  fillingField,
  filledFields,
  handleInputChange,
  validationErrors = {},
  analysisResult = {},
  handleRefill = () => {},
  handleUserEdit = () => {},
}: StepInfoProps) {
  const projectTypes = [
    { value: "横向", label: "横向", description: "企业合作项目" },
    { value: "纵向", label: "纵向", description: "政府资助项目" },
    { value: "校级", label: "校级", description: "校内立项项目" },
  ]

  const projectStatuses = [
    { value: "申请中", label: "申请中" },
    { value: "已立项", label: "已立项" },
    { value: "进行中", label: "进行中" },
    { value: "已结项", label: "已结项" },
    { value: "已终止", label: "已终止" },
  ]

  const departments = [
    { value: "计算机科学与技术学院", label: "计算机科学与技术学院" },
    { value: "电子信息工程学院", label: "电子信息工程学院" },
    { value: "机械工程学院", label: "机械工程学院" },
    { value: "材料科学与工程学院", label: "材料科学与工程学院" },
    { value: "经济管理学院", label: "经济管理学院" },
    { value: "信息工程学院", label: "信息工程学院" },
  ]

  const projectClassifications = [
    { value: "自然科学", label: "自然科学" },
    { value: "工程技术", label: "工程技术" },
    { value: "人文社科", label: "人文社科" },
    { value: "艺术设计", label: "艺术设计" },
    { value: "其他", label: "其他" },
  ]

  return (
    <div className="space-y-8">
      {/* 基本信息 */}
      <div className="space-y-4">
        <div className="flex items-center p-2 bg-primary/5 rounded-md mb-3">
          <Info className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">基本信息</h3>
        </div>

        <div className="pt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="批准号" className="flex items-center">
                批准号
                {fillingField === "批准号" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("批准号") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="批准号"
                  value={formData.批准号 || ""}
                  onChange={(e) => {
                    handleInputChange("批准号", e.target.value)
                    // 如果字段已被AI填充，并且用户编辑了内容，从filledFields中移除
                    if (filledFields.includes("批准号") && e.target.value !== analysisResult?.批准号) {
                      handleUserEdit("批准号")
                    }
                  }}
                  placeholder="请输入批准号"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "批准号" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("批准号") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {fillingField === "批准号" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, rotate: [0, 15, -15, 0] }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {filledFields.includes("批准号") && fillingField !== "批准号" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {!filledFields.includes("批准号") && analysisResult?.批准号 && fillingField !== "批准号" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => handleRefill("批准号")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="项目名称" className="flex items-center">
                项目名称 <span className="text-red-500 ml-1">*</span>
                {fillingField === "项目名称" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("项目名称") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="项目名称"
                  value={formData.项目名称 || ""}
                  onChange={(e) => {
                    handleInputChange("项目名称", e.target.value)
                    if (filledFields.includes("项目名称") && e.target.value !== analysisResult?.项目名称) {
                      handleUserEdit("项目名称")
                    }
                  }}
                  placeholder="请输入项目名称"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "项目名称" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("项目名称") && "border-green-500 bg-green-50 border-green-200",
                    validationErrors.项目名称 && "border-red-500 ring-2 ring-red-500/20",
                  )}
                />
                <AnimatePresence>
                  {fillingField === "项目名称" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, rotate: [0, 15, -15, 0] }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {filledFields.includes("项目名称") && fillingField !== "项目名称" && !validationErrors.项目名称 && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {validationErrors.项目名称 && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {!filledFields.includes("项目名称") &&
                    analysisResult?.项目名称 &&
                    fillingField !== "项目名称" &&
                    !validationErrors.项目名称 && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        onClick={() => handleRefill("项目名称")}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
              {validationErrors.项目名称 && <p className="text-sm text-red-500 mt-1">请输入项目名称</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="所属单位" className="flex items-center">
                所属单位 <span className="text-red-500 ml-1">*</span>
                {fillingField === "所属单位" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("所属单位") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Select
                  value={formData.所属单位 || ""}
                  onValueChange={(value) => {
                    handleInputChange("所属单位", value)
                    if (filledFields.includes("所属单位") && value !== analysisResult?.所属单位) {
                      handleUserEdit("所属单位")
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      fillingField === "所属单位" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                      filledFields.includes("所属单位") && "border-green-500 bg-green-50 border-green-200",
                      validationErrors.所属单位 && "border-red-500 ring-2 ring-red-500/20",
                    )}
                  >
                    <SelectValue placeholder="请选择所属单位" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!filledFields.includes("所属单位") && analysisResult?.所属单位 && (
                  <div
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleRefill("所属单位")}
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                {validationErrors.所属单位 && <p className="text-sm text-red-500 mt-1">请选择所属单位</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="项目分类" className="flex items-center">
                项目分类 <span className="text-red-500 ml-1">*</span>
                {fillingField === "项目分类" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("项目分类") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Select
                  value={formData.项目分类 || ""}
                  onValueChange={(value) => {
                    handleInputChange("项目分类", value)
                    if (filledFields.includes("项目分类") && value !== analysisResult?.项目分类) {
                      handleUserEdit("项目分类")
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      fillingField === "项目分类" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                      filledFields.includes("项目分类") && "border-green-500 bg-green-50 border-green-200",
                      validationErrors.项目分类 && "border-red-500 ring-2 ring-red-500/20",
                    )}
                  >
                    <SelectValue placeholder="请选择项目分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectClassifications.map((classification) => (
                      <SelectItem key={classification.value} value={classification.value}>
                        {classification.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!filledFields.includes("项目分类") && analysisResult?.项目分类 && (
                  <div
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleRefill("项目分类")}
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                {validationErrors.项目分类 && <p className="text-sm text-red-500 mt-1">请选择项目分类</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="项目级别" className="flex items-center">
                项目级别
                {fillingField === "项目级别" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("项目级别") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Select
                  value={formData.项目级别 || ""}
                  onValueChange={(value) => {
                    handleInputChange("项目级别", value)
                    if (filledFields.includes("项目级别") && value !== analysisResult?.项目级别) {
                      handleUserEdit("项目级别")
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      fillingField === "项目级别" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                      filledFields.includes("项目级别") &&
                        "border-green-500 bg-green-50 border-green-200" &&
                        "border-green-500 bg-green-50 border-green-200",
                    )}
                  >
                    <SelectValue placeholder="请选择项目级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="国家级">国家级</SelectItem>
                    <SelectItem value="省部级">省部级</SelectItem>
                    <SelectItem value="厅局级">厅局级</SelectItem>
                    <SelectItem value="市级">市级</SelectItem>
                    <SelectItem value="校级">校级</SelectItem>
                  </SelectContent>
                </Select>
                {!filledFields.includes("项目级别") && analysisResult?.项目级别 && (
                  <div
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleRefill("项目级别")}
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="经费来源" className="flex items-center">
                经费来源
                {fillingField === "经费来源" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("经费来源") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="经费来源"
                  value={formData.经费来源 || ""}
                  onChange={(e) => {
                    handleInputChange("经费来源", e.target.value)
                    if (filledFields.includes("经费来源") && e.target.value !== analysisResult?.经费来源) {
                      handleUserEdit("经费来源")
                    }
                  }}
                  placeholder="请输入经费来源"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "经费来源" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("经费来源") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("经费来源") && analysisResult?.经费来源 && fillingField !== "经费来源" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => handleRefill("经费来源")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="项目状态" className="flex items-center">
                项目状态
                {fillingField === "项目状态" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("项目状态") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Select
                  value={formData.项目状态 || ""}
                  onValueChange={(value) => {
                    handleInputChange("项目状态", value)
                    if (filledFields.includes("项目状态") && value !== analysisResult?.项目状态) {
                      handleUserEdit("项目状态")
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      fillingField === "项目状态" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                      filledFields.includes("项目状态") && "border-green-500 bg-green-50 border-green-200",
                    )}
                  >
                    <SelectValue placeholder="请选择项目状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!filledFields.includes("项目状态") && analysisResult?.项目状态 && (
                  <div
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleRefill("项目状态")}
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="开始日期" className="flex items-center">
                开始日期
                {fillingField === "开始日期" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("开始日期") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="开始日期"
                  type="date"
                  value={formData.开始日期 || ""}
                  onChange={(e) => {
                    handleInputChange("开始日期", e.target.value)
                    if (filledFields.includes("开始日期") && e.target.value !== analysisResult?.开始日期) {
                      handleUserEdit("开始日期")
                    }
                  }}
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "开始日期" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("开始日期") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("开始日期") && analysisResult?.开始日期 && fillingField !== "开始日期" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => handleRefill("开始日期")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="结束日期" className="flex items-center">
                结束日期
                {fillingField === "结束日期" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("结束日期") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="结束日期"
                  type="date"
                  value={formData.结束日期 || ""}
                  onChange={(e) => {
                    handleInputChange("结束日期", e.target.value)
                    if (filledFields.includes("结束日期") && e.target.value !== analysisResult?.结束日期) {
                      handleUserEdit("结束日期")
                    }
                  }}
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "结束日期" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("结束日期") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("结束日期") && analysisResult?.结束日期 && fillingField !== "结束日期" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => handleRefill("结束日期")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分割线 */}
      <hr className="border-muted" />

      {/* 负责人&经办人信息 */}
      <div className="space-y-4">
        <div className="flex items-center p-2 bg-primary/5 rounded-md mb-3">
          <User className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">负责人&经办人信息</h3>
        </div>

        <div className="pt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="项目负责人" className="flex items-center">
                项目负责人
                {fillingField === "项目负责人" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("项目负责人") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="项目负责人"
                  value={formData.项目负责人 || ""}
                  onChange={(e) => {
                    handleInputChange("项目负责人", e.target.value)
                    if (filledFields.includes("项目负责人") && e.target.value !== analysisResult?.项目负责人) {
                      handleUserEdit("项目负责人")
                    }
                  }}
                  placeholder="请输入负责人姓名"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "项目负责人" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("项目负责人") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("项目负责人") &&
                    analysisResult?.项目负责人 &&
                    fillingField !== "项目负责人" && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        onClick={() => handleRefill("项目负责人")}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="职称" className="flex items-center">
                职称
                {fillingField === "职称" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("职称") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="职称"
                  value={formData.职称 || ""}
                  onChange={(e) => {
                    handleInputChange("职称", e.target.value)
                    if (filledFields.includes("职称") && e.target.value !== analysisResult?.职称) {
                      handleUserEdit("职称")
                    }
                  }}
                  placeholder="请输入职称"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "职称" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("职称") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("职称") && analysisResult?.职称 && fillingField !== "职称" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => handleRefill("职称")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="联系电话" className="flex items-center">
                联系电话
                {fillingField === "联系电话" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("联系电话") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="联系电话"
                  value={formData.联系电话 || ""}
                  onChange={(e) => {
                    handleInputChange("联系电话", e.target.value)
                    if (filledFields.includes("联系电话") && e.target.value !== analysisResult?.联系电话) {
                      handleUserEdit("联系电话")
                    }
                  }}
                  placeholder="请输入联系电话"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "联系电话" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("联系电话") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("联系电话") && analysisResult?.联系电话 && fillingField !== "联系电话" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => handleRefill("联系电话")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="电子邮箱" className="flex items-center">
                电子邮箱
                {fillingField === "电子邮箱" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("电子邮箱") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="电子邮箱"
                  type="email"
                  value={formData.电子邮箱 || ""}
                  onChange={(e) => {
                    handleInputChange("电子邮箱", e.target.value)
                    if (filledFields.includes("电子邮箱") && e.target.value !== analysisResult?.电子邮箱) {
                      handleUserEdit("电子邮箱")
                    }
                  }}
                  placeholder="请输入电子邮箱"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "电子邮箱" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("电子邮箱") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("电子邮箱") && analysisResult?.电子邮箱 && fillingField !== "电子邮箱" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => handleRefill("电子邮箱")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="身份证号" className="flex items-center">
                身份证号
                {fillingField === "身份证号" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("身份证号") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="身份证号"
                  value={formData.身份证号 || ""}
                  onChange={(e) => {
                    handleInputChange("身份证号", e.target.value)
                    if (filledFields.includes("身份证号") && e.target.value !== analysisResult?.身份证号) {
                      handleUserEdit("身���证号")
                    }
                  }}
                  placeholder="请输入身份证号"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "身份证号" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("身份证号") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("身份证号") && analysisResult?.身份证号 && fillingField !== "身份证号" && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => handleRefill("身份证号")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="项目经办人" className="flex items-center">
                项目经办人
                {fillingField === "项目经办人" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("项目经办人") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="项目经办人"
                  value={formData.项目经办人 || ""}
                  onChange={(e) => {
                    handleInputChange("项目经办人", e.target.value)
                    if (filledFields.includes("项目经办人") && e.target.value !== analysisResult?.项目经办人) {
                      handleUserEdit("项目经办人")
                    }
                  }}
                  placeholder="请输入经办人姓名"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "项目经办人" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("项目经办人") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("项目经办人") &&
                    analysisResult?.项目经办人 &&
                    fillingField !== "项目经办人" && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        onClick={() => handleRefill("项目经办人")}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="经办人电话" className="flex items-center">
                联系电话
                {fillingField === "经办人电话" && (
                  <span className="ml-2 text-xs text-primary animate-pulse inline-flex items-center">
                    <div className="h-2 w-2 mr-1 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    AI填充中...
                  </span>
                )}
                {filledFields.includes("经办人电话") && (
                  <span className="ml-2 text-xs text-green-500 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="经办人电话"
                  value={formData.经办人电话 || ""}
                  onChange={(e) => {
                    handleInputChange("经办人电话", e.target.value)
                    if (filledFields.includes("经办人电话") && e.target.value !== analysisResult?.经办人电话) {
                      handleUserEdit("经办人电话")
                    }
                  }}
                  placeholder="请输入联系电话"
                  className={cn(
                    "transition-all duration-300",
                    fillingField === "经办人电话" && "border-primary ring-2 ring-primary/20 bg-primary/5 animate-pulse",
                    filledFields.includes("经办人电话") && "border-green-500 bg-green-50 border-green-200",
                  )}
                />
                <AnimatePresence>
                  {!filledFields.includes("经办人电话") &&
                    analysisResult?.经办人电话 &&
                    fillingField !== "经办人电话" && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        onClick={() => handleRefill("经办人电话")}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

