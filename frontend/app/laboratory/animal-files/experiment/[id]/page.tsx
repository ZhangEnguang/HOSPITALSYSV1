"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  FlaskConical,
  Activity,
  Calendar,
  Users,
  AlertCircle,
  Upload,
  X,
  ShieldIcon,
  ClipboardList
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

export default function CreateExperimentRecordPage() {
  const router = useRouter()
  const params = useParams()
  const animalId = params.id as string
  
  // 获取动物基本信息
  const animalData = allDemoAnimalItems.find(item => item.id === animalId)
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    experimentDate: new Date(),
    experimentType: "",
    projectId: "",
    projectName: "",
    researcher: "",
    assistant: "",
    
    // 实验前准备
    fastingHours: "",
    premedication: "",
    anesthesia: "",
    anesthesiaDosage: "",
    
    // 实验过程
    procedure: "",
    duration: "",
    sampleType: "",
    sampleAmount: "",
    administrationRoute: "",
    dosage: "",
    
    // 观察记录
    vitalSigns: "",
    behavioralChanges: "",
    adverseEvents: "",
    complications: "",
    
    // 实验结果
    outcomes: "",
    measurements: "",
    dataCollected: "",
    specimens: "",
    
    // 术后处理
    postCare: "",
    painManagement: "",
    monitoring: "",
    recovery: "",
    
    // 伦理合规
    ethicsApproval: "",
    animalWelfare: "",
    humaneEndpoint: "",
    
    // 其他信息
    notes: "",
    nextExperiment: new Date(new Date().setDate(new Date().getDate() + 7)),
    followUp: ""
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
    const requiredFields = ["experimentType", "projectName", "researcher", "procedure"]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${
          field === "experimentType" ? "实验类型" : 
          field === "projectName" ? "项目名称" :
          field === "researcher" ? "主实验员" :
          field === "procedure" ? "实验程序" : ""
        }`
      }
    })
    
    // 验证数值字段
    const numericFields = ["fastingHours", "duration"]
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
      description: "您的实验记录信息已保存为草稿",
      duration: 3000,
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    const experimentData = {
      ...formData,
      animalId: animalData?.id,
      animalCode: animalData?.animalId,
      images: uploadedImages
    }
    
    console.log("提交实验记录数据:", experimentData)
    setShowCompletionDialog(true)
  }

  // 继续添加实验记录
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单（保留一些常用信息）
    setFormData({
      experimentDate: new Date(),
      experimentType: "",
      projectId: formData.projectId, // 保留项目信息
      projectName: formData.projectName,
      researcher: formData.researcher, // 保留研究员信息
      assistant: formData.assistant,
      fastingHours: "",
      premedication: "",
      anesthesia: "",
      anesthesiaDosage: "",
      procedure: "",
      duration: "",
      sampleType: "",
      sampleAmount: "",
      administrationRoute: "",
      dosage: "",
      vitalSigns: "",
      behavioralChanges: "",
      adverseEvents: "",
      complications: "",
      outcomes: "",
      measurements: "",
      dataCollected: "",
      specimens: "",
      postCare: "",
      painManagement: "",
      monitoring: "",
      recovery: "",
      ethicsApproval: formData.ethicsApproval, // 保留伦理信息
      animalWelfare: "",
      humaneEndpoint: "",
      notes: "",
      nextExperiment: new Date(new Date().setDate(new Date().getDate() + 7)),
      followUp: ""
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
          <h1 className="text-2xl font-bold">新增实验记录</h1>
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
                {animalData.species} · {animalData.strain} · {animalData.gender} · {animalData.age}周 · {animalData.weight}g
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 实验记录表单 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experimentDate" className="text-muted-foreground">实验日期</Label>
              <DatePicker 
                id="experimentDate"
                date={formData.experimentDate} 
                onSelect={(date) => date && updateFormData("experimentDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experimentType" className="text-muted-foreground">实验类型 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.experimentType} 
                onValueChange={(value) => updateFormData("experimentType", value)}
                onOpenChange={(open) => !open && handleBlur("experimentType")}
              >
                <SelectTrigger 
                  id="experimentType"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.experimentType && formErrors.experimentType ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择实验类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="药效学试验">药效学试验</SelectItem>
                  <SelectItem value="毒理学试验">毒理学试验</SelectItem>
                  <SelectItem value="药代动力学试验">药代动力学试验</SelectItem>
                  <SelectItem value="生理学试验">生理学试验</SelectItem>
                  <SelectItem value="行为学试验">行为学试验</SelectItem>
                  <SelectItem value="外科手术">外科手术</SelectItem>
                  <SelectItem value="免疫学试验">免疫学试验</SelectItem>
                  <SelectItem value="其他试验">其他试验</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.experimentType && <ErrorMessage message={formErrors.experimentType || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId" className="text-muted-foreground">项目编号</Label>
              <Input 
                id="projectId" 
                value={formData.projectId} 
                onChange={(e) => updateFormData("projectId", e.target.value)} 
                placeholder="请输入项目编号"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-muted-foreground">项目名称 <span className="text-red-500">*</span></Label>
              <Input 
                id="projectName" 
                value={formData.projectName} 
                onChange={(e) => updateFormData("projectName", e.target.value)} 
                onBlur={() => handleBlur("projectName")}
                placeholder="请输入项目名称"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.projectName && formErrors.projectName ? "border-red-500" : ""
                )}
              />
              {formTouched.projectName && <ErrorMessage message={formErrors.projectName || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="researcher" className="text-muted-foreground">主实验员 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.researcher} 
                onValueChange={(value) => updateFormData("researcher", value)}
                onOpenChange={(open) => !open && handleBlur("researcher")}
              >
                <SelectTrigger 
                  id="researcher"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.researcher && formErrors.researcher ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择主实验员" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="张教授">张教授 (高级研究员)</SelectItem>
                  <SelectItem value="李博士">李博士 (副研究员)</SelectItem>
                  <SelectItem value="王医生">王医生 (助理研究员)</SelectItem>
                  <SelectItem value="刘研究员">刘研究员 (研究员)</SelectItem>
                  <SelectItem value="陈博士">陈博士 (博士后)</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.researcher && <ErrorMessage message={formErrors.researcher || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="assistant" className="text-muted-foreground">实验助手</Label>
              <Select 
                value={formData.assistant} 
                onValueChange={(value) => updateFormData("assistant", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择实验助手" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="赵技师">赵技师 (实验技师)</SelectItem>
                  <SelectItem value="钱助理">钱助理 (研究助理)</SelectItem>
                  <SelectItem value="孙学生">孙学生 (研究生)</SelectItem>
                  <SelectItem value="周技术员">周技术员 (技术员)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 实验前准备 */}
          <SectionTitle 
            icon={<ClipboardList className="h-5 w-5" />} 
            title="实验前准备" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fastingHours" className="text-muted-foreground">禁食时间(小时)</Label>
              <Input 
                id="fastingHours" 
                type="number"
                value={formData.fastingHours} 
                onChange={(e) => updateFormData("fastingHours", e.target.value)} 
                onBlur={() => handleBlur("fastingHours")}
                placeholder="请输入禁食时间"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.fastingHours && formErrors.fastingHours ? "border-red-500" : ""
                )}
              />
              {formTouched.fastingHours && <ErrorMessage message={formErrors.fastingHours || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="premedication" className="text-muted-foreground">预处理药物</Label>
              <Input 
                id="premedication" 
                value={formData.premedication} 
                onChange={(e) => updateFormData("premedication", e.target.value)} 
                placeholder="请输入预处理药物"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="anesthesia" className="text-muted-foreground">麻醉方式</Label>
              <Select 
                value={formData.anesthesia} 
                onValueChange={(value) => updateFormData("anesthesia", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择麻醉方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="吸入麻醉">吸入麻醉</SelectItem>
                  <SelectItem value="注射麻醉">注射麻醉</SelectItem>
                  <SelectItem value="局部麻醉">局部麻醉</SelectItem>
                  <SelectItem value="无麻醉">无麻醉</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="anesthesiaDosage" className="text-muted-foreground">麻醉剂量</Label>
              <Input 
                id="anesthesiaDosage" 
                value={formData.anesthesiaDosage} 
                onChange={(e) => updateFormData("anesthesiaDosage", e.target.value)} 
                placeholder="请输入麻醉剂量"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          {/* 实验过程 */}
          <SectionTitle 
            icon={<FlaskConical className="h-5 w-5" />} 
            title="实验过程" 
          />

          <div className="space-y-2">
            <Label htmlFor="procedure" className="text-muted-foreground">实验程序 <span className="text-red-500">*</span></Label>
            <Textarea 
              id="procedure" 
              value={formData.procedure} 
              onChange={(e) => updateFormData("procedure", e.target.value)} 
              onBlur={() => handleBlur("procedure")}
              placeholder="请详细描述实验操作程序和步骤"
              className={cn(
                "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[120px]",
                formTouched.procedure && formErrors.procedure ? "border-red-500" : ""
              )}
            />
            {formTouched.procedure && <ErrorMessage message={formErrors.procedure || ""} />}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-muted-foreground">实验时长(分钟)</Label>
              <Input 
                id="duration" 
                type="number"
                value={formData.duration} 
                onChange={(e) => updateFormData("duration", e.target.value)} 
                onBlur={() => handleBlur("duration")}
                placeholder="请输入实验时长"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.duration && formErrors.duration ? "border-red-500" : ""
                )}
              />
              {formTouched.duration && <ErrorMessage message={formErrors.duration || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="administrationRoute" className="text-muted-foreground">给药途径</Label>
              <Select 
                value={formData.administrationRoute} 
                onValueChange={(value) => updateFormData("administrationRoute", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择给药途径" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="口服">口服</SelectItem>
                  <SelectItem value="静脉注射">静脉注射</SelectItem>
                  <SelectItem value="肌肉注射">肌肉注射</SelectItem>
                  <SelectItem value="皮下注射">皮下注射</SelectItem>
                  <SelectItem value="腹腔注射">腹腔注射</SelectItem>
                  <SelectItem value="吸入">吸入</SelectItem>
                  <SelectItem value="局部应用">局部应用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage" className="text-muted-foreground">给药剂量</Label>
              <Input 
                id="dosage" 
                value={formData.dosage} 
                onChange={(e) => updateFormData("dosage", e.target.value)} 
                placeholder="请输入给药剂量和单位"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sampleType" className="text-muted-foreground">样品类型</Label>
              <Select 
                value={formData.sampleType} 
                onValueChange={(value) => updateFormData("sampleType", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择样品类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="血液">血液</SelectItem>
                  <SelectItem value="尿液">尿液</SelectItem>
                  <SelectItem value="组织">组织</SelectItem>
                  <SelectItem value="脑脊液">脑脊液</SelectItem>
                  <SelectItem value="粪便">粪便</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sampleAmount" className="text-muted-foreground">样品采集量</Label>
            <Input 
              id="sampleAmount" 
              value={formData.sampleAmount} 
              onChange={(e) => updateFormData("sampleAmount", e.target.value)} 
              placeholder="请输入样品采集量和单位"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            />
          </div>

          {/* 观察记录 */}
          <SectionTitle 
            icon={<Activity className="h-5 w-5" />} 
            title="观察记录" 
          />

          <div className="space-y-2">
            <Label htmlFor="vitalSigns" className="text-muted-foreground">生命体征</Label>
            <Textarea 
              id="vitalSigns" 
              value={formData.vitalSigns} 
              onChange={(e) => updateFormData("vitalSigns", e.target.value)} 
              placeholder="请记录心率、呼吸、血压、体温等生命体征变化"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="behavioralChanges" className="text-muted-foreground">行为变化</Label>
            <Textarea 
              id="behavioralChanges" 
              value={formData.behavioralChanges} 
              onChange={(e) => updateFormData("behavioralChanges", e.target.value)} 
              placeholder="请记录实验期间动物的行为变化"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adverseEvents" className="text-muted-foreground">不良事件</Label>
              <Textarea 
                id="adverseEvents" 
                value={formData.adverseEvents} 
                onChange={(e) => updateFormData("adverseEvents", e.target.value)} 
                placeholder="请记录任何不良事件"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complications" className="text-muted-foreground">并发症</Label>
              <Textarea 
                id="complications" 
                value={formData.complications} 
                onChange={(e) => updateFormData("complications", e.target.value)} 
                placeholder="请记录并发症情况"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
          </div>

          {/* 实验结果 */}
          <SectionTitle 
            icon={<Calendar className="h-5 w-5" />} 
            title="实验结果" 
          />

          <div className="space-y-2">
            <Label htmlFor="outcomes" className="text-muted-foreground">实验结果</Label>
            <Textarea 
              id="outcomes" 
              value={formData.outcomes} 
              onChange={(e) => updateFormData("outcomes", e.target.value)} 
              placeholder="请描述主要实验结果和发现"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="measurements" className="text-muted-foreground">测量数据</Label>
              <Textarea 
                id="measurements" 
                value={formData.measurements} 
                onChange={(e) => updateFormData("measurements", e.target.value)} 
                placeholder="请记录具体的测量数据"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataCollected" className="text-muted-foreground">数据收集</Label>
              <Textarea 
                id="dataCollected" 
                value={formData.dataCollected} 
                onChange={(e) => updateFormData("dataCollected", e.target.value)} 
                placeholder="请记录收集的数据类型和存储位置"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specimens" className="text-muted-foreground">标本信息</Label>
            <Textarea 
              id="specimens" 
              value={formData.specimens} 
              onChange={(e) => updateFormData("specimens", e.target.value)} 
              placeholder="请记录标本类型、编号、保存条件等信息"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          {/* 术后处理 */}
          <SectionTitle 
            icon={<Users className="h-5 w-5" />} 
            title="术后处理" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postCare" className="text-muted-foreground">术后护理</Label>
              <Textarea 
                id="postCare" 
                value={formData.postCare} 
                onChange={(e) => updateFormData("postCare", e.target.value)} 
                placeholder="请描述术后护理措施"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="painManagement" className="text-muted-foreground">疼痛管理</Label>
              <Textarea 
                id="painManagement" 
                value={formData.painManagement} 
                onChange={(e) => updateFormData("painManagement", e.target.value)} 
                placeholder="请记录疼痛管理措施"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monitoring" className="text-muted-foreground">监护要求</Label>
              <Textarea 
                id="monitoring" 
                value={formData.monitoring} 
                onChange={(e) => updateFormData("monitoring", e.target.value)} 
                placeholder="请描述术后监护要求"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recovery" className="text-muted-foreground">恢复情况</Label>
              <Textarea 
                id="recovery" 
                value={formData.recovery} 
                onChange={(e) => updateFormData("recovery", e.target.value)} 
                placeholder="请记录动物恢复情况"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
          </div>

          {/* 伦理合规 */}
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="伦理合规" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ethicsApproval" className="text-muted-foreground">伦理审批号</Label>
              <Input 
                id="ethicsApproval" 
                value={formData.ethicsApproval} 
                onChange={(e) => updateFormData("ethicsApproval", e.target.value)} 
                placeholder="请输入伦理委员会审批号"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humaneEndpoint" className="text-muted-foreground">人道终点</Label>
              <Input 
                id="humaneEndpoint" 
                value={formData.humaneEndpoint} 
                onChange={(e) => updateFormData("humaneEndpoint", e.target.value)} 
                placeholder="请描述人道终点标准"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="animalWelfare" className="text-muted-foreground">动物福利</Label>
            <Textarea 
              id="animalWelfare" 
              value={formData.animalWelfare} 
              onChange={(e) => updateFormData("animalWelfare", e.target.value)} 
              placeholder="请描述动物福利保障措施"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          {/* 实验图片 */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">实验照片</Label>
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
                        alt={`实验图片 ${index + 1}`}
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
          <div className="space-y-2">
            <Label htmlFor="followUp" className="text-muted-foreground">后续安排</Label>
            <Textarea 
              id="followUp" 
              value={formData.followUp} 
              onChange={(e) => updateFormData("followUp", e.target.value)} 
              placeholder="请描述后续实验安排或观察计划"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nextExperiment" className="text-muted-foreground">下次实验时间</Label>
              <DatePicker 
                id="nextExperiment"
                date={formData.nextExperiment} 
                onSelect={(date) => date && updateFormData("nextExperiment", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
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
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">实验记录提示</p>
              <p>
                请确保实验记录的准确性和完整性，严格按照实验方案执行，并遵循动物伦理规范和3R原则。
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
            <DialogTitle>实验记录添加成功！</DialogTitle>
            <DialogDescription>
              您的实验记录信息已成功提交。您可以选择继续添加新记录或返回动物详情页面。
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