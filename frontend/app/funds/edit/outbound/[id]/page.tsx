"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, ChevronRight, ChevronLeft, Upload, Trash2 } from "lucide-react"
import { format } from "date-fns"

// 导入步骤导航组件
import { StepNavigation, STEPS } from "../../../create/outbound/components/step-navigation"

// 导入各步骤组件
import { StepBasicInfo } from "../../../create/outbound/components/form-steps/step-basic-info"
import { StepProjectInfo } from "../../../create/outbound/components/form-steps/step-project-info"
import { StepAmountInfo } from "../../../create/outbound/components/form-steps/step-amount-info"
import { StepAttachment } from "../../../create/outbound/components/form-steps/step-attachment"
import { StepApplicant } from "../../../create/outbound/components/form-steps/step-applicant"

export default function EditOutboundPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1, 2, 3])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date("2023-09-18"))
  const [files, setFiles] = useState<File[]>([
    new File([""], "合作协议.pdf", { type: "application/pdf" }),
    new File([""], "经费外拨申请表.pdf", { type: "application/pdf" }),
  ])
  
  // 模拟项目数据
  const projects = [
    { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
    { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
    { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
    { id: "4", name: "高校创新创业教育体系构建研究" },
    { id: "5", name: "智慧校园综合管理平台开发" },
  ]

  // 经费外拨类别
  const categories = ["合作单位外拨", "设备采购", "材料采购", "劳务费", "其他外拨"]

  // 收款单位
  const recipients = ["北京理工大学", "某科学仪器有限公司", "某材料科技有限公司", "某研究所"]

  // 开户银行
  const banks = ["中国建设银行", "中国工商银行", "中国农业银行", "中国银行"]
  
  // 添加完整的演示数据
  const [formData, setFormData] = useState({
    // 基本信息
    name: "合作单位经费外拨",
    description: "向合作单位北京理工大学外拨联合研发经费",
    date: "2023-09-18",
    
    // 项目与类别信息
    projectId: "2",
    category: "合作单位外拨",
    
    // 金额与收款信息
    amount: "80000",
    recipient: "北京理工大学",
    recipientAccount: "9876543210123456789",
    recipientBank: "中国建设银行",
    contract: "BIT-2023-001",
    paymentMethod: "银行转账",
    paymentNote: "按季度分批次支付",
    
    // 其他信息
    status: "待审核",
    applicant: "张三",
    departmentApproval: "已批准",
    financeApproval: "待审核"
  })
  
  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 验证当前步骤
    validateCurrentStep(currentStep, {
      ...formData,
      [field]: value
    })
  }
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  }
  
  // 处理选择变化
  const handleSelectChange = (name: string, value: string) => {
    updateFormData(name, value);
  }
  
  // 处理日期选择
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateFormData('date', format(selectedDate, 'yyyy-MM-dd'));
    }
  }
  
  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  }
  
  // 处理文件删除
  const removeFile = (index: number) => {
    setFiles(files => files.filter((_, i) => i !== index))
  }
  
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
  
  // 切换到下一步
  const nextStep = () => {
    // 验证当前步骤
    if (!validateCurrentStep(currentStep)) {
      toast({
        title: "信息不完整",
        description: "请填写所有必填字段",
        variant: "destructive"
      })
      return
    }
    
    // 标记当前步骤为已完成
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }
    
    // 切换到下一步
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }
  
  // 切换到上一步
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }
  
  // 切换到指定步骤
  const goToStep = (step: number) => {
    // 编辑模式下允许自由切换步骤
    setCurrentStep(step)
    window.scrollTo(0, 0)
  }
  
  // 保存草稿
  const saveDraft = () => {
    toast({
      title: "更新已保存",
      description: "您的经费外拨信息更新已保存"
    })
  }
  
  // 提交表单
  const handleSubmit = () => {
    // 验证所有步骤
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validateCurrentStep(i)) {
        toast({
          title: "信息不完整",
          description: `请完成${STEPS[i].name}中的必填字段`,
          variant: "destructive"
        })
        setCurrentStep(i)
        return
      }
    }
    
    // 开始提交
    setIsSubmitting(true)
    
    // 模拟提交过程
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // 提交成功后显示提示
      toast({
        title: "更新成功",
        description: "经费外拨信息已成功更新"
      })
      
      // 3秒后返回列表页
      setTimeout(() => {
        router.push("/funds")
      }, 3000)
    }, 2000)
  }

  return (
    <div className="w-full py-6 bg-[#f5f7fa] min-h-screen px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">编辑经费外拨</h1>
      </div>

      {/* 步骤导航 */}
      <div className="mb-6">
        <StepNavigation
          currentStep={currentStep}
          goToStep={goToStep}
          validationErrors={validationErrors}
          completedSteps={completedSteps}
        />
      </div>

      {/* 步骤内容 */}
      <div className="mb-6">
        {currentStep === 0 && (
          <Card className="p-6 shadow-sm bg-white">
            <StepBasicInfo 
              formData={formData} 
              date={date}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              handleDateSelect={handleDateSelect}
            />
          </Card>
        )}
        
        {currentStep === 1 && (
          <Card className="p-6 shadow-sm bg-white">
            <StepProjectInfo 
              formData={formData} 
              validationErrors={validationErrors}
              handleSelectChange={handleSelectChange}
              projects={projects}
              categories={categories}
            />
          </Card>
        )}
        
        {currentStep === 2 && (
          <Card className="p-6 shadow-sm bg-white">
            <StepAmountInfo 
              formData={formData} 
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              recipients={recipients}
              banks={banks}
            />
          </Card>
        )}
        
        {currentStep === 3 && (
          <Card className="p-6 shadow-sm bg-white">
            <StepAttachment 
              files={files}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
            />
          </Card>
        )}
        
        {currentStep === 4 && (
          <Card className="p-6 shadow-sm bg-white">
            <StepApplicant 
              formData={formData}
              files={files}
              isEditMode={true}
            />
          </Card>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={saveDraft}>
          <Save className="h-4 w-4 mr-2" />
          保存更新
        </Button>
        
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              上一步
            </Button>
          )}
          
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              下一步
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || isSubmitted}>
              {isSubmitting ? "更新中..." : "完成更新"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 