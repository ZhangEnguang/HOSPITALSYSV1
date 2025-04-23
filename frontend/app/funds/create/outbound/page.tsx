"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, Upload, Trash2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

import { StepNavigation, STEPS } from "./components/step-navigation"
import { StepBasicInfo } from "./components/form-steps/step-basic-info"
import { StepProjectInfo } from "./components/form-steps/step-project-info"
import { StepAmountInfo } from "./components/form-steps/step-amount-info"
import { StepAttachment } from "./components/form-steps/step-attachment"
import { StepApplicant } from "./components/form-steps/step-applicant"

function CreateOutboundPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const isEditMode = !!id
  
  const [date, setDate] = useState<Date | undefined>()
  const [files, setFiles] = useState<File[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectId: "",
    category: "",
    amount: "",
    recipient: "",
    recipientAccount: "",
    recipientBank: "",
    date: "",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // 模拟项目数据
  const projects = [
    { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
    { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
    { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
    { id: "4", name: "高校创新创业教育体系构建研究" },
    { id: "5", name: "智慧校园综合管理平台开发" },
  ]

  // 经费外拨类别
  const categories = ["合作经费", "设备采购", "材料采购", "劳务费", "其他外拨"]

  // 收款单位
  const recipients = ["某大学计算机学院", "某科学仪器有限公司", "某材料科技有限公司", "某研究所"]

  // 开户银行
  const banks = ["中国建设银行", "中国工商银行", "中国农业银行", "中国银行"]

  // 模拟获取数据的函数
  const fetchOutboundData = async (id: string) => {
    setIsLoading(true)
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 示例数据 - 实际应用中应该从API获取
      const mockData = {
        name: "设备采购款外拨",
        description: "新型高效光电转换材料项目设备采购款",
        projectId: "3",
        category: "设备采购",
        amount: "150000",
        recipient: "某科学仪器有限公司",
        recipientAccount: "6227123456789012",
        recipientBank: "中国建设银行",
        date: "2023-08-15",
      }
      
      // 设置表单数据
      setFormData(mockData)
      
      // 设置日期
      if (mockData.date) {
        const parsedDate = new Date(mockData.date)
        setDate(parsedDate)
      }
      
      // 模拟附件文件
      // 注意：在实际实现中，你需要从服务器下载这些文件
      // 这里只是创建一个空的File对象作为示例
      setFiles([
        new File([""], "设备采购清单.pdf", { type: "application/pdf" }),
        new File([""], "购销合同.pdf", { type: "application/pdf" }),
      ])
      
      // 设置所有步骤为已完成
      setCompletedSteps([0, 1, 2, 3])
      
    } catch (error) {
      console.error("获取数据失败:", error)
      toast({
        title: "获取数据失败",
        description: "无法加载经费外拨信息，请重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 在组件加载时，如果是编辑模式，则获取数据
  useEffect(() => {
    if (isEditMode && id) {
      fetchOutboundData(id)
    }
  }, [isEditMode, id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 当选择日期时更新表单数据
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prev) => ({ ...prev, date: formattedDate }));
    }
  };

  // 验证当前步骤
  const validateCurrentStep = (step: number, data = formData) => {
    const errors: Record<string, string> = {}
    
    if (step === 0) {
      // 验证基本信息
      if (!data.name) errors["name"] = "请输入外拨名称"
      if (!data.date) errors["date"] = "请选择外拨日期"
    } else if (step === 1) {
      // 验证项目信息
      if (!data.projectId) errors["projectId"] = "请选择关联项目"
      if (!data.category) errors["category"] = "请选择外拨类别"
    } else if (step === 2) {
      // 验证金额信息
      if (!data.amount) errors["amount"] = "请输入外拨金额"
      if (!data.recipient) errors["recipient"] = "请选择收款单位"
      if (!data.recipientAccount) errors["recipientAccount"] = "请输入收款账号"
      if (!data.recipientBank) errors["recipientBank"] = "请选择开户银行"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    setAttemptedSubmit(true)
    if (validateCurrentStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep])
        }
      }
      setAttemptedSubmit(false)
    } else {
      toast({
        title: "验证未通过",
        description: "请检查并填写必填项",
      })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setAttemptedSubmit(false)
    }
  }

  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      projectId: "",
      category: "",
      amount: "",
      recipient: "",
      recipientAccount: "",
      recipientBank: "",
      date: "",
    })
    setDate(undefined)
    setFiles([])
    setCurrentStep(0)
    setCompletedSteps([])
    setValidationErrors({})
    setShowDialog(false)
    setAttemptedSubmit(false)
    setIsFormSubmitted(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 验证所有步骤
    let isValid = true
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validateCurrentStep(i)) {
        isValid = false
        setCurrentStep(i)
        break
      }
    }

    if (isValid) {
      // 显示确认对话框
      setShowDialog(true)
    }
  }

  const handleConfirmSubmit = async () => {
    try {
      setIsLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 处理文件上传 - 在实际应用中，这里应该上传文件到服务器
      const fileNames = files.map(file => file.name)
      
      // 整合数据 - 在实际应用中，这里应该发送数据到API
      const submitData = {
        ...formData,
        files: fileNames,
      }
      
      console.log("提交数据:", submitData)
      
      setIsFormSubmitted(true)
      setShowDialog(false)
      
      toast({
        title: isEditMode ? "更新成功" : "提交成功",
        description: isEditMode ? "经费外拨信息已更新" : "经费外拨申请已提交",
      })
      
    } catch (error) {
      console.error("提交失败:", error)
      toast({
        title: "提交失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueAdd = () => {
    resetForm()
  }

  const handleReturnToList = () => {
    router.push("/funds")
  }

  // 渲染表单步骤
  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBasicInfo
            formData={formData}
            date={date}
            handleInputChange={handleInputChange}
            handleDateSelect={handleDateSelect}
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <StepProjectInfo
            formData={formData}
            projects={projects}
            categories={categories}
            handleSelectChange={handleSelectChange}
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <StepAmountInfo
            formData={formData}
            recipients={recipients}
            banks={banks}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            validationErrors={validationErrors}
          />
        )
      case 3:
        return (
          <StepAttachment
            files={files}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
          />
        )
      case 4:
        return <StepApplicant formData={formData} files={files} />
      default:
        return null
    }
  }

  // 如果表单已提交，显示成功界面
  if (isFormSubmitted) {
    return (
      <div className="container py-8 max-w-3xl">
        <Card className="border-green-100 shadow-md">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">提交成功</h2>
              <p className="text-gray-600 mt-2">
                {isEditMode ? "经费外拨信息已更新" : "经费外拨申请已提交"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-800 mb-2">申请信息摘要</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="col-span-2">
                  <dt className="text-gray-500">外拨名称</dt>
                  <dd className="font-medium">{formData.name}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">关联项目</dt>
                  <dd>{projects.find(p => p.id === formData.projectId)?.name || "-"}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">外拨金额</dt>
                  <dd className="font-medium text-green-600">￥{parseFloat(formData.amount).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">外拨类别</dt>
                  <dd>{formData.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">收款单位</dt>
                  <dd>{formData.recipient}</dd>
                </div>
              </dl>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleContinueAdd}>
              继续添加
            </Button>
            <Button onClick={handleReturnToList}>返回列表</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/funds")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{isEditMode ? "编辑经费外拨" : "新增经费外拨"}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <StepNavigation currentStep={currentStep} goToStep={goToStep} completedSteps={completedSteps} />

        <div className="mt-6 bg-white rounded-md border p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderFormStep()
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            上一步
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              下一步
            </Button>
          ) : (
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
              提交申请
            </Button>
          )}
        </div>
      </form>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认提交</AlertDialogTitle>
            <AlertDialogDescription>
              经费外拨申请一旦提交后，需要等待审批。您确定要提交此申请吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} disabled={isLoading}>
              {isLoading ? "提交中..." : "确认提交"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function CreateOutboundPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">加载中...</p>
      </div>
    </div>}>
      <CreateOutboundPageContent />
    </Suspense>
  )
}
