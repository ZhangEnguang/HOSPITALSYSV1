"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarIcon, Building, User, PhoneCall, Contact, Hash, FileText, Info, SortAsc, Phone } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { orgTypeOptions } from "../config/members-config"
import { SearchSelect } from "@/components/ui/search-select"
import { get, ApiResponse } from "@/lib/api"
import { Dict } from "@/components/dict"

interface EditOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditOrganization: (organization: any) => void
  organization: any | null
}

interface OrganizationFormData {
  id: string;
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

interface personShow {
  id: string;
  name: string;
  account: string;
  unitId?: string;
  mobile?: string;
}

export function EditOrganizationDialog({
  open,
  onOpenChange,
  onEditOrganization,
  organization,
}: EditOrganizationDialogProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    id: "",
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

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [personName, setPersonName] = useState("")
  const [linkManName, setlinkManName] = useState("")

  useEffect(() => {
    if (organization) {
      let parsedDate = null;
      if (organization.unitCreateDate) {
        try {
          parsedDate = parseISO(organization.unitCreateDate);
          if (isNaN(parsedDate.getTime())) {
            parsedDate = null;
            console.warn("Invalid date format received for unitCreateDate:", organization.unitCreateDate);
          }
        } catch (error) {
          console.error("Error parsing date:", error);
          parsedDate = null;
        }
      }

      setFormData({
        id: organization.id || "",
        name: organization.name || "",
        code: organization.code || "",
        unitTypeId: organization.unitTypeId || "",
        charger: organization.charger || "",
        chargerId: organization.chargerId || "",
        linkMan: organization.linkMan || "",
        linkManId: organization.linkManId || "",
        tel: organization.tel || "",
        unitCreateDate: parsedDate,
        orderId: organization.orderId?.toString() || "",
        intro: organization.intro || "",
        standBy1: organization.standBy1 || "",
      })
      setErrors({});
      setPersonName(organization.charger || "");
      setlinkManName(organization.linkMan || "");
    }
  }, [organization])

  const handlePersonSearch = async (keyword: string, page: number, pageSize: number) => {
    try {
      const response = await get<ApiResponse<{ list: personShow[]; total: number; pageNum: number; pageSize: number; pages: number }>>("/api/teamInfo/person/page", {
        params: { name: keyword, code: keyword, pageNum: page, pageSize: pageSize } 
      });
    
      if (response.code === 200 && response.data) {
        return {
          list: response.data.records,
          total: response.data.total
        };
      }
      return { list: [], total: 0 };
    } catch (error) {
      console.error("搜索人员失败:", error);
      return { list: [], total: 0 };
    }
  };

  const handlePersonSelect = (value: string, person?: personShow) => {
    setFormData(prev => ({
      ...prev,
      charger: person?.name || "" ,
      chargerId: person?.id || "" 
    }));
    
    if (person) {
      setPersonName(person.name);
    }
  };

  const handlelinkManSelect = (value: string, person?: personShow) => {
    setFormData(prev => ({
      ...prev,
      linkMan: person?.name || "" ,
      linkManId: person?.id || "",
      tel: person?.mobile || prev.tel
    }));
    
    if (person) {
      setlinkManName(person.name);
    }
  };

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
      const updatedOrganization = {
        ...organization,
        id: formData.id,
        name: formData.name,
        code: formData.code,
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
      }

      delete updatedOrganization.level;
      delete updatedOrganization.parentId;
      delete updatedOrganization.parentOrg;
      delete updatedOrganization.memberCount;
      delete updatedOrganization.teamCount;
      delete updatedOrganization.leader;
      delete updatedOrganization.leaderInfo;
      delete updatedOrganization.contact;

      onEditOrganization(updatedOrganization)
      onOpenChange(false)

      toast({
        title: "更新成功",
        description: `已成功更新组织：${formData.name}`,
      })
    } else {
      toast({
        title: "验证失败",
        description: "请检查表单中的错误信息",
        variant: "destructive",
      })
    }
  }

  if (!organization) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">编辑组织</DialogTitle>
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
              <SearchSelect<personShow>
                value={formData.chargerId}
                displayValue={personName}
                onChange={handlePersonSelect}
                onSearch={handlePersonSearch}
                placeholder="请输入人员名称搜索"
                labelIcon={<User className="h-4 w-4 text-blue-600" />}
                labelField="name"
                displayFields={[
                  { field: "account", label: "工号", icon: <Info className="h-3.5 w-3.5 text-blue-500" /> },
                  { field: "unitId", label: "单位", icon: <User className="h-3.5 w-3.5 text-green-500" />, isDict: true, dictCode: "unit" },
                ]}
                allowEmptySearch={true}
                error={!!errors.charger}
                errorMessage={errors.charger}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="linkMan" className="flex items-center">
                <Contact className="mr-2 h-4 w-4 text-muted-foreground" /> 联系人 <span className="text-red-500 ml-1">*</span>
              </Label>
              <SearchSelect<personShow>
                value={formData.linkManId}
                displayValue={linkManName}
                onChange={handlelinkManSelect}
                onSearch={handlePersonSearch}
                placeholder="请输入人员名称搜索"
                labelIcon={<Contact className="h-4 w-4 text-blue-600" />}
                labelField="name"
                displayFields={[
                  { field: "account", label: "工号", icon: <Info className="h-3.5 w-3.5 text-blue-500" /> },
                  { field: "unitId", label: "单位", icon: <User className="h-3.5 w-3.5 text-green-500" />, isDict: true, dictCode: "unit" },
                  { field: "mobile", label: "联系电话", icon: <Phone className="h-3.5 w-3.5 text-green-500" /> },
                ]}
                allowEmptySearch={true}
                error={!!errors.linkMan}
                errorMessage={errors.linkMan}
              />
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
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

