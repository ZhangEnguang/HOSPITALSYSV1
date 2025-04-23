"use client"

import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Barcode, Building2, CalendarIcon, Info, Loader2, Phone, User, Award, GraduationCap } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { get, ApiResponse } from "@/lib/api"
import { SearchSelect } from "@/components/ui/search-select"
import { Dict } from "@/components/dict"
import { Textarea } from "@/components/ui/textarea"
import { expertLevelColors } from "../config/experts-config"

// 专家级别选项
const expertLevelOptions = [
  { id: "national", label: "国家级", value: "国家级" },
  { id: "provincial", label: "省级", value: "省级" },
  { id: "city", label: "市级", value: "市级" },
  { id: "school", label: "校级", value: "校级" },
]

// 状态选项
const statusOptions = [
  { id: "active", label: "在职", value: "active" },
  { id: "retired", label: "退休", value: "retired" },
  { id: "left", label: "离职", value: "left" },
]

// 性别选项
const sexOptions = [
  { id: "male", label: "男", value: "male" },
  { id: "female", label: "女", value: "female" },
]

// 职称选项
const titleOptions = [
  { id: "professor", label: "教授/博导", value: "教授/博导" },
  { id: "associate", label: "副教授/硕导", value: "副教授/硕导" },
  { id: "lecturer", label: "讲师", value: "讲师" },
  { id: "researcher", label: "研究员", value: "研究员" },
  { id: "associate_researcher", label: "副研究员", value: "副研究员" },
  { id: "assistant", label: "助理研究员", value: "助理研究员" },
]

// 学历学位选项
const educationOptions = [
  { id: "phd_postdoc", label: "博士/博士后", value: "博士/博士后" },
  { id: "phd", label: "博士", value: "博士" },
  { id: "master", label: "硕士", value: "硕士" },
  { id: "bachelor", label: "学士", value: "学士" },
]

// 专家数据接口
interface ExpertFormData {
  name: string;
  nameEn: string;
  account: string;
  birthday?: Date;
  sexId: string;
  unitId: string;
  roleId: string;
  mobile: string;
  telOffice: string;
  email: string;
  idCard: string;
  status: string;
  intro: string;
  workDate?: Date;
  // 专家特有字段
  expertLevel: string;
  specialty: string[];
  title: string;
  education: string;
}

// 对话框属性接口
interface AddExpertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddExpert: (expert: ExpertFormData) => Promise<void>
}

// 定义单位类型
interface Unit {
  id: string;
  name: string;
  code: string;
  charger?: string;
  tel?: string;
  linkMan?: string;
  intro?: string;
  unitTypeId?: string;
}

/**
 * 查询单位（支持名称和单位编号模糊匹配）
 * @param keyword 搜索关键字，将同时用于匹配名称和单位编号
 * @param page 页码
 * @param size 每页数量
 * @returns 单位列表及分页信息
 */
const searchUnit = async (keyword: string, page: number = 1, size: number = 5) => {
  return get<ApiResponse<{ list: Unit[]; total: number; pageNum: number; pageSize: number; pages: number }>>("/api/teamInfo/unit", { 
    params: { name: keyword, code: keyword, pageNum: page, pageSize: size } 
  });
};

export function AddExpertDialog({ open, onOpenChange, onAddExpert }: AddExpertDialogProps) {
  // 表单状态，匹配后端字段
  const [formData, setFormData] = useState<ExpertFormData>({
    name: "",
    nameEn: "",
    account: "", // 职工号
    sexId: "",
    unitId: "", // 成果归属单位，就是前端的departmentId
    roleId: "expert", // 默认为专家角色
    mobile: "",
    telOffice: "",
    email: "",
    idCard: "",
    status: "active", // 默认状态为"在职"
    intro: "",
    // 专家特有字段
    expertLevel: "",
    specialty: [],
    title: "",
    education: "",
  })

  // 表单验证错误
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // 保存选中的单位名称
  const [selectedUnitName, setSelectedUnitName] = useState("")

  // 专业特长输入状态
  const [specialtyInput, setSpecialtyInput] = useState("")

  // 添加专业特长
  const addSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialty.includes(specialtyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        specialty: [...prev.specialty, specialtyInput.trim()]
      }))
      setSpecialtyInput("")
    }
  }

  // 删除专业特长
  const removeSpecialty = (item: string) => {
    setFormData(prev => ({
      ...prev,
      specialty: prev.specialty.filter(s => s !== item)
    }))
  }

  // 处理专业特长输入框键盘事件
  const handleSpecialtyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSpecialty()
    }
  }

  // 处理表单字段变化
  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // 清除该字段的错误
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  // 搜索单位函数 - 适配SearchSelect组件
  const handleUnitSearch = async (keyword: string, page: number, pageSize: number) => {
    try {
      const response = await searchUnit(keyword, page, pageSize);
      if (response.code === 200 && response.data) {
        return {
          list: response.data.list,
          total: response.data.total
        };
      }
      return { list: [], total: 0 };
    } catch (error) {
      console.error("搜索单位失败:", error);
      return { list: [], total: 0 };
    }
  };

  // 处理单位选择
  const handleUnitSelect = useCallback((value: string, unit?: Unit) => {
    // 直接更新formData而不经过handleChange，确保只修改unitId字段
    setFormData(prevData => ({
      ...prevData,
      unitId: value
    }));
    
    // 清除该字段的错误
    if (errors.unitId) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.unitId;
        return newErrors;
      });
    }
    
    // 更新显示名称
    if (unit) {
      setSelectedUnitName(unit.name);
    }
  }, [errors.unitId]);

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = "姓名不能为空"
    if (!formData.account) newErrors.account = "工号不能为空"
    if (!formData.sexId) newErrors.sexId = "请选择性别"
    if (!formData.unitId) newErrors.unitId = "请选择所属单位"
    if (!formData.mobile) newErrors.mobile = "手机号不能为空"
    else if (!/^1[3-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = "请输入有效的手机号"
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "请输入有效的邮箱"
    
    // 专家特有字段验证
    if (!formData.expertLevel) newErrors.expertLevel = "请选择专家级别"
    if (formData.specialty.length === 0) newErrors.specialty = "请至少添加一项专业特长"
    if (!formData.title) newErrors.title = "请选择职称"
    if (!formData.education) newErrors.education = "请选择学历学位"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理提交
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onAddExpert(formData)
        // 提交成功后重置表单
        setFormData({
          name: "",
          nameEn: "",
          account: "", 
          sexId: "",
          unitId: "", 
          roleId: "expert",
          mobile: "",
          telOffice: "",
          email: "",
          idCard: "",
          status: "active",
          intro: "",
          expertLevel: "",
          specialty: [],
          title: "",
          education: "",
        })
        setSelectedUnitName("")
        onOpenChange(false)
      } catch (error) {
        console.error("添加专家失败:", error)
        toast({
          title: "添加专家失败",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        })
      }
    } else {
      // 滚动到第一个错误字段
      const firstErrorField = Object.keys(errors)[0]
      const errorElement = document.getElementById(firstErrorField)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        errorElement.focus()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>添加专家</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                姓名 <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="请输入姓名"
                  className={cn("pl-8", errors.name && "border-red-500")}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn" className="flex items-center">英文名</Label>
              <Input
                id="nameEn"
                placeholder="请输入英文名（可选）"
                value={formData.nameEn}
                onChange={(e) => handleChange("nameEn", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account" className="flex items-center">
                工号 <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Barcode className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="account"
                  placeholder="请输入工号"
                  className={cn("pl-8", errors.account && "border-red-500")}
                  value={formData.account}
                  onChange={(e) => handleChange("account", e.target.value)}
                />
              </div>
              {errors.account && <p className="text-red-500 text-xs">{errors.account}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexId" className="flex items-center">
                性别 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.sexId}
                onValueChange={(value) => handleChange("sexId", value)}
              >
                <SelectTrigger
                  id="sexId"
                  className={cn(errors.sexId && "border-red-500")}
                >
                  <SelectValue placeholder="请选择性别" />
                </SelectTrigger>
                <SelectContent>
                  {sexOptions.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sexId && <p className="text-red-500 text-xs">{errors.sexId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthday">出生日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birthday ? (
                      format(formData.birthday, "yyyy-MM-dd")
                    ) : (
                      <span>请选择出生日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.birthday}
                    onSelect={(date) => handleChange("birthday", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitId" className="flex items-center">
                所属单位 <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <SearchSelect
                  id="unitId"
                  placeholder="请搜索选择单位"
                  search={handleUnitSearch}
                  onSelect={handleUnitSelect}
                  className={cn(errors.unitId && "border-red-500")}
                  renderOption={(option) => (
                    <div className="flex flex-col">
                      <span>{option.name}</span>
                      <span className="text-xs text-muted-foreground">{option.code}</span>
                    </div>
                  )}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              </div>
              {errors.unitId && <p className="text-red-500 text-xs">{errors.unitId}</p>}
            </div>
          </div>

          {/* 联系方式 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center">
                手机号码 <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="mobile"
                  placeholder="请输入手机号码"
                  className={cn("pl-8", errors.mobile && "border-red-500")}
                  value={formData.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telOffice">办公电话</Label>
              <Input
                id="telOffice"
                placeholder="请输入办公电话（可选）"
                value={formData.telOffice}
                onChange={(e) => handleChange("telOffice", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">电子邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入电子邮箱（可选）"
                className={cn(errors.email && "border-red-500")}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="idCard">身份证号</Label>
              <Input
                id="idCard"
                placeholder="请输入身份证号（可选）"
                value={formData.idCard}
                onChange={(e) => handleChange("idCard", e.target.value)}
              />
            </div>
          </div>

          {/* 专家特有信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expertLevel" className="flex items-center">
                专家级别 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.expertLevel}
                onValueChange={(value) => handleChange("expertLevel", value)}
              >
                <SelectTrigger
                  id="expertLevel"
                  className={cn(errors.expertLevel && "border-red-500")}
                >
                  <SelectValue placeholder="请选择专家级别" />
                </SelectTrigger>
                <SelectContent>
                  {expertLevelOptions.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expertLevel && <p className="text-red-500 text-xs">{errors.expertLevel}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">专家状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="请选择专家状态" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center">
                职称 <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Award className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Select
                  value={formData.title}
                  onValueChange={(value) => handleChange("title", value)}
                >
                  <SelectTrigger
                    id="title"
                    className={cn("pl-8", errors.title && "border-red-500")}
                  >
                    <SelectValue placeholder="请选择职称" />
                  </SelectTrigger>
                  <SelectContent>
                    {titleOptions.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="education" className="flex items-center">
                学历学位 <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Select
                  value={formData.education}
                  onValueChange={(value) => handleChange("education", value)}
                >
                  <SelectTrigger
                    id="education"
                    className={cn("pl-8", errors.education && "border-red-500")}
                  >
                    <SelectValue placeholder="请选择学历学位" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationOptions.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.education && <p className="text-red-500 text-xs">{errors.education}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty" className="flex items-center">
              专业特长 <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="specialty"
                placeholder="输入专业特长，按回车或逗号添加"
                className={cn(errors.specialty && "border-red-500")}
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyDown={handleSpecialtyKeyDown}
              />
              <Button type="button" onClick={addSpecialty}>添加</Button>
            </div>
            {errors.specialty && <p className="text-red-500 text-xs">{errors.specialty}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.specialty.map((item, index) => (
                <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                  <span>{item}</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => removeSpecialty(item)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workDate">入职日期</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.workDate ? (
                    format(formData.workDate, "yyyy-MM-dd")
                  ) : (
                    <span>请选择入职日期</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.workDate}
                  onSelect={(date) => handleChange("workDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intro">专家简介</Label>
            <Textarea
              id="intro"
              placeholder="请输入专家简介，包括研究方向、主要成就等"
              value={formData.intro}
              onChange={(e) => handleChange("intro", e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>
            添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 