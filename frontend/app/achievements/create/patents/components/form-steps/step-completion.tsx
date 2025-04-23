"use client"

import { CheckCircle, BookOpen, Users, FileText, Upload, CheckCircle2 } from "lucide-react"

interface StepCompletionProps {
  formData: any
}

export function StepCompletion({ formData }: StepCompletionProps) {
  // 格式化专利类型
  const formatPatentType = (type: string): string => {
    switch (type) {
      case "invention": return "发明专利"
      case "utility": return "实用新型专利"
      case "design": return "外观设计专利"
      default: return "未填写"
    }
  }

  // 格式化专利状态
  const formatPatentStatus = (status: string): string => {
    switch (status) {
      case "applied": return "已申请"
      case "authorized": return "已授权"
      case "rejected": return "已驳回"
      case "abandoned": return "已放弃"
      default: return "未填写"
    }
  }

  // 格式化学科类别
  const formatDisciplineCategory = (category: string): string => {
    switch (category) {
      case "engineering": return "工学"
      case "science": return "理学"
      case "medicine": return "医学"
      case "agriculture": return "农学"
      case "management": return "管理学"
      case "economics": return "经济学"
      case "law": return "法学"
      case "education": return "教育学"
      case "literature": return "文学"
      case "history": return "历史学"
      case "philosophy": return "哲学"
      case "art": return "艺术学"
      case "military": return "军事学"
      default: return "未填写"
    }
  }

  // 格式化应用领域
  const formatApplicationArea = (area: string): string => {
    switch (area) {
      case "information": return "信息技术"
      case "manufacturing": return "制造业"
      case "energy": return "能源环保"
      case "materials": return "材料科学"
      case "biomedical": return "生物医药"
      case "agriculture": return "农业技术"
      case "transportation": return "交通运输"
      case "construction": return "建筑工程"
      case "other": return "其他领域"
      default: return "未填写"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">完成</h3>
      </div>

      <div className="space-y-3">
        <div className="border rounded-md p-3">
          <div className="flex items-center text-muted-foreground mb-2">
            <BookOpen className="h-4 w-4 mr-2" />
            <h3 className="text-sm font-medium">基本信息</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1 text-xs">专利号</p>
              <p className="font-medium">{formData.patentNumber || "未填写"}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">专利名称</p>
              <p className="font-medium">{formData.patentName || "未填写"}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">专利类型</p>
              <p className="font-medium">{formatPatentType(formData.patentType)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">专利状态</p>
              <p className="font-medium">{formatPatentStatus(formData.patentStatus)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">申请日期</p>
              <p className="font-medium">{formData.applicationDate || "未填写"}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">授权日期</p>
              <p className="font-medium">{formData.approvalDate || "未填写"}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-md p-3">
          <div className="flex items-center text-muted-foreground mb-2">
            <Users className="h-4 w-4 mr-2" />
            <h3 className="text-sm font-medium">发明人信息</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1 text-xs">发明人</p>
              <p className="font-medium">{formData.inventors || "未填写"}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">所属单位</p>
              <p className="font-medium">{formData.affiliatedUnit || "未填写"}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-md p-3">
          <div className="flex items-center text-muted-foreground mb-2">
            <FileText className="h-4 w-4 mr-2" />
            <h3 className="text-sm font-medium">专利详情</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1 text-xs">专利摘要</p>
              <p className="font-medium">{formData.patentAbstract || "未填写"}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground mb-1 text-xs">学科类别</p>
                <p className="font-medium">{formatDisciplineCategory(formData.disciplineCategory)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs">应用领域</p>
                <p className="font-medium">{formatApplicationArea(formData.applicationArea)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-md p-3">
          <div className="flex items-center text-muted-foreground mb-2">
            <Upload className="h-4 w-4 mr-2" />
            <h3 className="text-sm font-medium">上传文件</h3>
          </div>
          {formData.files && formData.files.length > 0 ? (
            <ul className="space-y-2">
              {formData.files.map((file: any, index: number) => (
                <li key={index} className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{file.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">未上传文件</p>
          )}
        </div>
      </div>
    </div>
  )
}
