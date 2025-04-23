"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AchievementAwardsForm } from "./components/achievement-awards-form"
import { Skeleton } from "@/components/ui/skeleton"

// 模拟从API获取成果获奖详情的函数
async function getAchievementAward(id: string) {
  // 实际项目中应该从API获取数据
  // 这里模拟一个延迟加载
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        awardName: "AI视觉监控系统",
        awardLevel: "national",
        awardDate: "2023-11-05",
        awardingBody: "国家科技部",
        firstAuthor: "李四",
        secondAuthor: "王五",
        otherAuthors: "张三, 赵六",
        contribution: "负责系统总体设计与实现",
        rankingConfirmed: true,
        awardCategory: "科技进步奖",
        awardRank: "一等奖",
        certificateNumber: "GT-2023-0105",
        awardDescription: "该系统利用人工智能视觉识别技术，实现了对异常行为的实时监控和预警功能。",
        files: []
      })
    }, 1000)
  })
}

export default function AchievementAwardsEditPage({
  params,
}: {
  params: { id: string }
}) {
  const [award, setAward] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAchievementAward(params.id)
        setAward(data)
      } catch (error) {
        console.error("获取成果获奖数据失败", error)
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
        <h1 className="text-2xl font-bold">编辑成果奖励</h1>
      </div>
      <AchievementAwardsForm initialData={award} mode="edit" />
    </div>
  )
} 