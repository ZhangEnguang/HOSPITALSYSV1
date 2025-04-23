"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save, ArrowLeft, CheckCircle } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { StepNavigation, STEPS } from "../../../create/sealType/components/step-navigation"
import BasicInfoForm, { BasicInfoFormValues } from "../../../create/sealType/components/basic-info-form"
import DetailInfoForm, { DetailInfoFormValues } from "../../../create/sealType/components/detail-info-form"
import { get, post, put } from "@/lib/api"

interface Props {
  params: {
    id: string
  }
}

export default function EditSealTypePage({ params }: Props) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    basic: {} as Partial<BasicInfoFormValues>,
    detail: {} as Partial<DetailInfoFormValues>,
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sealTypeData, setSealTypeData] = useState<any>(null)

  // 初始化时加载用章类型数据
  useEffect(() => {
    loadSealTypeData(id)
  }, [id])

  // 加载用章类型数据（演示数据）
  const loadSealTypeData = async (typeId: string) => {
    console.log("开始加载用章类型数据, ID:", typeId);
    setIsLoading(true)
    try {
      // 这里是模拟数据，实际项目中应该从API获取
      const mockData = {
        id: typeId,
        name: "财务专用章",
        code: "ST-2023-008",
        businessCategory: "finance",  // 财务类
        businessType: "报销凭证",
        sealType: "财务专用章",
        status: "启用",
        description: "用于财务报销和费用审批的专用印章",
        createdAt: "2023-08-20",
        type: "seal",
        applicableScenarios: ["financial", "certificate"],
        approvalRequired: true,
        approvalLevel: "department",
        validityPeriod: 30,
        maxUsageCount: 1,
        restrictDepartments: true,
        allowedDepartments: ["finance", "hr"],
        usageNotes: "仅限财务处使用，需附带有效财务凭证"
      }

      setSealTypeData(mockData)
        
      // 预填充基本信息
      const basic = {
        name: mockData.name || "",
        code: mockData.code || "",
        category: mockData.businessCategory || "",
        status: mockData.status === "启用" ? "active" as const : "inactive" as const,
        description: mockData.description || "",
      }
        
      // 预填充详细信息
      const detail = {
        applicableScenarios: mockData.applicableScenarios || [],
        approvalRequired: mockData.approvalRequired !== undefined ? mockData.approvalRequired : true,
        approvalLevel: mockData.approvalLevel || "",
        validityPeriod: mockData.validityPeriod || 30,
        maxUsageCount: mockData.maxUsageCount || 1,
        restrictDepartments: mockData.restrictDepartments !== undefined ? mockData.restrictDepartments : false,
        allowedDepartments: mockData.allowedDepartments || [],
        usageNotes: mockData.usageNotes || "",
      }
        
      // 更新表单数据
      setFormData({
        basic,
        detail,
      })
        
      // 标记步骤已完成
      setCompletedSteps([0])
        
      toast({
        title: "数据加载成功",
        description: "已加载用章类型数据",
      })
    } catch (error) {
      console.error("加载用章类型数据失败:", error)
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
        toast({
          title: "表单验证失败",
          description: "请填写所有必填项",
          variant: "destructive",
        })
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
    toast({
      title: "暂存成功",
      description: "用章类型已保存为草稿",
    })
    // 模拟保存后跳转
    setTimeout(() => {
      router.push("/auxiliary?tab=sealType")
    }, 1000)
  }

  // 完成更新
  const handleComplete = () => {
    if (validateCurrentStep()) {
      // 实际项目中应发送更新请求
      updateSealType(id, formData)
    } else {
      toast({
        title: "表单验证失败",
        description: "请填写所有必填项",
        variant: "destructive",
      })
    }
  }

  // 更新用章类型
  const updateSealType = async (typeId: string, data: any) => {
    setIsLoading(true)
    try {
      // 在实际项目中替换为实际API调用
      // const response = await put(`/api/auxiliary/sealType/${typeId}`, data)
      console.log(`模拟API调用: put /api/auxiliary/sealType/${typeId}`, data)
      
      // 模拟成功响应
      setTimeout(() => {
        setIsLoading(false)
        setShowSuccessDialog(true)
      }, 1000)
    } catch (error) {
      console.error("更新用章类型失败:", error)
      setIsLoading(false)
      toast({
        title: "更新失败",
        description: "无法更新用章类型，请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 继续添加
  const handleContinueAdd = () => {
    router.push("/auxiliary/create/sealType")
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/auxiliary?tab=sealType")
  }

  // 更新基本信息
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

  // 获取分类名称
  const getCategoryName = (code?: string) => {
    if (!code) return "未设置";
    
    const categories: Record<string, string> = {
      "contract": "合同类",
      "finance": "财务类",
      "official": "公文类",
      "certificate": "证明类",
      "other": "其他",
    };
    
    return categories[code] || code;
  }

  // 获取场景名称
  const getScenarioName = (code: string) => {
    const scenarios: Record<string, string> = {
      "contract": "合同签订",
      "financial": "财务报销",
      "certificate": "证明文件",
      "official": "公文处理",
      "invitation": "邀请函件",
      "application": "申请材料",
      "other": "其他场景",
    };
    
    return scenarios[code] || code;
  }

  // 获取审批级别名称
  const getApprovalLevelName = (code: string) => {
    const levels: Record<string, string> = {
      "department": "部门审批",
      "school": "学院审批",
      "university": "学校审批",
    };
    
    return levels[code] || code;
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
            onClick={handleNextStep}
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
            onClick={handlePrevStep}
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
            onClick={handleNextStep}
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
            onClick={handlePrevStep}
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
        <Link href="/auxiliary?tab=sealType" className="mr-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight">编辑用章类型</h2>
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
              用章类型信息已成功更新。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button onClick={handleContinueAdd}>
              创建新用章类型
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