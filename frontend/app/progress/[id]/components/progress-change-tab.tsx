"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRightIcon } from "lucide-react"

interface ProgressChangeTabProps {
  data: any
}

export default function ProgressChangeTab({ data }: ProgressChangeTabProps) {
  // 获取状态对应的颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-50 text-green-700 border-green-200"
      case "进行中":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "未开始":
        return "bg-slate-50 text-slate-700 border-slate-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* 变更前后进度对比 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">变更前后进度对比</CardTitle>
          <CardDescription>项目进度变更前后的阶段对比</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground w-[20%]">阶段</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground w-[15%]">状态</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground w-[20%]">完成率</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground w-[15%]">结束日期</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground w-[10%]">变更</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground w-[15%]">新结束日期</th>
                </tr>
              </thead>
              <tbody>
                {data.progressBefore.map((phase: any, index: number) => {
                  const afterPhase = data.progressAfter.find((p: any) => p.phase === phase.phase)
                  const dateChanged = afterPhase && afterPhase.endDate !== phase.endDate
                  
                  return (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="p-3 text-sm">{phase.phase}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={phase.completionRate} className="h-2" />
                          <span className="text-xs text-muted-foreground">{phase.completionRate}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{phase.endDate}</td>
                      <td className="p-3 text-center">
                        {dateChanged && (
                          <ArrowRightIcon className="h-4 w-4 text-amber-500 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 text-sm">
                        {afterPhase ? (
                          <span className={dateChanged ? "text-amber-600 font-medium" : ""}>
                            {afterPhase.endDate}
                          </span>
                        ) : "-"}
                      </td>
                    </tr>
                  )
                })}
                
                {/* 显示新增的阶段 */}
                {data.progressAfter
                  .filter((phase: any) => !data.progressBefore.some((p: any) => p.phase === phase.phase))
                  .map((phase: any, index: number) => (
                    <tr key={`new-${index}`} className="border-b hover:bg-slate-50 bg-blue-50/30">
                      <td className="p-3 text-sm font-medium text-blue-700">{phase.phase} (新增)</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={phase.completionRate} className="h-2" />
                          <span className="text-xs text-muted-foreground">{phase.completionRate}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">-</td>
                      <td className="p-3 text-center">
                        <ArrowRightIcon className="h-4 w-4 text-blue-500 mx-auto" />
                      </td>
                      <td className="p-3 text-sm font-medium text-blue-700">{phase.endDate}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* 变更前甘特图 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">变更前进度计划</CardTitle>
          <CardDescription>原项目进度计划甘特图</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.progressBefore.map((phase: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">{phase.phase}</div>
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status}
                  </Badge>
                </div>
                <div className="h-8 bg-slate-100 rounded-md relative overflow-hidden">
                  <div 
                    className={`h-full ${phase.status === "已完成" ? "bg-green-500" : phase.status === "进行中" ? "bg-blue-500" : "bg-slate-300"}`}
                    style={{ width: `${phase.completionRate}%` }}
                  ></div>
                  <div className="absolute top-0 right-2 h-full flex items-center">
                    <span className="text-xs text-slate-700">{phase.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* 变更后甘特图 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">变更后进度计划</CardTitle>
          <CardDescription>新项目进度计划甘特图</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.progressAfter.map((phase: any, index: number) => {
              const isNew = !data.progressBefore.some((p: any) => p.phase === phase.phase)
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className={`text-sm font-medium ${isNew ? "text-blue-700" : ""}`}>
                      {phase.phase} {isNew && "(新增)"}
                    </div>
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status}
                    </Badge>
                  </div>
                  <div className={`h-8 ${isNew ? "bg-blue-100" : "bg-slate-100"} rounded-md relative overflow-hidden`}>
                    <div 
                      className={`h-full ${phase.status === "已完成" ? "bg-green-500" : phase.status === "进行中" ? "bg-blue-500" : "bg-slate-300"}`}
                      style={{ width: `${phase.completionRate}%` }}
                    ></div>
                    <div className="absolute top-0 right-2 h-full flex items-center">
                      <span className="text-xs text-slate-700">{phase.endDate}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
