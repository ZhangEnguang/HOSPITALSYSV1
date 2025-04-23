"use client"

import { useState, useEffect } from "react"
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

import { StepNavigation, STEPS } from "../../../create/projectCategory/components/step-navigation"
import { BasicInfoForm, type FormValues as BasicInfoFormValues } from "../../../create/projectCategory/components/basic-info-form"
import { BudgetInfoForm, type BudgetInfoFormValues } from "../../../create/projectCategory/components/budget-info-form"
import CompletionStep from "../../../create/projectCategory/components/completion-step"
import { get, post, put } from "@/lib/api"

interface Props {
  params: {
    id: string
  }
}

export default function EditProjectCategoryPage({ params }: Props) {
  const { id } = params
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    basicInfo: {},
    budgetInfo: {},
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categoryData, setCategoryData] = useState<any>(null)

  const router = useRouter()
  const { toast } = useToast()
  
  // 初始化时加载项目分类数据
  useEffect(() => {
    loadCategoryData(id)
  }, [id])
  
  // 加载项目分类数据
  const loadCategoryData = async (categoryId: string) => {
    console.log("开始加载项目分类数据, ID:", categoryId);
    setIsLoading(true)
    try {
      // 调用API获取项目分类数据
      console.log("发送API请求:", `/api/project/projectType/detail/${categoryId}`);
      const response = await get(`/api/project/projectType/detail/${categoryId}`)
      console.log("API响应:", response);
      
      if (response && response.code === 200 && response.data) {
        const data = response.data
        console.log("获取到有效数据:", data);
        setCategoryData(data)
        
        // 预填充表单数据
        const basicInfo = {
          name: data.name || "",
          code: data.code || "",
          level: data.parentId ? "2" : "1",
          category: data.category || "research", // 默认为科研类
          parentCategory: data.parentId || "",
          enabled: data.status === "启用",
          remarks: data.description || "",
        }
        
        // 预填充预算信息
        const budgetInfo = {
          budgetItems: data.budgetItems || [], // 在实际项目中，这里需要从API获取预算项信息
        }
        
        console.log("设置表单数据:", { basicInfo, budgetInfo });
        
        // 更新表单数据
        setFormData({
          basicInfo,
          budgetInfo,
        })
        
        // 标记步骤已完成
        setCompletedSteps([0])
        
        toast({
          title: "数据加载成功",
          description: "已加载项目分类数据",
        })
      } else {
        console.error("API响应异常:", response);
        handleLoadError("数据格式不正确")
      }
    } catch (error) {
      console.error("加载项目分类数据失败:", error)
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
    
    // 暂时注释掉自动跳转，便于调试
    // setTimeout(() => {
    //   router.push("/auxiliary?tab=projectCategory")
    // }, 2000)
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
      description: "项目分类已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/auxiliary?tab=projectCategory")
    }, 1000)
  }

  const handleComplete = () => {
    console.log("提交项目分类", formData)
    // 实现更新逻辑
    updateProjectCategory(id, formData)
  }

  const handleContinueAdd = () => {
    router.push("/auxiliary/create/projectCategory")
  }

  const handleReturnToList = () => {
    router.push("/auxiliary?tab=projectCategory")
  }

  const handleBasicInfoSubmit = (data: BasicInfoFormValues) => {
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

  const handleBudgetInfoSubmit = (data: BudgetInfoFormValues) => {
    setFormData(prev => ({
      ...prev,
      budgetInfo: data
    }))
    handleNext()
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { name, code, level, category, parentCategory } = formData.basicInfo as any
      
      if (!name) errors["名称"] = true
      if (!code) errors["编码"] = true
      if (!level) errors["级别"] = true
      if (!category) errors["分类"] = true
      
      // 当级别为二级时，必须选择一级分类
      if (level === "2" && !parentCategory) {
        errors["一级分类"] = true
      }

      // 记录表单数据
      console.log("验证步骤0的表单数据:", formData.basicInfo);
    } 
    else if (currentStep === 1) {
      // 验证预算信息
      const { budgetItems } = formData.budgetInfo as any
      
      if (!budgetItems || budgetItems.length === 0) {
        errors["预算项"] = true
      } else {
        // 验证每个预算项
        let hasInvalidItem = false
        budgetItems.forEach((item: any, index: number) => {
          if (!item.name || !item.code || !item.type || !item.limitAmount) {
            hasInvalidItem = true
          }
        })
        if (hasInvalidItem) {
          errors["预算项"] = true
        }
      }

      // 记录表单数据
      console.log("验证步骤1的表单数据:", formData.budgetInfo);
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
  
  // 更新项目分类
  const updateProjectCategory = async (categoryId: string, data: any) => {
    try {
      // 调用API更新项目分类
      const response = await put('/api/project/projectType/update', {
        id: categoryId,
        ...data.basicInfo,
        description: data.basicInfo.remarks,
        status: data.basicInfo.enabled ? "启用" : "停用",
        budgetInfo: data.budgetInfo,
      })
      
      if (response && response.code === 200) {
        // 显示成功对话框
        setShowSuccessDialog(true)
      } else {
        toast({
          title: "更新失败",
          description: response?.message || "更新项目分类失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("更新项目分类失败:", error)
      toast({
        title: "更新失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm 
            initialData={formData.basicInfo as any} 
            onSubmit={handleBasicInfoSubmit}
            isLoading={isLoading}
          />
        )
      case 1:
        return (
          <BudgetInfoForm 
            defaultValues={formData.budgetInfo as any}
            onBack={handlePrevious}
            onSubmit={handleBudgetInfoSubmit}
          />
        )
      case 2:
        return (
          <CompletionStep 
            formData={formData} 
            onComplete={handleComplete}
            onBack={handlePrevious}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/auxiliary?tab=projectCategory" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          编辑项目分类{categoryData?.name ? `: ${categoryData.name}` : ''}
        </h1>
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

          {/* 不要在第一步显示底部操作栏，因为BasicInfoForm组件内已有按钮 */}
          {currentStep !== 0 && currentStep !== 1 && currentStep !== 2 && (
            <CardFooter className="flex justify-between border-t border-muted/30 py-4">
              <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                保存草稿
              </Button>
              <Button onClick={handleNext}>
                下一步
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              更新成功
            </DialogTitle>
            <DialogDescription>
              项目分类已成功更新
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleReturnToList}>
              返回列表
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 