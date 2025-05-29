"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  PackageIcon,
  Upload,
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  ShieldIcon,
  InfoIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { DatePicker } from "@/components/date-picker"

// 模拟演示数据
const demoReagentData = {
  id: "reagent-demo-001",
  name: "乙腈",
  englishName: "Acetonitrile",
  alias: "甲基氰",
  linearFormula: "CH3CN",
  category: "有机溶剂",
  specification: "HPLC级, 4L",
  casNumber: "75-05-8",
  catalogNumber: "ACN-4000",
  manufacturer: "J.T.Baker",
  supplier: "西陆科学",
  purchaseDate: new Date("2023-08-15"),
  expiryDate: new Date("2025-08-15"),
  openDate: new Date("2023-09-01"),
  location: "B栋试剂柜",
  department: "化学实验室",
  status: "正常",
  storageCondition: "常温",
  dangerLevel: "中",
  initialAmount: "4000",
  currentAmount: "3250",
  unit: "mL",
  price: "980",
  manager: "李三",
  description: "高纯度HPLC级有机溶剂，分子式CH₃CN，用于色谱分析、有机合成和萃取。",
  notes: "易燃，有毒，避免吸入蒸汽，远离火源和热源。",
  msdsUrl: "/docs/reagents/msds/acetonitrile.pdf",
  molecularFormula: "CH₃CN",
  molecularWeight: "41.05",
  boilingPoint: "81.6°C",
  meltingPoint: "-45.7°C",
  density: "0.786 g/mL",
  imageUrl: "/reagent/CH3CN.png"
}

// 试剂编辑表单组件接口
interface ReagentEditFormProps {
  reagentId: string
}

// 试剂编辑表单组件
export function ReagentEditForm({ reagentId }: ReagentEditFormProps) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    name: "",
    englishName: "",
    category: "",
    specification: "",
    casNumber: "",
    catalogNumber: "",
    description: "",
    
    // 供应信息
    manufacturer: "",
    supplier: "",
    purchaseDate: new Date(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
    price: "",
    department: "",
    
    // 存储信息
    location: "",
    storageCondition: "",
    dangerLevel: "",
    status: "正常",
    initialAmount: "",
    currentAmount: "",
    unit: "",
    notes: "",
    
    // 管理信息
    manager: "",
  })

  // 图片上传状态
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false)

  // 模拟加载试剂数据
  useEffect(() => {
    const loadReagentData = async () => {
      setIsLoading(true)
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 使用演示数据
        setFormData({
          name: demoReagentData.name,
          englishName: demoReagentData.englishName,
          category: demoReagentData.category,
          specification: demoReagentData.specification,
          casNumber: demoReagentData.casNumber,
          catalogNumber: demoReagentData.catalogNumber,
          description: demoReagentData.description,
          manufacturer: demoReagentData.manufacturer,
          supplier: demoReagentData.supplier,
          purchaseDate: demoReagentData.purchaseDate,
          expiryDate: demoReagentData.expiryDate,
          price: demoReagentData.price,
          department: demoReagentData.department,
          location: demoReagentData.location,
          storageCondition: demoReagentData.storageCondition,
          dangerLevel: demoReagentData.dangerLevel,
          status: demoReagentData.status,
          initialAmount: demoReagentData.initialAmount,
          currentAmount: demoReagentData.currentAmount,
          unit: demoReagentData.unit,
          notes: demoReagentData.notes,
          manager: demoReagentData.manager,
        })

        // 如果有图片，也设置图片
        if (demoReagentData.imageUrl) {
          setUploadedImages([demoReagentData.imageUrl])
        }
      } catch (error) {
        console.error("加载试剂数据失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载试剂数据，请重试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadReagentData()
  }, [reagentId])

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  // 处理字段失去焦点
  const handleBlur = (field: string) => {
    setFormTouched((prev) => ({
      ...prev,
      [field]: true
    }))
  }

  // 验证表单
  const validateForm = () => {
    const requiredFields = [
      "name", 
      "category", 
      "specification", 
      "catalogNumber",
      "supplier",
      "department",
      "location",
      "storageCondition",
      "status",
      "initialAmount",
      "currentAmount",
      "unit",
      "manager"
    ]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段是否填写
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${
          field === "name" ? "试剂名称" : 
          field === "category" ? "试剂类型" : 
          field === "specification" ? "规格" : 
          field === "catalogNumber" ? "目录号" :
          field === "supplier" ? "供应商" :
          field === "department" ? "所属部门" : 
          field === "location" ? "存放位置" : 
          field === "storageCondition" ? "存储条件" :
          field === "status" ? "库存状态" :
          field === "initialAmount" ? "初始数量" :
          field === "currentAmount" ? "当前库存" :
          field === "unit" ? "单位" :
          field === "manager" ? "负责人" : ""
        }`
      }
    })
    
    // 验证价格是否为有效数字
    if (formData.price && isNaN(Number(formData.price))) {
      isValid = false
      newErrors.price = "请输入有效的价格"
    }
    
    // 验证数量是否为有效数字
    if (formData.initialAmount && isNaN(Number(formData.initialAmount))) {
      isValid = false
      newErrors.initialAmount = "请输入有效的数量"
    }
    
    if (formData.currentAmount && isNaN(Number(formData.currentAmount))) {
      isValid = false
      newErrors.currentAmount = "请输入有效的数量"
    }
    
    setFormErrors(newErrors)
    setFormTouched(prev => ({
      ...prev,
      ...newTouched
    }))
    
    if (!isValid) {
      // 滚动到第一个错误字段
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
    
    return isValid
  }

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            setUploadedImages(prev => [...prev, result])
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  // 删除上传的图片
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // 保存草稿
  const handleSaveDraft = () => {
    toast({
      title: "草稿已保存",
      description: "您的试剂信息已保存为草稿",
      duration: 3000,
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    // 构建完整的试剂数据，包含图片
    const reagentData = {
      ...formData,
      images: uploadedImages
    }
    
    // 这里应该调用API保存数据
    console.log("更新试剂数据:", reagentData)
    
    // 显示完成对话框
    setShowCompletionDialog(true)
  }

  // 返回详情页面
  const handleReturnToDetail = () => {
    router.push(`/laboratory/reagent/${reagentId}`)
  }

  // 返回列表页面
  const handleReturnToList = () => {
    router.push('/laboratory/reagent')
  }

  // 区域标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium">{title}</h3>
      </div>
    )
  }

  // 错误信息组件
  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null
    
    return (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container py-6 space-y-6 max-w-5xl">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleReturnToList}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">编辑试剂</h1>
          </div>
        </div>
        <Card className="border-[#E9ECF2] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-muted-foreground">正在加载试剂数据...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">编辑试剂</h1>
        </div>
      </div>

      {/* 试剂基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          {/* 基本信息部分 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">试剂名称 <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => updateFormData("name", e.target.value)} 
                onBlur={() => handleBlur("name")}
                placeholder="请输入试剂中文名称"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.name && formErrors.name ? "border-red-500" : ""
                )}
              />
              {formTouched.name && <ErrorMessage message={formErrors.name || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="englishName" className="text-muted-foreground">英文名称</Label>
              <Input 
                id="englishName" 
                value={formData.englishName}
                onChange={(e) => updateFormData("englishName", e.target.value)} 
                placeholder="请输入试剂英文名称"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">试剂类型 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => updateFormData("category", value)}
                onOpenChange={(open) => !open && handleBlur("category")}
              >
                <SelectTrigger 
                  id="category"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.category && formErrors.category ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择试剂类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="化学试剂">化学试剂</SelectItem>
                  <SelectItem value="生物试剂">生物试剂</SelectItem>
                  <SelectItem value="分析试剂">分析试剂</SelectItem>
                  <SelectItem value="医用试剂">医用试剂</SelectItem>
                  <SelectItem value="标准品">标准品</SelectItem>
                  <SelectItem value="染色剂">染色剂</SelectItem>
                  <SelectItem value="有机溶剂">有机溶剂</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.category && <ErrorMessage message={formErrors.category || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="specification" className="text-muted-foreground">规格 <span className="text-red-500">*</span></Label>
              <Input 
                id="specification" 
                value={formData.specification} 
                onChange={(e) => updateFormData("specification", e.target.value)} 
                onBlur={() => handleBlur("specification")}
                placeholder="如: HPLC级, 500mL"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.specification && formErrors.specification ? "border-red-500" : ""
                )}
              />
              {formTouched.specification && <ErrorMessage message={formErrors.specification || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="casNumber" className="text-muted-foreground">CAS号</Label>
              <Input 
                id="casNumber" 
                value={formData.casNumber} 
                onChange={(e) => updateFormData("casNumber", e.target.value)} 
                placeholder="请输入CAS登记号"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalogNumber" className="text-muted-foreground">目录号 <span className="text-red-500">*</span></Label>
              <Input 
                id="catalogNumber" 
                value={formData.catalogNumber} 
                onChange={(e) => updateFormData("catalogNumber", e.target.value)} 
                onBlur={() => handleBlur("catalogNumber")}
                placeholder="请输入产品目录号"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.catalogNumber && formErrors.catalogNumber ? "border-red-500" : ""
                )}
              />
              {formTouched.catalogNumber && <ErrorMessage message={formErrors.catalogNumber || ""} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">试剂描述</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => updateFormData("description", e.target.value)} 
              placeholder="请输入试剂的详细描述，包括用途、性质等"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          {/* 供应信息 */}
          <SectionTitle 
            icon={<PackageIcon className="h-5 w-5" />} 
            title="供应信息" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="text-muted-foreground">生产厂商</Label>
              <Input 
                id="manufacturer" 
                value={formData.manufacturer} 
                onChange={(e) => updateFormData("manufacturer", e.target.value)} 
                placeholder="请输入生产厂商"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-muted-foreground">供应商 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.supplier} 
                onValueChange={(value) => updateFormData("supplier", value)}
                onOpenChange={(open) => !open && handleBlur("supplier")}
              >
                <SelectTrigger 
                  id="supplier"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.supplier && formErrors.supplier ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择供应商" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="西陆科学">西陆科学</SelectItem>
                  <SelectItem value="赛默飞世尔">赛默飞世尔</SelectItem>
                  <SelectItem value="默克中国">默克中国</SelectItem>
                  <SelectItem value="西格玛奥德里奇">西格玛奥德里奇</SelectItem>
                  <SelectItem value="费舍尔科学">费舍尔科学</SelectItem>
                  <SelectItem value="阿法埃莎">阿法埃莎</SelectItem>
                  <SelectItem value="国药试剂">国药试剂</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.supplier && <ErrorMessage message={formErrors.supplier || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">购置日期</Label>
              <DatePicker 
                selected={formData.purchaseDate} 
                onSelect={(date) => updateFormData("purchaseDate", date)} 
                placeholder="选择购置日期"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">有效期至</Label>
              <DatePicker 
                selected={formData.expiryDate} 
                onSelect={(date) => updateFormData("expiryDate", date)} 
                placeholder="选择过期日期"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-muted-foreground">
                <DollarSign className="h-4 w-4 inline mr-1" />
                价格 (元)
              </Label>
              <Input 
                id="price" 
                type="number"
                value={formData.price} 
                onChange={(e) => updateFormData("price", e.target.value)} 
                placeholder="请输入单价"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formErrors.price ? "border-red-500" : ""
                )}
              />
              {<ErrorMessage message={formErrors.price || ""} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-muted-foreground">所属部门 <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.department} 
              onValueChange={(value) => updateFormData("department", value)}
              onOpenChange={(open) => !open && handleBlur("department")}
            >
              <SelectTrigger 
                id="department"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.department && formErrors.department ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="请选择所属部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="化学实验室">化学实验室</SelectItem>
                <SelectItem value="有机化学实验室">有机化学实验室</SelectItem>
                <SelectItem value="分析化学实验室">分析化学实验室</SelectItem>
                <SelectItem value="物理化学实验室">物理化学实验室</SelectItem>
                <SelectItem value="无机化学实验室">无机化学实验室</SelectItem>
                <SelectItem value="仪器分析实验室">仪器分析实验室</SelectItem>
              </SelectContent>
            </Select>
            {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
          </div>

          {/* 图片上传 */}
          <div className="space-y-2">
            <Label htmlFor="imageUpload" className="text-muted-foreground">试剂图片</Label>
            <div className="border-2 border-dashed border-[#E9ECF2] rounded-lg p-4">
              <Input 
                id="imageUpload" 
                type="file" 
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">点击上传试剂图片或拖拽文件到此处</span>
                <span className="text-xs text-muted-foreground">支持 JPG、PNG 格式</span>
              </Label>
            </div>
            
            {/* 已上传图片预览 */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`试剂图片 ${index + 1}`} 
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 存储信息 */}
          <SectionTitle 
            icon={<InfoIcon className="h-5 w-5" />} 
            title="存储信息" 
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-muted-foreground">存放位置 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => updateFormData("location", value)}
                onOpenChange={(open) => !open && handleBlur("location")}
              >
                <SelectTrigger 
                  id="location"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.location && formErrors.location ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择存放位置" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A栋冰箱">A栋冰箱</SelectItem>
                  <SelectItem value="B栋试剂柜">B栋试剂柜</SelectItem>
                  <SelectItem value="C栋危化品柜">C栋危化品柜</SelectItem>
                  <SelectItem value="D栋常温架">D栋常温架</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.location && <ErrorMessage message={formErrors.location || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="storageCondition" className="text-muted-foreground">存储条件 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.storageCondition} 
                onValueChange={(value) => updateFormData("storageCondition", value)}
                onOpenChange={(open) => !open && handleBlur("storageCondition")}
              >
                <SelectTrigger 
                  id="storageCondition"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.storageCondition && formErrors.storageCondition ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择存储条件" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="常温">常温</SelectItem>
                  <SelectItem value="4℃">4℃</SelectItem>
                  <SelectItem value="-20℃">-20℃</SelectItem>
                  <SelectItem value="-80℃">-80℃</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.storageCondition && <ErrorMessage message={formErrors.storageCondition || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dangerLevel" className="text-muted-foreground">危险等级</Label>
              <Select 
                value={formData.dangerLevel} 
                onValueChange={(value) => updateFormData("dangerLevel", value)}
              >
                <SelectTrigger 
                  id="dangerLevel"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                >
                  <SelectValue placeholder="请选择危险等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="无">无</SelectItem>
                  <SelectItem value="低">低</SelectItem>
                  <SelectItem value="中">中</SelectItem>
                  <SelectItem value="高">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-muted-foreground">库存状态 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => updateFormData("status", value)}
                onOpenChange={(open) => !open && handleBlur("status")}
              >
                <SelectTrigger 
                  id="status"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.status && formErrors.status ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择库存状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="低库存">低库存</SelectItem>
                  <SelectItem value="未入库">未入库</SelectItem>
                  <SelectItem value="待检验">待检验</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.status && <ErrorMessage message={formErrors.status || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialAmount" className="text-muted-foreground">初始数量 <span className="text-red-500">*</span></Label>
              <Input 
                id="initialAmount" 
                type="number"
                value={formData.initialAmount} 
                onChange={(e) => updateFormData("initialAmount", e.target.value)} 
                onBlur={() => handleBlur("initialAmount")}
                placeholder="请输入数量"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.initialAmount && formErrors.initialAmount ? "border-red-500" : ""
                )}
              />
              {formTouched.initialAmount && <ErrorMessage message={formErrors.initialAmount || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentAmount" className="text-muted-foreground">当前库存 <span className="text-red-500">*</span></Label>
              <Input 
                id="currentAmount" 
                type="number"
                value={formData.currentAmount} 
                onChange={(e) => updateFormData("currentAmount", e.target.value)} 
                onBlur={() => handleBlur("currentAmount")}
                placeholder="请输入数量"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.currentAmount && formErrors.currentAmount ? "border-red-500" : ""
                )}
              />
              {formTouched.currentAmount && <ErrorMessage message={formErrors.currentAmount || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-muted-foreground">单位 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => updateFormData("unit", value)}
                onOpenChange={(open) => !open && handleBlur("unit")}
              >
                <SelectTrigger 
                  id="unit"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.unit && formErrors.unit ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择单位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mL">mL</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="μg">μg</SelectItem>
                  <SelectItem value="单位">单位</SelectItem>
                  <SelectItem value="测试">测试</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.unit && <ErrorMessage message={formErrors.unit || ""} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-muted-foreground">注意事项</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => updateFormData("notes", e.target.value)} 
              placeholder="请输入试剂使用时的注意事项、安全警告等"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          {/* 管理信息 */}
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="管理信息" 
          />

          <div className="space-y-2">
            <Label htmlFor="manager" className="text-muted-foreground">负责人 <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.manager} 
              onValueChange={(value) => updateFormData("manager", value)}
              onOpenChange={(open) => !open && handleBlur("manager")}
            >
              <SelectTrigger 
                id="manager"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.manager && formErrors.manager ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="请选择负责人" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="张七">张七 (实验室管理员)</SelectItem>
                <SelectItem value="李三">李三 (试剂管理员)</SelectItem>
                <SelectItem value="王五">王五 (实验室主任)</SelectItem>
                <SelectItem value="李四">李四 (技术员)</SelectItem>
                <SelectItem value="赵六">赵六 (技术员)</SelectItem>
              </SelectContent>
            </Select>
            {formTouched.manager && <ErrorMessage message={formErrors.manager || ""} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="msdsFile" className="text-muted-foreground">MSDS文件</Label>
            <Input 
              id="msdsFile" 
              type="file" 
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              上传试剂的物质安全数据表 (MSDS)
            </p>
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">安全提示</p>
              <p>
                对于危险等级为"高"的试剂，请确保已上传MSDS文件，并将试剂存放在指定的危化品柜中。
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              className="px-6"
            >
              保存草稿
            </Button>
            <Button 
              onClick={handleSubmit}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              更新试剂信息
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle>试剂更新成功！</DialogTitle>
            <DialogDescription>
              您的试剂信息已成功更新。您可以选择返回试剂详情页面或返回列表页面。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleReturnToDetail}>
              返回试剂详情
            </Button>
            <Button onClick={handleReturnToList}>
              返回试剂列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 