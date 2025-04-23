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

import { StepNavigation, STEPS } from "../../../create/managementFeeScheme/components/step-navigation"
import BasicInfoForm from "../../../create/managementFeeScheme/components/basic-info-form"
import FeeItemsForm from "../../../create/managementFeeScheme/components/fee-items-form" 
import CompletionStep from "../../../create/managementFeeScheme/components/completion-step"

// 导入演示数据
import { allManagementFeeSchemes } from "../../../data/auxiliary-demo-data"

export default function EditManagementFeeSchemePage({ params }: { params: { id: string } }) {
  const schemeId = params.id;
  
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    basicInfo: {},
    feeItems: {},
  })
  const [initialFormData, setInitialFormData] = useState({
    basicInfo: {},
    feeItems: {},
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  // 获取方案数据
  useEffect(() => {
    // 在实际开发中，这里应该是从API获取数据
    // 模拟API请求延迟
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 从演示数据中获取方案信息
        const scheme = allManagementFeeSchemes.find(s => s.id === schemeId)
        
        if (!scheme) {
          toast({
            title: "未找到方案",
            description: "无法找到指定的管理费提取方案",
            variant: "destructive",
            duration: 3000,
          })
          router.push("/auxiliary?tab=managementFeeScheme")
          return
        }
        
        // 模拟完整的方案数据
        const schemeData = {
          basicInfo: {
            schemeName: scheme.name,
            schemeCode: "MGF-" + scheme.id,
            schemeType: scheme.applicableProjectCategory,
            description: scheme.description || "",
            status: scheme.status,
          },
          feeItems: {
            feeItemsList: [
              {
                id: "1",
                name: "横向项目管理费",
                rate: 8,
                isFixedAmount: false,
                amount: null,
                useType: "管理费",
                description: "用于支付学校横向项目管理成本"
              },
              {
                id: "2",
                name: "纵向项目间接费用",
                rate: 5,
                isFixedAmount: false,
                amount: null,
                useType: "管理费",
                description: "用于支付学校纵向项目管理成本"
              }
            ]
          }
        }
        
        // 设置初始表单数据
        setFormData(schemeData)
        setInitialFormData(schemeData)
        
        // 将所有步骤标记为已完成
        setCompletedSteps([0, 1])
      } catch (error) {
        console.error("获取方案数据出错:", error)
        toast({
          title: "数据加载失败",
          description: "无法加载方案数据，请重试",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [schemeId, router, toast])

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
      description: "管理费提取方案已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/auxiliary?tab=managementFeeScheme")
    }, 1000)
  }

  const handleComplete = () => {
    console.log("更新管理费提取方案", formData)
    // 实现提交逻辑
    setShowSuccessDialog(true)
  }

  const handleContinueEdit = () => {
    // 关闭成功对话框
    setShowSuccessDialog(false)
  }

  const handleReturnToList = () => {
    router.push("/auxiliary?tab=managementFeeScheme")
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
            newData.feeItems = data
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
        return formData.feeItems
      default:
        return {}
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { schemeName, schemeCode, schemeType } = formData.basicInfo as any
      
      if (!schemeName) errors["方案名称"] = true
      if (!schemeCode) errors["方案编码"] = true
      if (!schemeType) errors["方案类型"] = true
    } 
    else if (currentStep === 1) {
      // 验证经费方案科目信息
      const { feeItemsList } = formData.feeItems as any
      
      if (!feeItemsList || feeItemsList.length === 0) {
        errors["科目项"] = true
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
          <FeeItemsForm 
            data={formData.feeItems} 
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

  if (isLoading) {
    return (
      <div className="w-full py-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">正在加载方案数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/auxiliary?tab=managementFeeScheme" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">编辑管理费提取方案</h1>
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
                  保存更新
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* 成功对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>更新成功</DialogTitle>
            <DialogDescription>
              管理费提取方案已成功更新。
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center my-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={handleContinueEdit}>
              继续编辑
            </Button>
            <Button onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 