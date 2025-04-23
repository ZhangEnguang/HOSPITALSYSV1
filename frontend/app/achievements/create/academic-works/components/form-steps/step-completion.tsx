"use client"

import { format } from "date-fns"
import { BookOpen, Users, FileText, Upload, CheckCircle2 } from "lucide-react"

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
        <h3 className="text-base font-medium">确认著作信息</h3>
      </div>

      {/* 基本信息 */}
      <div className="border rounded-md p-4">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
          基本信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">著作名称</p>
            <p>{formData.title || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">著作类型</p>
            <p>{formData.workType || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">出版社</p>
            <p>{formData.publisher || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">出版日期</p>
            <p>{formData.publishDate ? format(new Date(formData.publishDate), "yyyy-MM-dd") : "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ISBN</p>
            <p>{formData.isbn || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">总页数</p>
            <p>{formData.pages || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">总字数（千字）</p>
            <p>{formData.words || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">学科分类</p>
            <p>{formData.category || "-"}</p>
          </div>
        </div>
      </div>

      {/* 作者信息 */}
      <div className="border rounded-md p-4">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          作者信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">第一作者</p>
            <p>{formData.firstAuthor || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">主编</p>
            <p>{formData.editor || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">其他作者</p>
            <p>{formData.otherAuthors || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">本人贡献</p>
            <p>{formData.contribution || "-"}</p>
          </div>
        </div>
      </div>

      {/* 内容详情 */}
      <div className="border rounded-md p-4">
        <h3 className="text-md font-medium mb-3 flex items-center">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          内容详情
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">内容简介</p>
            <p className="text-sm">{formData.summary || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">关键词</p>
            <p>{formData.keywords || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">丛书名称</p>
            <p>{formData.series || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">获奖情况</p>
            <p>{formData.awards || "-"}</p>
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
