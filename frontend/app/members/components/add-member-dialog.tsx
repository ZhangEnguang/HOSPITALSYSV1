"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Barcode, Building2, CalendarIcon, Info, Loader2, Phone, User } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { departments } from "../config/members-config"
import { get, ApiResponse } from "@/lib/api"
import { SearchSelect } from "@/components/ui/search-select"
import { Dict } from "@/components/dict"

// 角色选项
const roleOptions = [
  { id: "researcher", label: "研究员", value: "researcher" },
  { id: "student", label: "学生", value: "student" },
  { id: "expert", label: "评审专家", value: "expert" },
  { id: "consultant", label: "独立顾问", value: "consultant" },
  { id: "other", label: "其他", value: "other" },
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

// 更改为与后端PersonDTO匹配的接口
interface PersonFormData {
  name: string;
  nameEn: string;
  account: string;
  birthday?: Date | string;
  sexId: string;
  unitId: string;
  roleId: string;
  mobile: string;
  telOffice: string;
  email: string;
  idCard: string;
  status: string;
  intro: string;
  workDate?: Date | string;
}

// 更新组件参数类型以匹配后端API
interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: PersonFormData) => void
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
  return get<ApiResponse<{ records: Unit[]; total: number; pageNum: number; pageSize: number; pages: number }>>("/api/teamInfo/unit", { 
    params: { name: keyword, code: keyword, pageNum: page, pageSize: size } 
  });
};

export function AddMemberDialog({ open, onOpenChange, onAddMember }: AddMemberDialogProps) {
  // 表单状态，匹配后端字段
  const [formData, setFormData] = useState<PersonFormData>({
    name: "",
    nameEn: "",
    account: "", // 职工号
    sexId: "",
    unitId: "", // 成果归属单位，就是前端的departmentId
    roleId: "",
    mobile: "",
    telOffice: "",
    email: "",
    idCard: "",
    status: "active", // 默认状态为"在职"
    intro: "",
  })

  // 表单验证错误
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // 保存选中的单位名称
  const [selectedUnitName, setSelectedUnitName] = useState("")

  // 重置表单数据
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      nameEn: "",
      account: "",
      sexId: "",
      unitId: "",
      roleId: "",
      mobile: "",
      telOffice: "",
      email: "",
      idCard: "",
      status: "active", // 默认状态为"在职"
      intro: "",
    });
    setErrors({});
    setSelectedUnitName("");
  }, []);

  // 当对话框打开时重置表单
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

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
          list: response.data.records,
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

    if (!formData.name.trim()) {
      newErrors.name = "姓名不能为空"
    }

    if (!formData.roleId) {
      newErrors.roleId = "请选择角色"
    }

    if (!formData.unitId) {
      newErrors.unitId = "请选择所属部门"
    }

    if (!formData.status) {
      newErrors.status = "请选择状态"
    }
    
    if (!formData.account) {
      newErrors.account = "职工号不能为空"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "邮箱格式不正确"
    }

    if (formData.mobile && !/^1[3-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "手机号格式不正确"
    }
    
    // 身份证号校验：15位或18位（最后一位可能是X）
    if (formData.idCard && !/^(\d{15}|\d{17}[\dXx])$/.test(formData.idCard)) {
      newErrors.idCard = "身份证号格式不正确，应为15位或18位"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = () => {
    if (validateForm()) {
      
      // 直接使用表单数据，转换日期为后端需要的格式
      const newMember = {
        ...formData,
        // 如果日期存在，转换为yyyy-MM-dd格式
        birthday: formData.birthday instanceof Date
          ? format(formData.birthday, 'yyyy-MM-dd') 
          : formData.birthday,
        workDate: formData.workDate instanceof Date
          ? format(formData.workDate, 'yyyy-MM-dd')
          : formData.workDate || format(new Date(), 'yyyy-MM-dd'),
        roleId: Array.isArray(formData.roleId) ? formData.roleId.join(",") : formData.roleId,
      }

      // 调用父组件提供的回调，添加新成员
      onAddMember(newMember)

      // 重置表单
      setFormData({
        name: "",
        nameEn: "",
        account: "",
        sexId: "",
        unitId: "",
        roleId: "",
        mobile: "",
        telOffice: "",
        email: "",
        idCard: "",
        status: "active",
        intro: "",
      })
      
      // 关闭对话框
      onOpenChange(false)

      // 显示成功提示
      toast({
        title: "添加成功",
        description: `已成功添加成员：${formData.name}`,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">新增科研人员</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 姓名 */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center">
              姓名 <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* 英文名 */}
          <div className="grid gap-2">
            <Label htmlFor="nameEn">英文名</Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => handleChange("nameEn", e.target.value)}
            />
          </div>

          {/* 职工号 */}
          <div className="grid gap-2">
            <Label htmlFor="account" className="flex items-center">
              职工号 <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="account"
              value={formData.account}
              onChange={(e) => handleChange("account", e.target.value)}
              className={errors.account ? "border-red-500" : ""}
            />
            {errors.account && <p className="text-red-500 text-xs">{errors.account}</p>}
          </div>

          {/* 角色 */}
          <div className="grid gap-2">
            <Label htmlFor="roleId" className="flex items-center">
              角色 <span className="text-red-500 ml-1">*</span>
            </Label>
            <Dict
              dictCode="roles"
              displayType="checkbox"
              value={formData.roleId || []}
              field="roleId"
              setFormData={setFormData}
            />
            {errors.roleId && <p className="text-red-500 text-xs">{errors.roleId}</p>}
          </div>

          {/* 性别 */}
          <div className="grid gap-2">
            <Label htmlFor="sexId">性别</Label>
            <Select value={formData.sexId} onValueChange={(value) => handleChange("sexId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择性别" />
              </SelectTrigger>
              <SelectContent>
                {sexOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 所属部门 - 使用SearchSelect组件 */}
          <div className="grid gap-2">
            <Label htmlFor="unitId" className="flex items-center">
              所属部门 <span className="text-red-500 ml-1">*</span>
            </Label>
            <SearchSelect<Unit>
              value={formData.unitId}
              displayValue={selectedUnitName}
              onChange={handleUnitSelect}
              onSearch={handleUnitSearch}
              placeholder="请输入部门名称搜索"
              labelIcon={<Building2 className="h-4 w-4 text-blue-600" />}
              labelField="name"
              displayFields={[
                { field: "code", label: "单位编码", icon: <Info className="h-3.5 w-3.5 text-blue-500" /> },
                { field: "charger", label: "负责人", icon: <User className="h-3.5 w-3.5 text-green-500" /> },
                { field: "tel", label: "联系电话", icon: <Phone className="h-3.5 w-3.5 text-red-500" /> }
              ]}
              allowEmptySearch={true}
              error={!!errors.unitId}
              errorMessage={errors.unitId}
            />
          </div>

          {/* 状态 */}
          <div className="grid gap-2">
            <Label htmlFor="status" className="flex items-center">
              状态 <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
          </div>

          {/* 手机号 */}
          <div className="grid gap-2">
            <Label htmlFor="mobile">手机号</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              className={errors.mobile ? "border-red-500" : ""}
            />
            {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
          </div>

          {/* 办公电话 */}
          <div className="grid gap-2">
            <Label htmlFor="telOffice">办公电话</Label>
            <Input
              id="telOffice"
              value={formData.telOffice}
              onChange={(e) => handleChange("telOffice", e.target.value)}
            />
          </div>

          {/* 邮箱 */}
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* 身份证号 */}
          <div className="grid gap-2">
            <Label htmlFor="idCard">身份证号</Label>
            <Input
              id="idCard"
              value={formData.idCard}
              onChange={(e) => handleChange("idCard", e.target.value)}
            />
          </div>

          {/* 入职日期 */}
          <div className="grid gap-2">
            <Label htmlFor="workDate">入职日期</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.workDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.workDate instanceof Date ? format(formData.workDate, "yyyy-MM-dd") : 
                    formData.workDate ? String(formData.workDate) : <span>选择日期</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.workDate instanceof Date ? formData.workDate : undefined}
                  onSelect={(date) => handleChange("workDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 个人介绍 */}
          <div className="grid gap-2">
            <Label htmlFor="intro">个人介绍</Label>
            <Input
              id="intro"
              value={formData.intro}
              onChange={(e) => handleChange("intro", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

