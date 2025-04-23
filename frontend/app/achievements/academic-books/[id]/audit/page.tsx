"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReviewSidebar from "@/app/todos/[id]/components/review-sidebar"
import { initialAchievementItems } from "../../../data/achievements-data"
import AcademicBookOverviewTab from "../components/academic-book-overview-tab"
import AcademicBookDocumentsTab from "../components/academic-book-documents-tab"
import AcademicBookRelatedProjectsTab from "../components/academic-book-related-projects-tab"
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
  Users,
  BookMarked
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RisksAndIssues } from "./components/risks-and-issues"

export default function AcademicBookAuditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [book, setBook] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从模拟数据中查找学术著作数据
      const foundBook = initialAchievementItems.find(item => item.id === id && item.type === "学术著作")
      
      if (foundBook) {
        // 确保作者信息格式正确
        if (foundBook.author && typeof foundBook.author === 'object') {
          const formattedAuthor = {
            id: foundBook.author.id,
            name: foundBook.author.name,
            avatar: foundBook.author.avatar
          }
          
          setBook({
            ...foundBook,
            author: formattedAuthor,
            isbn: foundBook.isbn || "978-7-XXXXX-XXX-X",
            publisher: foundBook.venue || "高等教育出版社",
            publishDate: foundBook.date || "2023-06-15",
            pages: foundBook.pages || 320,
            language: "中文",
            edition: "第1版",
            category: "计算机科学",
            subcategory: "人工智能",
            price: 78.00,
            sales: 1200,
            citations: 15,
            chapters: [
              { title: "绪论", pages: "1-20" },
              { title: "基本概念", pages: "21-50" },
              { title: "核心算法", pages: "51-120" },
              { title: "应用案例", pages: "121-200" },
              { title: "未来展望", pages: "201-300" },
              { title: "附录", pages: "301-320" }
            ]
          })
        } else {
          setBook({
            ...foundBook,
            isbn: "978-7-XXXXX-XXX-X",
            publisher: foundBook.venue || "高等教育出版社",
            publishDate: foundBook.date || "2023-06-15",
            pages: foundBook.pages || 320,
            language: "中文",
            edition: "第1版",
            category: "计算机科学",
            subcategory: "人工智能",
            price: 78.00,
            sales: 1200,
            citations: 15,
            chapters: [
              { title: "绪论", pages: "1-20" },
              { title: "基本概念", pages: "21-50" },
              { title: "核心算法", pages: "51-120" },
              { title: "应用案例", pages: "121-200" },
              { title: "未来展望", pages: "201-300" },
              { title: "附录", pages: "301-320" }
            ]
          })
        }
      }
    } catch (error) {
      console.error("Error fetching academic book data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/achievements")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (book) {
      setBook({ ...book, name: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此学术著作记录吗？")) {
      alert("删除成功")
      router.push("/achievements")
    }
  }

  // 自定义状态颜色
  const statusColors = {
    "已出版": "bg-green-50 text-green-700 border-green-200",
    "编写中": "bg-blue-50 text-blue-700 border-blue-200",
    "审核中": "bg-amber-50 text-amber-700 border-amber-200",
    "已退回": "bg-red-50 text-red-700 border-red-200"
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到学术著作记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "author",
      label: "第一作者",
      value: book.author.name,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "publisher",
      label: "出版社",
      value: book.publisher,
      icon: <BookMarked className="h-4 w-4" />,
    },
    {
      id: "isbn",
      label: "ISBN",
      value: book.isbn,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "publishDate",
      label: "出版日期",
      value: book.publishDate || "未出版",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "project",
      label: "所属项目",
      value: book.project.name,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "coAuthors",
      label: "合作作者",
      value: book.coAuthors ? `${book.coAuthors.length} 人` : "无",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "status",
      label: "状态",
      value: (
        <Badge 
          className={
            book.status === "已出版" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : book.status === "审核中" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
          }
        >
          {book.status}
        </Badge>
      ),
      icon: book.status === "已出版" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : book.status === "审核中" 
          ? <Clock className="h-4 w-4 text-amber-500" /> 
          : <FileText className="h-4 w-4 text-blue-500" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="flex-1 pr-[350px]"> {/* 为右侧审核面板留出空间 */}
          <UniversalDetailAdapter
            itemData={book}
            showRightSidebar={false}
            hiddenTabs={["process", "funds", "achievements", "reports", "statistics", "members"]}
            hiddenFields={["period"]} 
            hiddenActions={[]} 
            tabComponents={{
              overview: <AcademicBookOverviewTab data={book} />,
              documents: <AcademicBookDocumentsTab data={book} />,
              risks: <RisksAndIssues projectId={book?.id || ""} />,
              custom: <AcademicBookRelatedProjectsTab data={book} />
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
          {book.description && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-900 mb-2">著作简介</h3>
              <p className="text-sm text-slate-700 whitespace-pre-line">{book.description}</p>
            </div>
          )}
        </div>
        
        {/* 右侧审核信息面板 */}
        <ReviewSidebar 
          status={book.status}
          projectId={book.id}
          projectTitle={book.name}
          showReviewTab={true}
          showReviewHistoryTab={true}
          showOperationHistoryTab={true}
        />
      </div>
    </div>
  )
}
