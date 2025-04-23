"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

interface CompletionStepProps {
  formData: {
    basicInfo: any
    journalSource: any
  }
}

export default function CompletionStep({ formData }: CompletionStepProps) {
  const { basicInfo, journalSource } = formData
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">刊物级别创建成功</h2>
        <p className="text-muted-foreground mt-2">您已成功创建以下刊物级别</p>
      </div>

      <div className="space-y-6">
        <h3 className="font-medium text-lg">基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">级别编号</p>
            <p className="font-medium">{basicInfo.code || '未填写'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">级别名称</p>
            <p className="font-medium">{basicInfo.name || '未填写'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">论文类型</p>
            <p className="font-medium">{basicInfo.paperType || '未选择'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">状态</p>
            <Badge variant={basicInfo.status === "启用" ? "outline" : "secondary"}>
              {basicInfo.status || '未设置'}
            </Badge>
          </div>
          {basicInfo.description && (
            <div className="col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">描述</p>
              <p className="font-medium">{basicInfo.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-medium text-lg">期刊源信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">适用期刊源</p>
            <p className="font-medium">{journalSource.applicableJournalSource || '未选择'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">是否为收录</p>
            <Badge variant={journalSource.isIndexed ? "outline" : "secondary"}>
              {journalSource.isIndexed ? '是' : '否'}
            </Badge>
          </div>
          
          {journalSource.isIndexed && (
            <>
              {journalSource.impactFactorRequired && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">最低影响因子</p>
                  <p className="font-medium">{journalSource.impactFactorMin || '未设置'}</p>
                </div>
              )}
              
              {journalSource.quartileRequired && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">优选分区</p>
                  <p className="font-medium">{journalSource.preferredQuartile || '未设置'}</p>
                </div>
              )}
            </>
          )}
          
          {journalSource.additionalRequirements && (
            <div className="col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">附加要求</p>
              <p className="font-medium">{journalSource.additionalRequirements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 