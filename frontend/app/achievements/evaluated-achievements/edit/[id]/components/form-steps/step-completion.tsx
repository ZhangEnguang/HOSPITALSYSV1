"use client"

import { Check, FileText, InfoIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StepCompletionProps {
  formData: any
}

export function StepCompletion({ formData }: StepCompletionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">确认提交</h3>
      </div>

      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">信息已完善</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          您已完成所有必填信息，请核对信息无误后点击"完成"按钮提交
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">信息概览</h3>
        
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">成果名称</h4>
                <p>{formData.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">成果类型</h4>
                <p>{formData.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">鉴定单位</h4>
                <p>{formData.evaluationOrg}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">鉴定日期</h4>
                <p>{formData.evaluationDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">鉴定证书编号</h4>
                <p>{formData.certificateNo}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">鉴定水平</h4>
                <p>{formData.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">第一完成人</h4>
                <p>{formData.firstCompleter}</p>
              </div>
              {formData.secondCompleter && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">第二完成人</h4>
                  <p>{formData.secondCompleter}</p>
                </div>
              )}
              {formData.otherCompleters && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">其他完成人</h4>
                  <p>{formData.otherCompleters}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {formData.files && formData.files.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">已上传文件</h4>
                <div className="space-y-2">
                  {formData.files.map((file: File, index: number) => (
                    <div key={index} className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 