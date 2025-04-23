"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import ReviewSidebar from "@/app/todos/[id]/components/review-sidebar"
import { initialAchievementItems } from "../../../data/achievements-data"
import AcademicPaperOverviewTab from "../components/academic-paper-overview-tab"
import AcademicPaperRisksTab from "../components/academic-paper-risks-tab"
import AcademicPaperRelatedProjectsTab from "../components/academic-paper-related-projects-tab"
import AcademicPaperDocumentsTab from "../components/academic-paper-documents-tab"
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
  BookOpen,
  Award,
  Users
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AcademicPaperAuditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = use(params).id
  const [paper, setPaper] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找学术论文数据
      const foundPaper = initialAchievementItems.find(item => item.id === id && item.type === "学术论文")
      
      if (foundPaper) {
        // 确保作者信息格式正确
        if (foundPaper.author && typeof foundPaper.author === 'object') {
          const formattedAuthor = {
            id: foundPaper.author.id,
            name: foundPaper.author.name,
            avatar: foundPaper.author.avatar
          }
          
          setPaper({
            ...foundPaper,
            author: formattedAuthor
          })
        } else {
          setPaper(foundPaper)
        }
      }
    } catch (error) {
      console.error("Error fetching academic paper data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/achievements")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (paper) {
      setPaper({ ...paper, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此学术论文记录吗？")) {
      alert("删除成功")
      router.push("/achievements")
    }
  }

  // 自定义状态颜色
  const statusColors = {
    "已发表": "bg-green-50 text-green-700 border-green-200",
    "审核中": "bg-amber-50 text-amber-700 border-amber-200",
    "撰写中": "bg-blue-50 text-blue-700 border-blue-200",
    "已退回": "bg-red-50 text-red-700 border-red-200"
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!paper) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到学术论文记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "author",
      label: "第一作者",
      value: paper.author.name,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "level",
      label: "论文级别",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {paper.level}
        </Badge>
      ),
      icon: <Award className="h-4 w-4" />,
    },
    {
      id: "venue",
      label: "发表期刊",
      value: paper.venue,
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "date",
      label: "发表日期",
      value: paper.date || "未发表",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "project",
      label: "所属项目",
      value: paper.project.name,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "coAuthors",
      label: "合作作者",
      value: paper.coAuthors ? `${paper.coAuthors.length} 人` : "无",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "状态",
      value: (
        <Badge 
          className={
            paper.status === "已发表" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : paper.status === "审核中" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
          }
        >
          {paper.status}
        </Badge>
      ),
      icon: paper.status === "已发表" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : paper.status === "审核中" 
          ? <Clock className="h-4 w-4 text-amber-500" /> 
          : <FileText className="h-4 w-4 text-blue-500" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="flex-1 pr-[350px]"> {/* 为右侧审核面板留出空间 */}
          <UniversalDetailAdapter
            itemData={paper}
            showRightSidebar={false}
            hiddenTabs={["process", "funds", "achievements", "reports", "statistics", "members"]}
            hiddenFields={["period"]} 
            hiddenActions={[]} 
            tabComponents={{
              overview: <AcademicPaperOverviewTab data={paper} />,
              risks: <AcademicPaperRisksTab data={paper} />,
              documents: <AcademicPaperDocumentsTab data={paper} />,
              custom: <AcademicPaperRelatedProjectsTab data={paper} />
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
          {paper.description && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-900 mb-2">论文简介</h3>
              <p className="text-sm text-slate-700 whitespace-pre-line">{paper.description}</p>
            </div>
          )}
        </div>
        
        {/* 右侧审核信息面板 */}
        <ReviewSidebar 
          status={paper.status}
          projectId={paper.id}
          projectTitle={paper.name}
          showReviewTab={true}
          showReviewHistoryTab={true}
          showOperationHistoryTab={true}
        />
      </div>
    </div>
  )
}
