"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReviewSidebar from "@/app/todos/[id]/components/review-sidebar"
import { UniversalDetailAdapter } from "@/components/universal-detail"
import { 
  Calendar, 
  FileText, 
  BarChart, 
  GitBranch, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  Trash2,
  Link,
  CreditCard
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import FundsOverviewTab from "@/app/funds/[id]/components/funds-overview-tab"
import FundsRisksTab from "@/app/funds/[id]/components/funds-risks-tab"
import FundsRelatedProjectsTab from "@/app/funds/[id]/components/funds-related-projects-tab"
import FundsDocumentsTab from "@/app/funds/[id]/components/funds-documents-tab"

// 导入示例数据
import { initialFundsItems } from "../../data/funds-data"

export default function FundsReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [funds, setFunds] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fundsType, setFundsType] = useState<string>("入账") // 默认为入账类型

  useEffect(() => {
    try {
      // 从模拟数据中查找
      const foundFunds = initialFundsItems.find(item => item.id === id)
      
      if (foundFunds) {
        // 确保申请人信息格式正确
        if (foundFunds.applicant && typeof foundFunds.applicant === 'object') {
          // 确保申请人信息正确格式化
          const formattedApplicant = {
            id: foundFunds.applicant.id,
            name: foundFunds.applicant.name,
            avatar: foundFunds.applicant.avatar
          }
          
          setFunds({
            ...foundFunds,
            applicant: formattedApplicant
          })
          
          // 设置经费类型
          setFundsType(foundFunds.type)
        } else {
          setFunds(foundFunds)
          setFundsType(foundFunds.type)
        }
      }
    } catch (error) {
      console.error("Error fetching funds data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/funds")
  }

  // 自定义状态颜色
  const statusColors = {
    "待审核": "bg-amber-50 text-amber-700 border-amber-200",
    "已通过": "bg-green-50 text-green-700 border-green-200",
    "已退回": "bg-red-50 text-red-700 border-red-200",
    "已报销": "bg-blue-50 text-blue-700 border-blue-200",
    "进行中": "bg-blue-50 text-blue-700 border-blue-200",
    "已完成": "bg-slate-50 text-slate-700 border-slate-200"
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!funds) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到经费记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 根据经费类型获取不同的标签
  const getDateLabel = () => {
    switch (fundsType) {
      case "入账":
        return "入账日期"
      case "外拨":
        return "外拨日期"
      case "报销":
        return "报销日期"
      case "结转":
        return "结转日期"
      default:
        return "日期"
    }
  }

  // 自定义字段
  const customFields = [
    {
      id: "applicant",
      label: "申请人",
      value: funds.applicant.name,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "date",
      label: getDateLabel(),
      value: funds.date,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "project",
      label: "所属项目",
      value: funds.project.name,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "category",
      label: "经费类别",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {funds.category}
        </Badge>
      ),
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "审批状态",
      value: (
        <Badge 
          className={
            funds.status === "已通过" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : funds.status === "已退回" 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
          }
        >
          {funds.status}
        </Badge>
      ),
      icon: funds.status === "已通过" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : funds.status === "已退回" 
          ? <AlertCircle className="h-4 w-4 text-red-500" /> 
          : <Clock className="h-4 w-4 text-amber-500" />,
    },
  ]

  // 根据经费类型获取不同的页面标题
  const getPageTitle = () => {
    switch (fundsType) {
      case "入账":
        return "经费入账审核"
      case "外拨":
        return "经费外拨审核"
      case "报销":
        return "经费报销审核"
      case "结转":
        return "经费结转审核"
      default:
        return "经费审核"
    }
  }

  return (
    <div className="flex flex-col relative">
      <div className="w-[calc(100%-350px)]">
        <UniversalDetailAdapter
          itemData={funds}
          showRightSidebar={false}
          hiddenTabs={["process", "funds", "achievements", "reports", "statistics", "members"]}
          hiddenFields={["period"]} 
          hiddenActions={["delete"]} 
          tabComponents={{
            overview: <FundsOverviewTab data={funds} />,
            risks: <FundsRisksTab data={funds} />,
            custom: <FundsRelatedProjectsTab data={funds} />,
            documents: <FundsDocumentsTab data={funds} />
          }}
          customTabLabels={{
            overview: "概览",
            risks: "风险",
            custom: "关联项目",
            documents: "文档"
          }}
          tabsHeight={45}
          headerHeight={65}
          buttonsHeight={42}
          moduleType="fund"
          customBackPath="/funds"
          statusColors={statusColors}
          onBack={handleBack}
          customTitle={getPageTitle()}
          customFields={customFields}
        />
      </div>
      
      {/* 将审核侧边栏组件放在UniversalDetailAdapter之外 */}
      <ReviewSidebar projectData={funds} />
    </div>
  )
}
