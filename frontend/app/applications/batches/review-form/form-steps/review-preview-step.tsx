"use client"

import { format } from "date-fns"
import { CheckCircle2, FileText, Calendar, Settings, Info, Users, ClipboardList, User, ListChecks, GitMerge, PaperclipIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ReviewPreviewStepProps {
  formData: any
}

export function ReviewPreviewStep({ formData }: ReviewPreviewStepProps) {
  // 模拟数据 - 实际应用中应该从API获取
  const mockReviewers = [
    { value: "user1", label: "张三" },
    { value: "user2", label: "李四" },
    { value: "user3", label: "王五" },
    { value: "user4", label: "赵六" },
    { value: "user5", label: "钱七" },
  ];

  const mockReviewItems = [
    { id: "item1", name: "教学大纲", required: true },
    { id: "item2", name: "教案", required: true },
    { id: "item3", name: "考试试卷", required: false },
    { id: "item4", name: "课件", required: false },
    { id: "item5", name: "实验指导书", required: false },
  ];

  const reviewPlans = [
    { 
      value: "plan1", 
      label: "教学评审方案A", 
      description: "适用于教学质量评估，包含教学大纲、教案、课件等评审项目",
      items: ["教学大纲", "教案", "课件", "教学视频"]
    },
    { 
      value: "plan2", 
      label: "科研项目评审方案B", 
      description: "适用于科研项目评估，包含项目申请书、研究方法、预期成果等评审项目",
      items: ["项目申请书", "研究方法", "预期成果", "经费预算"]
    },
    { 
      value: "plan3", 
      label: "课程设计评审方案C", 
      description: "适用于课程设计评估，包含课程目标、教学内容、考核方式等评审项目",
      items: ["课程目标", "教学内容", "考核方式", "教学资源"]
    },
    { 
      value: "plan4", 
      label: "实验指导评审方案D", 
      description: "适用于实验教学评估，包含实验指导书、实验设备、实验报告等评审项目",
      items: ["实验指导书", "实验设备", "实验报告", "安全措施"]
    },
  ];


  const expertAssignMethods = [
    { value: "auto", label: "自动分配" },
    { value: "manual", label: "手动分配" },
  ];
  
  // 格式化日期
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "未设置";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return String(dateString);
    }
  };



  // 获取评审方案名称
  const getReviewPlanName = (value: string) => {
    const plan = reviewPlans.find(p => p.value === value);
    return plan ? plan.label : "未选择";
  };

  // 获取评审方案描述
  const getReviewPlanDescription = (value: string) => {
    const plan = reviewPlans.find(p => p.value === value);
    return plan ? plan.description : "";
  };


  // 获取专家分配方式
  const getExpertAssignMethodName = (value: string) => {
    const method = expertAssignMethods.find(m => m.value === value);
    return method ? method.label : "未设置";
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
          <h2 className="text-2xl font-bold text-center mb-2">{formData.评审计划名称 || "未命名评审计划"}</h2>
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
                  <span className="text-sm text-muted-foreground">评审计划名称</span>
                  <span className="text-sm col-span-2">{formData.评审计划名称 || "未设置"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">评审开始日期</span>
                  <span className="text-sm col-span-2">{formatDate(formData.评审开始日期)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">评审结束日期</span>
                  <span className="text-sm col-span-2">{formatDate(formData.评审结束日期)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">评审指南</span>
                  <div className="text-sm col-span-2 flex items-center">
                    {formData.评审指南 ? (
                      <>
                        <PaperclipIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formData.评审指南}
                      </>
                    ) : (
                      "未上传"
                    )}
                  </div>
                </div>
                {formData.备注 && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">备注</span>
                    <div className="text-sm col-span-2 whitespace-pre-line">{formData.备注}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 评审方案配置 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="h-5 w-5 text-primary" />
                <h3 className="font-medium">评审方案配置</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">评审方案</span>
                  <span className="text-sm col-span-2 font-medium">{getReviewPlanName(formData.reviewPlan)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">方案描述</span>
                  <span className="text-sm col-span-2">{getReviewPlanDescription(formData.reviewPlan)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 评审规则配置 */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h3 className="font-medium">评审规则配置</h3>
              </div>
              
              {/* 盲审模式设置 */}
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">盲审模式</span>
                  <span className="text-sm col-span-2">
                    {formData.isBlindReview ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">已启用</Badge>
                    ) : (
                      <Badge variant="outline">未启用</Badge>
                    )}
                  </span>
                </div>
              </div>
              
              {/* 专家分配设置 */}
              <div className="mt-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">专家分配设置</h4>
                </div>
                <div className="p-3 border rounded-md space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">分配方式</span>
                    <span className="text-sm col-span-2">{getExpertAssignMethodName(formData.expertAssignMethod)}</span>
                  </div>
                  
                  {formData.expertAssignMethod === "auto" && (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-muted-foreground">专家评审上限</span>
                        <span className="text-sm col-span-2">每位专家最多评审 {formData.maxProjectsPerExpert || "不限"} 个项目</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-muted-foreground">项目专家数</span>
                        <span className="text-sm col-span-2">每个项目分配 {formData.expertsPerProject || "不限"} 位专家</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* 专家回避设置 */}
              <div className="mt-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">专家回避设置</h4>
                </div>
                <div className="p-3 border rounded-md space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">排除合作者:</span>
                      {formData.avoidCooperators ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">已启用</Badge>
                      ) : (
                        <Badge variant="outline">未启用</Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">排除同单位:</span>
                      {formData.avoidSameUnit ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">已启用</Badge>
                      ) : (
                        <Badge variant="outline">未启用</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 