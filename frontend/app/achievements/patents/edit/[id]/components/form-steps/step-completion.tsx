"use client"

import { CheckIcon } from "lucide-react"
import { FormData } from "../patents-form"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StepCompletionProps {
  formData: FormData
}

export function StepCompletion({ formData }: StepCompletionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
        <div className="text-green-500">
          <CheckIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">信息确认</h3>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-2 pb-2 border-b">基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">专利号</p>
                <p className="font-medium">{formData.patentNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">专利名称</p>
                <p className="font-medium">{formData.patentName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">专利类型</p>
                <p className="font-medium">
                  {formData.patentType === "invention" && "发明专利"}
                  {formData.patentType === "utility" && "实用新型专利"}
                  {formData.patentType === "design" && "外观设计专利"}
                  {formData.patentType === "software" && "软件著作权"}
                  {!formData.patentType && "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">专利状态</p>
                <p className="font-medium">
                  {formData.patentStatus === "pending" && "申请中"}
                  {formData.patentStatus === "published" && "已公开"}
                  {formData.patentStatus === "authorized" && "已授权"}
                  {formData.patentStatus === "rejected" && "已驳回"}
                  {formData.patentStatus === "abandoned" && "已放弃"}
                  {!formData.patentStatus && "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">申请日期</p>
                <p className="font-medium">{formData.applicationDate || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">授权日期</p>
                <p className="font-medium">{formData.approvalDate || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-2 pb-2 border-b">发明人信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">发明人</p>
                <p className="font-medium">{formData.inventors || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">所属单位</p>
                <p className="font-medium">{formData.affiliatedUnit || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-2 pb-2 border-b">专利详情</h3>
            <div className="space-y-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">专利摘要</p>
                <p className="text-sm mt-1">{formData.patentAbstract || "-"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">学科类别</p>
                  <p className="font-medium">{formData.disciplineCategory || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">应用领域</p>
                  <p className="font-medium">{formData.applicationArea || "-"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-2 pb-2 border-b">上传文件</h3>
            <div className="mt-3">
              {formData.files && formData.files.length > 0 ? (
                <div className="space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={file.id || index} className="flex items-center text-sm">
                      <span className="w-4 text-center mr-2">{index + 1}.</span>
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">暂无上传文件</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          请仔细核对以上信息，确认无误后点击"提交"按钮完成专利信息的{formData.id ? "编辑" : "创建"}。提交后，信息将进入审核流程。
        </AlertDescription>
      </Alert>
    </div>
  )
} 