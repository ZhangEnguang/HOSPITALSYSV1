"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/hooks/use-toast"
import { templates } from "../components/templates-dialog"
import { format } from "date-fns"

// 导入步骤导航组件
import { StepNavigation, STEPS } from "./components/step-navigation"

// 导入成功视图组件
import { SuccessView } from "./components/success-view"

// 导入表单步骤组件
import { StepBasic } from "./components/form-steps/step-basic"
import { StepMaterials } from "./components/form-steps/step-materials"
import { StepDates } from "./components/form-steps/step-dates"
import { StepRequirements } from "./components/form-steps/step-requirements"
import { StepComplete } from "./components/form-steps/step-complete"

// 定义材料类型
type Material = {
  id: string
  name: string
  description: string
  required: boolean
}

// 定义日期类型
type KeyDate = {
  id: string
  name: string
  date: Date
}

// 定义要求类型
type Requirement = {
  id: string
  content: string
}

// 定义表单数据类型
export type FormData = {
  name: string
  description: string
  category: string
  type: string
  startDate: Date
  endDate: Date
  autoEnd: string
  canReview: string
  hasQuota: string
  guide: string
  template: string
  notes: string
  materials: Material[]
  keyDates: KeyDate[]
  requirements: Requirement[]
}

// 从模板中获取表单初始数据
const getDataFromTemplate = (templateId: string): Partial<FormData> => {
  const template = templates.find(t => t.id === templateId);
  if (!template) return {};
  
  return {
    name: `2025年度${template.title}`,
    description: template.description,
    category: template.category,
    type: template.category.includes("国家") ? "国家级" : 
          template.category.includes("省") ? "省部级" : 
          template.category.includes("校") ? "校级" : "其他",
    guide: `${template.title}申报指南，申报截止时间：${template.deadline}，申报频率：${template.frequency}。`,
    template: `请按照最新公布的${template.title}模板填写申报材料。`,
    materials: [
      {
        id: "1",
        name: "申报书",
        required: true,
        description: "请下载模板填写，并转成PDF格式上传"
      },
      {
        id: "2",
        name: "研究计划书",
        required: true,
        description: "请下载模板填写，包含研究背景、意义、目标、内容、方法、创新点等"
      }
    ]
  };
};

// 默认表单数据
const defaultFormData: FormData = {
  name: "",
  description: "",
  category: "",
  type: "",
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  autoEnd: "yes",
  canReview: "no",
  hasQuota: "no",
  guide: "",
  template: "",
  notes: "",
  materials: [],
  keyDates: [],
  requirements: [],
}

function CreateApplicationPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("templateId")
  
  // 状态管理
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [attachments, setAttachments] = useState<{ name: string; size: number; type: string }[]>([])

  // 处理模板数据加载
  useEffect(() => {
    if (templateId) {
      const templateData = getDataFromTemplate(templateId);
      if (Object.keys(templateData).length > 0) {
        setFormData(prevData => ({
          ...prevData,
          ...templateData
        }));
        toast({
          title: "模板已加载",
          description: "已根据所选模板预填充部分数据",
        })
      } else {
        toast({
          title: "模板加载失败",
          description: "未找到所选模板或模板数据无效",
          variant: "destructive"
        })
      }
    }
  }, [templateId]);

  // 获取页面标题
  const getPageTitle = () => {
    if (formData.name) {
      return formData.name;
    }
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        return `创建${template.title}`;
      }
    }
    
    return "创建申报批次";
  }

  // 处理步骤导航
  const goToStep = (step: number) => {
    // 验证当前步骤
    if (validateStep(currentStep)) {
      // 如果当前步骤验证通过，则将其标记为已完成
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(step)
    }
  }

  // 处理下一步
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      if (validateStep(currentStep)) {
        // 如果当前步骤验证通过，则将其标记为已完成
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep])
        }
        setCurrentStep(currentStep + 1)
      }
    }
  }

  // 处理上一步
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 验证步骤
  const validateStep = (step: number): boolean => {
    const errors: Record<string, boolean> = {}
    const messages: Record<string, string> = {}
    
    if (step === 0) {
      // 验证基本信息
      if (!formData.name) {
        errors.name = true
        messages.name = "请输入申请计划名称"
      }
      if (!formData.category) {
        errors.category = true
        messages.category = "请选择项目分类"
      }
      if (!formData.startDate) {
        errors.startDate = true
        messages.startDate = "请选择开始日期"
      }
      if (!formData.endDate) {
        errors.endDate = true
        messages.endDate = "请选择结束日期"
      }
      if (!formData.guide) {
        errors.guide = true
        messages.guide = "请输入申请指南"
      }
    } else if (step === 1) {
      // 验证材料
      if (formData.materials.length > 0) {
        const invalidMaterials = formData.materials.some(m => !m.name)
        if (invalidMaterials) {
          errors.materials = true
          messages.materials = "请填写所有材料名称"
        }
      }
    } else if (step === 2) {
      // 验证日期
      if (formData.keyDates.length > 0) {
        const invalidDates = formData.keyDates.some(d => !d.name || !d.date)
        if (invalidDates) {
          errors.keyDates = true
          messages.keyDates = "请填写所有时间节点名称和日期"
        }
      }
    } else if (step === 3) {
      // 验证要求
      if (formData.requirements.length > 0) {
        const invalidRequirements = formData.requirements.some(r => !r.content)
        if (invalidRequirements) {
          errors.requirements = true
          messages.requirements = "请填写所有要求内容"
        }
      }
    }

    setValidationErrors(errors)
    setErrorMessages(messages)
    return Object.keys(errors).length === 0
  }

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
      setAttachments([...attachments, ...newFiles])
    }
  }

  // 处理移除附件
  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  // 格式化文件大小
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  // 处理表单提交
  const handleSubmit = async () => {
    // 验证所有步骤
    let isValid = true
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validateStep(i)) {
        isValid = false
        setCurrentStep(i)
        break
      }
    }

    if (isValid) {
      setIsSubmitting(true)
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log("提交的数据:", formData)
        
        // 设置提交成功状态
        setSubmitSuccess(true)
      } catch (error) {
        console.error("提交失败:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // 处理继续添加
  const handleAddAnother = () => {
    // 重置表单和状态
    setFormData(defaultFormData)
    setCurrentStep(0)
    setCompletedSteps([])
    setValidationErrors({})
    setErrorMessages({})
    setSubmitSuccess(false)
    setAttachments([])
  }

  // 处理返回列表
  const handleReturnToList = () => {
    router.push("/applications")
  }

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepBasic formData={formData} setFormData={setFormData} errors={errorMessages} />
      case 1:
        return (
          <StepMaterials
            formData={formData}
            setFormData={setFormData}
            errors={errorMessages}
            handleFileUpload={handleFileUpload}
            handleRemoveAttachment={handleRemoveAttachment}
            formatFileSize={formatFileSize}
            attachments={attachments}
          />
        )
      case 2:
        return <StepDates formData={formData} setFormData={setFormData} errors={errorMessages} />
      case 3:
        return <StepRequirements formData={formData} setFormData={setFormData} errors={errorMessages} />
      case 4:
        return <StepComplete formData={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      default:
        return null
    }
  }

  // 动画变体
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  // 页面渲染逻辑
  if (submitSuccess) {
    return <SuccessView 
      formData={formData}
      onAddAnother={handleAddAnother}
      onReturnToList={handleReturnToList}
    />;
  }

  return (
    <div className="container py-6 max-w-5xl">
      {/* 页面标题和返回按钮 */}
      <div className="flex items-center mb-2">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/applications")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
      </div>

      {/* 副标题：项目分类·申报日期·申报类型 */}
      {(formData.category || formData.type || formData.startDate) && (
        <div className="flex items-center text-muted-foreground text-sm mb-6 ml-10">
          {formData.category && (
            <span className="inline-flex items-center">
              {formData.category}
            </span>
          )}
          
          {formData.category && formData.startDate && (
            <span className="mx-2">·</span>
          )}
          
          {formData.startDate && (
            <span className="inline-flex items-center">
              申报日期: {format(formData.startDate, "yyyy-MM-dd")} 至 {format(formData.endDate, "yyyy-MM-dd")}
            </span>
          )}
          
          {((formData.category && formData.type) || (formData.startDate && formData.type)) && (
            <span className="mx-2">·</span>
          )}
          
          {formData.type && (
            <span className="inline-flex items-center">
              {formData.type}
            </span>
          )}
        </div>
      )}

      <div className="space-y-6">
        {/* 步骤导航 */}
        <StepNavigation
          currentStep={currentStep}
          goToStep={goToStep}
          validationErrors={validationErrors}
          completedSteps={completedSteps}
        />

        {/* 步骤内容 */}
        <motion.div 
          key={currentStep}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {renderStepContent()}
        </motion.div>

        {/* 步骤按钮 */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              上一步
            </Button>
            <Button type="button" onClick={handleNextStep}>
              下一步
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CreateApplicationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">加载中...</p>
      </div>
    </div>}>
      <CreateApplicationPageContent />
    </Suspense>
  );
}
