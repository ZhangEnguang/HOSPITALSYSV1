"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { initialRewardItems } from "../../data/rewards-data"
import { useToast } from "@/hooks/use-toast"

// 评分标准
const scoringCriteria = [
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

// 评分等级
const performanceLevels = [
  { value: "excellent", label: "优秀", description: "表现远超预期", minScore: 90 },
  { value: "good", label: "良好", description: "表现超过预期", minScore: 80 },
  { value: "satisfactory", label: "满意", description: "达到预期要求", minScore: 70 },
  { value: "needsImprovement", label: "需要改进", description: "未完全达到预期", minScore: 60 },
  { value: "unsatisfactory", label: "不满意", description: "远低于预期要求", minScore: 0 },
]

export default function ScoringPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const memberId = params.id as string

  // 状态
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<string>("")
  const [overallRating, setOverallRating] = useState<string>("")
  const [totalScore, setTotalScore] = useState<number>(0)

  // 获取成员信息
  useEffect(() => {
    const fetchMember = () => {
      setLoading(true)
      // 模拟API调用
      setTimeout(() => {
        const foundMember = initialRewardItems.find((item) => item.id === memberId)
        if (foundMember) {
          setMember(foundMember)
          // 初始化评分为0
          const initialScores: Record<string, number> = {}
          scoringCriteria.forEach((criteria) => {
            initialScores[criteria.id] = 0
          })
          setScores(initialScores)
        }
        setLoading(false)
      }, 500)
    }

    if (memberId) {
      fetchMember()
    }
  }, [memberId])

  // 计算总分
  useEffect(() => {
    const newTotalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    setTotalScore(newTotalScore)

    // 根据总分自动设置评级
    for (const level of performanceLevels) {
      if (newTotalScore >= level.minScore) {
        setOverallRating(level.value)
        break
      }
    }
  }, [scores])

  // 处理评分变化
  const handleScoreChange = (criteriaId: string, value: number[]) => {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: value[0],
    }))
  }

  // 处理评论变化
  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value)
  }

  // 处理评级变化
  const handleRatingChange = (value: string) => {
    setOverallRating(value)
  }

  // 提交评分
  const handleSubmit = () => {
    // 检查是否所有评分都已完成
    const hasAllScores = Object.values(scores).every((score) => score > 0)

    if (!hasAllScores) {
      toast({
        title: "评分未完成",
        description: "请确保所有评分项都已评分",
        variant: "destructive",
      })
      return
    }

    if (!overallRating) {
      toast({
        title: "未选择总体评级",
        description: "请选择一个总体评级",
        variant: "destructive",
      })
      return
    }

    // 构建评分数据
    const scoringData = {
      memberId,
      memberName: member?.name,
      scores,
      totalScore,
      overallRating,
      comments,
      date: new Date().toISOString(),
    }

    console.log("提交评分数据:", scoringData)

    // 显示成功提示
    toast({
      title: "评分提交成功",
      description: `已完成对 ${member?.name} 的评分`,
    })

    // 返回列表页
    router.push("/rewards")
  }

  // 取消评分
  const handleCancel = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-2">未找到成员</h2>
        <p className="text-muted-foreground mb-4">无法找到ID为 {memberId} 的成员信息</p>
        <Button onClick={() => router.push("/rewards")}>返回列表</Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleCancel} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">成员评分</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>成员信息</CardTitle>
          <CardDescription>正在评分的成员详细信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">姓名</p>
              <p className="text-lg font-medium">{member.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">部门</p>
              <p className="text-lg font-medium">{member.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">职位</p>
              <p className="text-lg font-medium">{member.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">考核周期</p>
              <p className="text-lg font-medium">{member.period}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>评分标准</CardTitle>
          <CardDescription>请根据以下标准为成员评分</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {scoringCriteria.map((criteria) => (
            <div key={criteria.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{criteria.name}</h3>
                  <p className="text-sm text-muted-foreground">{criteria.description}</p>
                </div>
                <div className="text-xl font-bold w-12 text-center">{scores[criteria.id] || 0}</div>
              </div>
              <Slider
                value={[scores[criteria.id] || 0]}
                max={criteria.maxScore}
                step={1}
                onValueChange={(value) => handleScoreChange(criteria.id, value)}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{criteria.maxScore / 2}</span>
                <span>{criteria.maxScore}</span>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>总体评价</CardTitle>
          <CardDescription>请提供总体评价和评级</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">总分</h3>
              <div className="text-2xl font-bold">{totalScore} / 100</div>
            </div>
            <div className="w-full bg-muted rounded-full h-4 mb-4">
              <div className="h-4 rounded-full bg-primary" style={{ width: `${totalScore}%` }}></div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">总体评级</h3>
            <RadioGroup value={overallRating} onValueChange={handleRatingChange} className="grid grid-cols-1 gap-3">
              {performanceLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.value} id={level.value} />
                  <Label htmlFor={level.value} className="flex flex-col cursor-pointer">
                    <span className="font-medium">
                      {level.label} ({level.minScore}分以上)
                    </span>
                    <span className="text-sm text-muted-foreground">{level.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">评语和建议</h3>
            <Textarea
              placeholder="请输入对该成员的评语和改进建议..."
              value={comments}
              onChange={handleCommentsChange}
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            取消
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            提交评分
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

