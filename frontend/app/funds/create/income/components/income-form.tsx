"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Save, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

import { INCOME_STEPS, StepNavigation } from "./step-navigation"

// 模拟项目数据
const projects = [
  { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
  { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
  { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
  { id: "4", name: "高校创新创业教育体系构建研究" },
  { id: "5", name: "智慧校园综合管理平台开发" },
]

// 经费入账类别
const categories = ["纵向项目经费", "横向项目经费", "学校配套经费", "其他经费"]

// 经费来源
const sources = ["国家自然科学基金委员会", "省科技厅", "教育部", "某企业", "学校科研基金"]

export function IncomeForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [files, setFiles] = useState<File[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const isEditMode = initialData?.isEditMode || false
  
  // 初始化表单数据
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    projectId: initialData?.projectId || "",
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    source: initialData?.source || "",
    accountNumber: initialData?.accountNumber || "",
    budgetAllocation: initialData?.budgetAllocation || "",
    date: initialData?.date || "",
  })

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除验证错误
    if (validationErrors[field]) {
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
      if (!formData.name) errors["入账名称"] = true
      if (!formData.date) errors["入账日期"] = true
    } else if (step === 1) {
      if (!formData.projectId) errors["所属项目"] = true
      if (!formData.category) errors["入账类别"] = true
    } else if (step === 2) {
      if (!formData.amount) errors["入账金额"] = true
      if (!formData.source) errors["经费来源"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 下一步
  const handleNextStep = () => {
    if (currentStep < INCOME_STEPS.length - 1) {
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
      title: "草稿已保存",
      description: "您的经费入账信息已保存为草稿"
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

  // 继续添加
  const handleContinueAdding = () => {
    // 重置表单
    setFormData({
      name: "",
      description: "",
      projectId: "",
      category: "",
      amount: "",
      source: "",
      accountNumber: "",
      budgetAllocation: "",
      date: "",
    })
    setFiles([])
    setCurrentStep(0)
    setCompletedSteps([])
    setShowCompletionDialog(false)
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/funds")
  }

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{INCOME_STEPS[currentStep].name}</h3>
            <p className="text-gray-500">
              {isEditMode ? "编辑经费入账" : "新增经费入账"} - 基本信息
            </p>
            <div className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">入账名称 <span className="text-red-500">*</span></label>
                  <input 
                    id="name" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="date" className="text-right">入账日期 <span className="text-red-500">*</span></label>
                  <input 
                    id="date" 
                    type="date" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    value={formData.date}
                    onChange={(e) => updateFormData("date", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right">描述</label>
                  <textarea 
                    id="description" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{INCOME_STEPS[currentStep].name}</h3>
            <p className="text-gray-500">
              {isEditMode ? "编辑经费入账" : "新增经费入账"} - 项目信息
            </p>
            <div className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="projectId" className="text-right">所属项目 <span className="text-red-500">*</span></label>
                  <select 
                    id="projectId" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    value={formData.projectId}
                    onChange={(e) => updateFormData("projectId", e.target.value)}
                  >
                    <option value="">请选择项目</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="category" className="text-right">入账类别 <span className="text-red-500">*</span></label>
                  <select 
                    id="category" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    value={formData.category}
                    onChange={(e) => updateFormData("category", e.target.value)}
                  >
                    <option value="">请选择类别</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{INCOME_STEPS[currentStep].name}</h3>
            <p className="text-gray-500">
              {isEditMode ? "编辑经费入账" : "新增经费入账"} - 金额信息
            </p>
            <div className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="amount" className="text-right">入账金额 <span className="text-red-500">*</span></label>
                  <input 
                    id="amount" 
                    type="number" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    value={formData.amount}
                    onChange={(e) => updateFormData("amount", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="source" className="text-right">经费来源 <span className="text-red-500">*</span></label>
                  <select 
                    id="source" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    value={formData.source}
                    onChange={(e) => updateFormData("source", e.target.value)}
                  >
                    <option value="">请选择来源</option>
                    {sources.map((source, index) => (
                      <option key={index} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="accountNumber" className="text-right">账号</label>
                  <input 
                    id="accountNumber" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData("accountNumber", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="budgetAllocation" className="text-right">预算分配</label>
                  <textarea 
                    id="budgetAllocation" 
                    className="col-span-3 px-3 py-2 border rounded-md" 
                    rows={3}
                    value={formData.budgetAllocation}
                    onChange={(e) => updateFormData("budgetAllocation", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{INCOME_STEPS[currentStep].name}</h3>
            <p className="text-gray-500">
              {isEditMode ? "编辑经费入账" : "新增经费入账"} - 附件上传
            </p>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <p className="text-gray-500 mb-4">拖拽文件到此处或点击上传</p>
              <Button variant="outline">选择文件</Button>
              <p className="text-xs text-gray-400 mt-2">支持的文件格式：PDF, DOC, JPG, PNG</p>
            </div>
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">已上传文件：</h4>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{file.name}</span>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{INCOME_STEPS[currentStep].name}</h3>
            <p className="text-gray-500">
              {isEditMode ? "编辑经费入账" : "新增经费入账"} - 请确认以下信息
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-4 border-b pb-2">基本信息</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">入账名称</p>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">入账日期</p>
                  <p className="font-medium">{formData.date}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-gray-500 text-sm">描述</p>
                <p className="font-medium">{formData.description}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-4 border-b pb-2">项目信息</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">所属项目</p>
                  <p className="font-medium">
                    {projects.find(p => p.id === formData.projectId)?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">入账类别</p>
                  <p className="font-medium">{formData.category}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-4 border-b pb-2">金额信息</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">入账金额</p>
                  <p className="font-medium text-green-600">¥{Number(formData.amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">经费来源</p>
                  <p className="font-medium">{formData.source}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-gray-500 text-sm">账号</p>
                  <p className="font-medium">{formData.accountNumber || "-"}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-gray-500 text-sm">预算分配</p>
                <p className="font-medium">{formData.budgetAllocation || "-"}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  // 渲染底部按钮
  const renderButtons = () => {
    return (
      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={handleSaveDraft} className="mr-2">
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>
        </div>
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevStep}>
              上一步
            </Button>
          )}
          {currentStep < INCOME_STEPS.length - 1 ? (
            <Button onClick={handleNextStep} className="bg-blue-500 hover:bg-blue-600">
              下一步
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
              完成
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="form-container">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">{isEditMode ? "编辑经费入账" : "新增经费入账"}</h1>
        </div>

        <StepNavigation
          currentStep={currentStep}
          goToStep={goToStep}
          validationErrors={validationErrors}
          completedSteps={completedSteps}
        />

        <Card className="border shadow-sm mt-6">
          <CardContent className="p-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {renderStepContent()}
              <div className="pt-4 border-t">{renderButtons()}</div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "入账更新成功" : "入账申请提交成功"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "您的经费入账信息已成功更新，请选择后续操作" 
                : "您的经费入账申请已成功提交，请选择后续操作"
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" onClick={handleContinueAdding} className="w-full sm:w-auto">
              {isEditMode ? "继续编辑" : "继续添加"}
            </Button>
            <Button onClick={handleReturnToList} className="w-full sm:w-auto">
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 