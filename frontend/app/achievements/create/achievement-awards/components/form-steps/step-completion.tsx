"use client"

import { format } from "date-fns"
import { FileText, Users, Upload, Award, CheckCircle2 } from "lucide-react"

interface StepCompletionProps {
  formData: any
}

export function StepCompletion({ formData }: StepCompletionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">完成</h3>
      </div>

      {/* 基本信息 */}
      <div className="border rounded-md p-3">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          基本信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">奖励名称</p>
            <p>{formData.awardName || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">奖励级别</p>
            <p>{formData.awardLevel || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">获奖日期</p>
            <p>{formData.awardDate ? format(new Date(formData.awardDate), "yyyy-MM-dd") : "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">颁奖单位</p>
            <p>{formData.awardingBody || "-"}</p>
          </div>
        </div>
      </div>

      {/* 获奖人信息 */}
      <div className="border rounded-md p-3">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          获奖人信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">第一获奖人</p>
            <p>{formData.firstAuthor || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">第二获奖人</p>
            <p>{formData.secondAuthor || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">其他获奖人</p>
            <p>{formData.otherAuthors || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">本人贡献</p>
            <p>{formData.contribution || "-"}</p>
          </div>
        </div>
      </div>

      {/* 奖励信息 */}
      <div className="border rounded-md p-3">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <Award className="h-4 w-4 mr-2 text-muted-foreground" />
          奖励信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">奖励类别</p>
            <p>{formData.awardCategory || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">奖励等级</p>
            <p>{formData.awardRank || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">证书编号</p>
            <p>{formData.certificateNumber || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">奖励描述</p>
            <p>{formData.awardDescription || "-"}</p>
          </div>
        </div>
      </div>

      {/* 上传文件 */}
      <div className="border rounded-md p-3">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
          上传文件
        </h3>
        {formData.files && formData.files.length > 0 ? (
          <ul className="space-y-2">
            {formData.files.map((file: any, index: number) => (
              <li key={index} className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                <span>{file.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">未上传文件</p>
        )}
      </div>

      <div className="border-t pt-4 text-center text-muted-foreground">
        <p>请确认以上信息无误后，点击下方"提交"按钮完成提交</p>
      </div>
    </div>
  )
}
