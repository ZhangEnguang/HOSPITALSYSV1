"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
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
import { post } from "@/lib/api"
import type { ApiResponse } from "@/lib/api"

import { StepNavigation, STEPS } from "./components/step-navigation"
import BasicInfoForm from "./components/basic-info-form"
import BudgetItemsForm from "./components/budget-items-form"
import CompletionStep from "./components/completion-step"
import { BudgetStandardFormData } from "./components/basic-info-form"
import { BudgetItem } from "./components/budget-items-form"

// API基础URL
const API_BASE_URL = "/api/project/budgetStandard";

export default function CreateBudgetStandardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<{
    basicInfo: Partial<BudgetStandardFormData>,
    budgetItems: {
      budgetItems: BudgetItem[]
    }
  }>({
    basicInfo: {},
    budgetItems: {
      budgetItems: []
    }
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

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

  const handleSaveDraft = async () => {
    try {
      // 创建要提交的数据对象
      const budgetStandard = {
        ...formData.basicInfo,
        status: "草稿",
        budgetItems: formData.budgetItems.budgetItems.map(item => ({
          name: item.name,
          code: item.code,
          description: item.description,
          adjustmentLimit: item.adjustmentLimit || "0",
          parentId: item.parentId || null,
          category: item.category || "直接费用",
          limitAmount: item.limitAmount || "",
          limitPercent: item.limitPercent || "",
          isRequired: item.isRequired || false
        }))
      };

      // 使用API库中的post方法发送请求
      const response = await post<ApiResponse<any>>(`${API_BASE_URL}/add`, budgetStandard);
      
      if (response.code === 200) {
        toast({
          title: "暂存成功",
          description: "预算标准已保存为草稿",
          duration: 3000,
        });
        setTimeout(() => {
          router.push("/auxiliary?tab=budgetStandard");
        }, 1000);
      } else {
        toast({
          title: "保存失败",
          description: response.message || "请检查填写信息",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("保存草稿失败:", error);
      toast({
        title: "保存失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleComplete = async () => {
    try {
      // 创建要提交的数据对象
      const budgetStandard = {
        ...formData.basicInfo,
        status: "启用",
        budgetItems: formData.budgetItems.budgetItems.map(item => ({
          name: item.name,
          code: item.code,
          description: item.description,
          adjustmentLimit: item.adjustmentLimit || "0",
          parentId: item.parentId || null,
          category: item.category || "直接费用",
          limitAmount: item.limitAmount || "",
          limitPercent: item.limitPercent || "",
          isRequired: item.isRequired || false
        }))
      };

      // 使用API库中的post方法发送请求
      const response = await post<ApiResponse<any>>(`${API_BASE_URL}/add`, budgetStandard);
      
      if (response.code === 200) {
        setShowSuccessDialog(true);
      } else {
        toast({
          title: "提交失败",
          description: response.message || "请检查填写信息",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("提交预算标准失败:", error);
      toast({
        title: "提交失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleContinueAdd = () => {
    // 重置表单数据和步骤
    setFormData({
      basicInfo: {},
      budgetItems: {
        budgetItems: []
      }
    })
    setCurrentStep(0)
    setCompletedSteps([])
    setShowSuccessDialog(false)
    setValidationErrors({})
  }

  const handleReturnToList = () => {
    router.push("/auxiliary?tab=budgetStandard")
  }

  const updateFormData = (step: number, data: any) => {
    // 防止无限循环，只在数据真正变化时更新
    const currentStepData = getStepData(step)
    if (JSON.stringify(currentStepData) !== JSON.stringify(data)) {
      setFormData((prev) => {
        const newData = { ...prev }
        switch (step) {
          case 0:
            newData.basicInfo = data
            break
          case 1:
            newData.budgetItems = data
            break
          default:
            break
        }
        return newData
      })
    }
  }

  const getStepData = (step: number) => {
    switch (step) {
      case 0:
        return formData.basicInfo
      case 1:
        return formData.budgetItems
      default:
        return {}
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { name, code, projectType, limitAmount } = formData.basicInfo
      
      if (!name) errors["名称"] = true
      if (!code) errors["编码"] = true
      if (!projectType) errors["项目类型"] = true
      if (!limitAmount) errors["限额"] = true
    } 
    else if (currentStep === 1) {
      // 验证预算科目
      const { budgetItems } = formData.budgetItems
      
      if (!budgetItems || budgetItems.length === 0) {
        errors["预算科目"] = true
      } else {
        // 验证每个预算项
        let hasInvalidItem = false
        budgetItems.forEach((item) => {
          if (!item.name || !item.code) {
            hasInvalidItem = true
          }
        })
        if (hasInvalidItem) {
          errors["预算科目"] = true
        }
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤的下一步
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm 
            data={formData.basicInfo} 
            onUpdate={(data) => updateFormData(0, data)} 
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <BudgetItemsForm 
            data={formData.budgetItems} 
            onUpdate={(data) => updateFormData(1, data)} 
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <CompletionStep formData={formData} />
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/auxiliary?tab=budgetStandard" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">新增预算标准</h1>
      </div>

      <div className="mx-8 mb-6">
        <StepNavigation 
          currentStep={currentStep} 
          goToStep={goToStep} 
          completedSteps={completedSteps} 
          validationErrors={validationErrors}
        />
      </div>

      <motion.div 
        className="mx-8 mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
      >
        <Card className="border-muted/50 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md mb-4">
              <div className="text-primary">
                <InfoIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{STEPS[currentStep].name}</h3>
            </div>
            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存草稿
            </Button>
            <div className="space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  下一步
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>
                  完成
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* 成功提交对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>预算标准创建成功</DialogTitle>
            <DialogDescription>
              预算标准已成功创建并保存。您可以继续添加新标准或返回列表。
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="secondary" onClick={handleContinueAdd}>
              继续添加
            </Button>
            <Button variant="default" onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 