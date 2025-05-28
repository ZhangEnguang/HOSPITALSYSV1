"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  MessageSquare,
  Wrench,
  BookOpen,
  Settings,
  Package,
  Beaker
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import ReagentOverviewTab from "./components/reagent-overview-tab"
import ReagentStockInTab from "./components/reagent-stock-in-tab"
import ReagentApplicationTab from "./components/reagent-application-tab"
import ReagentRecommendationTab from "./components/reagent-recommendation-tab"

// 导入示例数据
import { allDemoReagentItems } from "../data/reagent-demo-data"
import { statusColors } from "../config/reagent-config"

export default function ReagentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [reagent, setReagent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找试剂数据
      const foundReagent = allDemoReagentItems.find(item => item.id === id)
    
      if (foundReagent) {
        setReagent(foundReagent)
      }
    } catch (error) {
      console.error("Error fetching reagent data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/laboratory/reagent")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (reagent) {
      setReagent({ ...reagent, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此试剂吗？")) {
      alert("删除成功")
      router.push("/laboratory/reagent")
    }
  }

  // 自定义状态颜色
  const reagentStatusColors = {
    "正常": "bg-green-50 text-green-700 border-green-200",
    "低库存": "bg-amber-50 text-amber-700 border-amber-200",
    "已用完": "bg-red-50 text-red-700 border-red-200",
    "已过期": "bg-red-50 text-red-700 border-red-200",
    "即将过期": "bg-amber-50 text-amber-700 border-amber-200",
    "未入库": "bg-slate-50 text-slate-700 border-slate-200",
    "待检验": "bg-blue-50 text-blue-700 border-blue-200",
    ...statusColors
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!reagent) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到试剂信息</h2>
        <p className="text-muted-foreground">该试剂可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "manager",
      label: "负责人",
      value: reagent.manager?.name || "未指定",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "location",
      label: "存放位置",
      value: reagent.location,
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: reagent.department,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "category",
      label: "试剂类型",
      value: (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {reagent.category}
                  </Badge>
      ),
      icon: <Beaker className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "库存状态",
      value: (
                  <Badge 
          className={
            reagent.status === "正常" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : reagent.status === "低库存" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : reagent.status === "已用完"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : reagent.status === "已过期"
                        ? "bg-red-50 text-red-700 border-red-200" 
                    : "bg-slate-50 text-slate-700 border-slate-200"
          }
                  >
          {reagent.status}
                  </Badge>
      ),
      icon: reagent.status === "正常" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : reagent.status === "低库存" || reagent.status === "即将过期"
          ? <AlertCircle className="h-4 w-4 text-amber-500" /> 
          : <AlertCircle className="h-4 w-4 text-red-500" />,
    },
    {
      id: "currentAmount",
      label: "当前库存",
      value: `${reagent.currentAmount}${reagent.unit}`,
      icon: <Package className="h-4 w-4" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={reagent}
        showRightSidebar={false}
        hiddenTabs={["booking", "maintenance", "process", "funds", "achievements", "risks", "reports", "statistics", "documents", "members", "custom"]}
        hiddenFields={["period"]} 
        hiddenActions={[]} 
        tabComponents={{
          overview: <ReagentOverviewTab data={reagent} />,
          stockIn: <ReagentStockInTab data={reagent} />,
          application: <ReagentApplicationTab data={reagent} />,
          recommendations: <ReagentRecommendationTab data={reagent} />
        }}
        customTabLabels={{
          overview: "基本信息",
          stockIn: "入库明细",
          application: "申领明细",
          recommendations: "相关推荐"
        }}
        tabsHeight={45}
        headerHeight={65}
        buttonsHeight={42}
        moduleType="custom"
        customBackPath="/laboratory/reagent"
        statusColors={reagentStatusColors}
        onBack={handleBack}
        onTitleEdit={handleTitleEdit}
        onDelete={handleDelete}
        customActions={[]}
        customFields={customFields}
      />
    </div>
  )
} 