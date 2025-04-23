"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { StepNavigation, STEPS } from "./components/step-navigation"
import { assessmentStandards, AssessmentStandard } from "../../data/rewards-data"

// 模拟数据
const members = [
  { id: "1", name: "张三", department: "研发部", position: "前端开发" },
  { id: "2", name: "李四", department: "研发部", position: "后端开发" },
  { id: "3", name: "王五", department: "产品部", position: "产品经理" },
  { id: "4", name: "赵六", department: "设计部", position: "UI设计师" },
]

const periods = [
  { id: "1", name: "2025年第一季度" },
  { id: "2", name: "2025年第二季度" },
  { id: "3", name: "2025年第三季度" },
  { id: "4", name: "2025年第四季度" },
]

const projects = [
  { id: "1", name: "智能平台V10开发", role: "开发人员", progress: 75 },
  { id: "2", name: "数据分析系统", role: "测试人员", progress: 60 },
  { id: "3", name: "移动端APP开发", role: "项目负责人", progress: 40 },
  { id: "4", name: "客户管理系统", role: "开发人员", progress: 90 },
]

// 根据分数获取评价结果
const getResultFromScore = (score: number) => {
  if (score >= 90) return "优秀"
  if (score >= 80) return "良好"
  if (score >= 70) return "合格"
  if (score >= 60) return "基本合格"
  return "不合格"
}

export default function NewMemberEvaluationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // 步骤1：选择考核人员和周期
  const [selectedMember, setSelectedMember] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedStandard, setSelectedStandard] = useState("")

  // 步骤2：选择项目
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // 步骤3：评分
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})

  // 步骤4：确认信息
  const [finalComment, setFinalComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // 过滤出适用于个人考核的标准
  const personalStandards = assessmentStandards.filter(
    standard => !standard.applicableType || standard.applicableType === "个人考核"
  )

  // 获取当前选择的考核标准
  const currentStandard = selectedStandard 
    ? assessmentStandards.find(s => s.id === selectedStandard) 
    : null

  // 当选择新的考核标准时，重置评分
  useEffect(() => {
    if (selectedStandard && currentStandard) {
      // 重置评分
      setScores({})
      setComments({})
    }
  }, [selectedStandard])

  // 计算总分
  const calculateTotalScore = () => {
    if (!currentStandard) return 0
    
    let totalScore = 0
    let totalWeight = 0

    currentStandard.criteria.forEach((item) => {
      if (scores[item.id]) {
        totalScore += scores[item.id] * item.maxScore
        totalWeight += item.maxScore
      }
    })

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
  }

  // 表单验证
  const validateForm = (step: number) => {
    const errors: Record<string, boolean> = {}

    // 验证第1步
    if (step === 0) {
      if (!selectedMember) errors.selectedMember = true
      if (!selectedPeriod) errors.selectedPeriod = true
      if (!selectedStandard) errors.selectedStandard = true
    }

    // 验证第2步
    if (step === 1) {
      if (selectedProjects.length === 0) errors.selectedProjects = true
    }

    // 验证第3步
    if (step === 2 && currentStandard) {
      let allScored = true
      currentStandard.criteria.forEach((item) => {
        if (!scores[item.id]) {
          allScored = false
        }
      })
      if (!allScored) errors.scores = true
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

  // 处理提交
  const handleSubmit = () => {
    if (!validateForm(currentStep)) {
      return
    }

    setIsSubmitting(true)

    // 模拟提交
    setTimeout(() => {
      setIsSubmitting(false)
      setIsCompleted(true)
      
      // 显示完成步骤
      setCurrentStep(4)
      
      // 模拟提交成功后跳转
      setTimeout(() => {
        router.push("/rewards")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">创建成员考核</h1>
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
            {/* 步骤1：选择考核人员和周期 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="member" className="text-sm font-medium">人员姓名 <span className="text-red-500">*</span></Label>
                    <Select 
                      value={selectedMember} 
                      onValueChange={(value) => {
                        setSelectedMember(value)
                        // 清除验证错误
                        if (validationErrors.selectedMember) {
                          const newErrors = { ...validationErrors }
                          delete newErrors.selectedMember
                          setValidationErrors(newErrors)
                        }
                      }}
                    >
                      <SelectTrigger id="member" className={`w-full ${validationErrors.selectedMember ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="请选择人员姓名" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.department} ({member.position})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.selectedMember && (
                      <p className="text-xs text-destructive mt-1">请选择考核人员</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">所在部门</Label>
                    <Input 
                      id="department" 
                      value={selectedMember ? members.find(m => m.id === selectedMember)?.department || "" : ""} 
                      disabled 
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium">所属岗位</Label>
                    <Input 
                      id="position" 
                      value={selectedMember ? members.find(m => m.id === selectedMember)?.position || "" : ""} 
                      disabled 
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period" className="text-sm font-medium">考核周期 <span className="text-red-500">*</span></Label>
                    <Select 
                      value={selectedPeriod} 
                      onValueChange={(value) => {
                        setSelectedPeriod(value)
                        // 清除验证错误
                        if (validationErrors.selectedPeriod) {
                          const newErrors = { ...validationErrors }
                          delete newErrors.selectedPeriod
                          setValidationErrors(newErrors)
                        }
                      }}
                    >
                      <SelectTrigger id="period" className={`w-full ${validationErrors.selectedPeriod ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="请选择考核周期" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period.id} value={period.id}>
                            {period.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.selectedPeriod && (
                      <p className="text-xs text-destructive mt-1">请选择考核周期</p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="standard" className="text-sm font-medium">考核标准 <span className="text-red-500">*</span></Label>
                    <Select 
                      value={selectedStandard} 
                      onValueChange={(value) => {
                        setSelectedStandard(value)
                        // 清除验证错误
                        if (validationErrors.selectedStandard) {
                          const newErrors = { ...validationErrors }
                          delete newErrors.selectedStandard
                          setValidationErrors(newErrors)
                        }
                      }}
                    >
                      <SelectTrigger id="standard" className={`w-full ${validationErrors.selectedStandard ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="请选择考核标准" />
                      </SelectTrigger>
                      <SelectContent>
                        {personalStandards.map((standard) => (
                          <SelectItem key={standard.id} value={standard.id}>
                            {standard.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.selectedStandard && (
                      <p className="text-xs text-destructive mt-1">请选择考核标准</p>
                    )}
                    {selectedStandard && currentStandard && (
                      <p className="text-xs text-muted-foreground mt-1">{currentStandard.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 步骤2：选择项目 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {validationErrors.selectedProjects && (
                    <p className="text-xs text-destructive mb-2">请至少选择一个项目</p>
                  )}
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-start space-x-3 p-3 border rounded-md">
                      <Checkbox
                        id={`project-${project.id}`}
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProjects([...selectedProjects, project.id])
                            // 清除验证错误
                            if (validationErrors.selectedProjects) {
                              const newErrors = { ...validationErrors }
                              delete newErrors.selectedProjects
                              setValidationErrors(newErrors)
                            }
                          } else {
                            setSelectedProjects(selectedProjects.filter((id) => id !== project.id))
                          }
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={`project-${project.id}`}
                          className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {project.name}
                        </Label>
                        <div className="text-sm text-muted-foreground">角色: {project.role}</div>
                        <div className="flex items-center mt-1">
                          <span className="text-sm mr-2">完成度: {project.progress}%</span>
                          <Progress value={project.progress} className="h-2 w-[100px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 步骤3：评分 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {validationErrors.scores && (
                  <p className="text-xs text-destructive mb-2">请为所有评分项打分</p>
                )}
                {currentStandard ? (
                  <div className="space-y-6">
                    <div className="bg-muted/40 p-4 rounded-md">
                      <h3 className="font-medium mb-2">{currentStandard.name}</h3>
                      <p className="text-sm text-muted-foreground">{currentStandard.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      {currentStandard.criteria.map((item) => (
                        <div key={item.id} className="border rounded-md p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-base font-medium">
                              {item.name} <span className="text-sm text-muted-foreground ml-2">分值: {item.maxScore}分</span>
                            </Label>
                            <div className="font-medium">{scores[item.id] || "-"} 分</div>
                          </div>
                          <RadioGroup
                            value={scores[item.id]?.toString() || ""}
                            onValueChange={(value) => {
                              const newScores = { ...scores }
                              newScores[item.id] = parseInt(value)
                              setScores(newScores)
                              
                              // 清除验证错误
                              if (validationErrors.scores) {
                                // 检查是否所有项目都已评分
                                let allScored = true
                                currentStandard.criteria.forEach((it) => {
                                  if (!newScores[it.id] && it.id !== item.id) {
                                    allScored = false
                                  }
                                })
                                if (allScored) {
                                  const newErrors = { ...validationErrors }
                                  delete newErrors.scores
                                  setValidationErrors(newErrors)
                                }
                              }
                            }}
                            className="flex space-x-2"
                          >
                            {[1, 2, 3, 4, 5].map((score) => (
                              <div key={score} className="flex items-center space-x-1">
                                <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                                <Label htmlFor={`${item.id}-${score}`}>{score}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          <div className="space-y-2">
                            <Label htmlFor={`comment-${item.id}`}>评语</Label>
                            <Textarea
                              id={`comment-${item.id}`}
                              placeholder="请输入评语（可选）"
                              value={comments[item.id] || ""}
                              onChange={(e) => {
                                const newComments = { ...comments }
                                newComments[item.id] = e.target.value
                                setComments(newComments)
                              }}
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    请先在第一步选择考核标准
                  </div>
                )}
              </div>
            )}

            {/* 步骤4：确认信息 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid gap-4 border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">人员姓名</h3>
                      <p className="text-base">{selectedMember ? members.find(m => m.id === selectedMember)?.name : ""}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">所在部门</h3>
                      <p className="text-base">{selectedMember ? members.find(m => m.id === selectedMember)?.department : ""}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">所属岗位</h3>
                      <p className="text-base">{selectedMember ? members.find(m => m.id === selectedMember)?.position : ""}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">考核周期</h3>
                      <p className="text-base">{selectedPeriod ? periods.find(p => p.id === selectedPeriod)?.name : ""}</p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground">考核标准</h3>
                      <p className="text-base">{currentStandard?.name}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">参与项目</h3>
                    <div className="grid gap-2">
                      {selectedProjects.map((projectId) => {
                        const project = projects.find(p => p.id === projectId)
                        return project ? (
                          <div key={project.id} className="border rounded-md p-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{project.name}</h4>
                              <span className="text-sm">{project.progress}%</span>
                            </div>
                            <p className="text-sm text-muted-foreground">角色: {project.role}</p>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">评分详情</h3>
                    {currentStandard && (
                      <div className="grid gap-2">
                        {currentStandard.criteria.map((item) => (
                          <div key={item.id} className="border rounded-md p-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{item.name}</h4>
                              <span className="text-sm font-medium">{scores[item.id] || 0}分 / {item.maxScore}分</span>
                            </div>
                            {comments[item.id] && (
                              <p className="text-sm text-muted-foreground mt-1">{comments[item.id]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">总评分</h3>
                    <div className="text-lg font-bold">{calculateTotalScore()}分</div>
                    <div className="text-sm text-muted-foreground">评价结果: {getResultFromScore(calculateTotalScore())}</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finalComment" className="text-sm font-medium">总体评语</Label>
                    <Textarea
                      id="finalComment"
                      placeholder="请输入总体评语（可选）"
                      value={finalComment}
                      onChange={(e) => setFinalComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 步骤5：完成 */}
            {currentStep === 4 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">考核提交成功</h2>
                <p className="text-muted-foreground mb-6">考核信息已成功提交，即将返回考核管理页面</p>
                <div className="animate-pulse bg-muted h-1 w-24 rounded-full"></div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <div>
              {currentStep < 4 && (
                <Button variant="outline" onClick={() => router.back()}>
                  取消
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && currentStep < 4 && (
                <Button variant="outline" onClick={goToPrevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}

              {currentStep < 3 ? (
                <Button onClick={goToNextStep}>
                  下一步
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : currentStep === 3 ? (
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
                      提交考核
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
