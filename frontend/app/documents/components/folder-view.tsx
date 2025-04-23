"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash2, Share2, ExternalLink, Info } from "lucide-react"
import type { Document, Project } from "../data/documents-data"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// 我们需要改进 FolderView 组件以显示新增的项目和文件夹
// 确保在视图模式切换时内容保持一致

// 修改 researchTitles 数组，增加更多���究项目标���
const researchTitles = [
  "基于深度学习的城市交通流量预测研究",
  "新型纳米材料在光催化降解有机污染物中的应用",
  "人工智能辅助医学影像诊断系统的开发与验证",
  "气候变化对长江流域生态系统的影响研究",
  "量子计算在密码学中的应用前景分析",
  "中医药现代化研究：传统理论与现代科学的融合",
  "基于区块链技术的医疗数据安全共享机制研究",
  "高效太阳能电池材料的设计与性能优化",
  "城市空气污染物扩散模型的构建与验证",
  "脑机接口技术在康复医学中的应用研究",
  "基因编辑技术CRISPR/Cas9在遗传疾病治疗中的应用",
  "智能制造系统中的人机协作模式研究",
  "新型冠状病毒变异株的免疫逃逸机制研究",
  "可降解生物材料在组织工程中的应用进展",
  "大数据驱动的精准农业决策支持系统开发",
  "生物芯片技术在疾病早期诊断中的应用",
  "智慧城市建设中的数据安全与隐私保护",
  "虚拟现实技术在教育培训中的应用研究",
  "海洋微生物资源开发与生物活性物质筛选",
  "石墨烯基复合材料在能源存储领域的应用",
  "人工智能驱动的新药研发流程优化",
  "生物质能源转化技术的效率提升研究",
  "远程医疗系统的设计与临床应用评估",
  "智能传感网络在环境监测中的应用研究",
]

// 增加更多研究领域
const researchFields = [
  { name: "人工智能", color: "bg-blue-100 text-blue-800" },
  { name: "材料科学", color: "bg-purple-100 text-purple-800" },
  { name: "医学研究", color: "bg-green-100 text-green-800" },
  { name: "环境科学", color: "bg-teal-100 text-teal-800" },
  { name: "信息安全", color: "bg-red-100 text-red-800" },
  { name: "传统医学", color: "bg-amber-100 text-amber-800" },
  { name: "区块链", color: "bg-indigo-100 text-indigo-800" },
  { name: "新能源", color: "bg-emerald-100 text-emerald-800" },
  { name: "城市规划", color: "bg-sky-100 text-sky-800" },
  { name: "脑科学", color: "bg-violet-100 text-violet-800" },
  { name: "基因工程", color: "bg-pink-100 text-pink-800" },
  { name: "智能制造", color: "bg-orange-100 text-orange-800" },
  { name: "病毒学", color: "bg-rose-100 text-rose-800" },
  { name: "生物材料", color: "bg-lime-100 text-lime-800" },
  { name: "农业科技", color: "bg-cyan-100 text-cyan-800" },
  { name: "生物芯片", color: "bg-fuchsia-100 text-fuchsia-800" },
  { name: "智慧城市", color: "bg-yellow-100 text-yellow-800" },
  { name: "虚拟现实", color: "bg-blue-100 text-blue-800" },
  { name: "海洋生物", color: "bg-teal-100 text-teal-800" },
  { name: "能源存储", color: "bg-emerald-100 text-emerald-800" },
  { name: "药物研发", color: "bg-red-100 text-red-800" },
  { name: "生物能源", color: "bg-amber-100 text-amber-800" },
  { name: "远程医疗", color: "bg-violet-100 text-violet-800" },
  { name: "环境监测", color: "bg-green-100 text-green-800" },
]

interface FolderViewProps {
  projects?: Project[]
  documents: Document[]
  onFolderClick: (id: string) => void
}

export default function FolderView({ projects, documents, onFolderClick }: FolderViewProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Calculate folder size
  const calculateFolderSize = (projectId: string) => {
    const projectDocs = documents.filter((doc) => doc.projectId === projectId)
    const totalSize = projectDocs.reduce((sum, doc) => sum + doc.size, 0)
    return formatFileSize(totalSize)
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  // Get latest modified date
  const getLatestModifiedDate = (projectId: string) => {
    const projectDocs = documents.filter((doc) => doc.projectId === projectId)

    if (projectDocs.length === 0) return "无文件"

    const dates = projectDocs.map((doc) => new Date(doc.lastModified).getTime())
    const latestDate = new Date(Math.max(...dates))

    return latestDate.toLocaleDateString("zh-CN")
  }

  // Count documents in project
  const countDocuments = (projectId: string) => {
    return documents.filter((doc) => doc.projectId === projectId).length
  }

  // 修改handleProjectClick函数，使其导航到文件夹而不是打开抽屉
  const handleProjectClick = (project: Project) => {
    onFolderClick(project.id)
  }

  // 添加一个新函数用于查看项目详情
  const handleViewProjectDetails = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedProject(project)
    setShowDetails(true)
  }

  // Get random research field
  const getRandomResearchField = (index: number) => {
    return researchFields[index % researchFields.length]
  }

  // Render project folders
  if (projects) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {projects.map((project, index) => {
            const researchTitle = researchTitles[index % researchTitles.length]
            const researchField = getRandomResearchField(index)

            return (
              <Card
                key={project.id}
                className="overflow-hidden border cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:translate-y-[-2px]"
                onClick={() => handleProjectClick(project)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute top-3 right-3 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onFolderClick(project.id)
                            }}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            打开文件夹
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleViewProjectDetails(project, e)}>
                            <Info className="mr-2 h-4 w-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Pencil className="mr-2 h-4 w-4" />
                            重命名
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Share2 className="mr-2 h-4 w-4" />
                            分享
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-col items-center justify-center pt-6 pb-3 px-3">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/display-folder-9067BlI6odOTy6u57hW0ye2BseVFnp.png"
                        alt="Folder"
                        width={56}
                        height={56}
                        className="h-14 w-14 object-contain mb-2"
                      />
                      <Badge className={`mb-2 ${researchField.color}`}>{researchField.name}</Badge>
                      <h3 className="text-sm font-medium text-center line-clamp-2 h-10 w-full">{researchTitle}</h3>
                    </div>
                    <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground flex justify-between">
                      <span>{calculateFolderSize(project.id)}</span>
                      <span>{getLatestModifiedDate(project.id)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 详情抽屉 */}
        <Sheet open={showDetails} onOpenChange={setShowDetails}>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            {selectedProject && (
              <>
                <SheetHeader className="pb-4">
                  <SheetTitle className="text-xl flex items-center gap-2">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/display-folder-9067BlI6odOTy6u57hW0ye2BseVFnp.png"
                      alt="Folder"
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                    />
                    {researchTitles[projects.indexOf(selectedProject) % researchTitles.length]}
                  </SheetTitle>
                  <SheetDescription>
                    项目ID: {selectedProject.id} · 文件数: {countDocuments(selectedProject.id)}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 mt-2">
                  <div>
                    <h3 className="text-sm font-medium mb-2">研究领域</h3>
                    <Badge className={getRandomResearchField(projects.indexOf(selectedProject)).color}>
                      {getRandomResearchField(projects.indexOf(selectedProject)).name}
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">项目概述</h3>
                    <p className="text-sm text-muted-foreground">
                      本研究旨在探索{getRandomResearchField(projects.indexOf(selectedProject)).name}领域的前沿问题，
                      通过创新方法和技术手段，解决当前面临的挑战，为学术界和产业界提供新的思路和解决方案。
                      研究成果将对相关领域的发展产生积极影响，并有望在实际应用中创造价值。
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">项目统计</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">总文件大小</p>
                        <p className="text-lg font-medium">{calculateFolderSize(selectedProject.id)}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">最近更新</p>
                        <p className="text-lg font-medium">{getLatestModifiedDate(selectedProject.id)}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">文件数量</p>
                        <p className="text-lg font-medium">{countDocuments(selectedProject.id)}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">创建时间</p>
                        <p className="text-lg font-medium">2023/06/15</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">相关文件</h3>
                    <div className="space-y-2">
                      {documents
                        .filter((doc) => doc.projectId === selectedProject.id)
                        .slice(0, 5)
                        .map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                            <div className="flex items-center">
                              <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-md mr-2">
                                <span className="text-xs font-medium text-primary">{doc.type.substring(0, 2)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full" onClick={() => onFolderClick(selectedProject.id)}>
                      打开文件夹
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return null
}

