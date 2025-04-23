"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// 导入步骤组件
import { STEPS, StepNavigation } from "./step-navigation"

// 导入各步骤组件
import { StepBasicInfo } from "./form-steps/step-basic-info"
import { StepAuthorsInfo } from "./form-steps/step-authors-info"
import { StepContentDetails } from "./form-steps/step-content-details"
import { StepDocumentUpload } from "./form-steps/step-document-upload"
import { StepCompletion } from "./form-steps/step-completion"

interface AcademicBooksEditFormProps {
  id: string
}

export function AcademicBooksEditForm({ id }: AcademicBooksEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [files, setFiles] = useState<File[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 初始化表单数据
  const [formData, setFormData] = useState({
    // 基本信息
    title: "",
    workType: "",
    publisher: "",
    publishDate: "",
    isbn: "",
    pages: "",
    words: "",
    category: "",

    // 作者信息
    firstAuthor: "",
    editor: "",
    otherAuthors: "",
    contribution: "",

    // 内容详情
    summary: "",
    keywords: "",
    series: "",
    awards: "",
  })

  // 模拟从API获取著作数据
  useEffect(() => {
    // 在实际应用中，这里会调用API获取著作数据
    // 这里使用模拟数据
    const fetchBookData = async () => {
      try {
        setLoading(true)
        // 模拟API请求延迟
        await new Promise((resolve) => setTimeout(resolve, 800))

        // 获取著作数据
        const demoData = getDemoBookData(id)
        
        // 设置表单数据
        setFormData(demoData)
        
        // 设置所有步骤为已完成
        setCompletedSteps([0, 1, 2, 3])
        
        setLoading(false)
      } catch (error) {
        console.error("获取著作数据失败:", error)
        toast({
          title: "获取著作数据失败",
          description: "无法加载著作数据，请稍后重试",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchBookData()
  }, [id])

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除验证错误
    if (field in validationErrors) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 验证当前步骤
  const validateStep = (step: number): boolean => {
    const errors: Record<string, boolean> = {}

    if (step === 0) {
      // 验证基本信息
      if (!formData.title) errors["著作名称"] = true
      if (!formData.workType) errors["著作类型"] = true
      if (!formData.publisher) errors["出版社"] = true
      if (!formData.publishDate) errors["出版日期"] = true
      if (!formData.isbn) errors["ISBN"] = true
      if (!formData.category) errors["学科分类"] = true
    } else if (step === 1) {
      // 验证作者信息
      if (!formData.firstAuthor) errors["第一作者"] = true
      if (!formData.editor) errors["主编"] = true
      if (!formData.contribution) errors["本人贡献"] = true
    } else if (step === 2) {
      // 验证内容详情
      if (!formData.summary) errors["内容简介"] = true
      if (!formData.keywords) errors["关键词"] = true
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
      description: "著作草稿已保存成功",
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

  // 获取模拟著作数据
  const getDemoBookData = (bookId: string) => {
    // 不同的ID返回不同的演示数据
    if (bookId === "1") {
      return {
        title: "物联网技术应用",
        workType: "专著",
        publisher: "电子工业出版社",
        publishDate: "2023-05-15",
        isbn: "ISBN: 待定",
        pages: "320",
        words: "25万",
        category: "工程技术",
        firstAuthor: "王五",
        editor: "王五",
        otherAuthors: "李四, 张三",
        contribution: "第一作者，负责全书总体规划和主要内容编写",
        summary: "本书系统介绍了物联网技术的基本原理和应用场景，包含多个实际案例，涵盖了传感器网络、数据处理、系统架构等内容。适合作为高校相关专业的教材以及从业人员的参考书籍。",
        keywords: "物联网, 传感网络, 嵌入式系统, 数据处理",
        series: "计算机科学与技术丛书",
        awards: "无",
      }
    } else if (bookId === "2") {
      return {
        title: "智慧城市理论与实践",
        workType: "教材",
        publisher: "高等教育出版社",
        publishDate: "2023-08-15",
        isbn: "ISBN: 978-7-04-XXXXXX-X",
        pages: "280",
        words: "22万",
        category: "工程技术",
        firstAuthor: "李四",
        editor: "张三",
        otherAuthors: "赵六, 孙七",
        contribution: "第二作者，负责智慧交通和智慧安防章节",
        summary: "本书探讨了智慧城市建设的理论基础和实践经验，提出了智慧城市建设的新模式。全书共分为10章，包括智慧城市概述、技术基础、应用领域、建设方法、案例分析等，是智慧城市研究和实践的重要参考书。",
        keywords: "智慧城市, 城市管理, 信息化, 智能交通",
        series: "现代城市建设丛书",
        awards: "无",
      }
    } else {
      // 默认演示数据
      return {
        title: "人工智能与大数据分析",
        workType: "教材",
        publisher: "科学出版社",
        publishDate: "2023-05-20",
        isbn: "ISBN: 978-7-03-XXXXXX-X",
        pages: "380",
        words: "30万",
        category: "人工智能",
        firstAuthor: "张三",
        editor: "张三",
        otherAuthors: "李四, 王五",
        contribution: "主编，负责全书框架设计和主要章节编写",
        summary: "本书系统介绍了人工智能与大数据分析的基本理论和应用实践，包含多个案例研究。全书分为人工智能基础、机器学习算法、深度学习技术、大数据处理与分析、典型应用案例等章节。适合作为高校相关专业的教材和研究参考。",
        keywords: "人工智能, 大数据, 机器学习, 深度学习",
        series: "计算机科学前沿丛书",
        awards: "无",
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
              <StepAuthorsInfo
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
              <StepContentDetails
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
              <StepCompletion
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
        <h2 className="text-2xl font-bold">编辑学术著作</h2>
      </div>
      
      <div className="text-muted-foreground mb-6">
        编辑学术著作信息，请填写必填项以完成提交
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
              学术著作信息已修改完成，是否返回列表？
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