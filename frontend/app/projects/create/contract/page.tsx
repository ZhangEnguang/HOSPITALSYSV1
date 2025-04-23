"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle, Pencil } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { StepNavigation, STEPS } from "./components/step-navigation"
import BasicInfoForm from "./components/basic-info-form"
import SealInfoForm from "./components/seal-info-form"
import SupplierInfoForm from "./components/supplier-info-form"
import CompletionStep from "./components/completion-step"
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
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { nanoid } from "nanoid"
// 引入AIAnalysisPanel组件
import { AIAnalysisPanel } from "../../create/vertical/components/ai-analysis-panel"

// 添加类型定义
interface BasicInfoData {
  [key: string]: any;
}

interface SealInfoData {
  sealDocuments?: Array<{
    id: string;
    file: string;
    count: string;
    school: string;
    type: string;
  }>;
  [key: string]: any;
}

interface SupplierInfoData {
  [key: string]: any;
}

interface FormData {
  basicInfo: BasicInfoData;
  sealInfo: SealInfoData;
  supplierInfo: SupplierInfoData;
}

// 模拟出账合同分析结果数据
const contractMockAnalysisResult = {
  项目编号: "XM2025002",
  合同名称: "科研仪器设备采购合同",
  所属单位: "信息工程学院",
  负责人电话: "13912345678",
  合同金额: "85000",
  支付方式: "分期付款",
  供应商名称: "科技仪器设备有限公司",
  联系人: "张经理",
  联系电话: "18987654321",
  信用代码: "91110105MAXXXXX58X",
  供应商类型: "企业",
  开始日期: "2025-03-01",
  结束日期: "2025-12-31",
  签订日期: "2025-02-15",
  合同状态: "执行中",
  付款说明: "签订合同后支付40%，交付验收后支付60%",
  用印文件数量: "3",
  用印类型: "合同专用章",
  主要内容: "采购高性能计算设备及配套软件系统，用于深度学习模型训练与部署"
}

export default function ContractCreatePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    basicInfo: {},
    sealInfo: {},
    supplierInfo: {},
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  // 为AI面板添加状态
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [filledFields, setFilledFields] = useState<string[]>([])

  const router = useRouter()
  const { toast } = useToast()

  // 计算右侧面板宽度（展开时350px，收起时20px）
  const panelWidth = isPanelCollapsed ? 20 : 350
  
  // 处理AI填充单个字段
  const handleFillField = (field: string) => {
    if (contractMockAnalysisResult[field]) {
      // 根据当前步骤更新对应的表单数据
      const updatedFormData = { ...formData };
      
      if (currentStep === 0) {
        // 基本信息字段
        const basicFields = ["项目编号", "合同名称", "所属单位", "负责人电话", "合同金额", 
                            "支付方式", "开始日期", "结束日期", "签订日期", "合同状态", "主要内容"];
        if (basicFields.includes(field)) {
          updatedFormData.basicInfo = {
            ...updatedFormData.basicInfo,
            [field]: contractMockAnalysisResult[field]
          };
        }
      } else if (currentStep === 1) {
        // 用印信息字段
        const sealFields = ["用印文件数量", "用印类型"];
        if (sealFields.includes(field)) {
          updatedFormData.sealInfo = {
            ...updatedFormData.sealInfo,
            [field]: contractMockAnalysisResult[field]
          };
        }
      } else if (currentStep === 2) {
        // 供方信息字段
        const supplierFields = ["供应商名称", "联系人", "联系电话", "信用代码", "供应商类型"];
        if (supplierFields.includes(field)) {
          updatedFormData.supplierInfo = {
            ...updatedFormData.supplierInfo,
            [field]: contractMockAnalysisResult[field]
          };
        }
      }
      
      setFormData(updatedFormData);
      
      // 添加到已填充字段列表
      if (!filledFields.includes(field)) {
        setFilledFields([...filledFields, field]);
      }
      
      toast({
        title: "AI自动填充",
        description: `已成功填充"${field}"字段`,
        duration: 2000,
      })
    }
  }

  // 处理AI填充所有字段
  const handleFillAll = () => {
    const updatedFormData = { ...formData };
    const newFilledFields = [...filledFields];
    
    // 基本信息字段
    updatedFormData.basicInfo = {
      ...updatedFormData.basicInfo,
      项目编号: contractMockAnalysisResult.项目编号,
      合同名称: contractMockAnalysisResult.合同名称,
      所属单位: contractMockAnalysisResult.所属单位,
      负责人电话: contractMockAnalysisResult.负责人电话,
      合同金额: contractMockAnalysisResult.合同金额,
      支付方式: contractMockAnalysisResult.支付方式,
      开始日期: contractMockAnalysisResult.开始日期,
      结束日期: contractMockAnalysisResult.结束日期,
      签订日期: contractMockAnalysisResult.签订日期,
      合同状态: contractMockAnalysisResult.合同状态,
      主要内容: contractMockAnalysisResult.主要内容
    };
    
    // 用印信息字段
    updatedFormData.sealInfo = {
      ...updatedFormData.sealInfo,
      用印文件数量: contractMockAnalysisResult.用印文件数量,
      用印类型: contractMockAnalysisResult.用印类型
    };
    
    // 供方信息字段
    updatedFormData.supplierInfo = {
      ...updatedFormData.supplierInfo,
      供应商名称: contractMockAnalysisResult.供应商名称,
      联系人: contractMockAnalysisResult.联系人,
      联系电话: contractMockAnalysisResult.联系电话,
      信用代码: contractMockAnalysisResult.信用代码,
      供应商类型: contractMockAnalysisResult.供应商类型
    };
    
    // 更新表单数据
    setFormData(updatedFormData);
    
    // 更新已填充字段列表
    Object.keys(contractMockAnalysisResult).forEach(field => {
      if (!newFilledFields.includes(field)) {
        newFilledFields.push(field);
      }
    });
    
    setFilledFields(newFilledFields);
    
    toast({
      title: "AI自动填充",
      description: "已自动填充所有可用字段",
      duration: 3000,
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
      description: "合同信息已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/projects")
    }, 1000)
  }

  const handleComplete = () => {
    console.log("提交合同申请", formData)
    // 实现提交逻辑
    setShowSuccessDialog(true)
  }

  const handleContinueAdd = () => {
    // 重置表单数据和步骤
    setFormData({
      basicInfo: {},
      sealInfo: {},
      supplierInfo: {},
    })
    setCurrentStep(0)
    setCompletedSteps([])
    setShowSuccessDialog(false)
    setValidationErrors({})
  }

  const handleReturnToList = () => {
    router.push("/projects")
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
            newData.sealInfo = data
            break
          case 2:
            newData.supplierInfo = data
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
        return formData.sealInfo
      case 2:
        return formData.supplierInfo
      default:
        return {}
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { 
        projectName, 
        contractTitle, 
        contractAmount, 
        supplierPhone,
        department, 
        paymentMethod,
        startDate, 
        endDate, 
        signDate,
        contractStatus,
        contractFile
      } = formData.basicInfo as any
      
      if (!projectName) errors["项目名称"] = true
      if (!contractTitle) errors["合同标题"] = true
      if (!contractAmount) errors["合同金额"] = true
      if (!supplierPhone) errors["负责人电话"] = true
      if (!department) errors["所属部门"] = true
      if (!paymentMethod) errors["支付方式"] = true
      if (!startDate) errors["开始日期"] = true
      if (!endDate) errors["结束日期"] = true
      if (!signDate) errors["签订日期"] = true
      if (!contractStatus) errors["合同状态"] = true
      if (!contractFile) errors["合同电子版"] = true
    } 
    else if (currentStep === 1) {
      // 验证用章信息 - 只需检查是否有至少一个用章文档
      const { sealDocuments } = formData.sealInfo as any
      
      // 检查是否至少有一个用章文档
      if (!sealDocuments || !Array.isArray(sealDocuments) || sealDocuments.length === 0) {
        errors["用章文档"] = true
      }
    }
    else if (currentStep === 2) {
      // 验证供方信息
      const { 
        supplierName, 
        contactName, 
        supplierPhone, 
        supplierSocialCode,
        supplierType
      } = formData.supplierInfo as any
      
      if (!supplierName) errors["供应商名称"] = true
      if (!contactName) errors["联系人"] = true
      if (!supplierPhone) errors["联系电话"] = true
      if (!supplierSocialCode) errors["信用代码"] = true
      if (!supplierType) errors["供应商类型"] = true
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
            onUpdate={(data: BasicInfoData) => updateFormData(0, data)} 
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <SealInfoForm 
            data={formData.sealInfo} 
            onUpdate={(data: SealInfoData) => updateFormData(1, data)} 
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <SupplierInfoForm 
            data={formData.supplierInfo} 
            onUpdate={(data: SupplierInfoData) => updateFormData(2, data)} 
            validationErrors={validationErrors}
          />
        )
      case 3:
        return (
          <CompletionStep
            formData={formData}
            onSubmit={handleComplete}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="mx-auto py-6 w-full">
      <div className="px-8 mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 font-bold" />
          </Button>
          <div className="ml-2 flex-1">
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              创建出账合同
              <Pencil className="ml-2 h-4 w-4 text-muted-foreground" />
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              未分类 · 未设置周期 · 草稿
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ 
            width: '100%', 
            paddingRight: `${panelWidth + 22}px`, // 添加右侧内边距以适应面板宽度，额外增加22px间距
            transition: 'padding-right 0.3s ease-in-out' 
          }}
        >
          <StepNavigation 
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        </motion.div>
      </div>

      <div className="px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ 
            width: '100%', 
            paddingRight: `${panelWidth + 22}px`, // 添加右侧内边距以适应面板宽度，额外增加22px间距
            transition: 'padding-right 0.3s ease-in-out' 
          }}
        >
          <Card>
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
            <CardFooter className="px-6 py-4 flex justify-between border-t">
              <div>
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="mr-2"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> 上一步
                  </Button>
                )}
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" /> 保存草稿
                </Button>
              </div>
              <div>
                {currentStep < STEPS.length - 1 ? (
                  <Button onClick={handleNext}>
                    下一步 <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleComplete}>
                    提交 <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* 成功对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>提交成功</DialogTitle>
            <DialogDescription>
              合同信息已成功提交，请等待审批
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={handleContinueAdd}>
              继续新增
            </Button>
            <Button onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI 分析面板 */}
      <div
        className="fixed transition-all duration-300 right-0 top-[var(--header-height,104px)]"
        style={{ 
          height: "calc(100vh - var(--header-height, 104px))", 
          zIndex: 48,
          width: `${panelWidth}px`, // 根据状态动态设置宽度
          transition: 'width 0.3s ease-in-out'
        }}
      >
        <AIAnalysisPanel
          mockAnalysisResult={contractMockAnalysisResult}
          filledFields={filledFields}
          handleFillField={handleFillField}
          handleFillAll={handleFillAll}
          isPanelCollapsed={isPanelCollapsed}
          setIsPanelCollapsed={(collapsed) => setIsPanelCollapsed(collapsed)}
          defaultAnalysisMode={false}
        />
      </div>
    </div>
  )
} 