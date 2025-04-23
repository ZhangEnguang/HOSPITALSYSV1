"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  ProjectCategoryTab
} from "./components/project-category-tab"

export default function ProjectCategoryPage() {
  const router = useRouter()
  
  // 状态管理 - 固定为项目分类标签，先不支持预算标准
  const [activeTab, setActiveTab] = useState<"project-category" | "budget-standard">("project-category")

  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      <div className="container mx-auto py-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/auxiliary" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold text-blue-800">辅助管理</h1>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
              导入
            </Button>
            <Button size="sm" variant="outline" className="bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
              导出
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <ProjectCategoryTab />
        </div>
      </div>
    </div>
  )
} 