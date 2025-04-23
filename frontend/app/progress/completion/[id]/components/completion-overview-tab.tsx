"use client"

import { Calendar, Clock, FileText, AlertCircle, Building, DollarSign, CheckCircle, Award, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import CompletionAISummary from "./completion-ai-summary"

interface CompletionOverviewTabProps {
  completion: any
}

export default function CompletionOverviewTab({ completion }: CompletionOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI摘要 */}
      <CompletionAISummary completionData={completion} />
      
      {/* 结项基本信息 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">项目基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">结项类型</div>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {completion.completionType}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">申请人</div>
              <div className="text-sm">{completion.applicant}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">所属部门</div>
              <div className="text-sm">{completion.department}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">结项日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{completion.completionDate || "未知"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">评价结果</div>
              <div className="flex items-center gap-1 text-sm">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{completion.evaluationResult || "未评价"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">完成率</div>
              <div className="flex items-center gap-2 text-sm">
                <Progress value={completion.completionRate || 0} className="h-2 w-24" />
                <span>{completion.completionRate || 0}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 结项说明 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">结项说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">结项原因</div>
              <p className="text-sm">{completion.reason}</p>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">项目总结</div>
              <p className="text-sm">{completion.summary}</p>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">主要成果</div>
              <p className="text-sm whitespace-pre-line">{completion.achievements}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 审批记录 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">审批记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">审批状态</div>
              <Badge 
                variant="outline"
                className={
                  completion.auditStatus === "已通过" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : completion.auditStatus === "已退回" 
                      ? "bg-red-50 text-red-700 border-red-200" 
                      : "bg-amber-50 text-amber-700 border-amber-200"
                }
              >
                {completion.auditStatus}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              {completion.auditHistory && completion.auditHistory.map((record: any, index: number) => (
                <div key={index} className="border-l-2 border-l-slate-200 pl-4 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{record.action}</div>
                      <div className="text-xs text-muted-foreground">{record.user} · {record.date}</div>
                    </div>
                  </div>
                  {record.comment && (
                    <div className="mt-1 text-sm">{record.comment}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 进度总结 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">进度总结</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completion.progressSummary && completion.progressSummary.map((phase: any, index: number) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{phase.phase}</div>
                  <div className="text-xs text-muted-foreground">完成日期: {phase.endDate}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={phase.completionRate} className="h-2 w-24" />
                  <Badge 
                    variant="outline"
                    className={
                      phase.status === "已完成" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {phase.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* 后续计划 */}
      {completion.nextSteps && completion.nextSteps.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">后续计划</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completion.nextSteps.map((step: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{step.phase}</div>
                    <div className="text-xs text-muted-foreground">负责人: {step.responsible}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {step.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
