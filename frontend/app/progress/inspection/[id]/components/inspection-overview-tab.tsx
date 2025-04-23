"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  RefreshCw, 
  ChevronRight, 
  Copy, 
  BarChart3, 
  PieChart, 
  LineChart,
  LayoutGrid,
  Calendar,
  User,
  CheckCircle2,
  FileText
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface InspectionOverviewTabProps {
  data: any
}

export default function InspectionOverviewTab({ data }: InspectionOverviewTabProps) {
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false)
  const [isAnalysisUpdated, setIsAnalysisUpdated] = useState(false)
  
  // 处理更新分析
  const handleUpdateAnalysis = () => {
    setIsUpdatingAnalysis(true)
    
    // 模拟分析过程
    setTimeout(() => {
      setIsUpdatingAnalysis(false)
      setIsAnalysisUpdated(true)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* AI摘要卡片 */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm">
        {/* 添加渐变色线条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-1 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src="/ai-icon.png" alt="AI摘要" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <span>AI摘要</span>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2 tracking-wide font-normal border border-primary/20"
                  >
                    v2.4.1
                  </Badge>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">AI模型: GPT-Scientific 2023</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 relative bg-white hover:bg-primary/5 border border-slate-200 shadow-sm"
              onClick={handleUpdateAnalysis}
              disabled={isUpdatingAnalysis}
            >
              {isUpdatingAnalysis ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs">分析中...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-xs">更新分析</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="pl-9 relative">
            {isUpdatingAnalysis && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-opacity-20 border-t-primary animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-amber-400 border-opacity-20 border-r-amber-400 animate-spin"></div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">AI模型分析中</div>
                </div>
                <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-progress rounded-full"></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">正在处理项目中检数据并生成智能洞察...</div>
              </div>
            )}

            <div className="mb-3">
              {isAnalysisUpdated && (
                <div className="flex items-center gap-2 mb-3 text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="font-medium">最新分析已更新 - 检测到项目中检详情</span>
                </div>
              )}
            </div>

            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
              {isAnalysisUpdated ? (
                <>
                  <p>
                    该项目中检为{data.inspectionType}，中检日期为{data.inspectionDate}，完成率达到{data.completionRate}%。最新分析显示，项目进展顺利，关键里程碑按期完成。核心功能已实现并通过测试，系统架构设计合理，具有良好的扩展性。团队协作良好，技术能力强，有效解决了研发过程中的技术难题。建议关注系统性能优化和安全性增强，加强用户体验设计，确保系统稳定可靠。
                  </p>
                  <div className="flex items-start gap-4 my-3 py-2">
                    <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <div className="text-xs text-slate-600">
                        <span>进度评估</span>
                        <div className="font-semibold text-sm text-slate-900">良好</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                      <PieChart className="h-4 w-4 text-amber-600" />
                      <div className="text-xs text-slate-600">
                        <span>风险评估</span>
                        <div className="font-semibold text-sm text-slate-900">
                          低风险 <span className="text-green-600 text-xs">↓</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LineChart className="h-4 w-4 text-green-600" />
                      <div className="text-xs text-slate-600">
                        <span>质量评估</span>
                        <div className="font-semibold text-sm text-slate-900">优秀</div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                    <span className="font-medium text-primary">AI建议：</span>
                    <span className="inline-flex items-center gap-1.5 mt-1">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                      <span>加强用户测试，收集更多用户反馈，优化用户体验</span>
                      <br />
                    </span>
                    <span className="inline-flex items-center gap-1.5 mt-1">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                      <span>优化数据处理流程，提高系统响应速度和稳定性</span>
                      <br />
                    </span>
                    <span className="inline-flex items-center gap-1.5 mt-1">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                      <span>完善系统文档，为后续维护和升级做好准备</span>
                      <br />
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    该项目中检为{data.inspectionType}，中检日期为{data.inspectionDate}，完成率达到{data.completionRate}%。项目进展符合预期，各阶段工作按计划推进。{data.findings}
                  </p>
                  <div className="flex items-start gap-4 my-3 py-2">
                    <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <div className="text-xs text-slate-600">
                        <span>进度评估</span>
                        <div className="font-semibold text-sm text-slate-900">良好</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                      <PieChart className="h-4 w-4 text-amber-600" />
                      <div className="text-xs text-slate-600">
                        <span>风险评估</span>
                        <div className="font-semibold text-sm text-slate-900">中等</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LineChart className="h-4 w-4 text-green-600" />
                      <div className="text-xs text-slate-600">
                        <span>质量评估</span>
                        <div className="font-semibold text-sm text-slate-900">良好</div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                    <span className="font-medium text-primary">AI建议：</span>
                    {data.suggestions.split(';').map((suggestion: string, index: number) => (
                      <span key={index} className="inline-flex items-center gap-1.5 mt-1">
                        <ChevronRight className="h-3.5 w-3.5 text-primary" />
                        <span>{suggestion.trim()}</span>
                        <br />
                      </span>
                    ))}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end items-center text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
              <div className="flex-1 flex items-center gap-2">
                <div className="inline-flex h-5 items-center rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-900">
                  可信度 95%
                </div>
                <span>分析时间: {isAnalysisUpdated ? "2024-04-07 16:45" : "2024-04-01 10:32"}</span>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-slate-500 hover:text-slate-900"
                  onClick={() => {
                    // 复制文本到剪贴板
                    navigator.clipboard.writeText(
                      isAnalysisUpdated 
                        ? `该项目中检为${data.inspectionType}，中检日期为${data.inspectionDate}，完成率达到${data.completionRate}%。最新分析显示，项目进展顺利，关键里程碑按期完成。核心功能已实现并通过测试，系统架构设计合理，具有良好的扩展性。团队协作良好，技术能力强，有效解决了研发过程中的技术难题。建议关注系统性能优化和安全性增强，加强用户体验设计，确保系统稳定可靠。`
                        : `该项目中检为${data.inspectionType}，中检日期为${data.inspectionDate}，完成率达到${data.completionRate}%。项目进展符合预期，各阶段工作按计划推进。${data.findings}`
                    )
                    toast({
                      title: "已复制到剪贴板",
                      description: "AI智能摘要内容已复制",
                      duration: 2000,
                    })
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>复制</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 中检详情卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">中检详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">中检原因</h3>
                <p className="text-sm text-slate-700">{data.reason}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">中检发现</h3>
                <p className="text-sm text-slate-700">{data.findings}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">中检建议</h3>
              <p className="text-sm text-slate-700">{data.suggestions}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">项目完成率</h3>
              <div className="flex items-center gap-2">
                <Progress value={data.completionRate} className="h-2 flex-1" />
                <span className="text-sm font-medium">{data.completionRate}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目进度卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">项目进度</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>阶段</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>完成率</TableHead>
                <TableHead>计划完成日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.progressSummary.map((phase: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{phase.phase}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        phase.status === "已完成"
                          ? "success"
                          : phase.status === "进行中"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {phase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={phase.completionRate} className="h-2 w-24" />
                      <span className="text-sm">{phase.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{phase.endDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 下一步计划卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">下一步计划</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>工作内容</TableHead>
                <TableHead>截止日期</TableHead>
                <TableHead>责任人</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.nextSteps.map((step: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{step.phase}</TableCell>
                  <TableCell>{step.deadline}</TableCell>
                  <TableCell>{step.responsible}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 审核历史卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">审核历史</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.auditHistory.map((history: any, index: number) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                  {history.action === "提交中检" ? (
                    <FileText className="h-4 w-4 text-primary" />
                  ) : history.action === "审核通过" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{history.action}</div>
                    <div className="text-xs text-slate-500">{history.date}</div>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{history.user}: {history.comment}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
