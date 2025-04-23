"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Check, Building, Users, CalendarIcon, BarChart } from "lucide-react"

// 模拟数据
const departments = [
  { id: "1", name: "研发部", memberCount: 24, manager: "张三" },
  { id: "2", name: "市场部", memberCount: 18, manager: "李四" },
  { id: "3", name: "人力资源部", memberCount: 12, manager: "王五" },
  { id: "4", name: "财务部", memberCount: 8, manager: "赵六" },
  { id: "5", name: "运营部", memberCount: 15, manager: "钱七" },
]

const periods = [
  { id: "2023-q4", name: "2023年第四季度" },
  { id: "2023-q3", name: "2023年第三季度" },
  { id: "2023-q2", name: "2023年第二季度" },
  { id: "2023-q1", name: "2023年第一季度" },
]

const evaluationTypes = [
  { id: "quarterly", name: "季度考核" },
  { id: "annual", name: "年度考核" },
  { id: "special", name: "专项考核" },
]

const assessmentStandards = [
  {
    id: "1",
    category: "部门绩效",
    items: [
      { id: "1-1", name: "目标完成率", weight: 25 },
      { id: "1-2", name: "工作质量", weight: 20 },
      { id: "1-3", name: "工作效率", weight: 15 },
    ],
  },
  {
    id: "2",
    category: "团队管理",
    items: [
      { id: "2-1", name: "团队协作", weight: 10 },
      { id: "2-2", name: "人员培养", weight: 10 },
    ],
  },
  {
    id: "3",
    category: "创新发展",
    items: [
      { id: "3-1", name: "创新能力", weight: 10 },
      { id: "3-2", name: "流程优化", weight: 10 },
    ],
  },
]

// 评分等级
const scoreOptions = [
  { value: 5, label: "优秀 (5分)", description: "表现远超预期，成果显著" },
  { value: 4, label: "良好 (4分)", description: "表现超过预期，成果明显" },
  { value: 3, label: "合格 (3分)", description: "达到预期要求，成果符合标准" },
  { value: 2, label: "待改进 (2分)", description: "基本达到要求，但有明显不足" },
  { value: 1, label: "不合格 (1分)", description: "未达到基本要求，表现较差" },
]

// 根据得分判断结果
const getResultFromScore = (score: number) => {
  if (score >= 90) return "优秀"
  if (score >= 80) return "良好"
  if (score >= 70) return "合格"
  if (score >= 60) return "待改进"
  return "不合格"
}

export default function NewDepartmentEvaluationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(25)

  // 步骤1：选择考核部门和周期
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [evaluationType, setEvaluationType] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())

  // 步骤2：部门概况
  const [departmentSummary, setDepartmentSummary] = useState("")
  const [keyAchievements, setKeyAchievements] = useState("")
  const [challenges, setChallenges] = useState("")

  // 步骤3：评分
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})

  // 步骤4：确认信息
  const [finalComment, setFinalComment] = useState("")

  // 计算总分
  const calculateTotalScore = () => {
    let totalScore = 0
    let totalWeight = 0

    assessmentStandards.forEach((category) => {
      category.items.forEach((item) => {
        if (scores[item.id]) {
          totalScore += scores[item.id] * item.weight
          totalWeight += item.weight
        }
      })
    })

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 20) : 0
  }

  // 处理下一步
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      setProgress((currentStep + 1) * 25)
    }
  }

  // 处理上一步
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setProgress((currentStep - 1) * 25)
    }
  }

  // 处理提交
  const handleSubmit = () => {
    const totalScore = calculateTotalScore()
    const result = getResultFromScore(totalScore)

    console.log({
      department: departments.find((d) => d.id === selectedDepartment),
      period: periods.find((p) => p.id === selectedPeriod),
      evaluationType,
      date,
      departmentSummary,
      keyAchievements,
      challenges,
      scores,
      comments,
      finalComment,
      totalScore,
      result,
    })

    // 提交成功后跳转
    router.push("/rewards?success=true")
  }

  // 检查当前步骤是否可以进行下一步
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDepartment && selectedPeriod && evaluationType && date
      case 2:
        return departmentSummary.trim().length > 0
      case 3:
        // 检查是否所有评分项都已评分
        let allScored = true
        assessmentStandards.forEach((category) => {
          category.items.forEach((item) => {
            if (!scores[item.id]) {
              allScored = false
            }
          })
        })
        return allScored
      default:
        return true
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">新增部门考核</h1>
        <Progress value={progress} className="mt-4" />
      </div>

      <div className="grid gap-6">
        {/* 步骤1：选择考核部门和周期 */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                步骤1：选择考核部门和周期
              </CardTitle>
              <CardDescription>请选择要考核的部门和考核周期</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="department">考核部门</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="选择考核部门" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name} - {department.manager} (成员: {department.memberCount}人)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">考核周期</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="选择考核周期" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluationType">考核类型</Label>
                <Select value={evaluationType} onValueChange={setEvaluationType}>
                  <SelectTrigger id="evaluationType">
                    <SelectValue placeholder="选择考核类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {evaluationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">考核日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "yyyy-MM-dd") : <span>选择日期</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNextStep} disabled={!canProceed()}>
                下一步
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* 步骤2：部门概况 */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                步骤2：部门概况
              </CardTitle>
              <CardDescription>
                请填写
                {selectedDepartment && (
                  <span className="font-medium"> {departments.find((d) => d.id === selectedDepartment)?.name} </span>
                )}
                在考核周期内的工作概况
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="departmentSummary">部门工作概述</Label>
                <Textarea
                  id="departmentSummary"
                  placeholder="请概述部门在考核周期内的主要工作内容和职责..."
                  value={departmentSummary}
                  onChange={(e) => setDepartmentSummary(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyAchievements">主要成就</Label>
                <Textarea
                  id="keyAchievements"
                  placeholder="请列出部门在考核周期内取得的主要成就和亮点..."
                  value={keyAchievements}
                  onChange={(e) => setKeyAchievements(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">面临挑战</Label>
                <Textarea
                  id="challenges"
                  placeholder="请描述部门在考核周期内面临的主要挑战和困难..."
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button onClick={handleNextStep} disabled={!canProceed()}>
                下一步
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* 步骤3：评分 */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                步骤3：考核评分
              </CardTitle>
              <CardDescription>
                请根据考核标准对
                {selectedDepartment && (
                  <span className="font-medium"> {departments.find((d) => d.id === selectedDepartment)?.name} </span>
                )}
                进行评分
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={assessmentStandards[0].id} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  {assessmentStandards.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {assessmentStandards.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="space-y-6">
                    {category.items.map((item) => (
                      <div key={item.id} className="space-y-4 border-b pb-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">
                            {item.name}
                            <span className="ml-2 text-sm text-muted-foreground">权重: {item.weight}%</span>
                          </h3>
                          <div className="text-lg font-bold">{scores[item.id] ? `${scores[item.id]}分` : "未评分"}</div>
                        </div>

                        <RadioGroup
                          value={scores[item.id]?.toString() || ""}
                          onValueChange={(value) => {
                            setScores({
                              ...scores,
                              [item.id]: Number.parseInt(value),
                            })
                          }}
                          className="grid grid-cols-5 gap-2"
                        >
                          {scoreOptions.map((option) => (
                            <div
                              key={option.value}
                              className={`border rounded-md p-3 cursor-pointer hover:border-primary transition-colors ${
                                scores[item.id] === option.value ? "border-primary bg-primary/5" : ""
                              }`}
                              onClick={() => {
                                setScores({
                                  ...scores,
                                  [item.id]: option.value,
                                })
                              }}
                            >
                              <RadioGroupItem
                                value={option.value.toString()}
                                id={`${item.id}-score-${option.value}`}
                                className="sr-only"
                              />
                              <div className="flex flex-col items-center text-center">
                                <span className="text-lg font-bold">{option.value}</span>
                                <Label htmlFor={`${item.id}-score-${option.value}`} className="text-sm font-medium">
                                  {option.label.split(" ")[0]}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>

                        <div className="space-y-2">
                          <Label htmlFor={`comment-${item.id}`}>评语（可选）</Label>
                          <Textarea
                            id={`comment-${item.id}`}
                            placeholder="请输入对该项的评语..."
                            value={comments[item.id] || ""}
                            onChange={(e) => {
                              setComments({
                                ...comments,
                                [item.id]: e.target.value,
                              })
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button onClick={handleNextStep} disabled={!canProceed()}>
                下一步
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* 步骤4：确认信息 */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                步骤4：确认考核信息
              </CardTitle>
              <CardDescription>请确认考核信息，确认无误后提交</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">考核部门</h3>
                    <p className="text-base">
                      {selectedDepartment ? departments.find((d) => d.id === selectedDepartment)?.name : "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">部门负责人</h3>
                    <p className="text-base">
                      {selectedDepartment ? departments.find((d) => d.id === selectedDepartment)?.manager : "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">考核周期</h3>
                    <p className="text-base">
                      {selectedPeriod ? periods.find((p) => p.id === selectedPeriod)?.name : "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">考核类型</h3>
                    <p className="text-base">
                      {evaluationType ? evaluationTypes.find((t) => t.id === evaluationType)?.name : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">考核得分</h3>
                <div className="grid gap-4">
                  {assessmentStandards.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <h4 className="font-medium">{category.category}</h4>
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.name}（权重：{item.weight}%）
                            </span>
                            <span className="font-medium">{scores[item.id] || 0}分</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-bold">总分</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">{calculateTotalScore()}</span>
                      <span className="text-sm ml-1">/ 100</span>
                      <div className="text-sm font-medium mt-1">
                        考核结果：
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            calculateTotalScore() >= 90
                              ? "bg-green-100 text-green-800"
                              : calculateTotalScore() >= 80
                                ? "bg-blue-100 text-blue-800"
                                : calculateTotalScore() >= 70
                                  ? "bg-yellow-100 text-yellow-800"
                                  : calculateTotalScore() >= 60
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getResultFromScore(calculateTotalScore())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-comment">总体评语</Label>
                <Textarea
                  id="final-comment"
                  placeholder="请输入对该部门的总体评价..."
                  value={finalComment}
                  onChange={(e) => setFinalComment(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button onClick={handleSubmit}>提交考核</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

