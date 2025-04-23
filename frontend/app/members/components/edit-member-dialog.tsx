import { useState, useEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Building2, CalendarIcon, Info, Loader2, Phone, User } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Dict } from "@/components/dict";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { departments } from "../config/members-config"
import { get, ApiResponse } from "@/lib/api"
import { SearchSelect } from "@/components/ui/search-select"

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

// 更改为与后端PersonDTO匹配的接口
interface PersonFormData {
  id?: string;
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
  userId?: string;
}

// 更新组件参数类型以匹配后端API
interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditMember: (member: PersonFormData) => void;
  member: any;
}

export function EditMemberDialog({ open, onOpenChange, onEditMember, member }: EditMemberDialogProps) {
  // 表单状态
  const [formData, setFormData] = useState<PersonFormData>({
    id: "",
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
    status: "",
    intro: "",
  });

  // 表单验证错误
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 保存选中的单位名称
  const [selectedUnitName, setSelectedUnitName] = useState("")

  // 根据unitId获取单位信息
  const fetchUnitInfo = useCallback(async (unitId: string) => {

    if (!unitId) {
      console.log("fetchUnitInfo: unitId为空，跳过请求");
      return;
    }

    // 添加防抖，避免重复请求
    const cacheKey = `unit_${unitId}`;
    const cachedName = sessionStorage.getItem(cacheKey);
    if (cachedName) {
      console.log("使用缓存的单位名称:", cachedName);
      setSelectedUnitName(cachedName);
      return;
    }

    try {

      console.log("开始获取单位信息，unitId:", unitId);
      const response = await get<ApiResponse<Unit>>(`/api/teamInfo/unit/${unitId}`);
      console.log("单位信息API响应:", response);

      if (response.code === 200 && response.data) {
        console.log("获取到单位信息:", response.data);
        setSelectedUnitName(response.data.name);
        // 缓存单位名称
        sessionStorage.setItem(cacheKey, response.data.name);
      } else {
        console.error("获取单位信息失败:", response);
        setSelectedUnitName(`未知部门(ID: ${unitId})`);
      }
    } catch (error) {
      console.error("获取单位信息请求出错:", error);
      setSelectedUnitName(`未知部门(ID: ${unitId})`);
    }
  }, []);

  // 当成员数据变化时，更新表单数据
  useEffect(() => {
    console.log("member数据变化，当前member:", member);

    if (member) {
      // 获取原始数据（如果存在）
      const originalData = member._original || member;
      console.log("处理的原始数据:", originalData);

      // 获取unitId，确保有正确的值
      let unitId = "";
      if (originalData.unitId) {
        unitId = originalData.unitId;
        console.log("使用originalData.unitId:", unitId);
      } else if (member.unitId) {
        unitId = member.unitId;
        console.log("使用member.unitId:", unitId);
      } else if (member.department?.id) {
        unitId = member.department.id.toString(); // 确保转换为字符串
        console.log("使用member.department.id:", unitId);
      } else if (typeof member.id === 'string' && member.id) {
        // 如果都没有，但有member.id，可能本身就是单位ID
        unitId = member.id;
        console.log("使用member.id作为unitId:", unitId);
      }

      console.log("最终确定的unitId:", unitId);

      // 转换日期格式
      const convertDate = (dateStr: string | undefined) => {
        if (!dateStr) return undefined;
        try {
          return new Date(dateStr);
        } catch {
          return undefined;
        }
      };

      // 构建完整的表单数据
      const newFormData = {
        id: member.id || "",
        name: member.name || "",
        nameEn: member.nameEn || "",
        account: member.account || "",
        birthday: convertDate(member.birthday),
        sexId: member.sexId || "",
        unitId: unitId, // 使用处理后的unitId
        roleId: member.roleId || "",
        mobile: member.mobile || member.phone || "",
        telOffice: member.telOffice || "",
        email: member.email || "",
        idCard: member.idCard || "",
        status: getStatusId(member) || "active",
        intro: member.intro || member.bio || "",
        workDate: convertDate(member.workDate) || convertDate(member.joinDate),
        userId: originalData.userId || member.userId || "",
      };

      console.log("设置新的表单数据:", newFormData);
      setFormData(newFormData);

      // 设置单位名称
      if (member.department?.name) {
        console.log("使用department.name设置单位名称:", member.department.name);
        setSelectedUnitName(member.department.name);
      } else if (originalData.unitName) {
        console.log("使用originalData.unitName设置单位名称:", originalData.unitName);
        setSelectedUnitName(originalData.unitName);
      } else if (unitId) {
        console.log("通过API获取单位名称, unitId:", unitId);
        fetchUnitInfo(unitId);
      } else {
        console.log("无法获取单位信息，所有可能的来源都为空");
        setSelectedUnitName("未知部门");
      }
    }
  }, [member, fetchUnitInfo]);

  // 监听对话框打开状态，确保每次打开时都重置表单
  useEffect(() => {
    if (open && member) {
      console.log("对话框打开，重新初始化表单数据");

      // 获取原始数据（如果存在）
      const originalData = member._original || member;

      // 获取unitId，确保有正确的值
      let unitId = "";
      if (originalData.unitId) {
        unitId = originalData.unitId;
      } else if (member.unitId) {
        unitId = member.unitId;
      } else if (member.department?.id) {
        unitId = member.department.id.toString();
      } else if (typeof member.id === 'string' && member.id) {
        unitId = member.id;
      }

      // 转换日期格式
      const convertDate = (dateStr: string | undefined) => {
        if (!dateStr) return undefined;
        try {
          return new Date(dateStr);
        } catch {
          return undefined;
        }
      };

      // 构建完整的表单数据
      const newFormData = {
        id: member.id || "",
        name: member.name || "",
        nameEn: member.nameEn || "",
        account: member.account || "",
        birthday: convertDate(member.birthday),
        sexId: member.sexId || "",
        unitId: unitId,
        roleId: member.roleId || "",
        mobile: member.mobile || member.phone || "",
        telOffice: member.telOffice || "",
        email: member.email || "",
        idCard: member.idCard || "",
        status: getStatusId(member) || "active",
        intro: member.intro || member.bio || "",
        workDate: convertDate(member.workDate) || convertDate(member.joinDate),
        userId: originalData.userId || member.userId || "",
      };

      // 重置表单数据
      setFormData(newFormData);

      // 重置单位名称
      if (member.department?.name) {
        setSelectedUnitName(member.department.name);
      } else if (originalData.unitName) {
        setSelectedUnitName(originalData.unitName);
      } else if (unitId) {
        fetchUnitInfo(unitId);
      } else {
        setSelectedUnitName("未知部门");
      }

      // 重置其他状态
      setErrors({});
    }
  }, [open, member, fetchUnitInfo]);

  // 监听对话框打开状态和formData变化
  useEffect(() => {
    if (open) {
      console.log("对话框打开，当前状态:", {
        formData,
        selectedUnitName,
        member
      });

      // 如果有unitId但没有单位名称，获取单位信息
      if (formData.unitId && (!selectedUnitName || selectedUnitName === "未知部门")) {
        console.log("对话框打开时获取单位信息:", formData.unitId);
        fetchUnitInfo(formData.unitId);
      }
    }
  }, [open, formData, selectedUnitName, fetchUnitInfo, member]);

  // 监听单位ID变化
  useEffect(() => {
    const unitId = formData.unitId;
    console.log("unitId变化:", {
      unitId,
      selectedUnitName,
      isOpen: open
    });

    if (unitId && (!selectedUnitName || selectedUnitName === "未知部门")) {
      console.log("unitId变化触发获取单位信息:", unitId);
      fetchUnitInfo(unitId);
    }
  }, [formData.unitId, selectedUnitName, fetchUnitInfo, open]);

  // 处理表单字段变化
  const handleChange = (field: string, value: any) => {

    setFormData({
      ...formData,
      [field]: value,
    });

    // 清除该字段的错误
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

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
    handleChange("unitId", value);
    if (unit) {
      setSelectedUnitName(unit.name);
      // 缓存单位名称，以便以后使用
      sessionStorage.setItem(`unit_${value}`, unit.name);
    }
  }, [handleChange]);

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "姓名不能为空";
    }

    if (!formData.roleId) {
      newErrors.roleId = "请选择角色";
    }

    if (!formData.unitId) {
      newErrors.unitId = "请选择所属部门";
    }

    if (!formData.status) {
      newErrors.status = "请选择状态";
    }

    if (!formData.account) {
      newErrors.account = "职工号不能为空";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "邮箱格式不正确";
    }

    if (formData.mobile && !/^1[3-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "手机号格式不正确";
    }
    
    // 身份证号校验：15位或18位（最后一位可能是X）
    if (formData.idCard && !/^(\d{15}|\d{17}[\dXx])$/.test(formData.idCard)) {
      newErrors.idCard = "身份证号格式不正确，应为15位或18位";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (validateForm()) {
      // 处理日期格式
      const updatedMember = {
        ...formData,
        birthday: formData.birthday instanceof Date
            ? format(formData.birthday, 'yyyy-MM-dd')
            : formData.birthday,
        workDate: formData.workDate instanceof Date
            ? format(formData.workDate, 'yyyy-MM-dd')
            : formData.workDate,
        roleId:Array.isArray(formData.roleId) ? formData.roleId.join(",") : formData.roleId,
      };

      // 调用父组件提供的回调，更新成员
      onEditMember(updatedMember);

      // 关闭对话框
      onOpenChange(false);

      // 显示成功提示
      toast({
        title: "更新成功",
        description: `已成功更新成员：${formData.name}`,
      });
    }
  };

  // 在对话框打开时记录调试信息
  useEffect(() => {
    if (open) {
      console.log("编辑对话框打开，表单数据:", formData);
    }
  }, [open, formData]);

  // 辅助函数：获取正确的状态ID
  function getStatusId(memberData: any): string {
    console.log("获取状态ID，原始数据：", memberData);

    // 1. 如果已经是ID格式，直接返回
    if (memberData.statusId && ["active", "retired", "left"].includes(memberData.statusId)) {
      console.log("使用statusId:", memberData.statusId);
      return memberData.statusId;
    }

    // 2. 从原始数据获取
    if (memberData._original && memberData._original.status &&
        ["active", "retired", "left"].includes(memberData._original.status)) {
      console.log("使用_original.status:", memberData._original.status);
      return memberData._original.status;
    }

    // 3. 从状态显示值映射回ID
    const statusMap: Record<string, string> = {
      '在职': 'active',
      '退休': 'retired',
      '离职': 'left'
    };

    if (memberData.status && statusMap[memberData.status]) {
      console.log("从显示值映射:", memberData.status, "->", statusMap[memberData.status]);
      return statusMap[memberData.status];
    }

    // 4. 如果是ID格式但不在预期列表中，仍返回原值
    if (memberData.status) {
      console.log("使用原始status:", memberData.status);
      return memberData.status;
    }

    // 5. 默认返回"active"
    console.log("使用默认值: active");
    return "active";
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">编辑科研人员</DialogTitle>
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
                  setFormData={setFormData} />
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
  );
}


