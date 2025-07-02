"use client"

import { useEffect, useState } from "react"
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
  Heart,
  Activity,
  Shield,
  MapPin,
  Building
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import AnimalOverviewTab from "./components/animal-overview-tab"
import AnimalHealthTab from "./components/animal-health-tab"
import AnimalExperimentTab from "./components/animal-experiment-tab"

// 导入示例数据
import { allDemoAnimalItems } from "../data/animal-files-demo-data"

export default function AnimalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [animal, setAnimal] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找动物数据
      const foundAnimal = allDemoAnimalItems.find(item => item.id === id)
      
      if (foundAnimal) {
        setAnimal(foundAnimal)
      }
    } catch (error) {
      console.error("Error fetching animal data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/laboratory/animal-files")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (animal) {
      setAnimal({ ...animal, animalId: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此动物档案吗？")) {
      alert("删除成功")
      router.push("/laboratory/animal-files")
    }
  }

  // 获取动物图标
  const getAnimalIcon = (species: string) => {
    const icons: Record<string, string> = {
      "小鼠": "🐭",
      "大鼠": "🐀", 
      "兔": "🐰",
      "豚鼠": "🐹",
      "猴": "🐒",
      "犬": "🐕"
    };
    return icons[species] || "🐾";
  }

  // 自定义状态颜色
  const animalStatusColors = {
    "健康": "bg-green-50 text-green-700 border-green-200",
    "观察中": "bg-amber-50 text-amber-700 border-amber-200",
    "治疗中": "bg-blue-50 text-blue-700 border-blue-200",
    "隔离": "bg-red-50 text-red-700 border-red-200",
    "退役": "bg-gray-50 text-gray-700 border-gray-200",
    "死亡": "bg-slate-50 text-slate-700 border-slate-200",
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!animal) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到动物档案</h2>
        <p className="text-muted-foreground">该动物档案可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "species",
      label: "动物种类",
      value: (
        <div className="flex items-center gap-2">
          <span className="text-lg">{getAnimalIcon(animal.species)}</span>
          <span>{animal.species}</span>
        </div>
      ),
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: "strain",
      label: "品系",
      value: animal.strain,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "gender",
      label: "性别",
      value: animal.gender,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "age",
      label: "年龄",
      value: `${animal.age}周`,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "weight",
      label: "体重",
      value: `${animal.weight}g`,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      id: "responsible",
      label: "责任人",
      value: animal.responsible || "未指定",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "location",
      label: "饲养位置",
      value: animal.location,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: animal.department,
      icon: <Building className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "健康状态",
      value: (
        <Badge 
          className={
            animal.status === "健康" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : animal.status === "观察中" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : animal.status === "治疗中"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : animal.status === "隔离"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : animal.status === "死亡"
                      ? "bg-gray-50 text-gray-700 border-gray-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
          }
        >
          {animal.status}
        </Badge>
      ),
      icon: animal.status === "健康" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : animal.status === "观察中" || animal.status === "治疗中"
          ? <Heart className="h-4 w-4 text-amber-500" /> 
          : <AlertCircle className="h-4 w-4 text-red-500" />,
    },
  ]

  // 自定义操作按钮
  const customActions = [
    {
      id: "edit",
      label: "编辑档案",
      icon: <Wrench className="h-4 w-4" />,
      onClick: () => router.push(`/laboratory/animal-files/edit/${id}`),
      variant: "outline" as const,
    },
    {
      id: "health",
      label: "健康记录",
      icon: <Heart className="h-4 w-4" />,
      onClick: () => router.push(`/laboratory/animal-files/health/${id}`),
      variant: "outline" as const,
    },
    {
      id: "experiment",
      label: "实验记录",
      icon: <Activity className="h-4 w-4" />,
      onClick: () => router.push(`/laboratory/animal-files/experiment/${id}`),
      variant: "outline" as const,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={{
          ...animal,
          name: animal.animalId,
          title: animal.animalId,
          subtitle: `${animal.species} · ${animal.strain} · ${animal.gender} · ${animal.age}周 · ${animal.weight}g`
        }}
        showRightSidebar={false}
        hiddenTabs={["maintenance", "stockIn", "application", "process", "funds", "achievements", "risks", "reports", "statistics", "documents", "members", "custom"]}
        hiddenFields={["period"]} 
        hiddenActions={["edit", "delete"]} 
        customActions={[]}
        tabComponents={{
          overview: <AnimalOverviewTab data={animal} />,
          recommendations: <AnimalHealthTab data={animal} />,
          booking: <AnimalExperimentTab data={animal} />
        }}
        customTabLabels={{
          overview: "基本信息",
          recommendations: "健康记录",
          booking: "实验记录"
        }}
        tabsHeight={45}
        headerHeight={65}
        buttonsHeight={42}
        moduleType="custom"
        customBackPath="/laboratory/animal-files"
        statusColors={animalStatusColors}
        onBack={handleBack}
        onTitleEdit={handleTitleEdit}
        onDelete={handleDelete}
        customFields={customFields.slice(0, 5)}
      />
    </div>
  )
} 