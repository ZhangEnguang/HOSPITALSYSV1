"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { initialReviewItems } from "../data/initial-review-demo-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Eye, FileEdit, Trash2, Clock, CheckCircle, XCircle, AlertCircle, ClipboardCheck } from "lucide-react"
import { statusVariants } from "../config/initial-review-config"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function InitialReviewDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      // 确保params不为null
      if (params) {
        const id = params.id as string
        const foundItem = initialReviewItems.find(item => item.id === id)
        setItem(foundItem || null)
      }
      setLoading(false)
    }, 500)
  }, [params])

  const handleGoBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/initial-review/${item?.id}/edit`)
  }

  const handleReview = () => {
    toast({
      title: "审核项目",
      description: "审核功能开发中",
    })
  }

  const handleDelete = () => {
    toast({
      title: "删除项目",
      description: "删除功能开发中",
    })
  }

  if (loading) {
    return <div className="p-8 text-center">加载中...</div>
  }

  if (!item) {
    return <div className="p-8 text-center">未找到项目</div>
  }

  // 获取项目状态对应的样式
  const statusVariant = statusVariants[item.status] || { color: "bg-gray-100 text-gray-700 border-gray-300" }

  // 项目操作按钮
  const actions = [
    {
      label: "返回列表",
      icon: <ArrowLeft className="h-4 w-4" />,
      onClick: handleGoBack,
    },
    {
      label: "编辑项目",
      icon: <FileEdit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "审核项目",
      icon: <ClipboardCheck className="h-4 w-4" />,
      onClick: handleReview,
    },
    {
      label: "删除项目",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
    },
  ]

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <Badge variant="outline" className={cn("px-2 py-0.5 border", statusVariant.color)}>
            {item.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          {actions.slice(1).map((action, index) => (
            <Button key={index} variant="outline" onClick={action.onClick} className="gap-2">
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧：项目基本信息 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>项目基本信息</CardTitle>
            <CardDescription>项目详细信息和描述</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">项目编号</p>
                <p>{item.projectId}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">项目类型</p>
                <p>{item.projectType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">所属院系</p>
                <p>{item.department}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">伦理委员会</p>
                <p>{item.ethicsCommittee}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">截止日期</p>
                <p>{item.dueDate || "-"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">实际完成日期</p>
                <p>{item.actualDate || "-"}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">项目描述</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">完成进度</p>
              <div className="flex items-center gap-2">
                <Progress value={item.completion} className="h-2 flex-1" />
                <span className="text-xs text-gray-500">{item.completion}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 右侧：项目负责人和审核信息 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>项目负责人</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={item.projectLeader?.avatar} alt={item.projectLeader?.name} />
                  <AvatarFallback>{item.projectLeader?.name?.charAt(0) || "-"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.projectLeader?.name || "-"}</p>
                  <p className="text-sm text-gray-500">{item.projectLeader?.title || "-"}</p>
                  <p className="text-sm text-gray-500">{item.projectLeader?.department || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>审查状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">审查状态</p>
                  <Badge variant="outline" className={cn("px-2 py-0.5 border", statusVariant.color)}>
                    {item.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">审查结果</p>
                  <p>{item.reviewResult || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">优先级</p>
                  <p>{item.priority || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">评论数</p>
                  <p>{item.comments || 0}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full gap-2" onClick={handleReview}>
                <ClipboardCheck className="h-4 w-4" />
                审核项目
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 