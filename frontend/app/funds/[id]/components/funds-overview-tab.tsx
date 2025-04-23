"use client"

import { Calendar, Clock, FileText, AlertCircle, CreditCard, Building, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AISummary from "./ai-summary"

interface FundsOverviewTabProps {
  data: any
}

export default function FundsOverviewTab({ data }: FundsOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI摘要 */}
      <AISummary fundsData={data} />
      
      {/* 经费基本信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">经费基本信息</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">经费类别</div>
              <div className="flex items-center">
                <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                  {data.category}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">申请人</div>
              <div className="text-sm">{data.applicant.name}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">所属项目</div>
              <div className="text-sm">{data.project.name}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">入账日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{data.date}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">经费金额</div>
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>¥{data.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">经费来源</div>
              <div className="flex items-center gap-1 text-sm">
                <Building className="h-4 w-4 text-gray-500" />
                <span>{data.source}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500">入账编号</div>
              <div className="text-sm">{data.accountNumber}</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500">审批状态</div>
              <div className="flex items-center">
                <Badge 
                  className={
                    data.status === "已通过" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : data.status === "已退回" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {data.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 经费说明 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">经费说明</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">详细说明</div>
              <p className="text-sm text-gray-700">{data.description}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 审批信息 */}
      {data.approver && (
        <Card className="border border-gray-100 rounded-md bg-white mb-6">
          <div className="p-4 pb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold">审批信息</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">审批人</div>
                <div className="text-sm">{data.approver.name}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-500">审批日期</div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{data.approveDate}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 附件列表 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">附件</span>
          </div>
          {data.attachments && data.attachments > 0 ? (
            <div className="space-y-3">
              {Array.from({ length: data.attachments }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{`经费入账附件${index + 1}.pdf`}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">1.2MB</span>
                    <span className="text-xs text-slate-500">{data.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-muted-foreground text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>暂无附件</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
