"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  HeartIcon,
  Upload,
  X,
  Calendar,
  Users,
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

export default function CreateAnimalFilePage() {
  const router = useRouter()
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    animalId: "",
    species: "",
    strain: "",
    gender: "",
    birthDate: new Date(),
    age: "",
    weight: "",
    description: "",
    
    // 健康信息
    status: "健康",
    lastCheckDate: new Date(),
    healthNotes: "",
    vaccinations: "",
    
    // 管理信息
    admissionDate: new Date(),
    department: "",
    location: "",
    responsible: "",
    purpose: "",
    expectedEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    
    // 其他信息
    notes: "",
    sourceInfo: "",
    geneticBackground: "",
  })

  // 图片上传状态
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

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
      "animalId", 
      "species", 
      "strain", 
      "gender",
      "department",
      "location",
      "responsible",
      "purpose"
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
          field === "animalId" ? "动物编号" : 
          field === "species" ? "动物种类" : 
          field === "strain" ? "品系" : 
          field === "gender" ? "性别" :
          field === "department" ? "所属部门" : 
          field === "location" ? "饲养位置" : 
          field === "responsible" ? "责任人" :
          field === "purpose" ? "使用目的" : ""
        }`
      }
    })
    
    // 验证年龄和体重是否为有效数字
    if (formData.age && isNaN(Number(formData.age))) {
      isValid = false
      newErrors.age = "请输入有效的年龄"
    }
    
    if (formData.weight && isNaN(Number(formData.weight))) {
      isValid = false
      newErrors.weight = "请输入有效的体重"
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
      description: "您的动物档案信息已保存为草稿",
      duration: 3000,
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    // 构建完整的动物档案数据，包含图片
    const animalData = {
      ...formData,
      images: uploadedImages
    }
    
    // 这里应该调用API保存数据
    console.log("提交动物档案数据:", animalData)
    
    // 显示完成对话框
    setShowCompletionDialog(true)
  }

  // 继续添加动物档案
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单
    setFormData({
      animalId: "",
      species: "",
      strain: "",
      gender: "",
      birthDate: new Date(),
      age: "",
      weight: "",
      description: "",
      status: "健康",
      lastCheckDate: new Date(),
      healthNotes: "",
      vaccinations: "",
      admissionDate: new Date(),
      department: "",
      location: "",
      responsible: "",
      purpose: "",
      expectedEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      notes: "",
      sourceInfo: "",
      geneticBackground: "",
    })
    
    setUploadedImages([])
    setFormErrors({})
    setFormTouched({})
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 返回列表页面
  const handleReturnToList = () => {
    router.push('/laboratory/animal-files')
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
          <h1 className="text-2xl font-bold">新增动物档案</h1>
        </div>
      </div>

      {/* 动物档案基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          {/* 基本信息部分 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animalId" className="text-muted-foreground">动物编号 <span className="text-red-500">*</span></Label>
              <Input 
                id="animalId" 
                value={formData.animalId} 
                onChange={(e) => updateFormData("animalId", e.target.value)} 
                onBlur={() => handleBlur("animalId")}
                placeholder="请输入动物编号"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.animalId && formErrors.animalId ? "border-red-500" : ""
                )}
              />
              {formTouched.animalId && <ErrorMessage message={formErrors.animalId || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="species" className="text-muted-foreground">动物种类 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.species} 
                onValueChange={(value) => updateFormData("species", value)}
                onOpenChange={(open) => !open && handleBlur("species")}
              >
                <SelectTrigger 
                  id="species"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.species && formErrors.species ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择动物种类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="小鼠">小鼠</SelectItem>
                  <SelectItem value="大鼠">大鼠</SelectItem>
                  <SelectItem value="兔">兔</SelectItem>
                  <SelectItem value="豚鼠">豚鼠</SelectItem>
                  <SelectItem value="猴">猴</SelectItem>
                  <SelectItem value="犬">犬</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.species && <ErrorMessage message={formErrors.species || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strain" className="text-muted-foreground">品系 <span className="text-red-500">*</span></Label>
              <Input 
                id="strain" 
                value={formData.strain} 
                onChange={(e) => updateFormData("strain", e.target.value)} 
                onBlur={() => handleBlur("strain")}
                placeholder="如: C57BL/6, BALB/c"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.strain && formErrors.strain ? "border-red-500" : ""
                )}
              />
              {formTouched.strain && <ErrorMessage message={formErrors.strain || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-muted-foreground">性别 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => updateFormData("gender", value)}
                onOpenChange={(open) => !open && handleBlur("gender")}
              >
                <SelectTrigger 
                  id="gender"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.gender && formErrors.gender ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="雄性">雄性</SelectItem>
                  <SelectItem value="雌性">雌性</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.gender && <ErrorMessage message={formErrors.gender || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-muted-foreground">出生日期</Label>
              <DatePicker 
                id="birthDate"
                date={formData.birthDate} 
                onSelect={(date) => date && updateFormData("birthDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-muted-foreground">年龄(周)</Label>
              <Input 
                id="age" 
                type="number"
                value={formData.age} 
                onChange={(e) => updateFormData("age", e.target.value)} 
                onBlur={() => handleBlur("age")}
                placeholder="请输入年龄"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.age && formErrors.age ? "border-red-500" : ""
                )}
              />
              {formTouched.age && <ErrorMessage message={formErrors.age || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-muted-foreground">体重(g)</Label>
              <Input 
                id="weight" 
                type="number"
                step="0.1"
                value={formData.weight} 
                onChange={(e) => updateFormData("weight", e.target.value)} 
                onBlur={() => handleBlur("weight")}
                placeholder="请输入体重"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.weight && formErrors.weight ? "border-red-500" : ""
                )}
              />
              {formTouched.weight && <ErrorMessage message={formErrors.weight || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="geneticBackground" className="text-muted-foreground">遗传背景</Label>
              <Input 
                id="geneticBackground" 
                value={formData.geneticBackground} 
                onChange={(e) => updateFormData("geneticBackground", e.target.value)} 
                placeholder="如: 转基因, 野生型"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">动物描述</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => updateFormData("description", e.target.value)} 
              placeholder="请输入动物的外观特征、行为特点等描述信息"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
            />
          </div>

          {/* 图片上传 */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">动物图片</Label>
            <div className="border-2 border-dashed border-[#E9ECF2] rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="imageUpload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">上传图片</span>
                    <Input
                      id="imageUpload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Label>
                  <p className="text-gray-500 text-sm mt-1">支持PNG、JPG格式，最大10MB</p>
                </div>
              </div>
              
              {/* 显示上传的图片 */}
              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`动物图片 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 健康信息 */}
          <SectionTitle 
            icon={<HeartIcon className="h-5 w-5" />} 
            title="健康信息" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-muted-foreground">健康状态</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => updateFormData("status", value)}
              >
                <SelectTrigger 
                  id="status"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                >
                  <SelectValue placeholder="请选择健康状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="健康">健康</SelectItem>
                  <SelectItem value="观察中">观察中</SelectItem>
                  <SelectItem value="治疗中">治疗中</SelectItem>
                  <SelectItem value="隔离">隔离</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastCheckDate" className="text-muted-foreground">最后检查日期</Label>
              <DatePicker 
                id="lastCheckDate"
                date={formData.lastCheckDate} 
                onSelect={(date) => date && updateFormData("lastCheckDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vaccinations" className="text-muted-foreground">疫苗接种</Label>
              <Input 
                id="vaccinations" 
                value={formData.vaccinations} 
                onChange={(e) => updateFormData("vaccinations", e.target.value)} 
                placeholder="如: 已接种常规疫苗"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceInfo" className="text-muted-foreground">来源信息</Label>
              <Input 
                id="sourceInfo" 
                value={formData.sourceInfo} 
                onChange={(e) => updateFormData("sourceInfo", e.target.value)} 
                placeholder="如: 北京维通利华, SPF级"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthNotes" className="text-muted-foreground">健康备注</Label>
            <Textarea 
              id="healthNotes" 
              value={formData.healthNotes} 
              onChange={(e) => updateFormData("healthNotes", e.target.value)} 
              placeholder="请输入健康状况的详细记录或注意事项"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          {/* 管理信息 */}
          <SectionTitle 
            icon={<Users className="h-5 w-5" />} 
            title="管理信息" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admissionDate" className="text-muted-foreground">入档日期</Label>
              <DatePicker 
                id="admissionDate"
                date={formData.admissionDate} 
                onSelect={(date) => date && updateFormData("admissionDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
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
                  <SelectItem value="药理实验室">药理实验室</SelectItem>
                  <SelectItem value="病理实验室">病理实验室</SelectItem>
                  <SelectItem value="生理实验室">生理实验室</SelectItem>
                  <SelectItem value="免疫实验室">免疫实验室</SelectItem>
                  <SelectItem value="遗传实验室">遗传实验室</SelectItem>
                  <SelectItem value="行为实验室">行为实验室</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-muted-foreground">饲养位置 <span className="text-red-500">*</span></Label>
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
                  <SelectValue placeholder="请选择饲养位置" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A栋动物房">A栋动物房</SelectItem>
                  <SelectItem value="B栋动物房">B栋动物房</SelectItem>
                  <SelectItem value="C栋隔离区">C栋隔离区</SelectItem>
                  <SelectItem value="D栋实验区">D栋实验区</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.location && <ErrorMessage message={formErrors.location || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible" className="text-muted-foreground">责任人 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.responsible} 
                onValueChange={(value) => updateFormData("responsible", value)}
                onOpenChange={(open) => !open && handleBlur("responsible")}
              >
                <SelectTrigger 
                  id="responsible"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.responsible && formErrors.responsible ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择责任人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="张三">张三 (动物管理员)</SelectItem>
                  <SelectItem value="李四">李四 (实验技术员)</SelectItem>
                  <SelectItem value="王五">王五 (兽医师)</SelectItem>
                  <SelectItem value="赵六">赵六 (研究员)</SelectItem>
                  <SelectItem value="钱七">钱七 (实验室主任)</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.responsible && <ErrorMessage message={formErrors.responsible || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-muted-foreground">使用目的 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.purpose} 
                onValueChange={(value) => updateFormData("purpose", value)}
                onOpenChange={(open) => !open && handleBlur("purpose")}
              >
                <SelectTrigger 
                  id="purpose"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.purpose && formErrors.purpose ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择使用目的" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="药理试验">药理试验</SelectItem>
                  <SelectItem value="毒理试验">毒理试验</SelectItem>
                  <SelectItem value="繁殖培育">繁殖培育</SelectItem>
                  <SelectItem value="基础研究">基础研究</SelectItem>
                  <SelectItem value="教学培训">教学培训</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.purpose && <ErrorMessage message={formErrors.purpose || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedEndDate" className="text-muted-foreground">预计结束日期</Label>
              <DatePicker 
                id="expectedEndDate"
                date={formData.expectedEndDate} 
                onSelect={(date) => date && updateFormData("expectedEndDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          {/* 其他信息 */}
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="其他信息" 
          />

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-muted-foreground">备注信息</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => updateFormData("notes", e.target.value)} 
              placeholder="请输入特殊要求、注意事项等备注信息"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">动物伦理提示</p>
              <p>
                请确保动物的使用符合伦理委员会的审批要求，严格按照3R原则（替代、减少、优化）进行实验动物的管理和使用。
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
              提交审核
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
            <DialogTitle>动物档案添加成功！</DialogTitle>
            <DialogDescription>
              您的动物档案信息已成功提交，系统将进行审核处理。您可以选择继续添加新档案或返回列表页面。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleContinueAdding}>
              继续添加档案
            </Button>
            <Button onClick={handleReturnToList}>
              返回档案列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 