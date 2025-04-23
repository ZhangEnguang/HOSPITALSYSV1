"use client"

import { Calendar, Clock, FileText, AlertCircle, Building, DollarSign, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ContractAISummary from "./contract-ai-summary"

interface ContractOverviewTabProps {
  data: any
}

export default function ContractOverviewTab({ data }: ContractOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI摘要 */}
      <ContractAISummary contractData={data} />
      
      {/* 合同基本信息 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">合同基本信息</CardTitle>
          <CardDescription>合同认定的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">合同类型</div>
              <div className="flex items-center">
                <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                  {data.changeType}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">申请人</div>
              <div>{data.applicant}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">所属部门</div>
              <div>{data.department}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">申请日期</div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{data.approvalHistory?.[0]?.date || "未知"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">合同金额</div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{data.contractAmount || "未设置"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">合作方</div>
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{data.contractParty || "未设置"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 合同说明 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">合同说明</CardTitle>
          <CardDescription>合同认定的详细说明</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">合同描述</h3>
              <p className="text-sm">{data.reason}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">影响分析</h3>
              <p className="text-sm">{data.impact}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 审批记录 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">审批记录</CardTitle>
          <CardDescription>合同认定的审批流程记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.approvalHistory && data.approvalHistory.length > 0 ? (
              <div className="space-y-3">
                {data.approvalHistory.map((record: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      record.action === "提交申请" 
                        ? "bg-blue-50 text-blue-600" 
                        : record.action === "审核通过" 
                          ? "bg-green-50 text-green-600" 
                          : "bg-red-50 text-red-600"
                    }`}>
                      {record.action === "提交申请" ? (
                        <FileText className="h-4 w-4" />
                      ) : record.action === "审核通过" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="font-medium text-sm">{record.action}</div>
                        <div className="text-xs text-muted-foreground">{record.date}</div>
                      </div>
                      <div className="text-sm mt-1">操作人: {record.user}</div>
                      {record.comment && <div className="text-sm text-muted-foreground mt-1">{record.comment}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">暂无审批记录</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
