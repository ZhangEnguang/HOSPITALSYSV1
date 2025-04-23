"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { 
  Calendar, 
  FileText, 
  Settings, 
  ClipboardList, 
  Clock,
  User,
  Building,
  Mail,
  Phone,
  AlertCircle,
  PenSquare,
  ArrowLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DetailPage, { TabConfig, ActionConfig, FieldConfig } from "@/components/detail-page/detail-page"

// 模拟批次数据获取
const fetchBatchData = async (id: string) => {
  // 这里应该从API获取数据
  // 暂时使用模拟数据
  const mockBatches = [
    {
      id: "1",
      name: "2025年第一批次项目申报",
      code: "XKKY-2025-01",
      type: "申报批次",
      projectType: "项目申报",
      startDate: "2025-02-01",
      endDate: "2025-03-01",
      status: "已发布",
      description: "本批次用于2025年第一批次项目申报",
      department: "项目管理处",
      contactPerson: "张三",
      contactPhone: "123-4567-8901",
      contactEmail: "zhangzr@example.edu.cn",
      maxProjectsPerPerson: 2,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "项目申报书",
          required: true,
          description: "详细说明项目的研究内容、目标、预算和人员等",
          template: "/templates/project-application.docx"
        },
        {
          id: "2",
          name: "预算表",
          required: true,
          description: "详细说明项目的预算",
          template: "/templates/budget-form.xlsx"
        },
        {
          id: "3",
          name: "研究团队成员信息",
          required: false,
          description: "研究团队成员信息",
          template: null
        },
      ]
    },
    {
      id: "2",
      name: "2025年第一批次项目评审",
      code: "XKPS-2025-01",
      type: "评审批次",
      projectType: "项目评审",
      startDate: "2025-03-15",
      endDate: "2025-04-15",
      status: "未发布",
      description: "本批次用于2025年第一批次项目评审",
      department: "项目管理处",
      contactPerson: "李四",
      contactPhone: "123-4567-8902",
      contactEmail: "lizr@example.edu.cn",
      maxProjectsPerPerson: 10,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "评审表",
          required: true,
          description: "评审表",
          template: "/templates/review-form.docx"
        }
      ]
    },
    {
      id: "3",
      name: "2023年度国家自然科学基金项目申报",
      code: "NSFC-2023-01",
      type: "申报批次",
      projectType: "国家自然科学基金",
      startDate: "2023-09-01",
      endDate: "2023-10-15",
      status: "已结束",
      description: "2023年度国家自然科学基金项目申报批次",
      department: "科研处",
      contactPerson: "王五",
      contactPhone: "123-4567-8903",
      contactEmail: "wangwu@example.edu.cn",
      maxProjectsPerPerson: 1,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "国家自然科学基金申请书",
          required: true,
          description: "按照基金委要求的格式填写",
          template: "/templates/nsfc-form.docx"
        }
      ]
    },
    {
      id: "4",
      name: "2024年度教育部人文社科项目申报",
      code: "RWSK-2024-01",
      type: "申报批次",
      projectType: "人文社科项目",
      startDate: "2024-02-01",
      endDate: "2024-03-31",
      status: "已结束",
      description: "2024年度教育部人文社科项目申报批次",
      department: "社科处",
      contactPerson: "赵六",
      contactPhone: "123-4567-8904",
      contactEmail: "zhaoliu@example.edu.cn",
      maxProjectsPerPerson: 2,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "人文社科项目申请书",
          required: true,
          description: "详细说明研究内容、方法和预期成果",
          template: "/templates/humanities-form.docx"
        }
      ]
    },
    {
      id: "5",
      name: "2022年度校级青年科研项目申报",
      code: "XKQN-2022-01",
      type: "申报批次",
      projectType: "校级科研项目",
      startDate: "2022-03-01",
      endDate: "2022-04-30",
      status: "已结束",
      description: "面向全校青年教师征集2022年度校级青年科研项目申报",
      department: "科研处",
      contactPerson: "钱七",
      contactPhone: "123-4567-8905",
      contactEmail: "qianqi@example.edu.cn",
      maxProjectsPerPerson: 1,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "校级青年项目申请书",
          required: true,
          description: "按照学校要求填写申请书",
          template: "/templates/youth-project-form.docx"
        },
        {
          id: "2",
          name: "个人简历",
          required: true,
          description: "包括教育背景、工作经历和研究成果",
          template: null
        }
      ]
    }
  ]

  const batch = mockBatches.find(batch => batch.id === id)
  if (!batch) {
    throw new Error("批次未找到")
  }
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return batch
}

// 基本信息标签页组件
const BatchBasicInfoTab = ({ batch }: { batch: any }) => {
  return (
    <div className="space-y-6">
      {/* 批次基本信息 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">批次基本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Building className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">所属部门</p>
                <p className="text-base">{batch.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">申报周期</p>
                <p className="text-base">
                  {formatDate(batch.startDate)} 至 {formatDate(batch.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">联系人</p>
                <p className="text-base">{batch.contactPerson}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">联系邮箱</p>
                <p className="text-base">{batch.contactEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">联系电话</p>
                <p className="text-base">{batch.contactPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">批次状态</p>
                <Badge className={getStatusColorClass(batch.status)}>
                  {batch.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium mb-4">批次描述</h3>
          <p className="text-base text-muted-foreground">{batch.description}</p>
        </div>
      </Card>
    </div>
  )
}

// 配置信息标签页组件
const BatchConfigTab = ({ batch }: { batch: any }) => {
  return (
    <div className="space-y-6">
      <Card className="border border-gray-100 rounded-md bg-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">批次规则配置</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-muted-foreground">批次类型</span>
              <span className="font-medium">{batch.type}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-muted-foreground">关联项目类型</span>
              <span className="font-medium">{batch.projectType}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-muted-foreground">每人最大申报数</span>
              <span className="font-medium">{batch.maxProjectsPerPerson}个</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-muted-foreground">是否需要审批</span>
              <span className="font-medium">{batch.requiresApproval ? "是" : "否"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 材料要求标签页组件
const BatchMaterialsTab = ({ batch }: { batch: any }) => {
  return (
    <div className="space-y-6">
      <Card className="border border-gray-100 rounded-md bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">申报材料要求</h3>
            <Badge variant="outline">共 {batch.materialsRequired.length} 项</Badge>
          </div>
          
          <div className="divide-y">
            {batch.materialsRequired.map((material: any) => (
              <div key={material.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{material.name}</span>
                  <Badge variant={material.required ? "default" : "outline"}>
                    {material.required ? "必交" : "选交"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{material.description}</p>
                {material.template && (
                  <div className="mt-2">
                    <a 
                      href={material.template} 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      下载模板
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 获取状态对应的样式类
const getStatusColorClass = (status: string) => {
  switch (status) {
    case "已发布":
      return "bg-green-50 text-green-700 border-green-200"
    case "未发布":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "已结束":
      return "bg-slate-50 text-slate-700 border-slate-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  try {
    if (!dateString) {
      return "-"
    }
    return dateString
  } catch (e) {
    return dateString
  }
}

export default function BatchViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [batch, setBatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadBatch = async () => {
      try {
        const data = await fetchBatchData(params.id)
        setBatch(data)
        setLoading(false)
      } catch (err) {
        setError((err as Error).message)
        setLoading(false)
      }
    }
    
    loadBatch()
  }, [params.id])
  
  const handleBack = () => {
    router.push("/applications")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (batch) {
      setBatch({ ...batch, name: newTitle })
    }
  }

  const handleEditBatch = () => {
    router.push(`/applications/batches/edit/${batch.id}`)
  }
  
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">加载失败</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }
  
  if (!batch) {
    return notFound()
  }

  // 定义标签页配置
  const tabConfigs: TabConfig[] = [
    {
      id: "basic",
      label: "基本信息",
      icon: <FileText className="h-4 w-4" />,
      component: <BatchBasicInfoTab batch={batch} />,
    },
    {
      id: "config",
      label: "配置信息",
      icon: <Settings className="h-4 w-4" />,
      component: <BatchConfigTab batch={batch} />,
    },
    {
      id: "materials",
      label: "材料要求",
      icon: <ClipboardList className="h-4 w-4" />,
      component: <BatchMaterialsTab batch={batch} />,
    },
  ]

  // 定义操作按钮配置
  const actionConfigs: ActionConfig[] = [
    {
      id: "edit",
      label: "编辑批次",
      icon: <PenSquare className="h-4 w-4" />,
      onClick: handleEditBatch,
      variant: "outline",
    },
  ]

  // 定义字段配置
  const fieldConfigs: FieldConfig[] = [
    {
      id: "code",
      label: "批次编号",
      value: batch.code,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "period",
      label: "申报周期",
      value: `${formatDate(batch.startDate)} 至 ${formatDate(batch.endDate)}`,
      icon: <Calendar className="h-4 w-4" />,
    },
  ]

  // 定义状态颜色映射
  const statusColors: Record<string, string> = {
    "已发布": "bg-green-50 text-green-700 border-green-200",
    "未发布": "bg-amber-50 text-amber-700 border-amber-200",
    "已结束": "bg-slate-50 text-slate-700 border-slate-200",
  }

  return (
    <DetailPage
      id={batch.id}
      title={batch.name}
      status={batch.status}
      statusLabel={batch.status}
      fields={fieldConfigs}
      tabs={tabConfigs}
      actions={actionConfigs}
      onTitleEdit={handleTitleEdit}
      onBack={handleBack}
      statusColors={statusColors}
      showReviewSidebar={false}
    />
  )
}
