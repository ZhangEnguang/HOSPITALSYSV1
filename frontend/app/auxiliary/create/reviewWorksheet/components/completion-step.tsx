"use client"

import { ClipboardCheck, CheckCircle2 } from "lucide-react"

export default function CompletionStep({ formData }) {
  const getWorksheetTypeName = (type) => {
    switch(type) {
      case "scoring": return "打分制";
      case "voting": return "投票制";
      case "grading": return "等级制";
      case "weighted": return "权重打分制";
      default: return "未知类型";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">评审工作表创建成功</h2>
        <p className="text-muted-foreground mt-2">您已成功创建以下评审工作表</p>
      </div>

      <div className="bg-muted/20 p-6 rounded-lg border">
        <h3 className="font-medium text-lg mb-4">工作表概要</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">评审表名称</p>
              <p className="font-medium">{formData.basicInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">编码</p>
              <p className="font-medium">{formData.basicInfo.code}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">适用项目类型</p>
              <p className="font-medium">{formData.basicInfo.projectType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">评审表类型</p>
              <p className="font-medium">{getWorksheetTypeName(formData.basicInfo.type)}</p>
            </div>
          </div>
          
          {formData.basicInfo.description && (
            <div>
              <p className="text-sm text-muted-foreground">描述</p>
              <p className="font-medium">{formData.basicInfo.description}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-muted-foreground flex items-center">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              评审标准项数量
            </p>
            <p className="font-medium">{formData.standardsInfo.standardItems?.length || 0} 项</p>
          </div>
        </div>
      </div>
    </div>
  )
} 