"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PatentsForm } from "./components/patents-form"
import { Skeleton } from "@/components/ui/skeleton"

// 模拟从API获取专利详情的函数
async function getPatent(id: string) {
  // 实际项目中应该从API获取数据
  // 这里模拟一个延迟加载
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        patentNumber: "ZL202110123456.8",
        patentName: "一种基于AI的智能识别系统",
        patentType: "invention",
        patentStatus: "authorized",
        applicationDate: "2021-05-15",
        approvalDate: "2022-08-20",
        inventors: "张三",
        affiliatedUnit: "高校科研创新智能服务平台",
        patentAbstract: "本发明提供一种基于人工智能的智能识别系统，通过深度学习算法实现对图像、视频中物体的精准识别和分类。",
        disciplineCategory: "计算机科学与技术",
        applicationArea: "人工智能、图像识别",
        files: []
      })
    }, 1000)
  })
}

export default function PatentEditPage({
  params,
}: {
  params: { id: string }
}) {
  const [patent, setPatent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatent(params.id)
        setPatent(data)
      } catch (error) {
        console.error("获取专利数据失败", error)
        // 如果获取数据失败，可以跳转到404页面
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-2" disabled>
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">编辑专利</h1>
      </div>
      <PatentsForm initialData={patent} mode="edit" />
    </div>
  )
} 