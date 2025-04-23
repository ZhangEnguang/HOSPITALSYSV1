"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// 定义模板接口
export interface Template {
  id: string
  title: string
  icon: string
  description: string
  category: string
  tags: string[]
  popular: boolean
  recommended: boolean
  deadline?: string
  frequency?: string
}

// 导出模板数据
export const templates: Template[] = [
  {
    id: "1",
    title: "国家自然科学基金申报",
    icon: "🧪",
    description: "适用于国家自然科学基金各类项目的申报，包括面上项目、青年项目、重点项目等",
    category: "国家级项目",
    tags: ["国家级", "自然科学", "基础研究"],
    popular: true,
    recommended: true,
    deadline: "每年3月",
    frequency: "每年一次",
  },
  {
    id: "2",
    title: "国家社会科学基金申报",
    icon: "📚",
    description: "适用于国家社会科学基金各类项目的申报，包括一般项目、青年项目、重点项目等",
    category: "国家级项目",
    tags: ["国家级", "社会科学", "人文"],
    popular: true,
    recommended: true,
    deadline: "每年3月",
    frequency: "每年一次",
  },
  {
    id: "3",
    title: "教育部人文社科项目申报",
    icon: "🏛️",
    description: "适用于教育部人文社会科学研究项目的申报，包括规划基金项目、青年基金项目等",
    category: "省部级项目",
    tags: ["教育部", "人文社科", "基金项目"],
    popular: true,
    recommended: false,
    deadline: "每年1月",
    frequency: "每年一次",
  },
  {
    id: "4",
    title: "省自然科学基金申报",
    icon: "🔬",
    description: "适用于省级自然科学基金项目的申报，包括面上项目、青年项目、重点项目等",
    category: "省部级项目",
    tags: ["省级", "自然科学", "基础研究"],
    popular: false,
    recommended: true,
    deadline: "各省不同",
    frequency: "每年一次",
  },
  {
    id: "5",
    title: "省社会科学基金申报",
    icon: "📖",
    description: "适用于省级社会科学基金项目的申报，包括一般项目、青年项目、重点项目等",
    category: "省部级项目",
    tags: ["省级", "社会科学", "人文"],
    popular: false,
    recommended: true,
    deadline: "各省不同",
    frequency: "每年一次",
  },
  {
    id: "6",
    title: "教育部重点研究基地项目申报",
    icon: "🏢",
    description: "适用于教育部人文社会科学重点研究基地项目的申报",
    category: "省部级项目",
    tags: ["教育部", "重点基地", "人文社科"],
    popular: false,
    recommended: false,
    deadline: "每年5月",
    frequency: "每年一次",
  },
  {
    id: "7",
    title: "国家重点研发计划项目申报",
    icon: "🔑",
    description: "适用于国家重点研发计划项目的申报，面向国家重大需求",
    category: "国家级项目",
    tags: ["国家级", "重点研发", "应用研究"],
    popular: true,
    recommended: false,
    deadline: "不定期",
    frequency: "不定期",
  },
  {
    id: "8",
    title: "校级科研项目申报",
    icon: "🏫",
    description: "适用于校级科研项目的申报，包括校级重点项目、创新项目等",
    category: "校级项目",
    tags: ["校级", "创新", "培育"],
    popular: true,
    recommended: true,
    deadline: "各校不同",
    frequency: "一年一次或两次",
  },
  {
    id: "9",
    title: "横向合作项目申报",
    icon: "🤝",
    description: "适用于与企业、政府等外部单位合作的横向项目申报",
    category: "横向项目",
    tags: ["横向合作", "产学研", "技术服务"],
    popular: true,
    recommended: false,
    deadline: "随时",
    frequency: "不定期",
  },
  {
    id: "10",
    title: "国际合作项目申报",
    icon: "🌎",
    description: "适用于与国外机构合作开展的国际科研项目申报",
    category: "国际项目",
    tags: ["国际合作", "交流", "共同研究"],
    popular: false,
    recommended: true,
    deadline: "不定期",
    frequency: "不定期",
  },
  {
    id: "11",
    title: "科技成果转化项目申报",
    icon: "🔄",
    description: "适用于科技成果转化应用的项目申报",
    category: "成果转化",
    tags: ["成果转化", "技术转移", "应用推广"],
    popular: false,
    recommended: false,
    deadline: "不定期",
    frequency: "不定期",
  },
  {
    id: "12",
    title: "人才项目申报",
    icon: "👥",
    description: "适用于各类人才计划项目的申报，如青年人才、领军人才等",
    category: "人才项目",
    tags: ["人才计划", "团队建设", "人才培养"],
    popular: true,
    recommended: true,
    deadline: "不定期",
    frequency: "不定期",
  },
]

interface TemplatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplatesDialog({ open, onOpenChange }: TemplatesDialogProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // 根据标签和搜索过滤模板
  const filteredTemplates = templates.filter((template) => {
    // 标签过滤
    if (activeTab === "popular" && !template.popular) return false
    if (activeTab === "recommended" && !template.recommended) return false

    // 搜索过滤
    if (searchTerm && !template.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !template.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false
    }

    return true
  })

  // 处理选择模板
  const handleUseTemplate = (template: Template) => {
    onOpenChange(false)
    router.push(`/applications/create?templateId=${template.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] h-[80vh] flex flex-col overflow-hidden bg-gray-50 p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle>申报模板库</DialogTitle>
        </DialogHeader>

        <div className="flex-shrink-0 px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索模板..."
              className="pl-10 pr-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <TabsList className="flex-shrink-0 px-6 py-2 border-b bg-transparent justify-start h-auto !rounded-none gap-2">
            <TabsTrigger 
              value="all" 
              className="px-4 py-2 !rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 hover:text-blue-600 transition-colors duration-200 data-[state=active]:shadow-none"
              style={{ borderRadius: 0 }}
            >
              全部模板 ({filteredTemplates.length})
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="px-4 py-2 !rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 hover:text-blue-600 transition-colors duration-200 data-[state=active]:shadow-none"
              style={{ borderRadius: 0 }}
            >
              最近使用 ({filteredTemplates.filter(t => t.popular).length})
            </TabsTrigger>
            <TabsTrigger 
              value="recommended" 
              className="px-4 py-2 !rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 hover:text-blue-600 transition-colors duration-200 data-[state=active]:shadow-none"
              style={{ borderRadius: 0 }}
            >
              推荐模板 ({filteredTemplates.filter(t => t.recommended).length})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto min-h-0">
            <TabsContent 
              value="all" 
              className="h-full data-[state=active]:block"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className="overflow-hidden h-full border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{template.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-lg truncate">{template.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {template.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="border bg-primary/5 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
                          <div>
                            <span className="font-medium">申报截止:</span> {template.deadline || "不限"}
                          </div>
                          <div>
                            <span className="font-medium">申报频率:</span> {template.frequency || "不限"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent 
              value="popular" 
              className="h-full data-[state=active]:block"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.filter(t => t.popular).map((template) => (
                    <Card 
                      key={template.id} 
                      className="overflow-hidden h-full border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{template.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-lg truncate">{template.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {template.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="border bg-primary/5 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
                          <div>
                            <span className="font-medium">申报截止:</span> {template.deadline || "不限"}
                          </div>
                          <div>
                            <span className="font-medium">申报频率:</span> {template.frequency || "不限"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent 
              value="recommended" 
              className="h-full data-[state=active]:block"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.filter(t => t.recommended).map((template) => (
                    <Card 
                      key={template.id} 
                      className="overflow-hidden h-full border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{template.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-lg truncate">{template.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {template.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="border bg-primary/5 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
                          <div>
                            <span className="font-medium">申报截止:</span> {template.deadline || "不限"}
                          </div>
                          <div>
                            <span className="font-medium">申报频率:</span> {template.frequency || "不限"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 