"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2, Save, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { StepNavigation, STEPS } from "./components/step-navigation"

// 默认评分标准模板，与评分页面保持一致
const defaultCriteria = [
  {
    id: "workQuality",
    name: "工作质量",
    description: "完成工作的准确性、完整性和质量",
    maxScore: 25,
  },
  {
    id: "workEfficiency",
    name: "工作效率",
    description: "完成工作的速度和资源利用效率",
    maxScore: 20,
  },
  {
    id: "teamwork",
    name: "团队协作",
    description: "与团队成员的合作能力和沟通效果",
    maxScore: 15,
  },
  {
    id: "innovation",
    name: "创新能力",
    description: "提出和实施新想法的能力",
    maxScore: 15,
  },
  {
    id: "responsibility",
    name: "责任心",
    description: "对工作的责任感和主动性",
    maxScore: 15,
  },
  {
    id: "attendance",
    name: "出勤情况",
    description: "工作出勤率和准时性",
    maxScore: 10,
  },
]

// 部门选项
const departmentOptions = [
  { value: "研发部", label: "研发部" },
  { value: "市场部", label: "市场部" },
  { value: "人力资源部", label: "人力资源部" },
  { value: "财务部", label: "财务部" },
  { value: "运营部", label: "运营部" },
  { value: "全公司", label: "全公司" },
]

export default function NewStandardPage() {
  const router = useRouter()
  const { toast } = useToast()

  // 状态
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [standardName, setStandardName] = useState<string>("")
  const [standardDescription, setStandardDescription] = useState<string>("")
  const [department, setDepartment] = useState<string>("全公司")
  const [criteria, setCriteria] = useState([...defaultCriteria])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [applicableType, setApplicableType] = useState<"个人考核" | "部门考核">("个人考核")

  // 计算总分
  const totalMaxScore = criteria.reduce((sum, item) => sum + item.maxScore, 0)

  // 处理标准名称变化
  const handleStandardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStandardName(e.target.value)
    if (validationErrors.standardName && e.target.value.trim()) {
      const newErrors = { ...validationErrors }
      delete newErrors.standardName
      setValidationErrors(newErrors)
    }
  }

  // 处理标准描述变化
  const handleStandardDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStandardDescription(e.target.value)
  }

  // 处理部门变化
  const handleDepartmentChange = (value: string) => {
    setDepartment(value)
  }

  // 处理评分项名称变化
  const handleCriteriaNameChange = (index: number, value: string) => {
    const newCriteria = [...criteria]
    newCriteria[index].name = value
    setCriteria(newCriteria)
    
    // 清除验证错误
    if (validationErrors.criteria) {
      let allValid = true
      for (let i = 0; i < newCriteria.length; i++) {
        if (!newCriteria[i].name.trim() || newCriteria[i].maxScore <= 0) {
          allValid = false
          break
        }
      }
      if (allValid) {
        const newErrors = { ...validationErrors }
        delete newErrors.criteria
        setValidationErrors(newErrors)
      }
    }
  }

  // 处理评分项描述变化
  const handleCriteriaDescriptionChange = (index: number, value: string) => {
    const newCriteria = [...criteria]
    newCriteria[index].description = value
    setCriteria(newCriteria)
  }

  // 处理评分项最大分值变化
  const handleCriteriaMaxScoreChange = (index: number, value: string) => {
    const newCriteria = [...criteria]
    newCriteria[index].maxScore = Number.parseInt(value) || 0
    setCriteria(newCriteria)
    
    // 清除验证错误
    if (validationErrors.criteria) {
      let allValid = true
      for (let i = 0; i < newCriteria.length; i++) {
        if (!newCriteria[i].name.trim() || newCriteria[i].maxScore <= 0) {
          allValid = false
          break
        }
      }
      if (allValid) {
        const newErrors = { ...validationErrors }
        delete newErrors.criteria
        setValidationErrors(newErrors)
      }
    }
    
    // 清除总分验证错误
    if (validationErrors.totalMaxScore) {
      const newTotal = newCriteria.reduce((sum, item) => sum + item.maxScore, 0)
      if (newTotal === 100) {
        const newErrors = { ...validationErrors }
        delete newErrors.totalMaxScore
        setValidationErrors(newErrors)
      }
    }
  }

  // 添加新的评分项
  const handleAddCriteria = () => {
    const newId = `criteria_${Date.now()}`
    setCriteria([
      ...criteria,
      {
        id: newId,
        name: "",
        description: "",
        maxScore: 10,
      },
    ])
  }

  // 删除评分项
  const handleRemoveCriteria = (index: number) => {
    const newCriteria = [...criteria]
    newCriteria.splice(index, 1)
    setCriteria(newCriteria)
    
    // 更新总分验证错误
    if (validationErrors.totalMaxScore) {
      const newTotal = newCriteria.reduce((sum, item) => sum + item.maxScore, 0)
      if (newTotal === 100) {
        const newErrors = { ...validationErrors }
        delete newErrors.totalMaxScore
        setValidationErrors(newErrors)
      }
    }
  }

  // 表单验证
  const validateForm = (step: number) => {
    const errors: Record<string, boolean> = {}

    // 验证第1步
    if (step === 0) {
      if (!standardName.trim()) {
        errors.standardName = true
      }
    }

    // 验证第2步
    if (step === 1) {
      // 验证每个评分项
      for (let i = 0; i < criteria.length; i++) {
        if (!criteria[i].name.trim() || criteria[i].maxScore <= 0) {
          errors.criteria = true
          break
        }
      }
      
      // 验证总分是否为100
      if (totalMaxScore !== 100) {
        errors.totalMaxScore = true
      }
    }

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return false
    }

    // 如果验证通过，将当前步骤添加到已完成步骤中
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step])
    }

    return true
  }

  // 步骤导航函数
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // 验证当前步骤
      if (validateForm(currentStep)) {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      // 如果向前移动，验证当前步骤
      if (stepIndex > currentStep) {
        if (validateForm(currentStep)) {
          setCurrentStep(stepIndex)
        }
      } else {
        setCurrentStep(stepIndex)
      }
    }
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm(currentStep)) {
      return
    }

    setIsSubmitting(true)

    // 构建提交数据
    const standardData = {
      name: standardName,
      description: standardDescription,
      department: department,
      criteria: criteria,
      applicableType: applicableType,
      totalScore: totalMaxScore,
      completionRate: 100, // 默认完成度为100%
      createdBy: "系统管理员",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("提交考核标准数据:", standardData)

    // 模拟API调用
    setTimeout(() => {
      setIsSubmitting(false)
      setIsCompleted(true)
      
      // 显示完成步骤
      setCurrentStep(3)
      
      // 显示成功提示
      toast({
        title: "考核标准创建成功",
        description: `已创建考核标准: ${standardName}`,
      })
      
      // 延迟跳转
      setTimeout(() => {
        router.push("/rewards")
      }, 2000)
    }, 1000)
  }

  // 取消
  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleCancel} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">创建考核标准</h1>
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

      {/* 表单内容 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-muted/50 overflow-hidden">
          <CardContent className="pt-6">
            {/* 步骤1：基本信息 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="standard-name" className="text-sm font-medium">标准名称 <span className="text-red-500">*</span></Label>
                    <Input
                      id="standard-name"
                      placeholder="请输入考核标准名称"
                      value={standardName}
                      onChange={handleStandardNameChange}
                      className={validationErrors.standardName ? 'border-destructive' : ''}
                    />
                    {validationErrors.standardName && (
                      <p className="text-xs text-destructive mt-1">请输入考核标准名称</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standard-description" className="text-sm font-medium">标准描述</Label>
                    <Textarea
                      id="standard-description"
                      placeholder="请输入考核标准描述"
                      value={standardDescription}
                      onChange={handleStandardDescriptionChange}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">适用部门</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {departmentOptions.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={department === option.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => handleDepartmentChange(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicable-type" className="text-sm font-medium">适用类型 <span className="text-red-500">*</span></Label>
                    <RadioGroup
                      value={applicableType}
                      onValueChange={(value) => setApplicableType(value as "个人考核" | "部门考核")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="个人考核" id="personal" />
                        <Label htmlFor="personal" className="cursor-pointer">个人考核</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="部门考核" id="department" />
                        <Label htmlFor="department" className="cursor-pointer">部门考核</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* 步骤2：评分标准 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">设置考核的评分项目和分值</div>
                  <div className={`text-sm font-medium ${totalMaxScore === 100 ? "text-green-600" : "text-red-600"}`}>
                    总分: {totalMaxScore}/100
                  </div>
                </div>
                
                {validationErrors.totalMaxScore && (
                  <p className="text-xs text-destructive mb-4">所有评分项的最大分值总和必须为100分</p>
                )}
                
                {validationErrors.criteria && (
                  <p className="text-xs text-destructive mb-4">请确保所有评分项都有名称且最大分值大于0</p>
                )}
                
                <div className="space-y-6">
                  {criteria.map((item, index) => (
                    <div key={item.id} className="space-y-4 pb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">评分项 #{index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCriteria(index)}
                          disabled={criteria.length <= 1}
                        >
                          <Trash2 className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`criteria-name-${index}`} className="text-sm font-medium">名称 <span className="text-red-500">*</span></Label>
                          <Input
                            id={`criteria-name-${index}`}
                            placeholder="评分项名称"
                            value={item.name}
                            onChange={(e) => handleCriteriaNameChange(index, e.target.value)}
                            className={validationErrors.criteria && !item.name.trim() ? 'border-destructive' : ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`criteria-max-score-${index}`} className="text-sm font-medium">最大分值 <span className="text-red-500">*</span></Label>
                          <Input
                            id={`criteria-max-score-${index}`}
                            type="number"
                            min="1"
                            max="100"
                            placeholder="最大分值"
                            value={item.maxScore}
                            onChange={(e) => handleCriteriaMaxScoreChange(index, e.target.value)}
                            className={validationErrors.criteria && item.maxScore <= 0 ? 'border-destructive' : ''}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`criteria-description-${index}`} className="text-sm font-medium">描述</Label>
                          <Textarea
                            id={`criteria-description-${index}`}
                            placeholder="评分项描述"
                            value={item.description}
                            onChange={(e) => handleCriteriaDescriptionChange(index, e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                      {index < criteria.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}

                  <Button variant="outline" className="w-full" onClick={handleAddCriteria}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加评分项
                  </Button>
                </div>
              </div>
            )}

            {/* 步骤3：确认信息 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid gap-4 border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">标准名称</h3>
                      <p className="text-base">{standardName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">适用部门</h3>
                      <p className="text-base">{department}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">适用类型</h3>
                      <p className="text-base">{applicableType}</p>
                    </div>
                    {standardDescription && (
                      <div className="col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground">标准描述</h3>
                        <p className="text-sm">{standardDescription}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">评分标准</h3>
                    <div className="grid gap-2">
                      {criteria.map((item, index) => (
                        <div key={item.id} className="border rounded-md p-3">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{item.name}</h4>
                            <span className="text-sm font-medium">{item.maxScore}分</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">总分</h3>
                    <div className="text-lg font-bold">{totalMaxScore}分</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 步骤4：完成 */}
            {currentStep === 3 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">考核标准创建成功</h2>
                <p className="text-muted-foreground mb-6">考核标准已成功创建，即将返回考核管理页面</p>
                <div className="animate-pulse bg-muted h-1 w-24 rounded-full"></div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <div>
              {currentStep < 3 && (
                <Button variant="outline" onClick={handleCancel}>
                  取消
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && currentStep < 3 && (
                <Button variant="outline" onClick={goToPrevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}

              {currentStep < 2 ? (
                <Button onClick={goToNextStep}>
                  下一步
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : currentStep === 2 ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-primary-foreground border-r-transparent"></div>
                      提交中...
                    </>
                  ) : (
                    <>
                      提交考核标准
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
