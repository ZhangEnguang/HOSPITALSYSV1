"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InfoIcon, CalendarIcon, User, BookOpen, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface BasicInfoStepProps {
  formData: Record<string, any>
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
}

export function BasicInfoStep({
  formData,
  handleInputChange,
  validationErrors,
}: BasicInfoStepProps) {
  // 项目分类选项
  const projectCategories = [
    "科研项目",
    "教学项目",
    "基础设施",
    "产学研合作项目",
    "其他项目"
  ]

  // 一级学科选项
  const disciplines = [
    "数学", "物理学", "化学", "生物学", "地球科学",
    "机械工程", "电子科学与技术", "信息与通信工程", "计算机科学与技术", "土木工程",
    "化学工程与技术", "医学", "管理学", "经济学", "法学",
    "教育学", "文学", "历史学", "哲学", "艺术学"
  ]

  // 国民经济行业选项
  const industries = [
    "农林牧渔业", "采矿业", "制造业", "电力、热力、燃气及水生产和供应业",
    "建筑业", "批发和零售业", "交通运输、仓储和邮政业", "住宿和餐饮业",
    "信息传输、软件和信息技术服务业", "金融业", "房地产业", "科学研究和技术服务业",
    "水利、环境和公共设施管理业", "教育", "卫生和社会工作", "文化、体育和娱乐业"
  ]

  // 科技活动类型选项
  const scienceTechTypes = [
    "基础研究", "应用研究", "试验发展", "研究与试验发展成果应用",
    "科技服务", "科技基础条件建设", "科学技术普及", "科技交流与合作"
  ]

  // 预期成果选项
  const expectedOutcomes = [
    { id: "outcome-1", label: "发表论文" },
    { id: "outcome-2", label: "专著" },
    { id: "outcome-3", label: "专利" },
    { id: "outcome-4", label: "软件著作权" },
    { id: "outcome-5", label: "技术标准" },
    { id: "outcome-6", label: "新产品" },
    { id: "outcome-7", label: "新工艺" },
    { id: "outcome-8", label: "其他" }
  ]

  // 性别选项
  const genders = ["男", "女"]

  // 职称选项
  const titles = ["教授", "副教授", "讲师", "助教", "研究员", "副研究员", "助理研究员"]

  // 学位选项
  const degrees = ["学士", "硕士", "博士", "博士后"]

  // 研究基地类型选项
  const baseTypes = ["教育部重点实验室", "国家重点实验室", "省部级重点实验室", "校级重点实验室", "其他"]

  // 处理预期成果多选
  const handleExpectedOutcomeChange = (outcomeId: string, checked: boolean) => {
    const currentOutcomes = formData["预期成果"] ? [...formData["预期成果"]] : [];
    
    if (checked) {
      // 添加选项
      const outcome = expectedOutcomes.find(item => item.id === outcomeId)?.label;
      if (outcome && !currentOutcomes.includes(outcome)) {
        handleInputChange("预期成果", [...currentOutcomes, outcome]);
      }
    } else {
      // 移除选项
      const outcome = expectedOutcomes.find(item => item.id === outcomeId)?.label;
      if (outcome) {
        handleInputChange("预期成果", currentOutcomes.filter(item => item !== outcome));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 项目信息区域 */}
      <div>
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <div className="text-blue-500">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">项目信息</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 mt-3 rounded-md">
          {/* 项目名称 */}
          <div className="space-y-2">
            <Label htmlFor="projectName" className="flex items-center">
              项目名称
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="projectName"
                placeholder="请输入项目名称"
                value={formData["项目名称"] || ""}
                onChange={(e) => handleInputChange("项目名称", e.target.value)}
                className={cn(
                  validationErrors["项目名称"] && "border-destructive",
                )}
              />
            </div>
            {validationErrors["项目名称"] && <p className="text-destructive text-sm mt-1">{validationErrors["项目名称"]}</p>}
          </div>

          {/* 项目编号 */}
          <div className="space-y-2">
            <Label htmlFor="projectCode" className="flex items-center">
              项目编号
            </Label>
            <div className="h-10 px-3 py-2 text-sm border rounded-md bg-slate-50 text-muted-foreground flex items-center">
              终审通过后系统自动生成
            </div>
          </div>

          {/* 项目分类 */}
          <div className="space-y-2">
            <Label htmlFor="projectCategory" className="flex items-center">
              项目分类
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select
              value={formData["项目分类"] || ""}
              onValueChange={(value) => handleInputChange("项目分类", value)}
            >
              <SelectTrigger
                id="projectCategory"
                className={cn(
                  validationErrors["项目分类"] && "border-destructive",
                )}
              >
                <SelectValue placeholder="请选择项目分类" />
              </SelectTrigger>
              <SelectContent>
                {projectCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors["项目分类"] && <p className="text-destructive text-sm mt-1">{validationErrors["项目分类"]}</p>}
          </div>

          {/* 所属单位 */}
          <div className="space-y-2">
            <Label htmlFor="department" className="flex items-center">
              所属单位
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select
              value={formData["所属单位"] || ""}
              onValueChange={(value) => handleInputChange("所属单位", value)}
            >
              <SelectTrigger
                id="department"
                className={cn(
                  validationErrors["所属单位"] && "border-destructive",
                )}
              >
                <SelectValue placeholder="请选择所属单位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="计算机科学系">计算机科学系</SelectItem>
                <SelectItem value="数学系">数学系</SelectItem>
                <SelectItem value="物理系">物理系</SelectItem>
                <SelectItem value="化学系">化学系</SelectItem>
                <SelectItem value="生物系">生物系</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors["所属单位"] && <p className="text-destructive text-sm mt-1">{validationErrors["所属单位"]}</p>}
          </div>
          
          {/* 研究开始日期 */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center">
              研究开始日期
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData["研究开始日期"] && "text-muted-foreground",
                    validationErrors["研究开始日期"] && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData["研究开始日期"] ? format(new Date(formData["研究开始日期"]), "yyyy-MM-dd") : "请选择开始日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData["研究开始日期"] ? new Date(formData["研究开始日期"]) : undefined}
                  onSelect={(date) => handleInputChange("研究开始日期", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {validationErrors["研究开始日期"] && <p className="text-destructive text-sm mt-1">{validationErrors["研究开始日期"]}</p>}
          </div>

          {/* 研究结束日期 */}
          <div className="space-y-2">
            <Label htmlFor="endDate" className="flex items-center">
              研究结束日期
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData["研究结束日期"] && "text-muted-foreground",
                    validationErrors["研究结束日期"] && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData["研究结束日期"] ? format(new Date(formData["研究结束日期"]), "yyyy-MM-dd") : "请选择结束日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData["研究结束日期"] ? new Date(formData["研究结束日期"]) : undefined}
                  onSelect={(date) => handleInputChange("研究结束日期", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {validationErrors["研究结束日期"] && <p className="text-destructive text-sm mt-1">{validationErrors["研究结束日期"]}</p>}
          </div>

          {/* 申请经费 */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center">
              申请经费(万元)
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="请输入申请经费"
                value={formData["申请经费"] || ""}
                onChange={(e) => handleInputChange("申请经费", e.target.value)}
                className={cn(
                  validationErrors["申请经费"] && "border-destructive",
                )}
              />
            </div>
            {validationErrors["申请经费"] && <p className="text-destructive text-sm mt-1">{validationErrors["申请经费"]}</p>}
          </div>

          {/* 一级学科 */}
          <div className="space-y-2">
            <Label htmlFor="discipline" className="flex items-center">
              一级学科
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select
              value={formData["一级学科"] || ""}
              onValueChange={(value) => handleInputChange("一级学科", value)}
            >
              <SelectTrigger
                id="discipline"
                className={cn(
                  validationErrors["一级学科"] && "border-destructive",
                )}
              >
                <SelectValue placeholder="请选择一级学科" />
              </SelectTrigger>
              <SelectContent>
                {disciplines.map((discipline) => (
                  <SelectItem key={discipline} value={discipline}>
                    {discipline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors["一级学科"] && <p className="text-destructive text-sm mt-1">{validationErrors["一级学科"]}</p>}
          </div>

          {/* 国民经济行业 */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="flex items-center">
              国民经济行业
            </Label>
            <Select
              value={formData["国民经济行业"] || ""}
              onValueChange={(value) => handleInputChange("国民经济行业", value)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="请选择国民经济行业" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 科技活动类型 */}
          <div className="space-y-2">
            <Label htmlFor="scienceTechType" className="flex items-center">
              科技活动类型
            </Label>
            <Select
              value={formData["科技活动类型"] || ""}
              onValueChange={(value) => handleInputChange("科技活动类型", value)}
            >
              <SelectTrigger id="scienceTechType">
                <SelectValue placeholder="请选择科技活动类型" />
              </SelectTrigger>
              <SelectContent>
                {scienceTechTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 预期成果 - 改为多选框 */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="expectedOutcome" className="flex items-center">
              预期成果
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
              {expectedOutcomes.map((outcome) => (
                <div key={outcome.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={outcome.id}
                    checked={formData["预期成果"]?.includes(outcome.label) || false}
                    onCheckedChange={(checked) => 
                      handleExpectedOutcomeChange(outcome.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={outcome.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {outcome.label}
                  </Label>
                </div>
              ))}
            </div>
            {validationErrors["预期成果"] && <p className="text-destructive text-sm mt-1">{validationErrors["预期成果"]}</p>}
          </div>
        </div>
      </div>

      {/* 申请人信息区域 */}
      <div>
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <div className="text-blue-500">
            <User className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">申请人信息</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 mt-3 rounded-md">
          {/* 申请人 */}
          <div className="space-y-2">
            <Label htmlFor="applicant" className="flex items-center">
              申请人
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="applicant"
                placeholder="请输入申请人姓名"
                value={formData["申请人"] || formData["负责人"] || ""}
                onChange={(e) => handleInputChange("申请人", e.target.value)}
                className={cn(
                  validationErrors["申请人"] && "border-destructive",
                )}
              />
            </div>
            {validationErrors["申请人"] && <p className="text-destructive text-sm mt-1">{validationErrors["申请人"]}</p>}
          </div>

          {/* 性别 */}
          <div className="space-y-2">
            <Label className="flex items-center">
              性别
              <span className="text-destructive ml-1">*</span>
            </Label>
            <RadioGroup
              value={formData["性别"] || ""}
              onValueChange={(value) => handleInputChange("性别", value)}
              className="flex space-x-4"
            >
              {genders.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender} id={`gender-${gender}`} />
                  <Label htmlFor={`gender-${gender}`} className="font-normal cursor-pointer">
                    {gender}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {validationErrors["性别"] && <p className="text-destructive text-sm mt-1">{validationErrors["性别"]}</p>}
          </div>

          {/* 出生年月 */}
          <div className="space-y-2">
            <Label htmlFor="birthday" className="flex items-center">
              出生年月
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData["出生年月"] && "text-muted-foreground",
                    validationErrors["出生年月"] && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData["出生年月"] ? format(new Date(formData["出生年月"]), "yyyy-MM-dd") : "请选择出生日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData["出生年月"] ? new Date(formData["出生年月"]) : undefined}
                  onSelect={(date) => handleInputChange("出生年月", date)}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1940}
                  toYear={2010}
                />
              </PopoverContent>
            </Popover>
            {validationErrors["出生年月"] && <p className="text-destructive text-sm mt-1">{validationErrors["出生年月"]}</p>}
          </div>

          {/* 行政职务 */}
          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center">
              行政职务
            </Label>
            <div className="relative">
              <Input
                id="position"
                placeholder="请输入行政职务"
                value={formData["行政职务"] || ""}
                onChange={(e) => handleInputChange("行政职务", e.target.value)}
              />
            </div>
          </div>

          {/* 联系电话 */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center">
              联系电话
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="phone"
                placeholder="请输入联系电话"
                value={formData["联系电话"] || ""}
                onChange={(e) => handleInputChange("联系电话", e.target.value)}
                className={cn(
                  validationErrors["联系电话"] && "border-destructive",
                )}
              />
            </div>
            {validationErrors["联系电话"] && <p className="text-destructive text-sm mt-1">{validationErrors["联系电话"]}</p>}
          </div>

          {/* 电子邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              电子邮箱
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                placeholder="请输入电子邮箱"
                value={formData["电子邮箱"] || ""}
                onChange={(e) => handleInputChange("电子邮箱", e.target.value)}
                className={cn(
                  validationErrors["电子邮箱"] && "border-destructive",
                )}
              />
            </div>
            {validationErrors["电子邮箱"] && <p className="text-destructive text-sm mt-1">{validationErrors["电子邮箱"]}</p>}
          </div>

          {/* 申请人学位 */}
          <div className="space-y-2">
            <Label htmlFor="degree" className="flex items-center">
              申请人学位
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select
              value={formData["申请人学位"] || ""}
              onValueChange={(value) => handleInputChange("申请人学位", value)}
            >
              <SelectTrigger
                id="degree"
                className={cn(
                  validationErrors["申请人学位"] && "border-destructive",
                )}
              >
                <SelectValue placeholder="请选择学位" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((degree) => (
                  <SelectItem key={degree} value={degree}>
                    {degree}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors["申请人学位"] && <p className="text-destructive text-sm mt-1">{validationErrors["申请人学位"]}</p>}
          </div>

          {/* 申请人职称 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center">
              申请人职称
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select
              value={formData["申请人职称"] || ""}
              onValueChange={(value) => handleInputChange("申请人职称", value)}
            >
              <SelectTrigger
                id="title"
                className={cn(
                  validationErrors["申请人职称"] && "border-destructive",
                )}
              >
                <SelectValue placeholder="请选择职称" />
              </SelectTrigger>
              <SelectContent>
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors["申请人职称"] && <p className="text-destructive text-sm mt-1">{validationErrors["申请人职称"]}</p>}
          </div>

          {/* 所属研究基地类型 */}
          <div className="space-y-2">
            <Label htmlFor="baseType" className="flex items-center">
              所属研究基地类型
            </Label>
            <Select
              value={formData["所属研究基地类型"] || ""}
              onValueChange={(value) => handleInputChange("所属研究基地类型", value)}
            >
              <SelectTrigger id="baseType">
                <SelectValue placeholder="请选择研究基地类型" />
              </SelectTrigger>
              <SelectContent>
                {baseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 所在研究基地名称 */}
          <div className="space-y-2">
            <Label htmlFor="baseName" className="flex items-center">
              所在研究基地名称
            </Label>
            <div className="relative">
              <Input
                id="baseName"
                placeholder="请输入研究基地名称"
                value={formData["所在研究基地名称"] || ""}
                onChange={(e) => handleInputChange("所在研究基地名称", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 摘要区域 */}
      <div>
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <div className="text-blue-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">摘要信息</h3>
        </div>
        
        <div className="space-y-4 bg-white p-3 mt-3 rounded-md">
          {/* 关键词 */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="flex items-center">
              关键词
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="keywords"
                placeholder="请输入关键词，多个关键词请用逗号分隔"
                value={formData["关键词"] || ""}
                onChange={(e) => handleInputChange("关键词", e.target.value)}
                className={cn(
                  validationErrors["关键词"] && "border-destructive",
                )}
              />
            </div>
            {validationErrors["关键词"] && <p className="text-destructive text-sm mt-1">{validationErrors["关键词"]}</p>}
          </div>

          {/* 项目摘要 */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="flex items-center">
              项目摘要
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="summary"
              placeholder="请简要描述项目的研究内容、目标、方法和预期成果"
              value={formData["项目摘要"] || ""}
              onChange={(e) => handleInputChange("项目摘要", e.target.value)}
              className={cn(
                "min-h-[150px]",
                validationErrors["项目摘要"] && "border-destructive",
              )}
            />
            {validationErrors["项目摘要"] && <p className="text-destructive text-sm mt-1">{validationErrors["项目摘要"]}</p>}
          </div>

        </div>
      </div>
    </div>
  )
} 