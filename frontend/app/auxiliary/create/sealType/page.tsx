"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { StepNavigation, STEPS } from "./components/step-navigation"
import BasicInfoForm, { BasicInfoFormValues } from "./components/basic-info-form"
import DetailInfoForm, { DetailInfoFormValues } from "./components/detail-info-form"

export default function CreateSealTypePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    basic: {} as Partial<BasicInfoFormValues>,
    detail: {} as Partial<DetailInfoFormValues>,
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // 处理下一步
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // 验证当前步骤
      if (validateCurrentStep()) {
        // 如果当前步骤验证通过，则将其标记为已完成
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep])
        }
        setCurrentStep(currentStep + 1)
      } else {
        // 显示验证错误提示
        toast.error("请填写所有必填项")
      }
    }
  }

  // 处理上一步
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 保存草稿
  const handleSaveDraft = () => {
    toast.success("用章类型已保存为草稿")
    // 模拟保存后跳转
    setTimeout(() => {
      router.push("/auxiliary?tab=sealType")
    }, 1000)
  }

  // 完成创建
  const handleComplete = () => {
    if (validateCurrentStep()) {
      // 模拟API请求
      setShowSuccessDialog(true)
    } else {
      toast.error("请填写所有必填项")
    }
  }

  // 继续添加
  const handleContinueAdd = () => {
    // 重置表单数据和步骤
    setFormData({
      basic: {} as Partial<BasicInfoFormValues>,
      detail: {} as Partial<DetailInfoFormValues>,
    })
    setCurrentStep(0)
    setCompletedSteps([])
    setShowSuccessDialog(false)
    setValidationErrors({})
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/auxiliary?tab=sealType")
  }

  // 更新表单数据
  const handleBasicInfoUpdate = (data: BasicInfoFormValues) => {
    setFormData(prev => ({
      ...prev,
      basic: data
    }))

    // 验证表单
    try {
      // 如果验证通过，清除错误
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors['基本信息']
        return newErrors
      })
    } catch (error) {
      // 如果验证失败，设置错误
      setValidationErrors(prev => ({
        ...prev,
        '基本信息': true
      }))
    }
  }

  // 更新详细信息
  const handleDetailInfoUpdate = (data: DetailInfoFormValues) => {
    setFormData(prev => ({
      ...prev,
      detail: data
    }))

    // 验证表单
    try {
      // 如果验证通过，清除错误
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors['详细信息']
        return newErrors
      })
    } catch (error) {
      // 如果验证失败，设置错误
      setValidationErrors(prev => ({
        ...prev,
        '详细信息': true
      }))
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { name, code, category } = formData.basic
      
      if (!name) errors["名称"] = true
      if (!code) errors["编码"] = true
      if (!category) errors["业务分类"] = true
    } 
    else if (currentStep === 1) {
      // 验证详细信息
      const { applicableScenarios } = formData.detail
      
      if (!applicableScenarios || applicableScenarios.length === 0) {
        errors["适用场景"] = true
      }
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

  // 渲染当前步骤的内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm 
            data={formData.basic} 
            onUpdate={handleBasicInfoUpdate}
          />
        )
      case 1:
        return (
          <DetailInfoForm 
            data={formData.detail} 
            onUpdate={handleDetailInfoUpdate}
          />
        )
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">基本信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">用章类型名称</p>
                  <p className="mt-1">{formData.basic.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">类型代码</p>
                  <p className="mt-1">{formData.basic.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">业务分类</p>
                  <p className="mt-1">{getCategoryName(formData.basic.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">状态</p>
                  <p className="mt-1">{formData.basic.status === 'active' ? '启用' : '禁用'}</p>
                </div>
              </div>
              {formData.basic.description && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">描述</p>
                  <p className="mt-1">{formData.basic.description}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">详细信息</h3>
              <div>
                <p className="text-sm text-gray-500">适用场景</p>
                <p className="mt-1">{
                  (formData.detail.applicableScenarios || []).map(id => 
                    getScenarioName(id)
                  ).join(', ')
                }</p>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500">需要审批</p>
                <p className="mt-1">{formData.detail.approvalRequired ? '是' : '否'}</p>
              </div>
              {formData.detail.approvalRequired && formData.detail.approvalLevel && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">审批级别</p>
                  <p className="mt-1">{getApprovalLevelName(formData.detail.approvalLevel)}</p>
                </div>
              )}
              {formData.detail.usageNotes && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">使用说明</p>
                  <p className="mt-1">{formData.detail.usageNotes}</p>
                </div>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // 获取业务分类的中文名称
  const getCategoryName = (code?: string) => {
    if (!code) return '';
    
    const categoryMap: Record<string, string> = {
      'contract': '合同类',
      'finance': '财务类',
      'official': '公文类',
      'certificate': '证明类',
      'other': '其他'
    };
    
    return categoryMap[code] || code;
  }
  
  // 获取场景的中文名称
  const getScenarioName = (code: string) => {
    const scenarioMap: Record<string, string> = {
      'contract': '合同签订',
      'financial': '财务报销',
      'certificate': '证明文件',
      'official': '公文处理',
      'invitation': '邀请函件',
      'application': '申请材料',
      'other': '其他场景'
    };
    
    return scenarioMap[code] || code;
  }
  
  // 获取审批级别的中文名称
  const getApprovalLevelName = (code: string) => {
    const levelMap: Record<string, string> = {
      'department': '部门审批',
      'school': '学院审批',
      'university': '学校审批'
    };
    
    return levelMap[code] || code;
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/auxiliary?tab=sealType" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">新增用章类型</h1>
      </div>

      <div className="mx-8 mb-6">
        <StepNavigation 
          currentStep={currentStep} 
          goToStep={goToStep} 
          completedSteps={completedSteps} 
          validationErrors={validationErrors}
        />
      </div>

      <div className="mx-8 mb-6">
        <Card className="border-muted/50 overflow-hidden">
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存草稿
            </Button>
            <div className="space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNextStep}>
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
      </div>

      {/* 提交成功弹框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              提交成功
            </DialogTitle>
            <DialogDescription>
              用章类型已成功创建，您可以继续添加新的用章类型或返回列表查看。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="outline" onClick={handleContinueAdd}>
              继续添加
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