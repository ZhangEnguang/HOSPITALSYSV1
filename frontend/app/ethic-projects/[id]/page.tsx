"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockEthicProjects } from "../data/ethic-project-data"
import { toast } from "@/components/ui/use-toast"
import TodoDetailAdapter from "@/components/detail-page/todo-detail-adapter"
import { adaptEthicProjectForDetail } from "@/lib/adapters/ethic-project-adapter"
import "./styles.css"

// 添加全局样式覆盖
const globalStyles = `
  /* 覆盖详情页右侧空白区域的样式 */
  .ethic-project-detail div[class*="overflow-auto"] {
    padding-right: 0 !important;
  }
`;

export default function EthicProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 模拟API调用获取项目详情
    const getProjectDetail = () => {
      setLoading(true)
      try {
        // 从模拟数据中查找项目
        const foundProject = mockEthicProjects.find(p => p.id === params.id)
        
        if (foundProject) {
          setProject(foundProject)
        } else {
          toast({
            title: "未找到项目",
            description: "无法找到指定的伦理项目，请返回项目列表重试",
            variant: "destructive",
          })
          // 延迟跳转回项目列表
          setTimeout(() => {
            router.push("/ethic-projects")
          }, 2000)
        }
      } catch (error) {
        console.error("获取项目详情失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载伦理项目详情，请稍后再试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getProjectDetail()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">加载项目详情...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <p className="mt-4 text-muted-foreground">未找到项目，正在返回项目列表...</p>
          </div>
        </div>
      </div>
    )
  }

  // 使用适配器转换项目数据为TodoDetailAdapter所需格式
  const adaptedProject = adaptEthicProjectForDetail(project)

  // 处理返回项目列表
  const handleBackToList = () => {
    if (project.type === "动物伦理") {
      router.push("/ethic-projects/animal")
    } else {
      router.push("/ethic-projects/human")
    }
  }

  // 处理编辑项目标题
  const handleTitleEdit = (newTitle: string) => {
    setProject((prev: any) => ({
      ...prev,
      name: newTitle
    }))

    toast({
      title: "已更新项目标题",
      description: "项目标题已成功更新"
    })
  }

  return (
    <>
      {/* 添加全局样式 */}
      <style jsx global>{globalStyles}</style>
      
      <div className="ethic-project-detail">
        <TodoDetailAdapter 
          todoData={adaptedProject}
          onBack={handleBackToList}
          onTitleEdit={handleTitleEdit}
          showReviewSidebar={false}
          hiddenTabs={["achievements", "funds"]}
          customFields={[
            {
              id: "animalType",
              label: "动物种类",
              value: project.animalType,
              icon: null
            },
            {
              id: "animalCount",
              label: "动物数量",
              value: project.animalCount,
              icon: null
            },
            {
              id: "facilityUnit",
              label: "实验设施单位",
              value: project.facilityUnit,
              icon: null
            }
          ]}
        />
      </div>
    </>
  )
} 