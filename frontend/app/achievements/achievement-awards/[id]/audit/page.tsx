"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReviewSidebar from "@/app/todos/[id]/components/review-sidebar"
import { initialAchievementItems } from "../../../data/achievements-data"
import AchievementAwardOverviewTab from "../components/achievement-award-overview-tab"
import AchievementAwardDocumentsTab from "../components/achievement-award-documents-tab"
import AchievementAwardRelatedProjectsTab from "../components/achievement-award-related-projects-tab"
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
  Medal
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AchievementAwardAuditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [award, setAward] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找成果获奖数据
      const foundAward = initialAchievementItems.find(item => item.id === id && item.type === "成果获奖")
      
      if (foundAward) {
        // 确保作者信息格式正确
        if (foundAward.author && typeof foundAward.author === 'object') {
          const formattedAuthor = {
            id: foundAward.author.id,
            name: foundAward.author.name,
            avatar: foundAward.author.avatar
          }
          
          setAward({
            ...foundAward,
            author: formattedAuthor
          })
        } else {
          setAward(foundAward)
        }
      }
    } catch (error) {
      console.error("Error fetching achievement award data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/achievements")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (award) {
      setAward({ ...award, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此成果获奖记录吗？")) {
      alert("删除成功")
      router.push("/achievements")
    }
  }

  // 自定义状态颜色
  const statusColors = {
    "已获奖": "bg-green-50 text-green-700 border-green-200",
    "申报中": "bg-amber-50 text-amber-700 border-amber-200",
    "准备中": "bg-blue-50 text-blue-700 border-blue-200",
    "已退回": "bg-red-50 text-red-700 border-red-200"
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!award) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到成果获奖记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "author",
      label: "第一完成人",
      value: award.author.name,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "level",
      label: "奖项级别",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {award.level}
        </Badge>
      ),
      icon: <Award className="h-4 w-4" />,
    },
    {
      id: "awardName",
      label: "奖项名称",
      value: award.awardName,
      icon: <Medal className="h-4 w-4" />,
    },
    {
      id: "venue",
      label: "颁奖机构",
      value: award.venue,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "date",
      label: "获奖日期",
      value: award.date || "未获奖",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "project",
      label: "所属项目",
      value: award.project.name,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "coAuthors",
      label: "完成人员",
      value: award.coAuthors ? `${award.coAuthors.length + 1} 人` : "1 人",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "状态",
      value: (
        <Badge 
          className={
            award.status === "已获奖" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : award.status === "申报中" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
          }
        >
          {award.status}
        </Badge>
      ),
      icon: award.status === "已获奖" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : award.status === "申报中" 
          ? <Clock className="h-4 w-4 text-amber-500" /> 
          : <FileText className="h-4 w-4 text-blue-500" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="flex-1 pr-[350px]"> {/* 为右侧审核面板留出空间 */}
          <UniversalDetailAdapter
            itemData={award}
            showRightSidebar={false}
            hiddenTabs={["process", "funds", "achievements", "reports", "statistics", "members", "risks"]}
            hiddenFields={["period"]} 
            hiddenActions={[]} 
            tabComponents={{
              overview: <AchievementAwardOverviewTab data={award} />,
              documents: <AchievementAwardDocumentsTab data={award} />,
              custom: <AchievementAwardRelatedProjectsTab data={award} />
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
          
          {/* 添加描述区域 */}
          {award.description && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-900 mb-2">获奖成果简介</h3>
              <p className="text-sm text-slate-700 whitespace-pre-line">{award.description}</p>
            </div>
          )}
        </div>
        
        {/* 右侧审核信息面板 */}
        <ReviewSidebar 
          status={award.status}
          projectId={award.id}
          projectTitle={award.name}
          showReviewTab={true}
          showReviewHistoryTab={true}
          showOperationHistoryTab={true}
        />
      </div>
    </div>
  )
}
