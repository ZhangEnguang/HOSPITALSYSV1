"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import UniversalDetailAdapter from "@/components/universal-detail/universal-detail-adapter"
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
  Award,
  Users,
  BookOpen,
  Lightbulb
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import PatentOverviewTab from "./components/patent-overview-tab"
import PatentDocumentsTab from "./components/patent-documents-tab"
import PatentRelatedProjectsTab from "./components/patent-related-projects-tab"

// 导入示例数据
import { initialAchievementItems } from "../../data/achievements-data"

export default function PatentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [patent, setPatent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找专利数据
      const foundPatent = initialAchievementItems.find(item => item.id === id && item.type === "专利")
      
      if (foundPatent) {
        // 确保作者信息格式正确
        if (foundPatent.author && typeof foundPatent.author === 'object') {
          const formattedAuthor = {
            id: foundPatent.author.id,
            name: foundPatent.author.name,
            avatar: foundPatent.author.avatar
          }
          
          setPatent({
            ...foundPatent,
            author: formattedAuthor
          })
        } else {
          setPatent(foundPatent)
        }
      }
    } catch (error) {
      console.error("Error fetching patent data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/achievements")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (patent) {
      setPatent({ ...patent, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此专利记录吗？")) {
      alert("删除成功")
      router.push("/achievements")
    }
  }

  // 自定义状态颜色
  const statusColors = {
    "已授权": "bg-green-50 text-green-700 border-green-200",
    "申请中": "bg-amber-50 text-amber-700 border-amber-200",
    "已公开": "bg-blue-50 text-blue-700 border-blue-200",
    "已驳回": "bg-red-50 text-red-700 border-red-200",
    "已放弃": "bg-slate-50 text-slate-700 border-slate-200"
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!patent) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到专利记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "author",
      label: "第一发明人",
      value: patent.author.name,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "patentType",
      label: "专利类型",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {patent.patentType || "发明专利"}
        </Badge>
      ),
      icon: <Lightbulb className="h-4 w-4" />,
    },
    {
      id: "patentNumber",
      label: "专利号",
      value: patent.patentNumber || "CN123456789A",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "applicationDate",
      label: "申请日期",
      value: patent.applicationDate || patent.date,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "project",
      label: "所属项目",
      value: patent.project?.name || "未关联项目",
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "coAuthors",
      label: "发明人员",
      value: patent.coAuthors ? `${patent.coAuthors.length + 1} 人` : "1 人",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "状态",
      value: (
        <Badge 
          className={
            patent.status === "已授权" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : patent.status === "申请中" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : patent.status === "已公开"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {patent.status || "申请中"}
        </Badge>
      ),
      icon: patent.status === "已授权" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : patent.status === "申请中" 
          ? <Clock className="h-4 w-4 text-amber-500" /> 
          : patent.status === "已公开"
            ? <BookOpen className="h-4 w-4 text-blue-500" />
            : <AlertCircle className="h-4 w-4 text-red-500" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={patent}
        showRightSidebar={false}
        hiddenTabs={["process", "funds", "achievements", "reports", "statistics", "members", "risks"]}
        hiddenFields={["period"]} 
        hiddenActions={[]} 
        tabComponents={{
          overview: <PatentOverviewTab data={patent} />,
          documents: <PatentDocumentsTab data={patent} />,
          custom: <PatentRelatedProjectsTab data={patent} />
        }}
        tabsHeight={45}
        headerHeight={65}
        buttonsHeight={42}
        moduleType="achievement"
        customBackPath="/achievements"
        statusColors={statusColors}
        onBack={handleBack}
        onTitleEdit={handleTitleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
