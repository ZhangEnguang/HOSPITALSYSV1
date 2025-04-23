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
  ClipboardCheck
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import EvaluatedAchievementOverviewTab from "./components/evaluated-achievement-overview-tab"
import EvaluatedAchievementDocumentsTab from "./components/evaluated-achievement-documents-tab"
import EvaluatedAchievementRelatedProjectsTab from "./components/evaluated-achievement-related-projects-tab"

// 导入示例数据
import { initialAchievementItems } from "../../data/achievements-data"

export default function EvaluatedAchievementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [achievement, setAchievement] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找鉴定成果数据
      const foundAchievement = initialAchievementItems.find(item => item.id === id && item.type === "鉴定成果")
      
      if (foundAchievement) {
        // 确保作者信息格式正确
        if (foundAchievement.author && typeof foundAchievement.author === 'object') {
          const formattedAuthor = {
            id: foundAchievement.author.id,
            name: foundAchievement.author.name,
            avatar: foundAchievement.author.avatar
          }
          
          setAchievement({
            ...foundAchievement,
            author: formattedAuthor
          })
        } else {
          setAchievement(foundAchievement)
        }
      }
    } catch (error) {
      console.error("Error fetching evaluated achievement data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/achievements")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (achievement) {
      setAchievement({ ...achievement, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此鉴定成果记录吗？")) {
      alert("删除成功")
      router.push("/achievements")
    }
  }

  // 自定义状态颜色
  const statusColors = {
    "已鉴定": "bg-green-50 text-green-700 border-green-200",
    "鉴定中": "bg-amber-50 text-amber-700 border-amber-200",
    "已退回": "bg-red-50 text-red-700 border-red-200"
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!achievement) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到鉴定成果记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "author",
      label: "第一作者",
      value: achievement.author.name,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "level",
      label: "鉴定级别",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {achievement.level}
        </Badge>
      ),
      icon: <Award className="h-4 w-4" />,
    },
    {
      id: "venue",
      label: "鉴定机构",
      value: achievement.venue,
      icon: <ClipboardCheck className="h-4 w-4" />,
    },
    {
      id: "date",
      label: "鉴定日期",
      value: achievement.date || "未鉴定",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "appraisalNumber",
      label: "鉴定编号",
      value: achievement.appraisalNumber || "无",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "appraisalResult",
      label: "鉴定结果",
      value: achievement.appraisalResult || "待定",
      icon: <Award className="h-4 w-4" />,
    },
    {
      id: "project",
      label: "所属项目",
      value: achievement.project.name,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "coAuthors",
      label: "参与人员",
      value: achievement.coAuthors ? `${achievement.coAuthors.length} 人` : "无",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "状态",
      value: (
        <Badge 
          className={
            achievement.status === "已鉴定" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : achievement.status === "鉴定中" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {achievement.status}
        </Badge>
      ),
      icon: achievement.status === "已鉴定" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : achievement.status === "鉴定中" 
          ? <Clock className="h-4 w-4 text-amber-500" /> 
          : <AlertCircle className="h-4 w-4 text-red-500" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={achievement}
        showRightSidebar={false}
        hiddenTabs={["process", "funds", "achievements", "reports", "statistics", "members", "risks"]}
        hiddenFields={["period"]} 
        hiddenActions={[]} 
        tabComponents={{
          overview: <EvaluatedAchievementOverviewTab data={achievement} />,
          documents: <EvaluatedAchievementDocumentsTab data={achievement} />,
          custom: <EvaluatedAchievementRelatedProjectsTab data={achievement} />
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
