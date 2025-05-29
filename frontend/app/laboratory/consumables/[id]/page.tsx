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
  TestTube
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import ConsumableOverviewTab from "./components/consumable-overview-tab"
import ConsumableStockInTab from "./components/consumable-stock-in-tab"
import ConsumableApplicationTab from "./components/consumable-application-tab"
import ConsumableRecommendationTab from "./components/consumable-recommendation-tab"

// 导入示例数据
import { allDemoConsumableItems } from "../data/consumable-demo-data"
import { statusColors } from "../config/consumable-config"

export default function ConsumableDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [consumable, setConsumable] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找耗材数据
      const foundConsumable = allDemoConsumableItems.find(item => item.id === id)
    
      if (foundConsumable) {
        setConsumable(foundConsumable)
      }
    } catch (error) {
      console.error("Error fetching consumable data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/laboratory/consumables")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (consumable) {
      setConsumable({ ...consumable, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此耗材吗？")) {
      alert("删除成功")
      router.push("/laboratory/consumables")
    }
  }

  // 自定义状态颜色
  const consumableStatusColors = {
    "充足": "bg-green-50 text-green-700 border-green-200",
    "低库存": "bg-amber-50 text-amber-700 border-amber-200",
    "缺货": "bg-red-50 text-red-700 border-red-200",
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

  if (!consumable) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到耗材信息</h2>
        <p className="text-muted-foreground">该耗材可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "manager",
      label: "负责人",
      value: consumable.manager?.name || "未指定",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "location",
      label: "存放位置",
      value: consumable.location,
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: consumable.department,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "category",
      label: "耗材类型",
      value: (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          {consumable.category}
        </Badge>
      ),
      icon: <TestTube className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "库存状态",
      value: (
        <Badge 
          className={
            consumable.status === "充足" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : consumable.status === "低库存" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : consumable.status === "缺货"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : consumable.status === "已过期"
                    ? "bg-red-50 text-red-700 border-red-200" 
                    : "bg-slate-50 text-slate-700 border-slate-200"
          }
        >
          {consumable.status}
        </Badge>
      ),
      icon: consumable.status === "充足" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : consumable.status === "低库存" || consumable.status === "即将过期"
          ? <AlertCircle className="h-4 w-4 text-amber-500" /> 
          : <AlertCircle className="h-4 w-4 text-red-500" />,
    },
    {
      id: "currentStock",
      label: "当前库存",
      value: `${consumable.currentStock}${consumable.unit}`,
      icon: <Package className="h-4 w-4" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={consumable}
        showRightSidebar={false}
        hiddenTabs={["booking", "maintenance", "process", "funds", "achievements", "risks", "reports", "statistics", "documents", "members", "custom"]}
        hiddenFields={["period"]} 
        hiddenActions={[]} 
        tabComponents={{
          overview: <ConsumableOverviewTab data={consumable} />,
          stockIn: <ConsumableStockInTab data={consumable} />,
          application: <ConsumableApplicationTab data={consumable} />,
          recommendations: <ConsumableRecommendationTab data={consumable} />
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
        customBackPath="/laboratory/consumables"
        statusColors={consumableStatusColors}
        onBack={handleBack}
        onTitleEdit={handleTitleEdit}
        onDelete={handleDelete}
        customActions={[]}
        customFields={customFields}
      />
    </div>
  )
} 