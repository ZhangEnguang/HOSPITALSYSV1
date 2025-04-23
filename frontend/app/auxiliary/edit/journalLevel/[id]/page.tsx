"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { StepNavigation, STEPS } from "../../../create/journalLevel/components/step-navigation"
import BasicInfoForm from "../../../create/journalLevel/components/basic-info-form"
import JournalSourceForm from "../../../create/journalLevel/components/journal-source-form"
import CompletionStep from "../../../create/journalLevel/components/completion-step"
import { get, post, put } from "@/lib/api"

interface Props {
  params: {
    id: string
  }
}

export default function EditJournalLevelPage({ params }: Props) {
  const { id } = params
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    basicInfo: {},
    journalSource: {},
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [journalLevelData, setJournalLevelData] = useState<any>(null)

  const router = useRouter()
  const { toast } = useToast()
  
  // 初始化时加载刊物级别数据
  useEffect(() => {
    loadJournalLevelData(id)
  }, [id])
  
  // 加载刊物级别数据 (演示数据)
  const loadJournalLevelData = async (levelId: string) => {
    console.log("开始加载刊物级别数据, ID:", levelId);
    setIsLoading(true)
    try {
      // 这里是模拟数据，实际项目中应该从API获取
      const mockData = {
        id: levelId,
        code: "JL-2023-008",
        name: "一级学术期刊",
        paperType: "学术论文",
        applicableJournalSource: "核心期刊",
        isIndexed: true,
        status: "启用",
        description: "适用于高水平学术研究成果发表的一级期刊",
        createdAt: "2023-06-15",
        type: "journal"
      }

      setJournalLevelData(mockData)
        
      // 预填充表单数据
      const basicInfo = {
        name: mockData.name || "",
        code: mockData.code || "",
        status: mockData.status === "启用" ? "active" : "inactive",
        description: mockData.description || "",
      }
        
      // 预填充期刊源信息
      const journalSource = {
        paperType: mockData.paperType || "",
        journalSource: mockData.applicableJournalSource || "",
        isIndexed: mockData.isIndexed || false,
      }
        
      // 更新表单数据
      setFormData({
        basicInfo,
        journalSource,
      })
        
      // 标记步骤已完成
      setCompletedSteps([0])
        
      toast({
        title: "数据加载成功",
        description: "已加载刊物级别数据",
      })
    } catch (error) {
      console.error("加载刊物级别数据失败:", error)
      handleLoadError("网络错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }
  
  // 处理加载错误
  const handleLoadError = (message: string) => {
    console.error("加载数据错误详情:", message);
    
    toast({
      title: "加载数据失败",
      description: message,
      variant: "destructive",
    })
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // 验证当前步骤
      if (validateCurrentStep()) {
        // 标记当前步骤为已完成
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep])
        }
        setCurrentStep(currentStep + 1)
      } else {
        // 显示验证错误提示
        toast({
          title: "表单验证失败",
          description: "请填写所有必填项",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    console.log("保存草稿", formData)
    // 实现保存草稿逻辑
    toast({
      title: "暂存成功",
      description: "刊物级别已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/auxiliary?tab=journalLevel")
    }, 1000)
  }

  const handleComplete = () => {
    console.log("提交刊物级别", formData)
    // 实现更新逻辑
    updateJournalLevel(id, formData)
  }

  const handleContinueAdd = () => {
    router.push("/auxiliary/create/journalLevel")
  }

  const handleReturnToList = () => {
    router.push("/auxiliary?tab=journalLevel")
  }

  const handleBasicInfoSubmit = (data: any) => {
    console.log("主页面接收到BasicInfoForm提交的数据:", data);
    try {
      setFormData(prev => {
        const newData = {
          ...prev,
          basicInfo: data
        };
        console.log("更新formData后的状态:", newData);
        return newData;
      });
      // 直接调用handleNext而不是在setFormData的回调中调用
      console.log("调用handleNext函数");
      handleNext();
    } catch (error) {
      console.error("处理基本信息提交时出错:", error);
      toast({
        title: "处理表单数据失败",
        description: "请重试或联系管理员",
        variant: "destructive",
      });
    }
  }

  const handleJournalSourceSubmit = (data: any) => {
    setFormData(prev => ({
      ...prev,
      journalSource: data
    }))
    handleNext()
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { name, code } = formData.basicInfo as any
      
      if (!name) errors["名称"] = true
      if (!code) errors["编码"] = true
    } 
    else if (currentStep === 1) {
      // 验证期刊源信息
      const { paperType, journalSource } = formData.journalSource as any
      
      if (!paperType) errors["论文类型"] = true
      if (!journalSource) errors["期刊源"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤的下一步
    if (step <= Math.max(...completedSteps, 0) + 1) {
      setCurrentStep(step)
    }
  }

  // 更新刊物级别
  const updateJournalLevel = async (levelId: string, data: any) => {
    setIsLoading(true)
    try {
      // 在实际项目中替换为实际API调用
      // const response = await put(`/api/auxiliary/journalLevel/${levelId}`, data)
      console.log(`模拟API调用: put /api/auxiliary/journalLevel/${levelId}`, data)
      
      // 模拟成功响应
      setTimeout(() => {
        setIsLoading(false)
        setShowSuccessDialog(true)
      }, 1000)
    } catch (error) {
      console.error("更新刊物级别失败:", error)
      setIsLoading(false)
      toast({
        title: "更新失败",
        description: "无法更新刊物级别，请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm 
            defaultValues={formData.basicInfo} 
            onSubmit={handleBasicInfoSubmit}
          />
        )
      case 1:
        return (
          <JournalSourceForm
            defaultValues={formData.journalSource}
            onSubmit={handleJournalSourceSubmit}
          />
        )
      case 2:
        return (
          <CompletionStep 
            formData={formData}
            onComplete={handleComplete}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  // 根据步骤渲染按钮
  const renderButtons = () => {
    if (currentStep === 0) {
      return (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            保存草稿
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
          >
            下一步
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </>
      )
    } else if (currentStep === 1) {
      return (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            保存草稿
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
          >
            下一步
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </>
      )
    } else {
      return (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button
            type="button"
            onClick={handleComplete}
            disabled={isLoading}
          >
            {isLoading ? "处理中..." : "提交"}
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        </>
      )
    }
  }

  return (
    <div className="container max-w-screen-xl py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/auxiliary?tab=journalLevel" className="mr-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight">编辑刊物级别</h2>
      </div>

      <StepNavigation 
        currentStep={currentStep} 
        goToStep={goToStep}
        validationErrors={validationErrors}
        completedSteps={completedSteps}
      />

      <Card>
        <CardContent className="pt-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-slate-50">
          <div>
            {Object.keys(validationErrors).length > 0 && (
              <div className="text-sm text-red-500">
                请检查以下字段: {Object.keys(validationErrors).join(", ")}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {renderButtons()}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更新成功</DialogTitle>
            <DialogDescription>
              刊物级别信息已成功更新。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button onClick={handleContinueAdd}>
              创建新刊物级别
            </Button>
            <Button variant="outline" onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 