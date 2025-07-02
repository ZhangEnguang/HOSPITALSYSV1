"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  HeartIcon,
  Activity,
  Stethoscope,
  Thermometer,
  AlertCircle,
  Upload,
  X,
  Calendar,
  Users,
  ShieldIcon
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
import { allDemoAnimalItems } from "../../data/animal-files-demo-data"

export default function CreateHealthRecordPage() {
  const router = useRouter()
  const params = useParams()
  const animalId = params.id as string
  
  // 获取动物基本信息
  const animalData = allDemoAnimalItems.find(item => item.id === animalId)
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    recordDate: new Date(),
    examiner: "",
    examType: "定期检查",
    
    // 生理指标
    weight: "",
    temperature: "",
    heartRate: "",
    respiratoryRate: "",
    bloodPressure: "",
    
    // 健康状态
    generalCondition: "正常",
    appetite: "正常",
    activity: "正常",
    mentalState: "正常",
    
    // 体格检查
    coat: "正常",
    eyes: "正常",
    ears: "正常",
    nose: "正常",
    mouth: "正常",
    limbs: "正常",
    
    // 实验室检查
    bloodTest: "",
    urineTest: "",
    fecesTest: "",
    otherTests: "",
    
    // 治疗记录
    symptoms: "",
    diagnosis: "",
    treatment: "",
    medication: "",
    dosage: "",
    
    // 其他信息
    followUp: "",
    nextCheckDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    notes: "",
    recommendations: ""
  })

  // 图片上传状态
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  // 检查动物是否存在
  useEffect(() => {
    if (!animalData) {
      router.push('/laboratory/animal-files')
      return
    }
  }, [animalData, router])

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
    const requiredFields = ["examiner", "examType"]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${
          field === "examiner" ? "检查人员" : 
          field === "examType" ? "检查类型" : ""
        }`
      }
    })
    
    // 验证数值字段
    const numericFields = ["weight", "temperature", "heartRate", "respiratoryRate"]
    numericFields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string
      if (value && isNaN(Number(value))) {
        isValid = false
        newErrors[field] = "请输入有效的数值"
      }
    })
    
    setFormErrors(newErrors)
    setFormTouched(prev => ({ ...prev, ...newTouched }))
    
    if (!isValid) {
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
      description: "您的健康记录信息已保存为草稿",
      duration: 3000,
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    const healthRecordData = {
      ...formData,
      animalId: animalData?.id,
      animalCode: animalData?.animalId,
      images: uploadedImages
    }
    
    console.log("提交健康记录数据:", healthRecordData)
    setShowCompletionDialog(true)
  }

  // 继续添加健康记录
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单
    setFormData({
      recordDate: new Date(),
      examiner: "",
      examType: "定期检查",
      weight: "",
      temperature: "",
      heartRate: "",
      respiratoryRate: "",
      bloodPressure: "",
      generalCondition: "正常",
      appetite: "正常", 
      activity: "正常",
      mentalState: "正常",
      coat: "正常",
      eyes: "正常",
      ears: "正常",
      nose: "正常",
      mouth: "正常",
      limbs: "正常",
      bloodTest: "",
      urineTest: "",
      fecesTest: "",
      otherTests: "",
      symptoms: "",
      diagnosis: "",
      treatment: "",
      medication: "",
      dosage: "",
      followUp: "",
      nextCheckDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      notes: "",
      recommendations: ""
    })
    
    setUploadedImages([])
    setFormErrors({})
    setFormTouched({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 返回动物档案列表页面
  const handleReturnToDetail = () => {
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

  if (!animalData) {
    return (
      <div className="container py-6 space-y-6 max-w-5xl">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">未找到动物档案信息</p>
        </div>
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
            onClick={handleReturnToDetail}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">新增健康记录</h1>
        </div>
      </div>

      {/* 动物基本信息显示 */}
      <Card className="border-[#E9ECF2] shadow-sm bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl">
              {animalData.species === "小鼠" ? "🐭" : 
               animalData.species === "大鼠" ? "🐀" : 
               animalData.species === "兔" ? "🐰" : "🐾"}
            </div>
            <div>
              <h3 className="font-medium">动物编号: {animalData.animalId}</h3>
              <p className="text-sm text-muted-foreground">
                {animalData.species} · {animalData.strain} · {animalData.gender} · {animalData.age}周
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 健康记录表单 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<HeartIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recordDate" className="text-muted-foreground">检查日期</Label>
              <DatePicker 
                id="recordDate"
                date={formData.recordDate} 
                onSelect={(date) => date && updateFormData("recordDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="examiner" className="text-muted-foreground">检查人员 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.examiner} 
                onValueChange={(value) => updateFormData("examiner", value)}
                onOpenChange={(open) => !open && handleBlur("examiner")}
              >
                <SelectTrigger 
                  id="examiner"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.examiner && formErrors.examiner ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择检查人员" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="张医生">张医生 (兽医师)</SelectItem>
                  <SelectItem value="李医生">李医生 (动物医学专家)</SelectItem>
                  <SelectItem value="王医生">王医生 (实验动物医生)</SelectItem>
                  <SelectItem value="刘医生">刘医生 (临床兽医)</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.examiner && <ErrorMessage message={formErrors.examiner || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examType" className="text-muted-foreground">检查类型 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.examType} 
                onValueChange={(value) => updateFormData("examType", value)}
                onOpenChange={(open) => !open && handleBlur("examType")}
              >
                <SelectTrigger 
                  id="examType"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.examType && formErrors.examType ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择检查类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="定期检查">定期检查</SelectItem>
                  <SelectItem value="健康体检">健康体检</SelectItem>
                  <SelectItem value="疾病诊断">疾病诊断</SelectItem>
                  <SelectItem value="术前检查">术前检查</SelectItem>
                  <SelectItem value="术后复查">术后复查</SelectItem>
                  <SelectItem value="治疗随访">治疗随访</SelectItem>
                  <SelectItem value="异常观察">异常观察</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.examType && <ErrorMessage message={formErrors.examType || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextCheckDate" className="text-muted-foreground">下次检查日期</Label>
              <DatePicker 
                id="nextCheckDate"
                date={formData.nextCheckDate} 
                onSelect={(date) => date && updateFormData("nextCheckDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          {/* 生理指标 */}
          <SectionTitle 
            icon={<Activity className="h-5 w-5" />} 
            title="生理指标" 
          />

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
                placeholder="请输入当前体重"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.weight && formErrors.weight ? "border-red-500" : ""
                )}
              />
              {formTouched.weight && <ErrorMessage message={formErrors.weight || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-muted-foreground">体温(°C)</Label>
              <Input 
                id="temperature" 
                type="number"
                step="0.1"
                value={formData.temperature} 
                onChange={(e) => updateFormData("temperature", e.target.value)} 
                onBlur={() => handleBlur("temperature")}
                placeholder="请输入体温"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.temperature && formErrors.temperature ? "border-red-500" : ""
                )}
              />
              {formTouched.temperature && <ErrorMessage message={formErrors.temperature || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate" className="text-muted-foreground">心率(次/分)</Label>
              <Input 
                id="heartRate" 
                type="number"
                value={formData.heartRate} 
                onChange={(e) => updateFormData("heartRate", e.target.value)} 
                onBlur={() => handleBlur("heartRate")}
                placeholder="请输入心率"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.heartRate && formErrors.heartRate ? "border-red-500" : ""
                )}
              />
              {formTouched.heartRate && <ErrorMessage message={formErrors.heartRate || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="respiratoryRate" className="text-muted-foreground">呼吸频率(次/分)</Label>
              <Input 
                id="respiratoryRate" 
                type="number"
                value={formData.respiratoryRate} 
                onChange={(e) => updateFormData("respiratoryRate", e.target.value)} 
                onBlur={() => handleBlur("respiratoryRate")}
                placeholder="请输入呼吸频率"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.respiratoryRate && formErrors.respiratoryRate ? "border-red-500" : ""
                )}
              />
              {formTouched.respiratoryRate && <ErrorMessage message={formErrors.respiratoryRate || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodPressure" className="text-muted-foreground">血压(mmHg)</Label>
              <Input 
                id="bloodPressure" 
                value={formData.bloodPressure} 
                onChange={(e) => updateFormData("bloodPressure", e.target.value)} 
                placeholder="如: 120/80"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          {/* 健康状态 */}
          <SectionTitle 
            icon={<Stethoscope className="h-5 w-5" />} 
            title="健康状态" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="generalCondition" className="text-muted-foreground">一般状况</Label>
              <Select 
                value={formData.generalCondition} 
                onValueChange={(value) => updateFormData("generalCondition", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="良好">良好</SelectItem>
                  <SelectItem value="一般">一般</SelectItem>
                  <SelectItem value="较差">较差</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="appetite" className="text-muted-foreground">食欲</Label>
              <Select 
                value={formData.appetite} 
                onValueChange={(value) => updateFormData("appetite", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="良好">良好</SelectItem>
                  <SelectItem value="减退">减退</SelectItem>
                  <SelectItem value="废绝">废绝</SelectItem>
                  <SelectItem value="亢进">亢进</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity" className="text-muted-foreground">活动能力</Label>
              <Select 
                value={formData.activity} 
                onValueChange={(value) => updateFormData("activity", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="活跃">活跃</SelectItem>
                  <SelectItem value="减少">减少</SelectItem>
                  <SelectItem value="无力">无力</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentalState" className="text-muted-foreground">精神状态</Label>
              <Select 
                value={formData.mentalState} 
                onValueChange={(value) => updateFormData("mentalState", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="兴奋">兴奋</SelectItem>
                  <SelectItem value="沉郁">沉郁</SelectItem>
                  <SelectItem value="昏迷">昏迷</SelectItem>
                  <SelectItem value="焦躁">焦躁</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 体格检查 */}
          <SectionTitle 
            icon={<Thermometer className="h-5 w-5" />} 
            title="体格检查" 
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coat" className="text-muted-foreground">被毛</Label>
              <Select 
                value={formData.coat} 
                onValueChange={(value) => updateFormData("coat", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="光泽">光泽</SelectItem>
                  <SelectItem value="粗糙">粗糙</SelectItem>
                  <SelectItem value="脱毛">脱毛</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eyes" className="text-muted-foreground">眼睛</Label>
              <Select 
                value={formData.eyes} 
                onValueChange={(value) => updateFormData("eyes", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="明亮">明亮</SelectItem>
                  <SelectItem value="分泌物">分泌物</SelectItem>
                  <SelectItem value="红肿">红肿</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ears" className="text-muted-foreground">耳朵</Label>
              <Select 
                value={formData.ears} 
                onValueChange={(value) => updateFormData("ears", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="清洁">清洁</SelectItem>
                  <SelectItem value="分泌物">分泌物</SelectItem>
                  <SelectItem value="发炎">发炎</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nose" className="text-muted-foreground">鼻子</Label>
              <Select 
                value={formData.nose} 
                onValueChange={(value) => updateFormData("nose", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="湿润">湿润</SelectItem>
                  <SelectItem value="干燥">干燥</SelectItem>
                  <SelectItem value="分泌物">分泌物</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mouth" className="text-muted-foreground">口腔</Label>
              <Select 
                value={formData.mouth} 
                onValueChange={(value) => updateFormData("mouth", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="清洁">清洁</SelectItem>
                  <SelectItem value="发炎">发炎</SelectItem>
                  <SelectItem value="溃疡">溃疡</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="limbs" className="text-muted-foreground">四肢</Label>
              <Select 
                value={formData.limbs} 
                onValueChange={(value) => updateFormData("limbs", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="灵活">灵活</SelectItem>
                  <SelectItem value="僵硬">僵硬</SelectItem>
                  <SelectItem value="跛行">跛行</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 实验室检查 */}
          <SectionTitle 
            icon={<Activity className="h-5 w-5" />} 
            title="实验室检查" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodTest" className="text-muted-foreground">血液检查</Label>
              <Textarea 
                id="bloodTest" 
                value={formData.bloodTest} 
                onChange={(e) => updateFormData("bloodTest", e.target.value)} 
                placeholder="请输入血液检查结果"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="urineTest" className="text-muted-foreground">尿液检查</Label>
              <Textarea 
                id="urineTest" 
                value={formData.urineTest} 
                onChange={(e) => updateFormData("urineTest", e.target.value)} 
                placeholder="请输入尿液检查结果"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecesTest" className="text-muted-foreground">粪便检查</Label>
              <Textarea 
                id="fecesTest" 
                value={formData.fecesTest} 
                onChange={(e) => updateFormData("fecesTest", e.target.value)} 
                placeholder="请输入粪便检查结果"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherTests" className="text-muted-foreground">其他检查</Label>
              <Textarea 
                id="otherTests" 
                value={formData.otherTests} 
                onChange={(e) => updateFormData("otherTests", e.target.value)} 
                placeholder="请输入其他检查结果"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
          </div>

          {/* 治疗记录 */}
          <SectionTitle 
            icon={<Users className="h-5 w-5" />} 
            title="诊疗记录" 
          />

          <div className="space-y-2">
            <Label htmlFor="symptoms" className="text-muted-foreground">症状描述</Label>
            <Textarea 
              id="symptoms" 
              value={formData.symptoms} 
              onChange={(e) => updateFormData("symptoms", e.target.value)} 
              placeholder="请描述观察到的症状"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="text-muted-foreground">诊断结果</Label>
            <Textarea 
              id="diagnosis" 
              value={formData.diagnosis} 
              onChange={(e) => updateFormData("diagnosis", e.target.value)} 
              placeholder="请输入诊断结果"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment" className="text-muted-foreground">治疗措施</Label>
            <Textarea 
              id="treatment" 
              value={formData.treatment} 
              onChange={(e) => updateFormData("treatment", e.target.value)} 
              placeholder="请输入治疗措施"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medication" className="text-muted-foreground">用药记录</Label>
              <Input 
                id="medication" 
                value={formData.medication} 
                onChange={(e) => updateFormData("medication", e.target.value)} 
                placeholder="请输入药物名称"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage" className="text-muted-foreground">用药剂量</Label>
              <Input 
                id="dosage" 
                value={formData.dosage} 
                onChange={(e) => updateFormData("dosage", e.target.value)} 
                placeholder="请输入用药剂量"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          {/* 检查图片 */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">检查照片</Label>
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
              
              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`检查图片 ${index + 1}`}
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

          {/* 其他信息 */}
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="其他信息" 
          />

          <div className="space-y-2">
            <Label htmlFor="followUp" className="text-muted-foreground">随访安排</Label>
            <Textarea 
              id="followUp" 
              value={formData.followUp} 
              onChange={(e) => updateFormData("followUp", e.target.value)} 
              placeholder="请输入随访安排"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations" className="text-muted-foreground">医疗建议</Label>
            <Textarea 
              id="recommendations" 
              value={formData.recommendations} 
              onChange={(e) => updateFormData("recommendations", e.target.value)} 
              placeholder="请输入医疗建议"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-muted-foreground">备注信息</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => updateFormData("notes", e.target.value)} 
              placeholder="请输入其他备注信息"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">健康记录提示</p>
              <p>
                请确保健康记录的准确性和完整性，这些信息将用于动物健康状况的持续监测和科学研究。
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
              提交记录
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
            <DialogTitle>健康记录添加成功！</DialogTitle>
            <DialogDescription>
              您的健康记录信息已成功提交。您可以选择继续添加新记录或返回动物详情页面。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleContinueAdding}>
              继续添加记录
            </Button>
            <Button onClick={handleReturnToDetail}>
              返回动物详情
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 