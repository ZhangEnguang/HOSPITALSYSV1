"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Info } from "lucide-react"

type StepApplicantProps = {
  formData: {
    name: string;
    description: string;
    projectId: string;
    category: string;
    amount: string;
    recipient: string;
    recipientAccount: string;
    recipientBank: string;
    date: string;
  };
  files: File[];
  isEditMode?: boolean;
}

export function StepApplicant({ formData, files, isEditMode = false }: StepApplicantProps) {
  // 找到对应项目名称的函数
  const getProjectName = (projectId: string) => {
    const projects = [
      { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
      { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
      { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
      { id: "4", name: "高校创新创业教育体系构建研究" },
      { id: "5", name: "智慧校园综合管理平台开发" },
    ]
    return projects.find(p => p.id === projectId)?.name || "未选择项目"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Info className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">{isEditMode ? "确认修改" : "确认提交"}</h3>
      </div>

      <div className="space-y-4 p-4 border rounded-md">
        <h4 className="font-medium">基本信息</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">外拨名称：</span>
            <span>{formData.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">外拨日期：</span>
            <span>{formData.date}</span>
          </div>
          {formData.description && (
            <div className="col-span-2">
              <span className="text-muted-foreground">外拨描述：</span>
              <span>{formData.description}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-md">
        <h4 className="font-medium">项目与分类信息</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">所属项目：</span>
            <span>{getProjectName(formData.projectId)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">外拨类别：</span>
            <span>{formData.category}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-md">
        <h4 className="font-medium">金额与收款信息</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">外拨金额：</span>
            <span className="font-medium text-red-600">￥{formData.amount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">收款单位：</span>
            <span>{formData.recipient}</span>
          </div>
          <div>
            <span className="text-muted-foreground">收款账号：</span>
            <span>{formData.recipientAccount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">开户银行：</span>
            <span>{formData.recipientBank}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-md">
        <h4 className="font-medium">附件信息</h4>
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="text-sm flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 text-xs">
                  {file.name.split('.').pop()?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">未上传附件</div>
        )}
      </div>

      <div className="p-4 border rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">张</div>
            <div>
              <div className="font-medium">张三</div>
              <div className="text-xs text-muted-foreground">计算机科学与技术学院</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <p className="text-sm text-yellow-800">
          {isEditMode 
            ? "确认信息后点击\"更新\"按钮，更新经费外拨信息。" 
            : "请确认以上信息无误后提交，提交后将进入审批流程。"}
        </p>
      </div>
    </div>
  )
}
