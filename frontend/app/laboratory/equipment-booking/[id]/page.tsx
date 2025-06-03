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
  Settings
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import EquipmentOverviewTab from "../../equipment/[id]/components/equipment-overview-tab"
import EquipmentBookingTab from "../../equipment/[id]/components/equipment-booking-tab"
import EquipmentMaintenanceTab from "../../equipment/[id]/components/equipment-maintenance-tab"
import EquipmentRecommendationTab from "../../equipment/[id]/components/equipment-recommendation-tab"

// 导入示例数据
import { allDemoEquipmentItems } from "../../equipment/data/equipment-demo-data"
import { statusColors } from "../../equipment/config/equipment-config"

export default function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [equipment, setEquipment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找仪器数据
      const foundEquipment = allDemoEquipmentItems.find(item => item.id === id)
      
      if (foundEquipment) {
        setEquipment(foundEquipment)
      }
    } catch (error) {
      console.error("Error fetching equipment data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/laboratory/equipment")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (equipment) {
      setEquipment({ ...equipment, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此仪器吗？")) {
      alert("删除成功")
      router.push("/laboratory/equipment")
    }
  }

  // 自定义状态颜色
  const equipmentStatusColors = {
    "在用": "bg-green-50 text-green-700 border-green-200",
    "维修中": "bg-amber-50 text-amber-700 border-amber-200",
    "闲置": "bg-slate-50 text-slate-700 border-slate-200",
    "报废": "bg-red-50 text-red-700 border-red-200",
    "待验收": "bg-blue-50 text-blue-700 border-blue-200",
    "外借": "bg-purple-50 text-purple-700 border-purple-200",
    ...statusColors
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到仪器信息</h2>
        <p className="text-muted-foreground">该仪器可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "manager",
      label: "负责人",
      value: equipment.manager?.name || "未指定",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "location",
      label: "存放位置",
      value: equipment.location,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: equipment.department,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "category",
      label: "仪器类型",
      value: (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          {equipment.category}
        </Badge>
      ),
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "使用状态",
      value: (
        <Badge 
          className={
            equipment.status === "在用" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : equipment.status === "维修中" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : equipment.status === "闲置"
                  ? "bg-slate-50 text-slate-700 border-slate-200"
                  : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {equipment.status}
        </Badge>
      ),
      icon: equipment.status === "在用" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : equipment.status === "维修中" 
          ? <Wrench className="h-4 w-4 text-amber-500" /> 
          : <AlertCircle className="h-4 w-4 text-slate-500" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={equipment}
        showRightSidebar={false}
        hiddenTabs={["stockIn", "application", "process", "funds", "achievements", "risks", "reports", "statistics", "documents", "members", "custom"]}
        hiddenFields={["period"]} 
        hiddenActions={[]} 
        tabComponents={{
          overview: <EquipmentOverviewTab data={equipment} />,
          booking: <EquipmentBookingTab data={equipment} />,
          maintenance: <EquipmentMaintenanceTab data={equipment} />,
          recommendations: <EquipmentRecommendationTab data={equipment} />
        }}
        customTabLabels={{
          overview: "基本信息",
          booking: "预约记录",
          maintenance: "维护记录",
          recommendations: "相关推荐"
        }}
        tabsHeight={45}
        headerHeight={65}
        buttonsHeight={42}
        moduleType="custom"
        customBackPath="/laboratory/equipment"
        statusColors={equipmentStatusColors}
        onBack={handleBack}
        onTitleEdit={handleTitleEdit}
        onDelete={handleDelete}
        customActions={[]}
        customFields={customFields}
      />
    </div>
  )
} 