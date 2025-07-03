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
  HomeIcon,
  Building,
  MapPin,
  Thermometer,
  Droplets,
  Users
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import AnimalRoomOverviewTab from "./components/animal-room-overview-tab"
import AnimalRoomManagementTab from "./components/animal-room-management-tab"

// 导入示例数据
import { allDemoAnimalRoomItems } from "../data/animal-rooms-demo-data"
import { statusColors } from "../config/animal-rooms-config"

export default function AnimalRoomDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [animalRoom, setAnimalRoom] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找动物房数据
      const foundAnimalRoom = allDemoAnimalRoomItems.find(item => item.id === id)
    
      if (foundAnimalRoom) {
        setAnimalRoom(foundAnimalRoom)
      }
    } catch (error) {
      console.error("Error fetching animal room data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/laboratory/animal-rooms")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (animalRoom) {
      setAnimalRoom({ ...animalRoom, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此动物房吗？")) {
      alert("删除成功")
      router.push("/laboratory/animal-rooms")
    }
  }

  // 自定义状态颜色
  const animalRoomStatusColors = {
    "使用中": "bg-green-50 text-green-700 border-green-200",
    "维修中": "bg-amber-50 text-amber-700 border-amber-200",
    "清洁中": "bg-blue-50 text-blue-700 border-blue-200",
    "空闲": "bg-slate-50 text-slate-700 border-slate-200",
    "停用": "bg-red-50 text-red-700 border-red-200",
    ...statusColors
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!animalRoom) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到动物房信息</h2>
        <p className="text-muted-foreground">该动物房可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "manager",
      label: "管理员",
      value: animalRoom.manager || "未指定",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "location",
      label: "位置",
      value: animalRoom.location,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: animalRoom.department,
      icon: <Building className="h-4 w-4" />,
    },
    {
      id: "type",
      label: "房间类型",
      value: (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          {animalRoom.type}
        </Badge>
      ),
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "房间状态",
      value: (
        <Badge 
          className={
            animalRoom.status === "使用中" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : animalRoom.status === "维修中" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : animalRoom.status === "清洁中"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : animalRoom.status === "空闲"
                    ? "bg-slate-50 text-slate-700 border-slate-200"
                    : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {animalRoom.status}
        </Badge>
      ),
      icon: animalRoom.status === "使用中" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : animalRoom.status === "维修中"
          ? <AlertCircle className="h-4 w-4 text-amber-500" /> 
          : animalRoom.status === "清洁中"
            ? <Clock className="h-4 w-4 text-blue-500" />
            : <AlertCircle className="h-4 w-4 text-slate-500" />,
    },
    {
      id: "capacity",
      label: "容量信息",
      value: `${animalRoom.currentOccupancy}/${animalRoom.capacity}只`,
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "environment",
      label: "环境条件",
      value: `${animalRoom.temperature}°C / ${animalRoom.humidity}%`,
      icon: <Thermometer className="h-4 w-4" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={animalRoom}
        showRightSidebar={false}
        hiddenTabs={["booking", "maintenance", "process", "funds", "achievements", "risks", "reports", "statistics", "documents", "members", "stockIn", "application", "recommendations", "aiAnalysis"]}
        hiddenFields={["period"]} 
        hiddenActions={[]} 
        tabComponents={{
          overview: <AnimalRoomOverviewTab data={animalRoom} />,
          custom: <AnimalRoomManagementTab data={animalRoom} />
        }}
        customTabLabels={{
          overview: "基本信息",
          custom: "饲养管理"
        }}
        tabsHeight={45}
        headerHeight={65}
        buttonsHeight={42}
        moduleType="custom"
        customBackPath="/laboratory/animal-rooms"
        statusColors={animalRoomStatusColors}
        onBack={handleBack}
        onTitleEdit={handleTitleEdit}
        onDelete={handleDelete}
        customActions={[]}
        customFields={customFields}
      />
    </div>
  )
} 