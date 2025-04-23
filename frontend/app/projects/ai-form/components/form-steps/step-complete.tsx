"use client"

import { CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepCompleteProps {
  formData: any
}

export const StepComplete = ({ formData }: StepCompleteProps) => {
  // 检查必填字段是否已填写
  const requiredFields = ["项目名称", "所属单位", "项目分类", "预算金额"]
  const missingFields = requiredFields.filter((field) => !formData[field])
  const isComplete = missingFields.length === 0

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">完成项目登记</h3>
      <p className="text-muted-foreground">请确认所有信息无误，点击提交完成项目登记</p>

      {isComplete ? (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="flex items-center text-green-800 font-medium">
            <CheckCircle className="h-5 w-5 mr-2" />
            项目即将创建完成
          </h4>
          <p className="text-green-700 mt-2">
            项目创建完成后，您可以在项目列表中查看和管理该项目。项目创建后支持编辑和删除操作。
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="flex items-center text-amber-800 font-medium">
            <AlertTriangle className="h-5 w-5 mr-2" />
            项目信息不完整
          </h4>
          <p className="text-amber-700 mt-2">
            以下必填信息尚未填写完成：
            <ul className="list-disc list-inside mt-1">
              {missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 bg-amber-100 hover:bg-amber-200 border-amber-300"
            onClick={() => {
              // 返回到第一个有缺失字段的步骤
              if (
                missingFields.includes("项目名称") ||
                missingFields.includes("所属单位") ||
                missingFields.includes("项目分类")
              ) {
                // 返回步骤一
                window.history.pushState({}, "", "?step=0")
                window.dispatchEvent(new Event("popstate"))
              } else if (missingFields.includes("预算金额")) {
                // 返回步骤三
                window.history.pushState({}, "", "?step=2")
                window.dispatchEvent(new Event("popstate"))
              }
            }}
          >
            返回填写
          </Button>
        </div>
      )}

      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-3">项目基本信息</h4>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">项目名称：</div>
            <div className="text-sm font-medium">{formData.项目名称 || "未填写"}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">项目类型：</div>
            <div className="text-sm font-medium">{formData.项目类型 || "未填写"}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">项目预算：</div>
            <div className="text-sm font-medium">
              {formData.预算金额 ? `${formData.预算金额} ${formData.预算单位 || "元"}` : "未填写"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">起止日期：</div>
            <div className="text-sm font-medium">
              {formData.开始日期 && formData.结束日期 ? `${formData.开始日期} 至 ${formData.结束日期}` : "未填写"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">项目负责人：</div>
            <div className="text-sm font-medium">{formData.项目负责人 || "未填写"}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">所属单位：</div>
            <div className="text-sm font-medium">{formData.所属单位 || "未填写"}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>提示：</strong> 提交后，项目将进入审核流程。您可以在"我的项目"中查看审核进度。
        </p>
      </div>
    </div>
  )
}

