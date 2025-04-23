"use client"

import { useState,useCallback,useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarIcon, Building, User, PhoneCall, Contact, Hash, FileText, Info, Building2,Phone, SortAsc } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { orgTypeOptions } from "../config/members-config"
import { SearchSelect } from "@/components/ui/search-select";
import { get, ApiResponse,post } from "@/lib/api";
import { Dict } from "@/components/dict";




// 保存选中的单位名称

interface AddOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddOrganization: (organization: any) => void
}

interface OrganizationFormData {
  name: string;
  code: string;
  unitTypeId: string;
  charger: string;
  chargerId: string;
  linkMan: string;
  linkManId: string;
  tel: string;
  unitCreateDate: Date | null;
  orderId: string;
  intro: string;
  standBy1: string;
}

// 定义单位类型
interface personShow {
  id: string;
  name: string;
  account: string;
  unitId?: string;
  mobile?: string;
}

export function AddOrganizationDialog({
  open,
  onOpenChange,
  onAddOrganization,
}: AddOrganizationDialogProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    code: "",
    unitTypeId: "",
    charger: "",
    chargerId: "",
    linkMan: "",
    linkManId: "",
    tel: "",
    unitCreateDate: null,
    orderId: "",
    intro: "",
    standBy1: "",
  })

  // 重置表单数据
const resetForm = useCallback(() => {
  setFormData({
    name: "",
    code: "",
    unitTypeId: "",
    charger: "",
    chargerId: "",
    linkMan: "",
    linkManId: "",
    tel: "",
    unitCreateDate: null,
    orderId: "",
    intro: "",
    standBy1: "",
  });
  setErrors({});
  setPersonName("");
  setlinkManName("");
}, []);


  const handlePersonSearch = async (keyword: string, page: number = 1, size: number = 5) => {
    try {
      const response = await post<ApiResponse<{ records: personShow[]; total: number; pageNum: number; pageSize: number; pages: number }>>("/api/teamInfo/person/page", { 
        name: keyword, 
        code: keyword, 
        pageNum: page, 
        pageSize: size 
      });
      console.log('获取人员列表响应:', response);
      if (response.code === 200 && response.data && Array.isArray(response.data.records)) {
        return {
          list: response.data.records,
          total: response.data.total
        };
      }
      return { list: [], total: 0 };
    } catch (error) {
      console.error("搜索人员失败:", error);
      return { list: [], total: 0 };
    } finally {
      setLoading(false)
    }
  };


  const handlePersonSelect = (value: string, person?: personShow) => {
    setFormData(prev => ({
      ...prev,
      charger: person?.name || "",
      chargerId: person?.id || ""
    }));
    
    if (person) {
      setPersonName(person.name);
      // 可选：缓存单位名称
      //sessionStorage.setItem(`unit_${value}`, unit.name);
    }
  };
  const handlelinkManSelect = (value: string, person?: personShow) => {
    setFormData(prev => ({
      ...prev,
      linkMan: person?.name || "",
      linkManId: person?.id || "",
      tel: person?.mobile || ""
    }));
    
    if (person) {
      setlinkManName(person.name);
      // 可选：缓存单位名称
      //sessionStorage.setItem(`unit_${value}`, unit.name);
    }
  };

  

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [personName, setPersonName] = useState("")
  const [linkManName, setlinkManName] = useState("")
  const [loading, setLoading] = useState(false)



  const handleChange = (field: keyof OrganizationFormData, value: any) => {
    setFormData((prev: OrganizationFormData) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev: Record<string, string>) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
      });
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "单位名称不能为空";
    if (!formData.unitTypeId) newErrors.unitTypeId = "请选择单位类型";
    if (!formData.charger.trim()) newErrors.charger = "负责人不能为空";
    if (!formData.linkMan.trim()) newErrors.linkMan = "联系人不能为空";
    if (!formData.tel.trim()) {
        newErrors.tel = "联系电话不能为空";
    } else if (!/^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(formData.tel)) {
        newErrors.tel = "请输入有效的联系电话";
    }
    if (!formData.unitCreateDate) newErrors.unitCreateDate = "请选择成立日期";
    if (formData.orderId && !/^\d+$/.test(formData.orderId)) {
        newErrors.orderId = "排序号必须是数字";
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const newOrganization = {
        id: `ORG-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        name: formData.name,
        code: formData.code || `${formData.unitTypeId}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        unitTypeId: formData.unitTypeId,
        charger: formData.charger,
        chargerId: formData.chargerId,
        linkMan: formData.linkMan,
        linkManId: formData.linkManId,
        tel: formData.tel,
        unitCreateDate: formData.unitCreateDate ? format(formData.unitCreateDate, "yyyy-MM-dd") : null,
        orderId: formData.orderId ? Number.parseInt(formData.orderId) : null,
        intro: formData.intro,
        standBy1: formData.standBy1,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      onAddOrganization(newOrganization)

      setFormData({
        name: "",
        code: "",
        unitTypeId: "",
        charger: "",
        chargerId: "",
        linkMan: "",
        linkManId: "",
        tel: "",
        unitCreateDate: null,
        orderId: "",
        intro: "",
        standBy1: "",
      })
      setErrors({});

      onOpenChange(false)

      toast({
        title: "添加成功",
        description: `已成功添加组织：${newOrganization.name}`,
      })
    } else {
       toast({
        title: "验证失败",
        description: "请检查表单中的错误信息",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">新增组织</DialogTitle>
        </DialogHeader>

        <div className="py-4 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" /> 单位名称 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={cn(errors.name && "border-red-500")}
                placeholder="请输入单位名称"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code" className="flex items-center">
                <Hash className="mr-2 h-4 w-4 text-muted-foreground" /> 单位编号
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="可选填，自动生成"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unitTypeId" className="flex items-center">
                 <Info className="mr-2 h-4 w-4 text-muted-foreground" /> 单位类型 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={formData.unitTypeId} onValueChange={(value) => handleChange("unitTypeId", value)}>
                <SelectTrigger className={cn(errors.unitTypeId && "border-red-500")}>
                  <SelectValue placeholder="选择单位类型" />
                </SelectTrigger>
                <SelectContent>
                  {orgTypeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unitTypeId && <p className="text-red-500 text-xs">{errors.unitTypeId}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="charger" className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" /> 负责人 <span className="text-red-500 ml-1">*</span>
              </Label>
              {/* <Input
                id="charger"
                value={formData.charger}
                onChange={(e) => handleChange("charger", e.target.value)}
                className={cn(errors.charger && "border-red-500")}
                placeholder="请输入负责人姓名"
              /> */}
              <SearchSelect<personShow>
                value={formData.charger}
                displayValue={personName}
                onChange={handlePersonSelect}
                onSearch={handlePersonSearch}
                placeholder="请输入人员名称搜索"
                labelIcon={<User className="h-4 w-4 text-blue-600" />}
                labelField="name"
                displayFields={[
                  { field: "account", label: "工号", icon: <Info className="h-3.5 w-3.5 text-blue-500" /> },
                  { field: "unitId", label: "单位", icon: <User className="h-3.5 w-3.5 text-green-500" />,isDict:true ,dictCode:"unit" },
                ]}
                allowEmptySearch={true}
                error={!!errors.charger}
                errorMessage={errors.charger}
              />
              {/* {errors.charger && <p className="text-red-500 text-xs">{errors.charger}</p>} */}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="linkMan" className="flex items-center">
                 <Contact className="mr-2 h-4 w-4 text-muted-foreground" /> 联系人 <span className="text-red-500 ml-1">*</span>
              </Label>
              {/* <Input
                id="linkMan"
                value={formData.linkMan}
                onChange={(e) => handleChange("linkMan", e.target.value)}
                 className={cn(errors.linkMan && "border-red-500")}
                placeholder="请输入联系人姓名"
              /> */}
              <SearchSelect<personShow>
                value={formData.linkMan}
                displayValue={linkManName}
                onChange={handlelinkManSelect}
                onSearch={handlePersonSearch}
                placeholder="请输入人员名称搜索"
                labelIcon={<User className="h-4 w-4 text-blue-600" />}
                labelField="name"
                displayFields={[
                  { field: "account", label: "工号", icon: <Info className="h-3.5 w-3.5 text-blue-500" /> },
                  { field: "unitId", label: "单位", icon: <User className="h-3.5 w-3.5 text-green-500" />,isDict:true ,dictCode:"unit"},
                  { field: "mobile", label: "联系电话", icon: <Phone className="h-3.5 w-3.5 text-green-500" /> },
                ]}
                allowEmptySearch={true}
                error={!!errors.charger}
                errorMessage={errors.charger}
              />
              {/* {errors.linkMan && <p className="text-red-500 text-xs">{errors.linkMan}</p>} */}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tel" className="flex items-center">
                <PhoneCall className="mr-2 h-4 w-4 text-muted-foreground" /> 联系电话 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="tel"
                value={formData.tel}
                onChange={(e) => handleChange("tel", e.target.value)}
                className={cn(errors.tel && "border-red-500")}
                placeholder="请输入联系电话"
              />
              {errors.tel && <p className="text-red-500 text-xs">{errors.tel}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unitCreateDate" className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" /> 成立日期 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.unitCreateDate && "text-muted-foreground",
                       errors.unitCreateDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.unitCreateDate ? format(formData.unitCreateDate, "yyyy-MM-dd") : <span>选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.unitCreateDate ?? undefined}
                    onSelect={(date) => handleChange("unitCreateDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
               {errors.unitCreateDate && <p className="text-red-500 text-xs">{errors.unitCreateDate}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="orderId" className="flex items-center">
                 <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" /> 排序号
              </Label>
              <Input
                id="orderId"
                type="number"
                value={formData.orderId}
                onChange={(e) => handleChange("orderId", e.target.value)}
                className={cn(errors.orderId && "border-red-500")}
                placeholder="可选填，数字越大越靠前"
                min="0"
              />
               {errors.orderId && <p className="text-red-500 text-xs">{errors.orderId}</p>}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="intro" className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" /> 简介
              </Label>
              <Textarea
                id="intro"
                value={formData.intro}
                onChange={(e) => handleChange("intro", e.target.value)}
                placeholder="请输入单位简介"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="standBy1" className="flex items-center">
                 <Info className="mr-2 h-4 w-4 text-muted-foreground" /> 备注
              </Label>
              <Textarea
                id="standBy1"
                value={formData.standBy1}
                onChange={(e) => handleChange("standBy1", e.target.value)}
                placeholder="请输入备注信息"
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

