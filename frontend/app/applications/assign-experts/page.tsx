"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Loader2, Search, ArrowLeft, Star, UserRound, Brain, BookOpen, CheckCircle2, Users } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// 项目类型定义
interface Project {
  id: string
  name: string
  field: string
  amount: number
  description: string
  date: string
}

// 专家类型定义
interface Expert {
  id: string
  name: string
  avatar?: string
  specialty: string
  organization: string
  title?: string
  rating: number
  matchScore?: number
  relatedPapers?: number
  reviewCount?: number
  isAIRecommended?: boolean
  availability?: boolean
}

export default function AssignExpertsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [experts, setExperts] = useState<Expert[]>([])
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [selectedExperts, setSelectedExperts] = useState<Set<string>>(new Set())
  const [projectSearchQuery, setProjectSearchQuery] = useState("")
  const [expertSearchQuery, setExpertSearchQuery] = useState("")
  const [assigning, setAssigning] = useState(false)
  
  // 初始化数据
  useEffect(() => {
    // 从sessionStorage获取之前选择的项目
    const storedProjects = sessionStorage.getItem('selectedProjects')
    const batchId = sessionStorage.getItem('batchId')
    
    const initData = async () => {
      try {
        setLoading(true)
        
        // 模拟从API获取项目数据
        // 实际开发中替换为真实的API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 项目数据（这里应该是API返回的实际数据）
        const projectsData: Project[] = [
          {
            id: 'project-1',
            name: '海洋微塑料污染监测与生态风险评估技术研究',
            field: '环境科学',
            amount: 320,
            description: '研究海洋微塑料的分布特征、迁移规律与生态风险，开发高效监测方法和生态修复技术。',
            date: '2024-05-12'
          },
          {
            id: 'project-2',
            name: '基于人工智能的海洋环境污染物源解析与预警系统',
            field: '人工智能',
            amount: 485,
            description: '利用深度学习算法构建海洋环境中污染物的扩散模型，实现污染源精准识别与预警。',
            date: '2024-06-03'
          },
          {
            id: 'project-3',
            name: '生物可降解材料在海洋环境中的降解机制及应用研究',
            field: '生物医药',
            amount: 275,
            description: '研发新型海洋环境友好型生物可降解材料，探究其在海洋环境中的降解机制与应用前景。',
            date: '2024-05-20'
          },
          {
            id: 'project-4',
            name: '深海极端环境微生物资源挖掘与生物活性物质研究',
            field: '生物医药',
            amount: 420,
            description: '从深海极端环境中分离特殊微生物菌株，筛选具有医药价值的生物活性物质。',
            date: '2024-06-15'
          },
          {
            id: 'project-5',
            name: '海洋生态系统健康评估与修复技术集成示范',
            field: '环境科学',
            amount: 530,
            description: '构建海洋生态系统健康评估指标体系，开发生态修复技术集成方案并进行示范应用。',
            date: '2024-07-01'
          },
          {
            id: 'project-6',
            name: '海洋绿色能源开发利用关键技术研究',
            field: '新能源',
            amount: 480,
            description: '研究海洋潮汐能、波浪能等可再生能源高效开发利用的关键技术，推动海洋绿色能源产业化。',
            date: '2024-05-28'
          },
          {
            id: 'project-7',
            name: '海洋生物基新材料制备技术与应用开发',
            field: '新材料',
            amount: 365,
            description: '以海洋生物资源为原料，研发高性能生物基新材料，探索在医疗、包装等领域的应用。',
            date: '2024-06-10'
          },
          {
            id: 'project-8',
            name: '海洋卫星遥感大数据分析与应用平台开发',
            field: '信息技术',
            amount: 395,
            description: '构建海洋卫星遥感大数据处理与分析平台，实现海洋环境要素精准监测与预测。',
            date: '2024-07-05'
          }
        ];
        
        // 专家数据
        const titles = ['教授', '副教授', '研究员', '高级工程师'];
        const specialties = [
          ['海洋生态', '微塑料研究', '环境修复'],
          ['海洋污染', '生物降解', '环境监测'],
          ['高分子材料', '降解技术', '材料表征'],
          ['生态环境研究', '生物多样性', '可持续发展']
        ];
        
        // 生成专家数据
        const expertsData: Expert[] = Array(12).fill(null).map((_, index) => {
          const isRecommended = index < 5;
          const expertGroup = index % 4;
          
          return {
            id: `expert-${index + 1}`,
            name: `${['于教授', '李研究员', '张教授', '赵研究员', '王教授'][index % 5]}`,
            specialty: specialties[expertGroup][index % 3],
            organization: ['某大学', '研究所', '某科技公司', '创新中心'][index % 4],
            title: titles[index % 4],
            rating: 4.0 + (Math.random() * 1.0),
            matchScore: isRecommended ? 95 - (index * 3) : 70 + (Math.random() * 10),
            relatedPapers: Math.floor(Math.random() * 12) + 2,
            reviewCount: Math.floor(Math.random() * 18) + 4,
            isAIRecommended: isRecommended,
            availability: Math.random() > 0.3
          }
        }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        
        setProjects(projectsData)
        setExperts(expertsData)
        
        // 如果有存储的已选项目，则恢复选择
        if (storedProjects) {
          try {
            const parsedProjects = JSON.parse(storedProjects)
            setSelectedProjects(new Set(parsedProjects))
          } catch (e) {
            console.error('解析已选项目失败', e)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    
    initData()
    
    // 组件卸载时清除sessionStorage中的数据
    return () => {
      sessionStorage.removeItem('selectedProjects')
      sessionStorage.removeItem('batchId')
    }
  }, [])
  
  // 处理项目选择
  const handleToggleProject = (id: string) => {
    const newSelection = new Set(selectedProjects)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedProjects(newSelection)
  }
  
  // 处理专家选择
  const handleToggleExpert = (id: string) => {
    const newSelection = new Set(selectedExperts)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedExperts(newSelection)
  }
  
  // 筛选项目
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    project.field.toLowerCase().includes(projectSearchQuery.toLowerCase())
  )
  
  // 筛选专家
  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(expertSearchQuery.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(expertSearchQuery.toLowerCase()) ||
    expert.organization.toLowerCase().includes(expertSearchQuery.toLowerCase())
  )
  
  // AI推荐的专家
  const recommendedExperts = filteredExperts.filter(expert => expert.isAIRecommended)
  
  // 全部专家
  const allExperts = filteredExperts
  
  // 执行分配操作
  const handleAssign = async () => {
    if (selectedProjects.size === 0 || selectedExperts.size === 0) {
      toast.error('请至少选择一个项目和一个专家')
      return
    }
    
    setAssigning(true)
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 显示成功消息
      toast.success(`已成功将 ${selectedExperts.size} 位专家分配到 ${selectedProjects.size} 个项目`)
      
      // 延迟返回
      setTimeout(() => {
        router.back()
      }, 1000)
    } catch (error) {
      toast.error('分配失败，请重试')
    } finally {
      setAssigning(false)
    }
  }
  
  // 显示评级星星
  const renderRating = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-3.5 w-3.5 ${index < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
      />
    ))
  }
  
  return (
    <div className="container mx-auto py-6">
      {/* 页面标题和返回按钮 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">批量分配专家</h1>
        </div>
        
        <Button 
          onClick={handleAssign} 
          disabled={selectedProjects.size === 0 || selectedExperts.size === 0 || assigning}
        >
          {assigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              分配中...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              确认分配
            </>
          )}
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">加载中...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：待分配项目 */}
          <Card>
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle>待分配项目</CardTitle>
                <div className="ml-auto">
                  <Badge variant="secondary">已选项目: {selectedProjects.size}</Badge>
                </div>
              </div>
              <CardDescription>
                已选择 {selectedProjects.size} 个项目进行专家分配
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索项目名称或领域..."
                  className="pl-9"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[70vh]">
                <div className="space-y-3 p-4 pt-2">
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      未找到匹配的项目
                    </div>
                  ) : (
                    filteredProjects.map(project => (
                      <div 
                        key={project.id} 
                        className={`p-3 border rounded-lg transition-all cursor-pointer ${
                          selectedProjects.has(project.id) 
                            ? "border-blue-500 bg-blue-50" 
                            : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                        onClick={() => handleToggleProject(project.id)}
                      >
                        <div className="flex items-start">
                          <Checkbox 
                            checked={selectedProjects.has(project.id)}
                            onCheckedChange={() => handleToggleProject(project.id)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">{project.name}</div>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">{project.field}</Badge>
                              <Badge variant="secondary" className="text-xs">{project.amount}万元</Badge>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* 右侧：专家资源池 */}
          <Card>
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle>AI智能推荐</CardTitle>
                <div className="ml-auto">
                  <Badge variant="secondary">已选专家: {selectedExperts.size}</Badge>
                </div>
              </div>
              <CardDescription>
                基于项目内容智能匹配最合适的专家和审查工作表
              </CardDescription>
            </CardHeader>

            <Tabs defaultValue="recommended" className="mt-0">
              <TabsList className="w-full rounded-none grid grid-cols-2">
                <TabsTrigger value="recommended" className="flex items-center justify-center text-sm">
                  <Brain className="mr-1.5 h-4 w-4" />
                  推荐专家
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center justify-center text-sm">
                  <Users className="mr-1.5 h-4 w-4" />
                  全部专家
                </TabsTrigger>
              </TabsList>
              
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索专家名称、专业或单位..."
                    className="pl-9"
                    value={expertSearchQuery}
                    onChange={(e) => setExpertSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="recommended" className="m-0">
                <div className="px-4 pb-2 pt-0 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-slate-700">智能推荐专家</h3>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    匹配度排序
                  </Badge>
                </div>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-3 p-4 pt-2">
                    {recommendedExperts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        未找到匹配的专家推荐
                      </div>
                    ) : (
                      recommendedExperts.map((expert) => (
                        <div
                          key={expert.id}
                          className={`p-3 border rounded-lg transition-all cursor-pointer ${
                            selectedExperts.has(expert.id) 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                          onClick={() => handleToggleExpert(expert.id)}
                        >
                          <div className="flex items-start">
                            <Checkbox 
                              checked={selectedExperts.has(expert.id)}
                              onCheckedChange={() => handleToggleExpert(expert.id)}
                              className="mt-2 mr-3"
                            />
                            <div className="flex items-start gap-3 flex-1">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={expert.avatar} />
                                  <AvatarFallback className="bg-slate-200 text-slate-500">
                                    {expert.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {expert.availability !== undefined && (
                                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                                    expert.availability 
                                      ? "bg-green-500" 
                                      : "bg-amber-500"
                                    } rounded-full border-2 border-white`}>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-slate-800">{expert.name}</div>
                                  <Badge
                                    className={`${
                                      (expert.matchScore || 0) >= 90
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : (expert.matchScore || 0) >= 80
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                  >
                                    匹配度 {Math.round(expert.matchScore || 0)}%
                                  </Badge>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  {expert.organization} · {expert.title}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {expert.specialty && (
                                    <Badge
                                      variant="outline"
                                      className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                                    >
                                      {expert.specialty}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                                  <div className="flex items-center gap-3">
                                    {expert.relatedPapers !== undefined && (
                                      <div className="flex items-center">
                                        <BookOpen className="h-3 w-3 mr-1" />
                                        <span>相关论文: {expert.relatedPapers}</span>
                                      </div>
                                    )}
                                    {expert.reviewCount !== undefined && (
                                      <div className="flex items-center">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        <span>已审核: {expert.reviewCount}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    {renderRating(expert.rating)}
                                    <span className="ml-1">{expert.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="all" className="m-0">
                <div className="px-4 pb-2 pt-0 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-slate-700">全部专家</h3>
                  <Badge variant="outline">{allExperts.length} 位专家</Badge>
                </div>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-3 p-4 pt-2">
                    {allExperts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        未找到匹配的专家
                      </div>
                    ) : (
                      allExperts.map((expert) => (
                        <div
                          key={expert.id}
                          className={`p-3 border rounded-lg transition-all cursor-pointer ${
                            selectedExperts.has(expert.id) 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                          onClick={() => handleToggleExpert(expert.id)}
                        >
                          <div className="flex items-start">
                            <Checkbox 
                              checked={selectedExperts.has(expert.id)}
                              onCheckedChange={() => handleToggleExpert(expert.id)}
                              className="mt-2 mr-3"
                            />
                            <div className="flex items-start gap-3 flex-1">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={expert.avatar} />
                                  <AvatarFallback className="bg-slate-200 text-slate-500">
                                    {expert.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {expert.availability !== undefined && (
                                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                                    expert.availability 
                                      ? "bg-green-500" 
                                      : "bg-amber-500"
                                    } rounded-full border-2 border-white`}>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-slate-800">{expert.name}</div>
                                  {expert.isAIRecommended && (
                                    <Badge 
                                      className="bg-green-50 text-green-700 border-green-200"
                                    >
                                      匹配度 {Math.round(expert.matchScore || 0)}%
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  {expert.organization} · {expert.title}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {expert.specialty && (
                                    <Badge
                                      variant="outline"
                                      className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                                    >
                                      {expert.specialty}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                                  <div className="flex items-center gap-3">
                                    {expert.relatedPapers !== undefined && (
                                      <div className="flex items-center">
                                        <BookOpen className="h-3 w-3 mr-1" />
                                        <span>相关论文: {expert.relatedPapers}</span>
                                      </div>
                                    )}
                                    {expert.reviewCount !== undefined && (
                                      <div className="flex items-center">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        <span>已审核: {expert.reviewCount}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    {renderRating(expert.rating)}
                                    <span className="ml-1">{expert.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}
    </div>
  )
}
