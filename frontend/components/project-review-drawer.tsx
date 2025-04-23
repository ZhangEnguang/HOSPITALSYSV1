"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock, FileText, User, Calendar, DollarSign, BarChart4, X } from "lucide-react"

interface ProjectReviewDrawerProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onSubmitReview: (reviewData: any) => void
}

export function ProjectReviewDrawer({ isOpen, onClose, project, onSubmitReview }: ProjectReviewDrawerProps) {
  const [reviewData, setReviewData] = useState({
    status: "approved",
    score: 85,
    comments: "",
    technicalScore: 85,
    innovationScore: 80,
    feasibilityScore: 90,
    budgetScore: 85,
    teamScore: 80,
  })

  // 控制抽屉和遮罩层的可见性
  const [isVisible, setIsVisible] = useState(false)

  // 当isOpen变化时更新可见性
  useEffect(() => {
    if (isOpen) {
      // 打开时立即显示
      setIsVisible(true)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 先触发淡出动画
    setIsVisible(false)

    // 延迟提交，等待动画完成
    setTimeout(() => {
      onSubmitReview({
        ...reviewData,
        projectId: project?.id,
        reviewDate: new Date().toISOString(),
      })
    }, 300)
  }

  const handleChange = (field: string, value: any) => {
    setReviewData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 处理关闭
  const handleClose = () => {
    // 先触发淡出动画
    setIsVisible(false)

    // 延迟关闭，等待动画完成
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!project) return null

  return (
    <>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className={`fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* 抽屉内容 */}
          <div
            className={`fixed inset-y-0 right-0 z-50 w-3/4 bg-background p-6 shadow-lg overflow-y-auto
              transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>

            {/* 头部 */}
            <div className="flex flex-col space-y-2 text-center sm:text-left mb-6">
              <h3 className="text-xl font-semibold">项目审核</h3>
              <p className="text-sm text-muted-foreground">
                审核批次 <span className="font-medium">{project.batchNumber}</span> 中的项目
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 项目信息 */}
              <div className="md:col-span-1 space-y-4">
                <h3 className="text-lg font-medium">项目信息</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">类型: {project.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart4 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">类别: {project.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">申请金额: {project.amount?.toFixed(2)} 万元</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">申报日期: {project.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">截止日期: {project.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          负责人: {project.manager?.name} ({project.manager?.department})
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          project.status === "已通过"
                            ? "bg-green-500"
                            : project.status === "已拒绝"
                              ? "bg-red-500"
                              : project.status === "已提交"
                                ? "bg-blue-500"
                                : project.status === "审核中"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                        }`}
                      />
                      <span className="text-sm font-medium">当前状态: {project.status}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">附件文档</h4>
                  <div className="bg-muted/50 rounded-lg p-4 text-center text-sm text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
                    <p>项目申报书.pdf</p>
                    <p>预算明细.xlsx</p>
                    <p>技术方案.docx</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      查看全部文件
                    </Button>
                  </div>
                </div>
              </div>

              {/* 审核表单 */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-lg font-medium">审核评估</h3>

                  {/* 审核结果 */}
                  <div className="space-y-3">
                    <Label>审核结果</Label>
                    <RadioGroup
                      value={reviewData.status}
                      onValueChange={(value) => handleChange("status", value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="approved" id="approved" />
                        <Label htmlFor="approved" className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          通过
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rejected" id="rejected" />
                        <Label htmlFor="rejected" className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          拒绝
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="revision" id="revision" />
                        <Label htmlFor="revision" className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                          需要修改
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* 评分项 */}
                  <div className="space-y-6">
                    <h4 className="text-base font-medium">评分项</h4>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>技术可行性 (30%)</Label>
                          <span className="text-sm font-medium">{reviewData.technicalScore}</span>
                        </div>
                        <Slider
                          value={[reviewData.technicalScore]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleChange("technicalScore", value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>创新性 (20%)</Label>
                          <span className="text-sm font-medium">{reviewData.innovationScore}</span>
                        </div>
                        <Slider
                          value={[reviewData.innovationScore]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleChange("innovationScore", value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>实施可行性 (20%)</Label>
                          <span className="text-sm font-medium">{reviewData.feasibilityScore}</span>
                        </div>
                        <Slider
                          value={[reviewData.feasibilityScore]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleChange("feasibilityScore", value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>预算合理性 (15%)</Label>
                          <span className="text-sm font-medium">{reviewData.budgetScore}</span>
                        </div>
                        <Slider
                          value={[reviewData.budgetScore]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleChange("budgetScore", value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>团队能力 (15%)</Label>
                          <span className="text-sm font-medium">{reviewData.teamScore}</span>
                        </div>
                        <Slider
                          value={[reviewData.teamScore]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleChange("teamScore", value[0])}
                        />
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">综合得分</span>
                        <span className="text-lg font-bold">
                          {Math.round(
                            reviewData.technicalScore * 0.3 +
                              reviewData.innovationScore * 0.2 +
                              reviewData.feasibilityScore * 0.2 +
                              reviewData.budgetScore * 0.15 +
                              reviewData.teamScore * 0.15,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 审核意见 */}
                  <div className="space-y-3">
                    <Label htmlFor="comments">审核意见</Label>
                    <Textarea
                      id="comments"
                      placeholder="请输入详细的审核意见和建议..."
                      rows={5}
                      value={reviewData.comments}
                      onChange={(e) => handleChange("comments", e.target.value)}
                    />
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      取消
                    </Button>
                    <Button type="submit">提交审核</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

