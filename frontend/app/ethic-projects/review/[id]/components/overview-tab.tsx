"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  Copy,
  Building,
  User,
  PawPrint,
  Users,
  FileCheck,
  Tag,
  BadgeCheck,
  Info,
  Heart,
  Beaker,
  Microscope,
  Brain,
  Hourglass
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// 项目概览标签页组件
export default function EthicProjectOverviewTab({
  project
}: { 
  project: any 
}) {
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false)

  // 从project对象获取AI摘要内容
  const aiSummaryContent = project.aiSummary || ""
  const aiModelName = project.aiModelName || "EthicGPT 2024"
  const aiModelVersion = project.aiModelVersion || "v3.1"

  // 处理更新分析
  const handleUpdateAnalysis = () => {
    if (isUpdatingAnalysis) return

    setIsUpdatingAnalysis(true)
    toast({
      title: "正在更新分析",
      description: "AI正在重新分析最新项目数据...",
      duration: 2000,
    })

    // 模拟分析过程
    setTimeout(() => {
      setIsUpdatingAnalysis(false)
      toast({
        title: "分析完成",
        description: "AI智能摘要已更新",
        duration: 3000,
      })
    }, 3000)
  }

  // 获取项目类型图标
  const getProjectTypeIcon = () => {
    if (project.projectType === "动物") {
      return <PawPrint className="h-4 w-4 text-blue-500 mr-2" />
    } else {
      return <User className="h-4 w-4 text-blue-500 mr-2" />
    }
  }

  return (
    <div className="space-y-6">
      {/* AI智能摘要区域 */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm">
        {/* 添加渐变色线条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-1 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src="/ai-icon.png" alt="AI摘要" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <span>AI摘要</span>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2 tracking-wide font-normal border border-primary/20"
                  >
                    {aiModelVersion}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">AI模型: {aiModelName}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 relative bg-white hover:bg-primary/5 border border-slate-200 shadow-sm"
              onClick={handleUpdateAnalysis}
              disabled={isUpdatingAnalysis}
            >
              {isUpdatingAnalysis ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs">分析中...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-xs">更新分析</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="pl-9 relative">
            {isUpdatingAnalysis && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-opacity-20 border-t-primary animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-amber-400 border-opacity-20 border-r-amber-400 animate-spin"></div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">AI模型分析中</div>
                </div>
                <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-progress rounded-full"></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">正在处理项目数据并生成智能洞察...</div>
              </div>
            )}

            {/* AI摘要内容 */}
            <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {aiSummaryContent}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目基本信息区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">项目信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-2 text-gray-500">基本信息</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">项目名称</p>
                      <p className="text-sm text-gray-600">{project.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Tag className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">审查类型</p>
                      <p className="text-sm text-gray-600">{project.reviewType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    {getProjectTypeIcon()}
                    <div>
                      <p className="text-sm font-medium text-gray-700">项目类型</p>
                      <p className="text-sm text-gray-600">{project.projectType}伦理</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">负责人</p>
                      <p className="text-sm text-gray-600">{project.leader}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Building className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">所属院系</p>
                      <p className="text-sm text-gray-600">{project.department}</p>
                    </div>
                  </div>
                  
                  {project.projectType === "动物" && (
                    <>
                      <div className="flex items-start">
                        <PawPrint className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">动物种系</p>
                          <p className="text-sm text-gray-600">{project.animalType}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">动物数量</p>
                          <p className="text-sm text-gray-600">{project.animalCount}</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {project.projectType === "人体" && (
                    <div className="flex items-start">
                      <Users className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">参与人数</p>
                        <p className="text-sm text-gray-600">{project.participantCount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-2 text-gray-500">审查信息</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FileCheck className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">受理号</p>
                      <p className="text-sm text-gray-600">{project.reviewNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">伦理委员会</p>
                      <p className="text-sm text-gray-600">{project.ethicsCommittee}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">提交时间</p>
                      <p className="text-sm text-gray-600">{project.submittedAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">审核期限</p>
                      <p className="text-sm text-gray-600">{project.deadline}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <BadgeCheck className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">审核状态</p>
                      <p className="flex items-center">
                        <Badge className={cn(
                          "mt-1",
                          project.status === "审核通过" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          project.status === "待审核" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                          project.status === "已退回" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        )}>
                          {project.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  
                  {project.approvedAt && (
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">通过时间</p>
                        <p className="text-sm text-gray-600">{project.approvedAt}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.returnedAt && (
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">退回时间</p>
                        <p className="text-sm text-gray-600">{project.returnedAt}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2 text-gray-500">审核进度</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">完成度</span>
                    <span className="text-gray-700 font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="font-medium text-sm mb-3 text-gray-500">项目描述</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {project.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 