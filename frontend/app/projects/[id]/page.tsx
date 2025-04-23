"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TodoDetailAdapter from "@/components/detail-page/todo-detail-adapter"
import { getProjectById } from "@/lib/api/project"
import { Skeleton } from "@/components/ui/skeleton"
import { adaptProjectForDetail } from "@/lib/adapters/project-adapter"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [projectData, setProjectData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取项目详情
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true)
      try {
        const data = await getProjectById(params.id)
        setProjectData(data)
        setError(null)
      } catch (err) {
        console.error("获取项目详情失败:", err)
        setError("获取项目详情失败，请稍后重试")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProjectData()
    }
  }, [params.id])

  // 处理返回列表
  const handleBackToList = () => {
    router.push("/projects")
  }

  // 处理编辑项目标题
  const handleTitleEdit = (newTitle: string) => {
    // 更新项目标题，实际应调用API
    setProjectData((prev: any) => ({
      ...prev,
      name: newTitle,
    }))
  }

  // 如果正在加载，显示骨架屏
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-medium">加载失败</h2>
          <p>{error}</p>
          <button 
            onClick={handleBackToList}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            返回项目列表
          </button>
        </div>
      </div>
    )
  }

  // 使用适配器将API返回的数据转换为TodoDetailAdapter需要的格式
  const todoData = projectData ? adaptProjectForDetail(projectData) : null

  // 如果没有数据，显示空状态
  if (!projectData || !todoData) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium">项目不存在</h2>
          <p>找不到ID为 {params.id} 的项目</p>
          <button 
            onClick={handleBackToList}
            className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            返回项目列表
          </button>
        </div>
      </div>
    )
  }

  // 渲染项目详情
  return (
    <TodoDetailAdapter 
      todoData={todoData}
      onBack={handleBackToList}
      onTitleEdit={handleTitleEdit}
    />
  )
}
