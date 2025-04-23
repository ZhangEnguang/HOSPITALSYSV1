"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// 使用本地的步骤导航和表单步骤组件
import { STEPS, StepNavigation } from "./step-navigation"
import { StepBasicInfo } from "./form-steps/step-basic-info"
import { StepAuthorInfo } from "./form-steps/step-author-info"
import { StepPaperDetails } from "./form-steps/step-paper-details"
import { StepDocumentUpload } from "./form-steps/step-document-upload"
import { StepComplete } from "./form-steps/step-complete"

interface AcademicPapersEditFormProps {
  id: string
}

export function AcademicPapersEditForm({ id }: AcademicPapersEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [files, setFiles] = useState<File[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 初始化表单数据
  const [formData, setFormData] = useState({
    // 基本信息 (Step 0)
    paperCode: "",
    paperTitle: "",
    paperType: "",
    paperLevel: "",
    paperStatus: "",
    department: "",
    category: "",
    fundingSource: "",
    startDate: new Date().toISOString(),
    
    // 作者信息 (Step 1)
    firstAuthor: "",
    correspondingAuthor: "",
    firstAuthorUnit: "",
    otherAuthors: "",
    otherUnits: "",
    isFirstUnit: "yes",
    isCorrespondingUnit: "yes",
    
    // 论文详情 (Step 2)
    journal: "",
    publishDate: new Date().toISOString(),
    volume: "",
    doi: "",
    impactFactor: "",
    citations: "",
    keywords: "",
    abstract: "",
    funding: "",
    isEsi: false,
  })

  // 模拟从API获取论文数据
  useEffect(() => {
    // 在实际应用中，这里会调用API获取论文数据
    // 这里使用模拟数据
    const fetchPaperData = async () => {
      try {
        setLoading(true)
        // 模拟API请求延迟
        await new Promise((resolve) => setTimeout(resolve, 800))

        // 获取论文数据
        const demoData = getDemoPaperData(id)
        
        // 设置表单数据
        setFormData(demoData)
        
        // 设置所有步骤为已完成
        setCompletedSteps([0, 1, 2, 3])
        
        setLoading(false)
      } catch (error) {
        console.error("获取论文数据失败:", error)
        toast({
          title: "获取论文数据失败",
          description: "无法加载论文数据，请稍后重试",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchPaperData()
  }, [id])

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除验证错误
    if (field === "paperTitle" && validationErrors["论文标题"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["论文标题"]
        return newErrors
      })
    } else if (field === "paperType" && validationErrors["论文类型"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["论文类型"]
        return newErrors
      })
    } else if (field === "paperLevel" && validationErrors["论文级别"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["论文级别"]
        return newErrors
      })
    } else if (field === "paperStatus" && validationErrors["发表状态"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["发表状态"]
        return newErrors
      })
    } else if (field === "firstAuthor" && validationErrors["第一作者"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["第一作者"]
        return newErrors
      })
    } else if (field === "correspondingAuthor" && validationErrors["通讯作者"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["通讯作者"]
        return newErrors
      })
    } else if (field === "firstAuthorUnit" && validationErrors["第一作者单位"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["第一作者单位"]
        return newErrors
      })
    } else if (field === "journal" && validationErrors["期刊名称"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["期刊名称"]
        return newErrors
      })
    } else if (field === "publishDate" && validationErrors["发表日期"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["发表日期"]
        return newErrors
      })
    } else if (field === "volume" && validationErrors["卷号页码"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["卷号页码"]
        return newErrors
      })
    } else if (field === "impactFactor" && validationErrors["影响因子"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["影响因子"]
        return newErrors
      })
    } else if (field === "validationErrors") {
      // 直接更新验证错误
      setValidationErrors(value)
    }
  }

  // 验证当前步骤
  const validateStep = (step: number): boolean => {
    const errors: Record<string, boolean> = {}

    if (step === 0) {
      if (!formData.paperTitle) errors["论文标题"] = true
      if (!formData.paperType) errors["论文类型"] = true
      if (!formData.paperLevel) errors["论文级别"] = true
      if (!formData.paperStatus) errors["发表状态"] = true
    } else if (step === 1) {
      if (!formData.firstAuthor) errors["第一作者"] = true
      if (!formData.correspondingAuthor) errors["通讯作者"] = true
      if (!formData.firstAuthorUnit) errors["第一作者单位"] = true
    } else if (step === 2) {
      if (!formData.journal) errors["期刊名称"] = true
      if (!formData.publishDate) errors["发表日期"] = true
      if (!formData.volume) errors["卷号页码"] = true
      if (!formData.impactFactor) errors["影响因子"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 下一步
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      const isValid = validateStep(currentStep)
      
      if (!isValid) {
        return
      }
      
      // 添加到已完成步骤
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      
      setCurrentStep(currentStep + 1)
    }
  }

  // 上一步
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    if (step > currentStep) {
      // 如果向前跳转，需要验证当前步骤
      const isValid = validateStep(currentStep)
      if (!isValid) return
    }
    
    setCurrentStep(step)
  }

  // 保存草稿
  const handleSaveDraft = () => {
    console.log("保存草稿:", formData)
    toast({
      title: "已保存草稿",
      description: "论文草稿已保存成功",
    })
  }

  // 提交表单
  const handleSubmit = () => {
    // 验证最后一步
    const isValid = validateStep(currentStep)
    if (!isValid) return
    
    // 显示完成对话框
    setShowCompletionDialog(true)
  }

  // 继续编辑
  const handleContinueEditing = () => {
    setShowCompletionDialog(false)
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/achievements")
  }

  // 返回按钮
  const handleGoBack = () => {
    router.push("/achievements")
  }

  // 获取模拟论文数据
  const getDemoPaperData = (paperId: string) => {
    // 不同的ID返回不同的演示数据
    if (paperId === "1") {
      return {
        paperCode: "AC2023001",
        paperTitle: "基于物联网的智慧能源管理系统研究",
        paperType: "学术论文",
        paperLevel: "国际级",
        paperStatus: "审核中",
        department: "计算机科学与技术学院",
        category: "工程技术",
        fundingSource: "国家自然科学基金",
        startDate: "2023-01-15T00:00:00.000Z",
        
        firstAuthor: "王五",
        correspondingAuthor: "王五",
        firstAuthorUnit: "智慧能源管理系统",
        otherAuthors: "李四, 张三",
        otherUnits: "计算机科学与工程学院",
        isFirstUnit: "yes",
        isCorrespondingUnit: "yes",
        
        journal: "Energy and Buildings",
        publishDate: "2023-08-15T00:00:00.000Z",
        volume: "Vol. 245, pp. 112-125",
        doi: "10.1016/j.enbuild.2023.112358",
        impactFactor: "5.879",
        citations: "12",
        keywords: "物联网, 智慧能源, 能源管理, 可持续发展",
        abstract: "本文研究了物联网技术在智慧能源管理系统中的应用，提出了一种新型的能源管理架构。该架构集成了智能传感器网络、数据分析平台和决策支持系统，可以实现能源使用的实时监控、预测和优化。实验结果表明，该系统可以显著降低能源消耗和碳排放，同时提高能源利用效率。",
        funding: "国家自然科学基金(No.62076123)",
        isEsi: true,
      }
    } else if (paperId === "2") {
      return {
        paperCode: "AC2023002",
        paperTitle: "基于深度学习的停车位识别算法研究",
        paperType: "学术论文",
        paperLevel: "国家级",
        paperStatus: "审核中",
        department: "计算机科学与技术学院",
        category: "人工智能",
        fundingSource: "校级科研项目",
        startDate: "2023-03-10T00:00:00.000Z",
        
        firstAuthor: "孙七",
        correspondingAuthor: "赵六",
        firstAuthorUnit: "智能交通管理平台",
        otherAuthors: "赵六, 刘八",
        otherUnits: "计算机科学与工程学院",
        isFirstUnit: "yes",
        isCorrespondingUnit: "no",
        
        journal: "智能停车管理平台",
        publishDate: "2023-09-20T00:00:00.000Z",
        volume: "Vol. 35, No. 4, pp. 78-92",
        doi: "10.1016/j.ipm.2023.09.045",
        impactFactor: "3.892",
        citations: "5",
        keywords: "深度学习, 图像识别, 停车管理, 智能交通",
        abstract: "本文提出了一种基于深度学习的停车位识别方法，可以准确识别各种环境下的停车位状态。该方法结合了卷积神经网络和注意力机制，能够有效处理光照变化、遮挡等复杂场景。实验结果表明，该方法在公共数据集上取得了95.7%的识别准确率，优于现有方法。",
        funding: "校级科研基金(XK2023-45)",
        isEsi: false,
      }
    } else {
      // 默认演示数据
      return {
        paperCode: "AC" + new Date().getFullYear() + "00" + Math.floor(Math.random() * 100),
        paperTitle: "基于人工智能的园区安防系统研究",
        paperType: "学术论文",
        paperLevel: "国际级",
        paperStatus: "已发表",
        department: "计算机科学与技术学院",
        category: "人工智能",
        fundingSource: "国家重点研发计划",
        startDate: "2023-02-20T00:00:00.000Z",
        
        firstAuthor: "张三",
        correspondingAuthor: "李四",
        firstAuthorUnit: "智能园区安防系统",
        otherAuthors: "王五, 赵六",
        otherUnits: "计算机科学与工程学院",
        isFirstUnit: "yes",
        isCorrespondingUnit: "yes",
        
        journal: "IEEE Internet of Things Journal",
        publishDate: "2023-06-10T00:00:00.000Z",
        volume: "Vol. 10, No. 6, pp. 5678-5693",
        doi: "10.1109/JIOT.2023.3165789",
        impactFactor: "9.936",
        citations: "25",
        keywords: "人工智能, 园区安防, 物联网, 深度学习",
        abstract: "本文研究了人工智能技术在园区安防系统中的应用，提出了一种新型的安防系统架构。该架构结合了深度学习和物联网技术，可以实现对园区内异常行为的实时检测和预警。实验结果表明，该系统在各种复杂场景下表现优异，比传统方法提高了检测准确率约20%。",
        funding: "国家重点研发计划项目(2023YFB2501900)",
        isEsi: true,
      }
    }
  }

  // 渲染步骤内容
  const renderStepContent = () => {
    if (loading) {
      return (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      )
    }

    switch (currentStep) {
      case 0:
        return (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <StepBasicInfo
                formData={formData}
                updateFormData={updateFormData}
                validationErrors={validationErrors}
              />
            </CardContent>
          </Card>
        )
      case 1:
        return (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <StepAuthorInfo
                formData={formData}
                updateFormData={updateFormData}
                validationErrors={validationErrors}
              />
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <StepPaperDetails
                formData={formData}
                updateFormData={updateFormData}
                validationErrors={validationErrors}
              />
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <StepDocumentUpload
                files={files}
                setFiles={setFiles}
              />
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <StepComplete
                formData={formData}
                files={files}
              />
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  // 渲染按钮
  const renderButtons = () => {
    return (
      <div className="flex items-center justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStep === 0 || loading}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          上一步
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={loading}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>
          
          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={loading}
              className="flex items-center"
            >
              下一步
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              提交修改
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 返回按钮和标题 */}
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={handleGoBack} 
          size="sm" 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h2 className="text-2xl font-bold">编辑学术论文</h2>
      </div>
      
      <div className="text-muted-foreground mb-6">
        编辑学术论文信息，请填写必填项以完成提交
      </div>

      <StepNavigation
        currentStep={currentStep}
        goToStep={goToStep}
        validationErrors={validationErrors}
        completedSteps={completedSteps}
      />

      <div className="mt-6"></div>
      {renderStepContent()}
      {renderButtons()}

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改已完成</DialogTitle>
            <DialogDescription>
              学术论文信息已修改完成，是否返回列表？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={handleContinueEditing}>
              继续编辑
            </Button>
            <Button onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 