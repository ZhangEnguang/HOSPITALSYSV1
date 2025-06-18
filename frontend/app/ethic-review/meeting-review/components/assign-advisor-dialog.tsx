"use client"

import React, { useState, useEffect } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UserPlus,
  AlertCircle,
  Building2,
  CheckCircle2,
  Users,
  Search,
  X,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"

// 类型定义
interface ProjectItem {
  id: string
  name: string
  projectId?: string
  acceptanceNumber?: string
  projectSubType?: string
  projectLeader?: {
    name: string
    avatar?: string
  }
  department?: string
  reviewType?: string
  status?: string
  description?: string
  ethicalConcerns?: string[]
  questionAreas?: string[]
}

interface AdvisorOption {
  id: string
  name: string
  email: string
  avatar?: string
  department: string
  title: string
  expertise: string[]
  experience: number
  rating: number
  availability: boolean
  recentCases: number
  specialties: string[]
  certifications?: string[]
  matchScore?: number
}

interface AssignAdvisorDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectItem | null
  onAssign: (advisorIds: string[], questions: string) => void
}

// 模拟独立顾问数据
const mockAdvisors: AdvisorOption[] = [
  {
    id: "advisor1",
    name: "张明华",
    email: "zhang.minghua@hospital.edu.cn",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "医学伦理委员会",
    title: "主任委员",
    expertise: ["医学伦理", "生物伦理学", "研究伦理"],
    experience: 15,
    rating: 4.8,
    availability: true,
    recentCases: 24,
    specialties: ["临床试验伦理", "人体研究伦理", "医疗器械评估"],
    certifications: ["国际生物伦理委员会认证", "临床研究伦理培训证书"],
    matchScore: 95
  },
  {
    id: "advisor2",
    name: "李文静",
    email: "li.wenjing@law.edu.cn",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c43f9b2e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "法学院",
    title: "教授",
    expertise: ["法律伦理", "医疗法", "隐私保护"],
    experience: 12,
    rating: 4.9,
    availability: true,
    recentCases: 18,
    specialties: ["知情同意", "隐私保护", "数据安全"],
    certifications: ["法律职业资格证书", "伦理审查专家证书"],
    matchScore: 92
  },
  {
    id: "advisor3",
    name: "王德胜",
    email: "wang.desheng@medicine.edu.cn",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "医学院",
    title: "主任医师",
    expertise: ["临床医学", "医学伦理", "患者权益"],
    experience: 20,
    rating: 4.7,
    availability: false,
    recentCases: 32,
    specialties: ["临床试验", "药物研究", "医疗器械评估"],
    certifications: ["执业医师证", "临床试验质量管理规范证书"],
    matchScore: 88
  },
  {
    id: "advisor4",
    name: "陈若琳",
    email: "chen.ruolin@biology.edu.cn",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "生物科学学院",
    title: "教授",
    expertise: ["生物技术伦理", "基因研究", "分子生物学"],
    experience: 14,
    rating: 4.8,
    availability: true,
    recentCases: 21,
    specialties: ["基因编辑", "干细胞研究", "转基因技术"],
    certifications: ["生物安全委员会专家证书", "国际生物技术伦理认证"],
    matchScore: 94
  },
  {
    id: "advisor5",
    name: "刘建国",
    email: "liu.jianguo@psychology.edu.cn", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "心理学院",
    title: "教授",
    expertise: ["心理学伦理", "行为研究", "认知科学"],
    experience: 18,
    rating: 4.6,
    availability: true,
    recentCases: 25,
    specialties: ["人体行为研究", "心理干预", "认知评估"],
    certifications: ["心理学会认证", "行为研究伦理证书"],
    matchScore: 89
  },
  {
    id: "advisor6",
    name: "赵美玲",
    email: "zhao.meiling@publichealth.edu.cn",
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "公共卫生学院",
    title: "副教授",
    expertise: ["流行病学", "公共卫生伦理", "统计学"],
    experience: 9,
    rating: 4.5,
    availability: true,
    recentCases: 16,
    specialties: ["疫情研究", "社区调研", "健康政策"],
    certifications: ["流行病学专家证书", "公共卫生伦理认证"],
    matchScore: 85
  },
  {
    id: "advisor7",
    name: "孙志强",
    email: "sun.zhiqiang@law.edu.cn",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "法学院",
    title: "系主任",
    expertise: ["法律伦理", "医疗法", "隐私法"],
    experience: 16,
    rating: 4.7,
    availability: false,
    recentCases: 28,
    specialties: ["医疗纠纷", "患者权利", "数据保护"],
    certifications: ["律师执业证", "医疗法专家证书"],
    matchScore: 91
  },
  {
    id: "advisor8",
    name: "马晓燕",
    email: "ma.xiaoyan@pharmacy.edu.cn",
    avatar: "https://images.unsplash.com/photo-1594824694162-9ba26df533a7?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "药学院",
    title: "研究员",
    expertise: ["药物伦理", "临床药理", "药物安全"],
    experience: 11,
    rating: 4.6,
    availability: true,
    recentCases: 19,
    specialties: ["新药研发", "药物试验", "不良反应"],
    certifications: ["药师资格证", "临床药理专家证书"],
    matchScore: 87
  },
  {
    id: "advisor9",
    name: "林雅芳",
    email: "lin.yafang@nursing.edu.cn",
    avatar: "https://images.unsplash.com/photo-1559626120-f1269c97a6e8?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "护理学院",
    title: "副院长",
    expertise: ["护理伦理", "临床护理", "患者照护"],
    experience: 13,
    rating: 4.8,
    availability: true,
    recentCases: 22,
    specialties: ["重症护理", "康复护理", "老年护理"],
    certifications: ["护师资格证", "护理伦理专家证书"],
    matchScore: 86
  },
  {
    id: "advisor10",
    name: "黄智勇",
    email: "huang.zhiyong@cs.edu.cn",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "计算机学院",
    title: "副教授",
    expertise: ["数据伦理", "人工智能", "隐私计算"],
    experience: 8,
    rating: 4.4,
    availability: false,
    recentCases: 14,
    specialties: ["算法公平", "数据隐私", "AI伦理"],
    certifications: ["数据保护官证书", "AI伦理专家认证"],
    matchScore: 82
  },
  {
    id: "advisor11",
    name: "郑慧敏",
    email: "zheng.huimin@sociology.edu.cn",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "社会学院",
    title: "教授",
    expertise: ["社会学", "伦理学", "社会调研"],
    experience: 17,
    rating: 4.9,
    availability: true,
    recentCases: 26,
    specialties: ["社会调查", "群体研究", "文化研究"],
    certifications: ["社会学会专家证书", "调研伦理认证"],
    matchScore: 93
  },
  {
    id: "advisor12",
    name: "徐立成",
    email: "xu.licheng@environment.edu.cn",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    department: "环境学院",
    title: "副教授",
    expertise: ["环境伦理", "生态学", "可持续发展"],
    experience: 10,
    rating: 4.3,
    availability: true,
    recentCases: 13,
    specialties: ["环境影响评估", "生态保护", "绿色技术"],
    certifications: ["环境评估师证书", "生态伦理专家认证"],
    matchScore: 79
  }
]

// 模拟项目待提问内容
const generateProjectQuestions = (project: ProjectItem | null) => {
  if (!project) return ""
  
  const questions = [
    `请就"${project.name}"项目的伦理合规性提供专业意见`,
    `该项目涉及的主要伦理关注点包括：`,
    `1. 研究对象的权益保护是否充分？`,
    `2. 知情同意过程是否符合规范？`,
    `3. 风险收益比是否合理？`,
    `4. 数据隐私保护措施是否完善？`,
    `5. 研究设计的科学性和伦理性是否平衡？`,
    ``,
    `请您基于专业经验，对以上问题给出详细的建议和意见。`
  ].join("\n")
  
  return questions
}

export function AssignAdvisorDialog({
  isOpen,
  onOpenChange,
  project,
  onAssign
}: AssignAdvisorDialogProps) {
  const { toast } = useToast()
  const [selectedAdvisors, setSelectedAdvisors] = useState<string[]>([])
  const [questions, setQuestions] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("smartMatch")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isAlgorithmExpanded, setIsAlgorithmExpanded] = useState(false)
  const [consultantName, setConsultantName] = useState("")
  const [consultationTime, setConsultationTime] = useState("")
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6) // 每页显示6个顾问

  // 当项目改变时重置状态并生成问题
  useEffect(() => {
    if (project && isOpen) {
      setSelectedAdvisors([])
      setQuestions("")
      setSearchQuery("")
      setSortBy("smartMatch")
      setCurrentPage(1) // 重置分页
      setIsSuccess(false) // 重置成功状态
      setIsAlgorithmExpanded(false) // 重置展开状态
      setConsultantName("")
      setConsultationTime("")
    }
  }, [project, isOpen])

  // 当搜索或筛选条件改变时重置分页
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy])

  // 过滤、排序和分页顾问
  const { filteredAdvisors, paginatedAdvisors, totalPages, totalCount } = React.useMemo(() => {
    let filtered = mockAdvisors

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(advisor =>
        advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advisor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advisor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        advisor.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // 计算各种匹配分数的辅助函数
    const calculateMatchScores = (advisor: AdvisorOption) => {
      // 学科匹配分数：基于原有匹配度
      const subjectScore = advisor.matchScore || 0
      
      // 研究领域匹配分数：基于专业领域相关性
      const researchScore = advisor.matchScore || 0
      
      // 伦理专业匹配分数：伦理相关专业加权
      const ethicsScore = advisor.expertise.some(exp => exp.includes('伦理')) 
        ? (advisor.matchScore || 0) + 10 
        : (advisor.matchScore || 0)
      
      // 经验匹配分数：基于从业年限，最高20分
      const experienceScore = Math.min(advisor.experience * 5, 100)
      
      // 案例相似度匹配分数：基于近期案例数和匹配度
      const caseScore = advisor.recentCases * 2 + (advisor.matchScore || 0) * 0.5
      
      return {
        subjectScore,
        researchScore,
        ethicsScore,
        experienceScore,
        caseScore
      }
    }

    // 排序 - 根据不同匹配方式排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "smartMatch":
          // 智能匹配：综合学科(30%) + 研究领域(25%) + 伦理专业(20%) + 经验(15%) + 案例相似度(10%)
          const scoresA = calculateMatchScores(a)
          const scoresB = calculateMatchScores(b)
          
          const smartScoreA = scoresA.subjectScore * 0.3 + 
                             scoresA.researchScore * 0.25 + 
                             scoresA.ethicsScore * 0.2 + 
                             scoresA.experienceScore * 0.15 + 
                             scoresA.caseScore * 0.1
          
          const smartScoreB = scoresB.subjectScore * 0.3 + 
                             scoresB.researchScore * 0.25 + 
                             scoresB.ethicsScore * 0.2 + 
                             scoresB.experienceScore * 0.15 + 
                             scoresB.caseScore * 0.1
          
          return smartScoreB - smartScoreA
        case "subjectMatch":
          // 学科匹配：基于学科相关性
          return (b.matchScore || 0) - (a.matchScore || 0)
        case "researchMatch":
          // 研究领域匹配：基于研究专业领域
          return (b.matchScore || 0) - (a.matchScore || 0)
        case "ethicsMatch":
          // 伦理专业匹配：优先显示伦理相关专业
          const ethicsA = a.expertise.some(exp => exp.includes('伦理')) ? 1 : 0
          const ethicsB = b.expertise.some(exp => exp.includes('伦理')) ? 1 : 0
          if (ethicsA !== ethicsB) return ethicsB - ethicsA
          return (b.matchScore || 0) - (a.matchScore || 0)
        case "experienceMatch":
          // 经验匹配：按从业经验年限排序
          return b.experience - a.experience
        case "caseMatch":
          // 案例相似度匹配：按近期案例数和专业匹配度排序
          const caseScoreA = a.recentCases * 0.6 + (a.matchScore || 0) * 0.4
          const caseScoreB = b.recentCases * 0.6 + (b.matchScore || 0) * 0.4
          return caseScoreB - caseScoreA
        default:
          return (b.matchScore || 0) - (a.matchScore || 0)
      }
    })

    // 分页计算
    const totalCount = filtered.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedAdvisors = filtered.slice(startIndex, endIndex)

    return {
      filteredAdvisors: filtered,
      paginatedAdvisors,
      totalPages,
      totalCount
    }
  }, [searchQuery, sortBy, currentPage, pageSize])

  // 切换顾问选择
  const toggleAdvisor = (advisorId: string) => {
    setSelectedAdvisors(prev => 
      prev.includes(advisorId)
        ? prev.filter(id => id !== advisorId)
        : [...prev, advisorId]
    )
  }

  // 提交指派
  const handleSubmit = () => {
    // 关闭弹框
    onOpenChange(false)
    
    // 显示成功提示
    toast({
      title: "✅ 指派成功！",
      description: "独立顾问指派已完成，相关人员将收到通知。",
      duration: 3000,
    })
  }

  // 获取匹配分值颜色
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50"
    if (score >= 80) return "text-blue-600 bg-blue-50"
    if (score >= 70) return "text-yellow-600 bg-yellow-50"
    return "text-gray-600 bg-gray-50"
  }



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] min-h-[70vh] flex flex-col p-0 overflow-hidden">
        {/* 固定头部 */}
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
          <DialogTitle className="flex items-center text-lg font-semibold">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-2.5 text-indigo-600">
              <UserPlus className="h-4 w-4" />
            </div>
            指派独立顾问
          </DialogTitle>
        </DialogHeader>

        {/* 可滚动内容区 */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ margin: '-16px 0' }}>
          <div className="space-y-6">
          {/* 项目信息 */}
          {project && (
            <div className="space-y-2">
              <div className="text-gray-900 font-semibold text-lg leading-tight">
                {project.name}
              </div>
              <div className="text-gray-600 text-base">
                {project.acceptanceNumber || project.projectId || "-"} · {project.projectLeader?.name || "-"} · {project.projectSubType || "-"}
              </div>
            </div>
          )}

          {/* 填写咨询 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium flex items-center text-gray-900">
              <div className="w-1 h-4 bg-blue-600 mr-2"></div>
              填写咨询
            </h3>
            
            {/* 第一行：咨询人与咨询时间 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consultantName" className="text-sm font-medium text-gray-700">
                  咨询人
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="consultantName"
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  placeholder="请输入咨询人姓名"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consultationTime" className="text-sm font-medium text-gray-700">
                  咨询时间
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="consultationTime"
                  type="datetime-local"
                  value={consultationTime}
                  onChange={(e) => setConsultationTime(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
            
            {/* 第二行：咨询内容，占两列 */}
            <div className="space-y-2">
              <Label htmlFor="questions" className="text-sm font-medium text-gray-700">
                咨询内容
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="questions"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                placeholder="请详细描述需要独立顾问关注的伦理问题和咨询要点"
                className="min-h-[120px] text-sm"
              />
            </div>
          </div>

          {/* 顾问选择 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium flex items-center text-gray-900">
              <div className="w-1 h-4 bg-blue-600 mr-2"></div>
              选择独立顾问
              {selectedAdvisors.length > 0 && (
                <Badge variant="outline" className="ml-2 text-xs">
                  已选择 {selectedAdvisors.length} 位
                </Badge>
              )}
            </h3>
            
            {/* 搜索和过滤 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索顾问姓名、部门或专业领域..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartMatch" className="text-sm">智能匹配</SelectItem>
                  <SelectItem value="subjectMatch" className="text-sm">学科匹配</SelectItem>
                  <SelectItem value="researchMatch" className="text-sm">研究领域匹配</SelectItem>
                  <SelectItem value="ethicsMatch" className="text-sm">伦理专业匹配</SelectItem>
                  <SelectItem value="experienceMatch" className="text-sm">经验匹配</SelectItem>
                  <SelectItem value="caseMatch" className="text-sm">案例相似度匹配</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 智能匹配说明 */}
            {sortBy === "smartMatch" && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md">
                <div 
                  className="p-3 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setIsAlgorithmExpanded(!isAlgorithmExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div className="font-medium text-sm text-blue-800">
                        智能匹配算法说明
                      </div>
                    </div>
                    <div className="text-blue-600">
                      {isAlgorithmExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
                
                {isAlgorithmExpanded && (
                  <div className="px-3 pb-3 border-t border-blue-200 mt-2 pt-2">
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>• 学科匹配 (30%)：基于专业学科相关性评分</div>
                      <div>• 研究领域匹配 (25%)：基于研究方向契合度</div>
                      <div>• 伦理专业匹配 (20%)：伦理学背景专家优先</div>
                      <div>• 从业经验匹配 (15%)：基于专业从业年限</div>
                      <div>• 案例相似度匹配 (10%)：基于处理类似项目经验</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 顾问列表 - 网格布局，一行2个 */}
            <div className="grid grid-cols-2 gap-4">
              {paginatedAdvisors.map((advisor) => (
                <div
                  key={advisor.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-all duration-200 min-h-[80px]",
                    selectedAdvisors.includes(advisor.id)
                      ? "border-indigo-500 bg-indigo-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  )}
                  onClick={() => toggleAdvisor(advisor.id)}
                >
                  <div className="flex items-start space-x-3">
                    {/* 头像 */}
                    <div className="relative flex-shrink-0">
                      <Avatar className={`h-10 w-10 transition-all ${
                        selectedAdvisors.includes(advisor.id)
                          ? "ring-2 ring-blue-500 ring-offset-1"
                          : ""
                      }`}>
                        <AvatarFallback className={`text-sm font-medium ${
                          selectedAdvisors.includes(advisor.id) ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        }`}>{advisor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {selectedAdvisors.includes(advisor.id) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* 主要信息 */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">{advisor.name}</h4>
                        {advisor.matchScore && (
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs px-1.5 py-0.5 flex-shrink-0 ml-2", getMatchScoreColor(advisor.matchScore))}
                          >
                            匹配度 {advisor.matchScore}%
                          </Badge>
                        )}
                      </div>
                      
                      {/* 部门和职称 */}
                      <div className="flex items-center text-xs text-gray-500 space-x-1">
                        <Building2 className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{advisor.department}</span>
                        <span>·</span>
                        <span className="whitespace-nowrap">{advisor.title}</span>
                        <span>·</span>
                        <span className="whitespace-nowrap">{advisor.experience}年经验</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 一行式分页器 */}
          {totalCount > 0 && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              {/* 左侧：分页信息 */}
              <div className="text-gray-600 flex-shrink-0">
                共 {totalCount} 位，第 {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} 位
              </div>
              
              {/* 中间：分页按钮 */}
              <div className="flex items-center space-x-1 mx-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0"
                >
                  ‹
                </Button>
                
                {/* 页码按钮 */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="h-7 w-7 p-0 text-xs"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-1 text-gray-400 text-xs">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="h-7 w-7 p-0 text-xs"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 w-7 p-0"
                >
                  ›
                </Button>
              </div>
              
              {/* 右侧：每页显示数量 */}
              <div className="flex items-center space-x-1 text-gray-600 flex-shrink-0">
                <span className="text-xs">每页</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border border-gray-300 rounded px-1 py-0.5 text-xs min-w-[40px]"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
                <span className="text-xs">位</span>
              </div>
            </div>
          )}

          {/* 空状态 */}
          {totalCount === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">未找到符合条件的独立顾问</p>
              <p className="text-xs text-gray-400">请尝试调整搜索条件</p>
            </div>
          )}
          </div>
        </div>

        {/* 固定底部操作栏 */}
        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-white">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-sm px-4 py-2"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="transition-all duration-200 text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            确认指派
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AssignAdvisorDialog 