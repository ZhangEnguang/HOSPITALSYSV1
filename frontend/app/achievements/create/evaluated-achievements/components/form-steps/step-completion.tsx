"use client"

import { format } from "date-fns"
import { FileText, Users, Upload, Award, CheckCircle2 } from "lucide-react"

interface StepCompletionProps {
  formData: any
}

export function StepCompletion({ formData }: StepCompletionProps) {
  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">确认鉴定成果信息</h3>
      </div>

      {/* 基本信息 */}
      <div className="border rounded-md p-4">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          基本信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">成果名称</p>
            <p>{formData.title || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">成果类型</p>
            <p>{formData.type || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">鉴定单位</p>
            <p>{formData.evaluationOrg || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">鉴定日期</p>
            <p>{formData.evaluationDate ? format(new Date(formData.evaluationDate), "yyyy-MM-dd") : "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">鉴定证书编号</p>
            <p>{formData.certificateNo || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">鉴定水平</p>
            <p>{formData.level || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">学科分类</p>
            <p>{formData.category || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">项目来源</p>
            <p>{formData.projectSource || "-"}</p>
          </div>
        </div>
      </div>

      {/* 完成人信息 */}
      <div className="border rounded-md p-4">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          完成人信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">第一完成人</p>
            <p>{formData.firstCompleter || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">第二完成人</p>
            <p>{formData.secondCompleter || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">其他完成人</p>
            <p>{formData.otherCompleters || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">本人贡献</p>
            <p>{formData.contribution || "-"}</p>
          </div>
        </div>
      </div>

      {/* 鉴定详情 */}
      <div className="border rounded-md p-4">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <Award className="h-4 w-4 mr-2 text-muted-foreground" />
          鉴定详情
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">成果简介</p>
            <p className="text-sm">{formData.summary || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">专家姓名</p>
            <p>{formData.expertNames || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">专家职称</p>
            <p>{formData.expertTitles || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">专家单位</p>
            <p>{formData.expertUnits || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">是否通过鉴定</p>
            <p>{formData.isPassed === "yes" ? "是" : formData.isPassed === "no" ? "否" : "-"}</p>
          </div>
        </div>
      </div>

      {/* 文档上传 */}
      <div className="border rounded-md p-4">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
          文档上传
        </h3>
        <div>
          <p className="text-sm text-muted-foreground">已上传文件</p>
          {formData.files && formData.files.length > 0 ? (
            <ul className="list-disc list-inside">
              {formData.files.map((file: string, index: number) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  )
}
