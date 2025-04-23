"use client"

import { format } from "date-fns"
import { CheckCircle2, FileText, Calendar, Settings, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface BatchPreviewStepProps {
  formData: any
  isViewMode?: boolean
}

export function BatchPreviewStep({ formData, isViewMode = false }: BatchPreviewStepProps) {
  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return "未设置";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return dateString;
    }
  };

  // 获取状态对应的Badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "已发布":
        return "default";
      case "未发布":
        return "secondary";
      case "已结束":
        return "destructive";
      case "进行中":
        return "outline";
      default:
        return "secondary";
    }
  };

  // 获取状态对应的CSS类名
  const getStatusClassName = (status: string) => {
    switch (status) {
      case "已发布":
        return "bg-green-100 text-green-800";
      case "未发布":
        return "";
      case "已结束":
        return "bg-red-100 text-red-800";
      case "进行中":
        return "bg-blue-100 text-blue-800";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">预览确认</h3>
      </div>

      <div className="bg-white p-6 rounded-md border">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-center mb-2">{formData.计划名称 || "未命名批次"}</h2>
          <Badge variant="outline" className="px-3 py-1">
            {formData.项目分类 || "未设置分类"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="font-medium">基本信息</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">计划名称</span>
                  <span className="text-sm col-span-2">{formData.计划名称 || "未设置"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">项目分类</span>
                  <span className="text-sm col-span-2">{formData.项目分类 || "未设置"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">申报开始日期</span>
                  <span className="text-sm col-span-2">{formatDate(formData.申报开始日期)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">申报结束日期</span>
                  <span className="text-sm col-span-2">{formatDate(formData.申报结束日期)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">批次说明</span>
                  <div className="text-sm col-span-2 whitespace-pre-line">{formData.批次说明 || "无"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 批次配置 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-medium">批次配置</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">每人最大申报数量</span>
                  <span className="text-sm col-span-2">{formData.每人最大申报数量 || "未限制"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">项目预算上限</span>
                  <span className="text-sm col-span-2">
                    {formData.项目预算上限 ? `${formData.项目预算上限} 万元` : "未设置"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">申报书生成方式</span>
                  <span className="text-sm col-span-2">{formData.申报书生成方式 || "未设置"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">批次状态</span>
                  <span className="text-sm col-span-2">
                    <Badge 
                      variant={getStatusVariant(formData.批次状态)} 
                      className={getStatusClassName(formData.批次状态)}
                    >
                      {formData.批次状态 || "草稿"}
                    </Badge>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">是否公开</span>
                  <span className="text-sm col-span-2">{formData.是否公开 || "否"}</span>
                </div>
                {formData.要求_职称要求 && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">职称要求</span>
                    <span className="text-sm col-span-2">{formData.职称要求 || "未设置"}</span>
                  </div>
                )}
                {formData.要求_年龄要求 && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">出生日期要求</span>
                    <span className="text-sm col-span-2">
                      {formData.出生日期下限 && `不早于 ${formatDate(formData.出生日期下限)}`}
                      {formData.出生日期下限 && formData.出生日期上限 && "，"}
                      {formData.出生日期上限 && `不晚于 ${formatDate(formData.出生日期上限)}`}
                    </span>
                  </div>
                )}
                {formData.要求_部门限制 && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">部门限制</span>
                    <span className="text-sm col-span-2">已设置部门限制（详见部门清单）</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 申报书模板 */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-medium">申报书模板</h3>
              </div>
              
              <div className="space-y-3">
                {formData.申报书生成方式 === "全流程在线生成" && (
                  <div className="border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">在线模板：{
                        templateLibrary?.find((t: any) => t.id === formData.申报书模板ID)?.name || "未选择模板"
                      }</span>
                    </div>
                  </div>
                )}
                
                {formData.申报书生成方式 === "智能协同生成" && (
                  <div className="border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">正文模板：{formData.申报书模板 || "未上传模板"}</span>
                    </div>
                  </div>
                )}
                
                {formData.申报书生成方式 === "模板化线下填报" && (
                  <div className="border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">申请书模板：{formData.申报书模板 || "未上传模板"}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// 模板库数据，实际应从props传入或从API获取
const templateLibrary = [
  { id: "template1", name: "基础科研项目申报书模板" },
  { id: "template2", name: "教育教学项目申报书模板" },
  { id: "template3", name: "人文社科项目申报书模板" },
  { id: "template4", name: "创新创业项目申报书模板" },
];
