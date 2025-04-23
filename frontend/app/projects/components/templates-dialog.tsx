"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2, X, FileSearch } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// 模板数据
export const templates = [
  {
    id: 1,
    title: "国家自然科学基金项目",
    icon: "🧪",
    description: "国家自然科学基金委员会年度项目申请模板",
    category: "科研类",
    tags: ["基础研究", "青年项目", "重点项目", "联合基金", "地区基金"],
    deadline: "每年3月1日-3月20日",
    frequency: "每年3月",
    popular: true,
    recommended: true,
  },
  {
    id: 2,
    title: "国家重点研发计划项目",
    icon: "🚀",
    description: "科技部重点研发计划项目申报模板",
    category: "科研类",
    tags: ["人工智能", "生物医药", "新材料", "环保节能", "技术转移"],
    deadline: "每季度首月1日-10日",
    frequency: "每季度首月",
    popular: true,
    recommended: false,
  },
  {
    id: 3,
    title: "教育部人文社科项目",
    icon: "📚",
    description: "面向高等教育的人文社科研究项目",
    category: "人文类",
    tags: ["青年项目", "后期资助", "新人奖", "专著出版"],
    deadline: "每年9月1日-9月30日",
    frequency: "每年9月",
    popular: false,
    recommended: true,
  },
  {
    id: 4,
    title: "企业技术开发合同",
    icon: "🏢",
    description: "企业间技术开发与合作项目合同模板",
    category: "合作类",
    tags: ["技术合作", "联合开发", "成果转化", "知识产权"],
    deadline: "随时可用",
    frequency: "指南发布后",
    popular: true,
    recommended: false,
  },
  {
    id: 5,
    title: "设备采购合同",
    icon: "🛒",
    description: "科研设备与物资采购合同标准模板",
    category: "采购类",
    tags: ["设备采购", "试剂耗材", "大型仪器", "进口设备"],
    deadline: "随时可用",
    frequency: "指南发布后",
    popular: false,
    recommended: true,
  },
  {
    id: 6,
    title: "国际科技合作项目",
    icon: "🌎",
    description: "国际科技合作与交流项目申报模板",
    category: "国际合作",
    tags: ["国际合作", "联合研究", "学术交流", "人才培养"],
    deadline: "每年6月1日-6月30日",
    frequency: "每年6月",
    popular: true,
    recommended: true,
  },
  {
    id: 7,
    title: "青年人才项目",
    icon: "🏆",
    description: "青年科技人才支持计划项目模板",
    category: "人才类",
    tags: ["青年人才", "创新团队", "人才培养", "学术交流"],
    deadline: "每年4月1日-4月30日",
    frequency: "每年4月",
    popular: true,
    recommended: false,
  },
  {
    id: 8,
    title: "产学研合作项目",
    icon: "💡",
    description: "产学研合作与成果转化项目模板",
    category: "合作类",
    tags: ["产学研", "成果转化", "技术转移", "创新创业"],
    deadline: "随时可用",
    frequency: "指南发布后",
    popular: false,
    recommended: true,
  },
  {
    id: 9,
    title: "实验室建设项目",
    icon: "🔬",
    description: "实验室建设与设备配置项目模板",
    category: "建设类",
    tags: ["实验室", "设备配置", "平台建设", "资源共享"],
    deadline: "每年5月1日-5月31日",
    frequency: "每年5月",
    popular: true,
    recommended: false,
  },
  {
    id: 10,
    title: "研究生培养项目",
    icon: "🎓",
    description: "研究生培养与教育改革项目模板",
    category: "教育类",
    tags: ["研究生", "教育改革", "课程建设", "实践教学"],
    deadline: "每年10月1日-10月31日",
    frequency: "每年10月",
    popular: false,
    recommended: true,
  },
  {
    id: 11,
    title: "创新创业项目",
    icon: "💼",
    description: "大学生创新创业训练项目模板",
    category: "创新类",
    tags: ["创新创业", "实践训练", "成果转化", "创业孵化"],
    deadline: "每年11月1日-11月30日",
    frequency: "每年11月",
    popular: true,
    recommended: true,
  },
  {
    id: 12,
    title: "团队建设项目",
    icon: "👥",
    description: "科研团队建设与人才培养项目模板",
    category: "团队类",
    tags: ["团队建设", "人才培养", "学术交流", "国际合作"],
    deadline: "每年7月1日-7月31日",
    frequency: "每年7月",
    popular: false,
    recommended: true,
  },
]

interface Template {
  id: number
  title: string
  icon: string
  description: string
  category: string
  tags: string[]
  deadline: string
  frequency: string
  popular: boolean
  recommended: boolean
}

interface TemplatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 骨架加载组件
function TemplateCardSkeleton() {
  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

// 空状态组件
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <FileSearch className="h-6 w-6 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">未找到相关模板</h3>
      <p className="text-sm text-gray-500 max-w-sm">
        尝试使用其他关键词搜索，或者清除筛选条件查看更多模板
      </p>
    </div>
  )
}

export function TemplatesDialog({ open, onOpenChange }: TemplatesDialogProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // 处理搜索和标签页切换时的加载状态
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // 300ms的加载动画
    return () => clearTimeout(timer)
  }, [searchTerm, activeTab])

  // 过滤模板
  const filteredTemplates = templates.filter((template: Template) => {
    // 搜索过滤
    if (
      searchTerm &&
      !template.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !template.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false
    }

    return true
  })

  // 根据当前标签页过滤
  const tabFilteredTemplates = filteredTemplates.filter((template) => {
    if (activeTab === "popular") return template.popular
    if (activeTab === "recommended") return template.recommended
    return true
  })

  const handleUseTemplate = (templateId: number) => {
    onOpenChange(false) // 先关闭弹框
    
    // 找到当前选中的模板
    const selectedTemplate = templates.find(t => t.id === templateId);
    
    // 存储到sessionStorage，以便创建页面可以恢复
    if (selectedTemplate) {
      // 使用sessionStorage存储选中的模板信息，这样页面刷新后不会丢失
      sessionStorage.setItem('selectedTemplateId', String(templateId));
      sessionStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
      
      // 直接创建预填充数据并存储
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const endDate = new Date(today.setMonth(today.getMonth() + 12)).toISOString().split('T')[0];
      
      // 判断项目类型
      const isHorizontal = selectedTemplate.category.includes("合作") || selectedTemplate.category === "采购类";
      const projectType = isHorizontal ? "横向" : "纵向";
      
      // 判断项目级别
      let projectLevel = "校级";
      if (selectedTemplate.title.includes("国家") || selectedTemplate.category.includes("国家")) {
        projectLevel = "国家级";
      } else if (selectedTemplate.title.includes("省") || selectedTemplate.category.includes("省")) {
        projectLevel = "省部级";
      }
      
      // 预填充数据
      const prefillData = {
        项目名称: selectedTemplate.title,
        项目分类: selectedTemplate.category,
        项目类型: projectType,
        项目级别: projectLevel,
        经费来源: selectedTemplate.category,
        项目状态: "筹备中",
        开始日期: startDate,
        结束日期: endDate,
        预算金额: projectLevel === "国家级" ? "500000" : projectLevel === "省部级" ? "300000" : "100000",
        研究内容: `基于${selectedTemplate.title}的深入研究与应用`,
        预期成果: selectedTemplate.tags.join("、"),
        关键词: selectedTemplate.tags.join("、"),
        摘要: selectedTemplate.description,
      };
      
      // 存储预填充数据
      sessionStorage.setItem('prefillData', JSON.stringify(prefillData));
    }
    
    setTimeout(() => {
      router.push(`/projects/create?template=${templateId}`)
    }, 100) // 延迟100ms跳转，避免闪动
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] h-[80vh] flex flex-col overflow-hidden bg-gray-50 p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle>项目模板库</DialogTitle>
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
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="flex-shrink-0 px-6 py-2 border-b bg-transparent justify-start h-auto !rounded-none gap-2" style={{ borderRadius: 0 }}>
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

          <div className="flex-1 overflow-y-auto">
            <TabsContent 
              value="all" 
              className="h-full data-[state=active]:block"
            >
              <div className="p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(12).fill(0).map((_, index) => (
                      <TemplateCardSkeleton key={index} />
                    ))}
                  </div>
                ) : tabFilteredTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tabFilteredTemplates.map((template) => (
                      <Card 
                        key={template.id} 
                        className="overflow-hidden h-full border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleUseTemplate(template.id)}
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
                              <span className="font-medium">申报截止:</span> {template.deadline}
                            </div>
                            <div>
                              <span className="font-medium">申报频率:</span> {template.frequency}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            </TabsContent>
            <TabsContent 
              value="popular" 
              className="h-full data-[state=active]:block"
            >
              <div className="p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(12).fill(0).map((_, index) => (
                      <TemplateCardSkeleton key={index} />
                    ))}
                  </div>
                ) : tabFilteredTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tabFilteredTemplates.map((template) => (
                      <Card 
                        key={template.id} 
                        className="overflow-hidden h-full border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleUseTemplate(template.id)}
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
                              <span className="font-medium">申报截止:</span> {template.deadline}
                            </div>
                            <div>
                              <span className="font-medium">申报频率:</span> {template.frequency}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            </TabsContent>
            <TabsContent 
              value="recommended" 
              className="h-full data-[state=active]:block"
            >
              <div className="p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(12).fill(0).map((_, index) => (
                      <TemplateCardSkeleton key={index} />
                    ))}
                  </div>
                ) : tabFilteredTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tabFilteredTemplates.map((template) => (
                      <Card 
                        key={template.id} 
                        className="overflow-hidden h-full border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleUseTemplate(template.id)}
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
                              <span className="font-medium">申报截止:</span> {template.deadline}
                            </div>
                            <div>
                              <span className="font-medium">申报频率:</span> {template.frequency}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 