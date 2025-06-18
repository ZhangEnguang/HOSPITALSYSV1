"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, Zap, User, ClipboardList, Calendar, CheckCircle2, Check, UserRoundPlus, ArrowRight, LucideCheck, FileText, CheckCircle, AlertTriangle, FileCheck, FileSignature, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { quickReviewItems } from "../data/quick-review-demo-data"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// 定义专家类型
type Expert = {
  id: string;
  name: string;
  department: string;
  title: string;
  expertise: string[];
  matchScore: number;
  relatedPapers: number;
  reviewCount: number;
  rating: number;
  availability: boolean;
};

// 定义工作表类型
type Worksheet = {
  id: string;
  name: string;
  description: string;
  suitabilityScore: number;
  createdDate: string;
  lastUpdated: string;
  questionCount: number;
  usageCount: number;
};

// 模拟专家数据
const mockExperts: Expert[] = [
  {
    id: "exp-001",
    name: "王教授",
    department: "基础医学院",
    title: "教授",
    expertise: ["内科学", "心血管疾病", "临床试验设计"],
    matchScore: 95,
    relatedPapers: 53,
    reviewCount: 28,
    rating: 4.8,
    availability: true
  },
  {
    id: "exp-002",
    name: "李博士",
    department: "药理学研究所",
    title: "副研究员",
    expertise: ["药理学", "新药研发", "临床前评估"],
    matchScore: 88,
    relatedPapers: 32,
    reviewCount: 15,
    rating: 4.5,
    availability: true
  },
  {
    id: "exp-003",
    name: "张教授",
    department: "临床医学院",
    title: "教授",
    expertise: ["外科学", "腔镜技术", "医疗器械评估"],
    matchScore: 82,
    relatedPapers: 47,
    reviewCount: 23,
    rating: 4.7,
    availability: false
  },
  {
    id: "exp-004",
    name: "陈博士",
    department: "公共卫生学院",
    title: "研究员",
    expertise: ["流行病学", "健康政策", "伦理审查"],
    matchScore: 79,
    relatedPapers: 27,
    reviewCount: 31,
    rating: 4.3,
    availability: true
  },
  {
    id: "exp-005",
    name: "林教授",
    department: "生物医学工程系",
    title: "副教授",
    expertise: ["生物材料", "人工智能医疗", "设备评价"],
    matchScore: 75,
    relatedPapers: 19,
    reviewCount: 12,
    rating: 4.1,
    availability: true
  }
];

// 模拟工作表数据
const mockWorksheets: Worksheet[] = [
  {
    id: "ws-001",
    name: "人体研究标准评估表",
    description: "用于评估涉及人体受试者的研究项目，包含知情同意、风险评估、受益分析等项目",
    suitabilityScore: 92,
    createdDate: "2023-12-10",
    lastUpdated: "2024-03-15",
    questionCount: 28,
    usageCount: 136
  },
  {
    id: "ws-002",
    name: "临床试验伦理审查表",
    description: "适用于药物临床试验、医疗器械临床试验的伦理审查，包含试验方案、安全性监测等内容",
    suitabilityScore: 85,
    createdDate: "2023-10-05",
    lastUpdated: "2024-02-20",
    questionCount: 34,
    usageCount: 98
  },
  {
    id: "ws-003",
    name: "人类遗传资源研究审查表",
    description: "针对涉及人类遗传资源的研究项目，包括基因测序、生物样本采集与保存等内容的审查",
    suitabilityScore: 78,
    createdDate: "2023-11-18",
    lastUpdated: "2024-01-30",
    questionCount: 23,
    usageCount: 62
  }
];

export default function BatchAssignPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // 状态管理
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stepIndex, setStepIndex] = useState(1)
  const [selectedExperts, setSelectedExperts] = useState<string[]>([])
  const [selectedWorksheet, setSelectedWorksheet] = useState<string | null>(null)

  
  // 筛选状态
  const [expertiseFilter, setExpertiseFilter] = useState<string[]>([])
  const [titleFilter, setTitleFilter] = useState<string[]>([])

  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // 分组分配状态
  const [groupByType, setGroupByType] = useState<boolean>(false)
  const [projectGroups, setProjectGroups] = useState<{[key: string]: any[]}>({})
  const [groupAssignments, setGroupAssignments] = useState<{[key: string]: {experts: string[], worksheet: string | null}}>({})
  const [activeGroup, setActiveGroup] = useState<string>('')
  
  // 从URL参数中获取项目ID列表
  const ids = searchParams?.get("ids")?.split(",") || []
  
  // 专业领域选项（从专家数据中提取）
  const expertiseOptions = useMemo(() => {
    const allExpertise = mockExperts.flatMap(expert => expert.expertise);
    return Array.from(new Set(allExpertise));
  }, []);
  
  // 职称选项（从专家数据中提取）
  const titleOptions = useMemo(() => {
    return Array.from(new Set(mockExperts.map(expert => expert.title)));
  }, []);

  // 加载项目数据
  useEffect(() => {
    const filteredProjects = ids.length > 0 
      ? quickReviewItems.filter(item => ids.includes(item.id))
      : [];
    
    setProjects(filteredProjects);
    
    // 按类型分组项目
    if (filteredProjects.length > 0) {
      const grouped = filteredProjects.reduce((acc, project) => {
        const type = project.projectSubType || '其他';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(project);
        return acc;
      }, {} as {[key: string]: any[]});
      
      setProjectGroups(grouped);
      
      // 初始化每个组的分配
      const initialAssignments = {} as {[key: string]: {experts: string[], worksheet: string | null}};
      Object.keys(grouped).forEach(type => {
        initialAssignments[type] = { experts: [], worksheet: null };
      });
      setGroupAssignments(initialAssignments);
    }
    
    setLoading(false);
  }, []);
  
  // 处理返回
  const handleBack = () => {
    router.back()
  }
  
  // 切换分组分配模式
  const toggleGroupAssignment = () => {
    const newGroupByMode = !groupByType;
    setGroupByType(newGroupByMode);
    
    // 如果开启分组模式，自动选择第一个组作为活动组
    if (newGroupByMode && Object.keys(projectGroups).length > 0) {
      setActiveGroup(Object.keys(projectGroups)[0]);
    } else {
      setActiveGroup('');
    }
  }
  
  // 切换活动组
  const switchActiveGroup = (groupName: string) => {
    setActiveGroup(groupName);
    // 可以在这里添加额外的逻辑，例如重置筛选条件等
  }
  
  // 获取当前活动组的分配情况
  const getCurrentGroupAssignment = () => {
    if (!activeGroup || !groupAssignments[activeGroup]) {
      return { experts: [], worksheet: null };
    }
    return groupAssignments[activeGroup];
  }

  // 处理专家选择
  const handleExpertSelect = (expertId: string) => {
    if (groupByType) {
      // 如果是分组分配模式，需要更新当前选中组的专家
      if (activeGroup) {
        setGroupAssignments(prev => ({
          ...prev,
          [activeGroup]: {
            ...prev[activeGroup],
            experts: prev[activeGroup].experts.includes(expertId)
              ? prev[activeGroup].experts.filter(id => id !== expertId)
              : [...prev[activeGroup].experts, expertId]
          }
        }));
      }
    } else {
      // 常规模式
      setSelectedExperts(prev => 
        prev.includes(expertId)
          ? prev.filter(id => id !== expertId)
          : [...prev, expertId]
      )
    }
  }
  
  // 处理工作表选择
  const handleWorksheetSelect = (worksheetId: string) => {
    if (groupByType) {
      // 如果是分组分配模式，需要更新当前选中组的工作表
      if (activeGroup) {
        setGroupAssignments(prev => ({
          ...prev,
          [activeGroup]: {
            ...prev[activeGroup],
            worksheet: prev[activeGroup].worksheet === worksheetId ? null : worksheetId
          }
        }));
      }
    } else {
      // 常规模式
      setSelectedWorksheet(prev => 
        prev === worksheetId ? null : worksheetId
      )
    }
  }
  
  // 过滤专家列表
  const filteredExperts = useMemo(() => {
    return mockExperts.filter(expert => {
      // 按专业筛选
      if (expertiseFilter.length > 0 && !expert.expertise.some(exp => expertiseFilter.includes(exp))) {
        return false;
      }
      
      // 按职称筛选
      if (titleFilter.length > 0 && !titleFilter.includes(expert.title)) {
        return false;
      }
      

      
      // 按名称搜索
      if (searchQuery && !expert.name.includes(searchQuery) && !expert.department.includes(searchQuery)) {
        return false;
      }
      
      return true;
    });
  }, [expertiseFilter, titleFilter, searchQuery]);
  

  
  // 获取已选专家
  const getSelectedExpertNames = (): string | Record<string, string> => {
    if (groupByType) {
      // 分组模式下，返回每个组的专家
      const result: Record<string, string> = {};
      Object.keys(groupAssignments).forEach(group => {
        result[group] = groupAssignments[group].experts.map(id => 
          mockExperts.find(expert => expert.id === id)?.name || ''
        ).join('、');
      });
      return result;
    } else {
      // 常规模式
      return selectedExperts.map(id => 
        mockExperts.find(expert => expert.id === id)?.name || ''
      ).join('、');
    }
  }
  
  // 获取已选工作表
  const getSelectedWorksheetName = (): string | Record<string, string> => {
    if (groupByType) {
      // 分组模式下，返回每个组的工作表
      const result: Record<string, string> = {};
      Object.keys(groupAssignments).forEach(group => {
        result[group] = mockWorksheets.find(ws => ws.id === groupAssignments[group].worksheet)?.name || '';
      });
      return result;
    } else {
      // 常规模式
      return mockWorksheets.find(ws => ws.id === selectedWorksheet)?.name || '';
    }
  }

  // 获取当前选择的专家总数（分组或常规模式）
  const getTotalSelectedExperts = () => {
    if (groupByType) {
      // 分组模式下，计算所有组中选择的专家总数
      return Object.values(groupAssignments).reduce((total, group) => 
        total + group.experts.length, 0
      );
    } else {
      // 常规模式
      return selectedExperts.length;
    }
  }

  // 获取当前活动组选择的专家数量
  const getActiveGroupSelectedExpertsCount = () => {
    if (!groupByType || !activeGroup || !groupAssignments[activeGroup]) {
      return 0;
    }
    return groupAssignments[activeGroup].experts.length;
  }

  // 检查是否所有组都已选择专家
  const areAllGroupsSelected = () => {
    if (!groupByType) return true;
    
    return Object.keys(groupAssignments).every(group => 
      groupAssignments[group].experts.length > 0
    );
  }

  // 检查是否所有组都已选择专家和工作表
  const areAllGroupsComplete = () => {
    if (!groupByType) {
      return selectedExperts.length > 0 && selectedWorksheet !== null;
    }
    
    return Object.keys(groupAssignments).every(group => 
      groupAssignments[group].experts.length > 0 && groupAssignments[group].worksheet !== null
    );
  }

  // 进入下一步
  const goToNextStep = () => {
    if (stepIndex === 1) {
      if (groupByType) {
        // 分组模式下的验证
        if (!areAllGroupsSelected()) {
          toast({
            title: "请为所有组选择专家",
            description: "请确保为每个项目组至少选择一位专家后继续",
            variant: "destructive",
          });
          return;
        }
      } else {
        // 常规模式的验证
        if (selectedExperts.length === 0) {
          toast({
            title: "请选择专家",
            description: "请至少选择一位专家后继续",
            variant: "destructive",
          });
          return;
        }
      }
      setStepIndex(2);
    } 
  }
  
  // 返回上一步
  const goToPrevStep = () => {
    if (stepIndex > 1) {
      setStepIndex(stepIndex - 1)
    }
  }
  
  // 直接执行批量分配
  const handleBatchAssign = () => {
    if (groupByType) {
      // 分组模式下的验证
      const invalidGroups = Object.keys(groupAssignments).filter(group => {
        return groupAssignments[group].experts.length === 0 || !groupAssignments[group].worksheet;
      });
      
      if (invalidGroups.length > 0) {
        toast({
          title: "分配不完整",
          description: `请为所有项目组选择专家和工作表`,
          variant: "destructive",
        });
        return;
      }
    } else {
      // 常规模式的验证
      if (!selectedWorksheet) {
        toast({
          title: "请选择工作表",
          description: "请选择一个审查工作表",
          variant: "destructive",
        });
        return;
      }
    }
    
    // 直接执行分配并显示成功提示
    toast({
      title: "分配成功",
      description: groupByType 
        ? `已成功为${projects.length}个项目按分组分配专家和工作表` 
        : `已成功为${projects.length}个项目分配专家和工作表`,
    });
    
    // 返回快速审查列表
    router.push("/ethic-review/quick-review");
  }
  


  return (
    <div className="container py-6 max-w-[1200px]">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {/* 返回按钮 */}
          <button
            onClick={handleBack}
            className="h-8 w-8 flex items-center justify-center border rounded-md text-gray-500 hover:text-primary transition-colors duration-200 bg-white shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          {/* 页面标题 */}
          <h1 className="text-2xl font-bold ml-4">批量分配专家</h1>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* 左侧项目列表 */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <div className="p-5 border-b bg-gradient-to-r from-purple-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <UserRoundPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">待分配快速审查项目</h2>
                  <p className="text-xs text-slate-500 mt-0.5">已选择 {projects.length} 个项目进行批量分配</p>
                </div>
              </div>
            </div>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
              {loading ? (
                <div className="h-64 flex items-center justify-center flex-1">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {projects.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 h-full flex items-center justify-center">
                      <p>未选择任何项目</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {projects.map((project) => (
                        <div key={project.id} className="p-4 hover:bg-slate-50">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                              <span className="text-sm">{project.name.charAt(0)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-slate-800 truncate">{project.name}</div>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" className="bg-slate-50 text-slate-700 text-xs">
                                  {project.projectSubType}
                                </Badge>
                                <span className="text-xs text-slate-500">{project.projectId}</span>
                              </div>
                              <div className="mt-2 text-xs text-slate-500">
                                <span>项目负责人: {project.projectLeader?.name}</span>
                                <span className="mx-2">•</span>
                                <span>{project.department}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* 右侧AI推荐面板 */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col">
            {/* 标题区域 - 修改为与左侧项目卡片一致的样式 */}
            <div className="p-5 border-b bg-gradient-to-r from-purple-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <FileCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">确认专家分配</h2>
                  <p className="text-xs text-slate-500 mt-0.5">为选定的项目分配专家和工作表</p>
                </div>
              </div>
            </div>
            
            {/* 步骤指示器 */}
            <div className="flex items-center px-4 py-3 bg-white border-b">
              <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepIndex === 1 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {stepIndex > 1 ? <LucideCheck className="h-4 w-4" /> : "1"}
                </div>
                <div className="ml-2">
                  <div className={`text-sm font-medium ${stepIndex === 1 ? "text-blue-600" : "text-slate-700"}`}>选择专家</div>
                  <div className="text-xs text-slate-500">推荐{mockExperts.length}位专家</div>
                </div>
              </div>
              
              <div className="w-12 h-0.5 bg-slate-200"></div>
              
              <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepIndex === 2 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-100 text-slate-400"
                }`}>
                  2
                </div>
                <div className="ml-2">
                  <div className={`text-sm font-medium ${stepIndex === 2 ? "text-blue-600" : "text-slate-400"}`}>选择工作表</div>
                  <div className="text-xs text-slate-500">推荐{mockWorksheets.length}种工作表</div>
                </div>
              </div>
            </div>
            
            {/* 内容区域 */}
            <div className="flex-1 overflow-auto min-h-0 bg-slate-50/50">
              {/* 专家推荐列表 */}
              {stepIndex === 1 && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-700">
                      {groupByType && activeGroup 
                        ? `为${activeGroup}组推荐专家` 
                        : "智能推荐专家"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="relative flex bg-slate-100 p-0.5 rounded-full">
                        <button
                          onClick={() => setGroupByType(false)}
                          className={`relative px-3 py-1 text-xs font-medium rounded-full transition-colors ${!groupByType ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          匹配度排序
                        </button>
                        <button
                          onClick={() => {
                            if (!groupByType) {
                              setGroupByType(true);
                              if (Object.keys(projectGroups).length > 0) {
                                setActiveGroup(Object.keys(projectGroups)[0]);
                              }
                            }
                          }}
                          className={`relative px-3 py-1 text-xs font-medium rounded-full transition-colors ${groupByType ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          分组分配
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 筛选工具条 - 改为折叠面板 */}
                  <div className="bg-white rounded-lg border border-slate-200 mb-3 overflow-hidden transition-all">
                    <div 
                      className="p-3 cursor-pointer flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                      onClick={() => {
                        const filterPanel = document.getElementById('filterPanel');
                        if (filterPanel) {
                          filterPanel.classList.toggle('hidden');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">筛选条件</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </div>
                    
                    <div id="filterPanel" className="hidden p-3 border-t border-slate-200">
                      <div className="space-y-3">
                        {/* 专业领域筛选 */}
                        <div>
                          <label className="text-xs font-medium text-slate-700 mb-1 block">专业领域</label>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {["内科学", "外科学", "药理学", "伦理审查", "人工智能医疗"].map(expertise => (
                              <Badge
                                key={expertise}
                                variant="outline"
                                className={`cursor-pointer ${expertiseFilter.includes(expertise) ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 hover:bg-slate-100"}`}
                                onClick={() => setExpertiseFilter(prev => prev.includes(expertise) ? prev.filter(e => e !== expertise) : [...prev, expertise])}
                              >
                                {expertise}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* 职称筛选 */}
                        <div>
                          <label className="text-xs font-medium text-slate-700 mb-1 block">职称</label>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {["教授", "副教授", "研究员", "副研究员"].map(title => (
                              <Badge
                                key={title}
                                variant="outline"
                                className={`cursor-pointer ${titleFilter.includes(title) ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 hover:bg-slate-100"}`}
                                onClick={() => setTitleFilter(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title])}
                              >
                                {title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* 搜索框 */}
                        <div>
                          <label className="text-xs font-medium text-slate-700 mb-1 block">快速搜索</label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                placeholder="搜索专家姓名或部门..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-slate-200 py-1.5 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <button
                              onClick={() => {
                                setExpertiseFilter([]);
                                setTitleFilter([]);
                                setSearchQuery('');
                              }}
                              className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"
                            >
                              重置
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* u5206u7ec4u5206u914du6a21u5f0f */}
                  {groupByType && (
                    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-1.5 text-blue-500" />
                        项目分组
                      </h4>
                      <div className="grid gap-2">
                        {Object.entries(projectGroups).map(([type, groupProjects]) => (
                          <div 
                            key={type}
                            className={`p-3 rounded-md border ${
                              activeGroup === type 
                                ? "border-blue-300 bg-blue-50/60 shadow-sm" 
                                : "border-slate-200 hover:bg-slate-50"
                            } cursor-pointer transition-colors`}
                            onClick={() => switchActiveGroup(type)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-slate-800">{type}</span>
                                <span className="ml-2 text-xs text-slate-500">{groupProjects.length} 个项目</span>
                                {activeGroup === type && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-700 border-none">当前选中</Badge>
                                )}
                              </div>
                              <div className="text-xs">
                                <span className="mr-2">已选: {groupAssignments[type]?.experts.length || 0} 位专家</span>
                                <Badge variant="outline" className={
                                  groupAssignments[type]?.worksheet 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : "bg-slate-50"
                                }>
                                  {groupAssignments[type]?.worksheet ? '已选工作表' : '未选工作表'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {activeGroup && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-slate-700">
                              当前为 <span className="text-blue-600">{activeGroup}</span> 组选择专家
                            </div>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              {projectGroups[activeGroup]?.length || 0} 个项目
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {filteredExperts.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <div className="mb-2">没有找到符合条件的专家</div>
                        <div className="text-sm">请尝试调整筛选条件</div>
                      </div>
                    ) : (
                      filteredExperts.map((expert) => (
                        <div
                          key={expert.id}
                          className={`p-4 rounded-lg transition-all shadow-sm ${
                            selectedExperts.includes(expert.id)
                              ? "border border-blue-200 bg-blue-50/80 shadow-blue-100"
                              : "border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                          }`}
                          onClick={() => handleExpertSelect(expert.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-slate-500 overflow-hidden transition-all ${
                                (groupByType ? 
                                  (activeGroup && groupAssignments[activeGroup]?.experts.includes(expert.id)) :
                                  selectedExperts.includes(expert.id)
                                )
                                  ? "bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-500"
                                  : "bg-gradient-to-br from-slate-100 to-slate-200"
                              }`}>
                                <User className={`h-6 w-6 ${
                                  (groupByType ? 
                                    (activeGroup && groupAssignments[activeGroup]?.experts.includes(expert.id)) :
                                    selectedExperts.includes(expert.id)
                                  ) ? "text-blue-600" : "text-slate-600"
                                }`} />
                              </div>
                              {(groupByType ? 
                                (activeGroup && groupAssignments[activeGroup]?.experts.includes(expert.id)) :
                                selectedExperts.includes(expert.id)
                              ) && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="min-w-0">
                                  <div className="font-medium text-slate-800 truncate">{expert.name}</div>
                                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                                    {expert.department} · {expert.title}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`flex-shrink-0 ${
                                      expert.matchScore >= 90
                                        ? "bg-green-50 text-green-700 border-green-100"
                                        : expert.matchScore >= 80
                                        ? "bg-blue-50 text-blue-700 border-blue-100"
                                        : "bg-amber-50 text-amber-700 border-amber-100"
                                    } font-normal whitespace-nowrap`}
                                  >
                                    匹配度 {expert.matchScore}%
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* 专业标签 - 最多显示2个，剩余的显示数量 */}
                              <div className="mt-2 flex space-x-1.5">
                                {expert.expertise.slice(0, 2).map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-normal whitespace-nowrap flex-shrink-0"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {expert.expertise.length > 2 && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge
                                          variant="outline"
                                          className="bg-slate-100 text-slate-600 border-slate-300 text-xs font-normal whitespace-nowrap flex-shrink-0 cursor-pointer"
                                        >
                                          +{expert.expertise.length - 2}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="max-w-xs">
                                        <div className="space-y-1">
                                          <div className="font-medium text-xs">其他专业领域：</div>
                                          <div className="text-xs">
                                            {expert.expertise.slice(2).join('、')}
                                          </div>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              
                              {/* u81eau5b9au4e49u6837u5f0fu9690u85cfu6edau52a8u6761 */}
                              <style jsx global>{`
                                .hide-scrollbar::-webkit-scrollbar {
                                  height: 0px;
                                  width: 0px;
                                  background: transparent;
                                }
                                .hide-scrollbar {
                                  -ms-overflow-style: none;
                                  scrollbar-width: none;
                                }
                              `}</style>
                              

                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 工作表推荐列表 */}
              {stepIndex === 2 && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-700">
                      {groupByType && activeGroup 
                        ? `为${activeGroup}组推荐工作表` 
                        : "智能推荐审查工作表"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="relative flex bg-slate-100 p-0.5 rounded-full">
                        <button
                          onClick={() => setGroupByType(false)}
                          className={`relative px-3 py-1 text-xs font-medium rounded-full transition-colors ${!groupByType ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          匹配度排序
                        </button>
                        <button
                          onClick={() => {
                            if (!groupByType) {
                              setGroupByType(true);
                              if (Object.keys(projectGroups).length > 0) {
                                setActiveGroup(Object.keys(projectGroups)[0]);
                              }
                            }
                          }}
                          className={`relative px-3 py-1 text-xs font-medium rounded-full transition-colors ${groupByType ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          分组分配
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 分组工作表选择模式 */}
                  {groupByType && (
                    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-1.5 text-blue-500" />
                        项目分组
                      </h4>
                      <div className="grid gap-2">
                        {Object.entries(projectGroups).map(([type, groupProjects]) => (
                          <div 
                            key={type}
                            className={`p-3 rounded-md border ${
                              activeGroup === type 
                                ? "border-blue-300 bg-blue-50/60 shadow-sm" 
                                : "border-slate-200 hover:bg-slate-50"
                            } cursor-pointer transition-colors`}
                            onClick={() => switchActiveGroup(type)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-slate-800">{type}</span>
                                <span className="ml-2 text-xs text-slate-500">{groupProjects.length} 个项目</span>
                                {activeGroup === type && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-700 border-none">当前选中</Badge>
                                )}
                              </div>
                              <div className="text-xs">
                                <span className="mr-2">已选: {groupAssignments[type]?.experts.length || 0} 位专家</span>
                                <Badge variant="outline" className={
                                  groupAssignments[type]?.worksheet 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : "bg-slate-50"
                                }>
                                  {groupAssignments[type]?.worksheet ? '已选工作表' : '未选工作表'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {activeGroup && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-slate-700">
                              当前为 <span className="text-blue-600">{activeGroup}</span> 组选择专家
                            </div>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              {projectGroups[activeGroup]?.length || 0} 个项目
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {mockWorksheets.map((worksheet) => (
                      <div
                        key={worksheet.id}
                        className={`p-4 rounded-lg transition-all shadow-sm ${
                          groupByType 
                            ? (activeGroup && groupAssignments[activeGroup]?.worksheet === worksheet.id)
                              ? "border border-blue-200 bg-blue-50/80 shadow-blue-100"
                              : "border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                            : selectedWorksheet === worksheet.id
                              ? "border border-blue-200 bg-blue-50/80 shadow-blue-100"
                              : "border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                        }`}
                        onClick={() => handleWorksheetSelect(worksheet.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 transition-all ${
                              (groupByType 
                                ? (activeGroup && groupAssignments[activeGroup]?.worksheet === worksheet.id)
                                : selectedWorksheet === worksheet.id
                              )
                                ? "bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-500 text-blue-600"
                                : "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-500"
                            }`}>
                            <ClipboardList className="h-6 w-6" />
                            </div>
                            {(groupByType 
                              ? (activeGroup && groupAssignments[activeGroup]?.worksheet === worksheet.id)
                              : selectedWorksheet === worksheet.id
                            ) && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="font-medium text-slate-800 truncate">{worksheet.name}</div>
                              <Badge
                                className={`flex-shrink-0 ${
                                  worksheet.suitabilityScore >= 90
                                    ? "bg-green-50 text-green-700 border-green-100"
                                    : worksheet.suitabilityScore >= 80
                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                } font-normal whitespace-nowrap`}
                              >
                                匹配度 {worksheet.suitabilityScore}%
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              <div className="flex items-center whitespace-nowrap">
                                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span>更新: {worksheet.lastUpdated}</span>
                              </div>
                              <div className="flex items-center whitespace-nowrap">
                                <CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span>问题: {worksheet.questionCount}个</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 底部导航与确认区域 */}
            <div className="p-4 bg-white border-t mt-auto">
              {stepIndex === 1 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-slate-600 font-medium flex items-center">
                      <UserRoundPlus className="h-4 w-4 mr-1.5 text-blue-500" />
                      {groupByType && activeGroup 
                        ? `${activeGroup}组已选专家` 
                        : "已选专家"}
                    </div>
                    <div className="font-medium text-sm bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                      {groupByType && activeGroup 
                        ? getActiveGroupSelectedExpertsCount() 
                        : selectedExperts.length}
                    </div>
                  </div>
                  {groupByType && (
                    <div className="mb-4 pb-3 border-b border-slate-100">
                      <div className="text-xs text-slate-500 flex items-center justify-between">
                        <div>所有分组已选专家总数</div>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          {getTotalSelectedExperts()}
                        </Badge>
                      </div>
                      
                      {!areAllGroupsSelected() && (
                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100 flex gap-2">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          <span>请为所有项目组选择至少一位专家</span>
                        </div>
                      )}
                    </div>
                  )}
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 h-auto rounded-md transition-all shadow-sm"
                    onClick={goToNextStep}
                    disabled={groupByType ? !areAllGroupsSelected() : selectedExperts.length === 0}
                  >
                    下一步: 选择工作表
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-slate-600 font-medium flex items-center">
                        <UserRoundPlus className="h-4 w-4 mr-1.5 text-blue-500" />
                        已选专家
                      </div>
                      <div className="font-medium text-sm flex items-center bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                        {groupByType ? getTotalSelectedExperts() : selectedExperts.length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-slate-600 font-medium flex items-center">
                        <ClipboardList className="h-4 w-4 mr-1.5 text-blue-500" />
                        {groupByType && activeGroup 
                          ? `${activeGroup}组已选工作表` 
                          : "已选工作表"}
                      </div>
                      <div className="font-medium text-sm flex items-center bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                        {groupByType 
                          ? (activeGroup && groupAssignments[activeGroup]?.worksheet ? 1 : 0)
                          : (selectedWorksheet ? 1 : 0)}
                      </div>
                    </div>
                  </div>
                  
                  {groupByType && (
                    <div className="mb-4 pb-3 border-b border-slate-100">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-500">所有分组工作表选择情况：</div>
                        <div className="flex gap-2">
                          {Object.entries(groupAssignments).map(([type, assignment]) => (
                            <Badge key={type} variant="outline" 
                              className={assignment.worksheet 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-amber-50 text-amber-700 border-amber-100"}>
                              {type}: {assignment.worksheet ? '已选' : '未选'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {!Object.values(groupAssignments).every(g => g.worksheet) && (
                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100 flex gap-2">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          <span>请为所有项目组选择工作表</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="bg-white border border-slate-200 text-slate-700 font-medium py-2.5 h-auto rounded-md transition-all hover:bg-slate-50"
                      onClick={goToPrevStep}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1.5" />
                      返回选择专家
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 h-auto rounded-md flex justify-center items-center gap-1.5 transition-colors shadow-sm"
                      onClick={handleBatchAssign}
                      disabled={groupByType ? !areAllGroupsComplete() : !selectedWorksheet}
                    >
                      确认批量分配
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
      

    </div>
  )
} 