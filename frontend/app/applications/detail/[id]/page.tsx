"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import TodoDetailAdapter from "@/components/detail-page/todo-detail-adapter"
import { extendedApplicationItems } from "../../data/applications-data"

export default function ApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const urlId = params.id as string
  const [application, setApplication] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 处理URL中的ID格式
      // 可能是"2022-batch-1-project-1"格式，我们需要提取出"2022-batch-1"部分
      let searchId = urlId;
      
      // 如果ID包含"-project-"，提取批次部分
      if (urlId.includes("-project-")) {
        const parts = urlId.split("-project-");
        searchId = parts[0];
      }
      
      console.log("搜索的批次ID:", searchId);
      console.log("可用的批次IDs:", extendedApplicationItems.map(item => item.id));
      
      // 查找对应ID的申报批次
      const foundApplication = extendedApplicationItems.find((item) => 
        item.id === searchId || item.id === urlId
      );
      
      if (foundApplication) {
        console.log("找到匹配的申报批次:", foundApplication.id);
        setApplication(foundApplication);
      } else {
        // 如果找不到精确匹配，尝试部分匹配
        const partialMatch = extendedApplicationItems.find(item => 
          urlId.startsWith(item.id) || item.id.startsWith(urlId)
        );
        
        if (partialMatch) {
          console.log("找到部分匹配的申报批次:", partialMatch.id);
          setApplication(partialMatch);
        } else {
          console.log("未找到申报批次:", urlId);
        }
      }
    } catch (error) {
      console.error("查找申报批次失败:", error)
    } finally {
      setIsLoading(false)
    }
  }, [urlId])

  const handleTitleEdit = (newTitle: string) => {
    if (application) {
      setApplication({ ...application, name: newTitle })
    }
  }

  const handleBack = () => {
    router.push("/applications")
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到申报批次</h2>
        <p className="text-muted-foreground">该申报批次可能已被删除或不存在</p>
      </div>
    )
  }

  // 将申报批次数据转换为适合TodoDetailAdapter的格式
  const adaptedApplicationData = {
    id: application.id,
    title: application.name,
    status: application.status,
    applicant: typeof application.applicant === 'object' ? application.applicant : { name: application.applicant },
    priority: application.priority || "普通",
    description: application.description || "",
    createdAt: application.date,
    dueDate: application.deadline,
    type: application.type,
    category: application.category,
    amount: application.amount,
    batchNumber: application.batchNumber,
    projectCount: application.projectCount,
    progress: application.progress,
  }

  // 自定义字段配置
  const customFields = [
    { id: "type", label: "申报类型", value: application.type, icon: null },
    { id: "category", label: "申报类别", value: application.category, icon: null },
    { id: "batchNumber", label: "批次编号", value: application.batchNumber, icon: null },
    { id: "amount", label: "申报总金额(万元)", value: application.amount?.toFixed(2), icon: null },
    { id: "date", label: "开始日期", value: application.date, icon: null },
    { id: "deadline", label: "截止日期", value: application.deadline, icon: null },
    { id: "projectCount", label: "申报项目数", value: application.projectCount, icon: null },
    { id: "progress", label: "完成进度", value: `${application.progress}%`, icon: null },
  ]

  return (
    <TodoDetailAdapter
      todoData={adaptedApplicationData}
      showReviewSidebar={false}
      hiddenTabs={["risks"]} 
      hiddenFields={[]} 
      hiddenActions={[]}
      customFields={customFields}
      onBack={handleBack}
      onTitleEdit={handleTitleEdit}
    />
  )
}
