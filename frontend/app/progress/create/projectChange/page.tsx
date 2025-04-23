"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, CheckCircle, FileText, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar, Building, Tag, Clock, CreditCard, CalendarClock, Upload, X, Plus, AlertCircle, PaperclipIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { initialProjects } from "@/app/projects/data/project-data"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import React from "react"

interface Project {
  id: number;
  projectNumber: string;
  name: string;
  description: string;
  status: string;
  auditStatus: string;
  priority: string;
  type: string;
  source: string;
  startDate: string;
  endDate: string;
  progress: number;
  tasks: { completed: number; total: number };
  leader: { id: number; name: string; avatar: string };
  members: number;
  budget: number;
  isFavorite: boolean;
}

// 定义变更类型
export const CHANGE_TYPES = [
  { value: "budget", label: "预算变更" },
  { value: "member", label: "成员变更" },
  { value: "delegation", label: "项目委托" },
  { value: "delay", label: "延期变更" },
  { value: "leader", label: "负责人变更" },
  { value: "termination", label: "终止变更" },
]

// 模拟预算数据
interface BudgetItem {
  id: string;
  categoryId: string;
  category: string;
  subcategory: string;
  amount: number;
  changeAmount: number;
}

// 预算类别
interface BudgetCategory {
  id: string;
  name: string;
  items: BudgetItem[];
}

// 模拟项目成员数据
interface ProjectMember {
  id: string;
  name: string;
  avatar?: string;
  type: string; // 校内教师、校内学生、校外人员
  workUnit: string;
  title: string; 
  degree: string;
  role: string; // 负责人、参与人、主要参与人
  isRemoved?: boolean;
}

interface DelegationInfo {
  delegateName: string;
  delegationType: string; // "longTerm" or "fixedPeriod"
  startDate?: Date | null;
  endDate?: Date | null;
  delegationReason?: string;
  delegationContent?: string;
}

interface FormValues {
  projectId: string;
  projectName: string;
  changeTypes: string[];
  changeMaterials: string;
  selectedFile?: File | null;
  selectedFileName?: string;
  changeReason: string;
  // 预算变更
  budgetCategories: BudgetCategory[];
  budgetChangeReason?: string;
  // 成员变更
  projectMembers: ProjectMember[];
  newMembers: ProjectMember[];
  // 项目委托
  delegationInfo: DelegationInfo;
  // 延期变更
  originalEndDate?: Date | null;
  newEndDate?: Date | null;
  delayReason?: string;
  // 负责人变更
  originalLeader?: string;
  originalLeaderTitle?: string; 
  originalLeaderUnit?: string;
  newLeader?: string;
  leaderChangeReason?: string;
  // 终止变更
  terminationReason?: string;
  projectAchievement?: string;
}

export default function ProjectChangePage() {
  const [formValues, setFormValues] = useState<FormValues>({
    projectId: "",
    projectName: "",
    changeTypes: [],
    changeMaterials: "",
    selectedFile: null,
    selectedFileName: "",
    changeReason: "",
    budgetCategories: [],
    projectMembers: [],
    newMembers: [],
    delegationInfo: {
      delegateName: "",
      delegationType: "longTerm",
      delegationReason: "",
      delegationContent: ""
    },
    originalLeader: "",
    originalLeaderTitle: "",
    originalLeaderUnit: ""
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showProjectInfo, setShowProjectInfo] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const isFirstRender = useRef(true)

  // 过滤项目列表
  const filteredProjects = initialProjects.filter((project) => 
    project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.projectNumber.toLowerCase().includes(searchValue.toLowerCase())
  )

  useEffect(() => {
    // 如果有初始项目ID，查找对应项目并设置为选中
    if (formValues.projectId) {
      const project = initialProjects.find(p => p.projectNumber === formValues.projectId)
      if (project) {
        setSelectedProject(project)
      }
    }
  }, [formValues.projectId])

  const handleSaveDraft = () => {
    console.log("保存草稿", formValues)
    // 实现保存草稿逻辑
    toast({
      title: "暂存成功",
      description: "项目变更已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/progress")
    }, 1000)
  }

  const handleComplete = () => {
    // 验证表单
    if (validateForm()) {
      console.log("提交变更申请", formValues)
    // 实现提交逻辑
    setShowSuccessDialog(true)
    } else {
      // 显示验证错误提示
      toast({
        title: "表单验证失败",
        description: "请填写所有必填项",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleContinueAdd = () => {
    // 重置表单数据和步骤
    setFormValues({
      projectId: "",
      projectName: "",
      changeTypes: [],
      changeMaterials: "",
      selectedFile: null,
      selectedFileName: "",
      changeReason: "",
      budgetCategories: [],
      projectMembers: [],
      newMembers: [],
      delegationInfo: {
        delegateName: "",
        delegationType: "longTerm",
        delegationReason: "",
        delegationContent: ""
      },
      originalLeader: "",
      originalLeaderTitle: "",
      originalLeaderUnit: ""
    })
    setShowSuccessDialog(false)
    setValidationErrors({})
    setSelectedProject(null)
  }

  const handleReturnToList = () => {
    router.push("/progress")
  }

  const handleChange = (field: keyof FormValues, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 验证表单
  const validateForm = () => {
    const errors: Record<string, boolean> = {}
    
    if (!formValues.projectName) errors["项目名称"] = true
    if (formValues.changeTypes.length === 0) errors["变更类型"] = true
    if (!formValues.changeReason) errors["变更原因"] = true

    // 验证不同变更类型的必填字段
    if (formValues.changeTypes.includes("budget")) {
      if (formValues.budgetCategories.length === 0) errors["预算项"] = true
      
      // 验证变更金额总和是否为0
      const totalChange = formValues.budgetCategories.reduce((total, category) => {
        return total + category.items.reduce((sum, item) => sum + (item.changeAmount || 0), 0);
      }, 0);
      
      if (Math.abs(totalChange) > 0.01) { // 允许一定的浮点数精度误差
        errors["预算变更总和"] = true;
      }
    }
    
    if (formValues.changeTypes.includes("member")) {
      if (formValues.projectMembers.filter(m => m.isRemoved).length === 0 && 
          formValues.newMembers.length === 0) {
        errors["成员变更"] = true
      }
    }
    
    if (formValues.changeTypes.includes("delegation")) {
      if (!formValues.delegationInfo.delegateName) errors["被委托人"] = true
      if (formValues.delegationInfo.delegationType === "fixedPeriod") {
        if (!formValues.delegationInfo.startDate) errors["委托开始日期"] = true
        if (!formValues.delegationInfo.endDate) errors["委托结束日期"] = true
      }
      if (!formValues.delegationInfo.delegationContent) errors["委托内容"] = true
    }
    
    if (formValues.changeTypes.includes("delay")) {
      if (!formValues.newEndDate) errors["新结束日期"] = true
      if (!formValues.delayReason) errors["延期原因"] = true
    }
    
    if (formValues.changeTypes.includes("leader")) {
      if (!formValues.newLeader) errors["新负责人"] = true
    }
    
    if (formValues.changeTypes.includes("termination")) {
      if (!formValues.terminationReason) errors["终止原因"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 检查变更类型是否选中
  const isChangeTypeSelected = (type: string) => {
    return formValues.changeTypes.includes(type)
  }
  
  // 处理变更类型的选择/取消
  const handleChangeTypeToggle = (type: string) => {
    setFormValues((prev) => {
      // 如果已经选中，则取消选择
      if (prev.changeTypes.includes(type)) {
        return {
          ...prev,
          changeTypes: prev.changeTypes.filter(t => t !== type)
        }
      } 
      // 否则添加到选中项
      return {
        ...prev,
        changeTypes: [...prev.changeTypes, type]
      }
    })
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return ""
    if (typeof date === 'string') return date
    return format(date, "yyyy-MM-dd")
  }

  const handleSelectProject = (project: Project) => {
    setFormValues((prev) => ({
      ...prev,
      projectId: project.projectNumber,
      projectName: project.name,
    }))
    setSelectedProject(project)
    setOpen(false)
    
    // 显示加载状态和项目信息预览
    setIsLoading(true)
    setShowProjectInfo(true)
    
    // 模拟加载时间后进入下一步
    setTimeout(() => {
      setIsLoading(false)
      // 项目信息预览显示一段时间后自动进入下一页
      setTimeout(() => {
        setShowProjectInfo(false)
      }, 1000)
    }, 1200)
  }

  // 处理预算变更金额
  const handleBudgetChange = (categoryId: string, itemId: string, changeAmount: number) => {
    setFormValues(prev => {
      const newCategories = prev.budgetCategories.map(category => {
        if (category.id === categoryId) {
          const updatedItems = category.items.map(item => 
            item.id === itemId ? { ...item, changeAmount } : item
          );
          return { ...category, items: updatedItems };
        }
        return category;
      });
      return {
        ...prev,
        budgetCategories: newCategories
      };
    });
  }
  
  // 计算预算类别总额
  const getCategoryTotal = (category: BudgetCategory) => {
    return category.items.reduce((sum, item) => sum + item.amount, 0);
  }
  
  // 计算预算类别变更总额
  const getCategoryChangeTotal = (category: BudgetCategory) => {
    return category.items.reduce((sum, item) => sum + (item.changeAmount || 0), 0);
  }
  
  // 计算所有预算变更总额
  const getTotalBudgetChange = () => {
    return formValues.budgetCategories.reduce((total, category) => {
      return total + getCategoryChangeTotal(category);
    }, 0);
  }
  
  // 处理成员移除操作
  const handleMemberRemoval = (id: string) => {
    setFormValues(prev => ({
      ...prev,
      projectMembers: prev.projectMembers.map(member => 
        member.id === id ? { ...member, isRemoved: !member.isRemoved } : member
      )
    }));
  }
  
  // 处理委托信息变更
  const handleDelegationChange = (field: keyof DelegationInfo, value: any) => {
    setFormValues(prev => ({
      ...prev,
      delegationInfo: {
        ...prev.delegationInfo,
        [field]: value
      }
    }));
  }
  
  // 更新新成员信息
  const handleNewMemberChange = (id: string, field: keyof ProjectMember, value: string) => {
    setFormValues(prev => ({
      ...prev,
      newMembers: prev.newMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  }
  
  // 删除新成员
  const handleRemoveNewMember = (id: string) => {
    setFormValues(prev => ({
      ...prev,
      newMembers: prev.newMembers.filter(member => member.id !== id)
    }));
  }

  // 处理文件上传
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormValues(prev => ({
        ...prev,
        selectedFile: file,
        selectedFileName: file.name
      }));
    }
  };

  // 当选择项目时加载预算和成员信息
  useEffect(() => {
    if (selectedProject) {
      // 模拟预算数据 - 实际环境中应该从API获取
      const mockBudgetCategories: BudgetCategory[] = [
        {
          id: "cat1",
          name: "研发费用",
          items: [
            { id: "b1", categoryId: "cat1", category: "研发费用", subcategory: "人员薪酬", amount: 200, changeAmount: 0 },
            { id: "b2", categoryId: "cat1", category: "研发费用", subcategory: "设备费", amount: 150, changeAmount: 0 },
            { id: "b3", categoryId: "cat1", category: "研发费用", subcategory: "材料费", amount: 80, changeAmount: 0 },
          ]
        },
        {
          id: "cat2",
          name: "管理费用",
          items: [
            { id: "b4", categoryId: "cat2", category: "管理费用", subcategory: "办公费", amount: 50, changeAmount: 0 },
            { id: "b5", categoryId: "cat2", category: "管理费用", subcategory: "差旅费", amount: 80, changeAmount: 0 },
          ]
        },
        {
          id: "cat3",
          name: "其他费用",
          items: [
            { id: "b6", categoryId: "cat3", category: "其他费用", subcategory: "会议费", amount: 30, changeAmount: 0 },
            { id: "b7", categoryId: "cat3", category: "其他费用", subcategory: "培训费", amount: 45, changeAmount: 0 },
          ]
        }
      ];
      
      // 模拟成员数据 - 实际环境中应该从API获取
      const mockMembers: ProjectMember[] = [
        { 
          id: "m1", 
          name: "王建国", 
          type: "校内教师", 
          workUnit: "计算机科学学院", 
          title: "教授", 
          degree: "博士", 
          role: "负责人", 
          avatar: "/avatars/01.png" 
        },
        { 
          id: "m2", 
          name: "李明", 
          type: "校内教师", 
          workUnit: "计算机科学学院", 
          title: "副教授", 
          degree: "博士", 
          role: "主要参与人", 
          avatar: "/avatars/02.png" 
        },
        { 
          id: "m3", 
          name: "张华", 
          type: "校内学生", 
          workUnit: "计算机科学学院", 
          title: "博士研究生", 
          degree: "硕士", 
          role: "参与人", 
          avatar: "/avatars/03.png" 
        },
        { 
          id: "m4", 
          name: "赵芳", 
          type: "校外人员", 
          workUnit: "科技有限公司", 
          title: "高级工程师", 
          degree: "硕士", 
          role: "参与人", 
          avatar: "/avatars/04.png" 
        },
      ];
      
      // 获取原始结束日期
      const originalEndDate = new Date(selectedProject.endDate);
      
      // 获取项目负责人信息
      const projectLeader = mockMembers.find(member => member.role === "负责人");
      
      setFormValues(prev => ({
        ...prev,
        budgetCategories: mockBudgetCategories,
        projectMembers: mockMembers,
        originalEndDate: originalEndDate,
        originalLeader: projectLeader?.name || selectedProject.leader.name,
        originalLeaderTitle: projectLeader?.title || "教授", // 示例默认值
        originalLeaderUnit: projectLeader?.workUnit || "计算机科学学院" // 示例默认值
      }));
    }
  }, [selectedProject]);

  // 获取成员类型选项
  const memberTypes = ["校内教师", "校内学生", "校外人员"];
  
  // 获取项目角色选项
  const projectRoles = ["负责人", "主要参与人", "参与人"];
  
  // 处理添加新成员
  const handleAddNewMember = () => {
    const newMemberId = `new-${Date.now()}`;
    setFormValues(prev => ({
      ...prev,
      newMembers: [
        ...prev.newMembers,
        {
          id: newMemberId,
          name: "",
          type: "校内教师",
          workUnit: "",
          title: "",
          degree: "",
          role: "参与人"
        }
      ]
    }));
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/progress" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">新增项目变更</h1>
      </div>

      {/* 初始界面 - 仅显示项目选择 */}
      {!selectedProject && !showProjectInfo && (
        <motion.div 
          className="max-w-3xl mx-auto px-4 mb-6"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
        >
          <Card className="border-muted/30 rounded-lg shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-8 py-4">
                <div className="bg-blue-50 p-4 rounded-full">
                  <FileText className="h-10 w-10 text-blue-500" />
                </div>

                <div className="w-full max-w-md space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">选择项目</h3>
                    <p className="text-sm text-gray-500">请选择需要进行变更的项目</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="project-select"
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between border-gray-300 h-10",
                            validationErrors["项目名称"] && "border-destructive"
                          )}
                        >
                          {formValues.projectName || "请选择项目"}
                          <ChevronLeft className="ml-2 h-4 w-4 shrink-0 opacity-50 rotate-90" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full max-w-md p-0">
                        <Command>
                          <CommandInput 
                            placeholder="搜索项目名称或编号..." 
                            value={searchValue}
                            onValueChange={setSearchValue}
                          />
                          <CommandList className="max-h-60">
                            <CommandEmpty>
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                未找到相关项目
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredProjects.map((project) => (
                                <CommandItem
                                  key={project.id}
                                  value={project.name}
                                  onSelect={() => handleSelectProject(project)}
                                  className="py-2"
                                >
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{project.name}</span>
                                      <Badge className="px-1 h-5 text-xs" variant="outline">{project.type}</Badge>
                                    </div>
                                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                      <span>{project.projectNumber}</span>
                                      <span>负责人: {project.leader.name}</span>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {validationErrors["项目名称"] && (
                      <p className="text-xs text-destructive mt-1 text-center">请选择项目名称</p>
                    )}
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <InfoIcon className="h-4 w-4 mt-0.5 text-blue-500" />
                        <div>
                          <p>选择项目后，可进行以下变更操作：</p>
                          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 pl-1">
                            <li className="flex items-center gap-1.5 text-gray-600">
                              <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                              预算变更
                            </li>
                            <li className="flex items-center gap-1.5 text-gray-600">
                              <User className="h-3.5 w-3.5 text-blue-400" />
                              成员变更
                            </li>
                            <li className="flex items-center gap-1.5 text-gray-600">
                              <Building className="h-3.5 w-3.5 text-blue-400" />
                              项目委托
                            </li>
                            <li className="flex items-center gap-1.5 text-gray-600">
                              <CalendarClock className="h-3.5 w-3.5 text-blue-400" />
                              延期变更
                            </li>
                            <li className="flex items-center gap-1.5 text-gray-600">
                              <User className="h-3.5 w-3.5 text-blue-400" />
                              负责人变更
                            </li>
                            <li className="flex items-center gap-1.5 text-gray-600">
                              <FileText className="h-3.5 w-3.5 text-blue-400" />
                              终止变更
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-700">正在加载项目信息...</p>
        </motion.div>
      )}

      {/* 项目信息展示阶段 */}
      {showProjectInfo && selectedProject && !isLoading && (
        <motion.div
          className="max-w-3xl mx-auto px-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Card className="border-muted/30 rounded-lg shadow-sm">
            <CardContent className="p-0">
              <div className="bg-blue-50 p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h3 className="text-base font-medium text-gray-800">项目信息确认</h3>
                </div>
                <div className="text-sm text-blue-500">即将跳转到变更页面...</div>
              </div>
              
              <div className="p-6">
                <div className="bg-muted/40 p-4 rounded-md border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-medium">{selectedProject.name}</div>
                    <Badge variant="outline" className="px-3 py-1 text-xs">
                      {selectedProject.projectNumber}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">负责人:</span>
                      <span className="font-medium">{selectedProject.leader.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">所属单位:</span>
                      <span className="font-medium">{selectedProject.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">项目分类:</span>
                      <span className="font-medium">{selectedProject.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 选择项目后的布局 - 左侧变更信息，右侧项目信息 */}
      {selectedProject && !showProjectInfo && !isLoading && (
        <motion.div 
          className="mx-8 mb-6 flex flex-col lg:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
        >
          {/* 左侧 - 变更信息 */}
          <div className="flex-1 space-y-6">
            {/* 变更信息区域 */}
            <div>
              <div className="flex items-center gap-2 bg-white p-3 border-b">
                <div className="text-blue-500">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium">变更信息</h3>
              </div>
              <div className="mt-3">
                <Card className="border-muted/50">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        <Label className="flex items-center">
                          变更类型 <span className="text-destructive ml-1">*</span>
                        </Label>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {CHANGE_TYPES.map((type) => (
                            <div key={type.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`change-type-${type.value}`}
                                checked={isChangeTypeSelected(type.value)}
                                onCheckedChange={() => handleChangeTypeToggle(type.value)}
                              />
                              <Label
                                htmlFor={`change-type-${type.value}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        {validationErrors["变更类型"] && (
                          <p className="text-xs text-destructive mt-1">请至少选择一种变更类型</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="changeMaterials" className="flex items-center">
                          变更材料
                        </Label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label htmlFor="fileUpload" className="cursor-pointer">
                              <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50">
                                <Upload className="h-4 w-4" />
                                <span>上传文档</span>
                              </div>
                              <input 
                                id="fileUpload" 
                                type="file" 
                                className="hidden" 
                                onChange={handleFileChange}
                              />
                            </Label>
                            <span className="text-sm text-muted-foreground">支持上传PDF、Word等文档格式</span>
                          </div>
                          {formValues.selectedFileName && (
                            <div className="flex items-center justify-between gap-2 p-2 bg-muted rounded">
                              <div className="flex items-center gap-2">
                                <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{formValues.selectedFileName}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5" 
                                onClick={() => setFormValues(prev => ({ ...prev, selectedFile: null, selectedFileName: "" }))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="changeReason" className="flex items-center">
                          变更原因 <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Textarea
                          id="changeReason"
                          value={formValues.changeReason}
                          onChange={(e) => handleChange("changeReason", e.target.value)}
                          placeholder="请详细描述变更原因"
                          rows={4}
                          className={cn(
                            validationErrors["变更原因"] && "border-destructive"
                          )}
                        />
                        {validationErrors["变更原因"] && (
                          <p className="text-xs text-destructive mt-1">请输入变更原因</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 预算变更 */}
            {isChangeTypeSelected("budget") && (
              <div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                  <div className="text-blue-500">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium">预算变更</h3>
                </div>
                <div className="mt-3">
                  <Card className="border-muted/50">
                    <CardContent className="p-5">
                      <div className="space-y-6">
                        <Alert>
                          <InfoIcon className="h-4 w-4" />
                          <AlertDescription>
                            请注意：预算变更金额总和必须为0，表示预算总量不变，仅在科目间调整。增加预算填正数，减少预算填负数。
                          </AlertDescription>
                        </Alert>
                        
                        {formValues.budgetCategories.length > 0 ? (
                          <div className="space-y-6">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead style={{ width: "40%" }}>预算科目</TableHead>
                                  <TableHead className="text-right">原预算(万元)</TableHead>
                                  <TableHead className="text-right">变更金额(万元)</TableHead>
                                  <TableHead className="text-right">变更后金额(万元)</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {formValues.budgetCategories.map((category) => (
                                  <React.Fragment key={category.id}>
                                    {/* 父科目行 */}
                                    <TableRow className="bg-muted/30 font-medium">
                                      <TableCell>{category.name}</TableCell>
                                      <TableCell className="text-right">
                                        {getCategoryTotal(category).toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {getCategoryChangeTotal(category).toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {(getCategoryTotal(category) + getCategoryChangeTotal(category)).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                    
                                    {/* 子科目行 */}
                                    {category.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell className="pl-8">{item.subcategory}</TableCell>
                                        <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                          <Input
                                            type="number"
                                            value={item.changeAmount || ""}
                                            onChange={(e) => handleBudgetChange(category.id, item.id, Number(e.target.value))}
                                            className="w-32 text-right ml-auto"
                                            step="0.01"
                                          />
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                          {(item.amount + (item.changeAmount || 0)).toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </React.Fragment>
                                ))}
                                
                                {/* 总计行 */}
                                <TableRow className="bg-primary/10 font-bold">
                                  <TableCell>总计</TableCell>
                                  <TableCell className="text-right">
                                    {formValues.budgetCategories.reduce((total, category) => 
                                      total + getCategoryTotal(category), 0).toFixed(2)}
                                  </TableCell>
                                  <TableCell className={cn(
                                    "text-right",
                                    Math.abs(getTotalBudgetChange()) > 0.01 ? "text-destructive font-bold" : ""
                                  )}>
                                    {getTotalBudgetChange().toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formValues.budgetCategories.reduce((total, category) => 
                                      total + getCategoryTotal(category) + getCategoryChangeTotal(category), 0).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            
                            {validationErrors["预算变更总和"] && (
                              <p className="text-xs text-destructive mt-2">预算变更金额总和必须为0，请调整变更金额</p>
                            )}
                            
             
                          </div>
                        ) : (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              未找到项目预算信息，请联系管理员。
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 成员变更 */}
            {isChangeTypeSelected("member") && (
              <div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                  <div className="text-blue-500">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium">成员变更</h3>
                </div>
                <div className="mt-3">
                  <Card className="border-muted/50">
                    <CardContent className="p-5">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-3">当前项目成员</h4>
                          {formValues.projectMembers.length > 0 ? (
                            <div className="grid gap-4">
                              {formValues.projectMembers.map((member) => (
                                <div 
                                  key={member.id}
                                  className={cn(
                                    "flex items-center justify-between p-3 border rounded-md",
                                    member.isRemoved && "bg-muted/20 border-dashed border-destructive/50"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={member.avatar} />
                                      <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                      <div className="flex items-center">
                                        <p className={cn("font-medium", member.isRemoved && "line-through")}>{member.name}</p>
                                        <Badge variant="outline" className="ml-2">{member.role}</Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {member.type} | {member.workUnit} | {member.title} | {member.degree}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMemberRemoval(member.id)}
                                    className={cn(
                                      member.isRemoved ? "border-dashed" : "text-destructive hover:bg-destructive/10",
                                    )}
                                  >
                                    {member.isRemoved ? (
                                      <><Plus className="h-4 w-4 mr-1" /> 撤销申请</>
                                    ) : (
                                      <><X className="h-4 w-4 mr-1" /> 申请退出</>
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                未找到项目成员信息
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">新增成员</h4>
                            <Button variant="outline" size="sm" onClick={handleAddNewMember}>
                              <Plus className="h-4 w-4 mr-1" />
                              添加成员
                            </Button>
                          </div>
                          
                          {formValues.newMembers.length > 0 ? (
                            <div className="space-y-4">
                              {formValues.newMembers.map((member, index) => (
                                <div key={member.id} className="border rounded-md p-4 relative">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2"
                                    onClick={() => handleRemoveNewMember(member.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`member-name-${index}`}>姓名</Label>
                                      <Input
                                        id={`member-name-${index}`}
                                        value={member.name}
                                        onChange={(e) => handleNewMemberChange(member.id, "name", e.target.value)}
                                        placeholder="成员姓名"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor={`member-type-${index}`}>成员类型</Label>
                                      <Select
                                        value={member.type}
                                        onValueChange={(value) => handleNewMemberChange(member.id, "type", value)}
                                      >
                                        <SelectTrigger id={`member-type-${index}`}>
                                          <SelectValue placeholder="选择成员类型" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {memberTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor={`member-work-unit-${index}`}>工作单位</Label>
                                      <Input
                                        id={`member-work-unit-${index}`}
                                        value={member.workUnit}
                                        onChange={(e) => handleNewMemberChange(member.id, "workUnit", e.target.value)}
                                        placeholder="工作单位"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor={`member-title-${index}`}>职称/职务</Label>
                                      <Input
                                        id={`member-title-${index}`}
                                        value={member.title}
                                        onChange={(e) => handleNewMemberChange(member.id, "title", e.target.value)}
                                        placeholder="职称或职务"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor={`member-degree-${index}`}>学位</Label>
                                      <Input
                                        id={`member-degree-${index}`}
                                        value={member.degree}
                                        onChange={(e) => handleNewMemberChange(member.id, "degree", e.target.value)}
                                        placeholder="最高学位"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor={`member-role-${index}`}>项目角色</Label>
                                      <Select
                                        value={member.role}
                                        onValueChange={(value) => handleNewMemberChange(member.id, "role", value)}
                                      >
                                        <SelectTrigger id={`member-role-${index}`}>
                                          <SelectValue placeholder="选择项目角色" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {projectRoles.map((role) => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center p-6 border border-dashed rounded-md">
                              <p className="text-muted-foreground">点击上方按钮添加新成员</p>
                            </div>
                          )}
                        </div>
                        
                        {validationErrors["成员变更"] && (
                          <p className="text-xs text-destructive">请至少标记移除一名成员或添加一名新成员</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 项目委托 */}
            {isChangeTypeSelected("delegation") && (
              <div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                  <div className="text-blue-500">
                    <Building className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium">项目委托</h3>
                </div>
                <div className="mt-3">
                  <Card className="border-muted/50">
                    <CardContent className="p-5">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="delegateName" className="flex items-center">
                            被委托人 <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input
                            id="delegateName"
                            value={formValues.delegationInfo.delegateName}
                            onChange={(e) => handleDelegationChange("delegateName", e.target.value)}
                            placeholder="请输入被委托人姓名"
                            className={cn(
                              validationErrors["被委托人"] && "border-destructive"
                            )}
                          />
                          {validationErrors["被委托人"] && (
                            <p className="text-xs text-destructive mt-1">请输入被委托人</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>委托方式</Label>
                          <RadioGroup
                            value={formValues.delegationInfo.delegationType}
                            onValueChange={(value) => handleDelegationChange("delegationType", value)}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="longTerm" id="longTerm" />
                              <Label htmlFor="longTerm" className="cursor-pointer">长期委托</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fixedPeriod" id="fixedPeriod" />
                              <Label htmlFor="fixedPeriod" className="cursor-pointer">固定期限</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {formValues.delegationInfo.delegationType === "fixedPeriod" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="delegationStartDate" className="flex items-center">
                                委托开始日期 <span className="text-destructive ml-1">*</span>
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !formValues.delegationInfo.startDate && "text-muted-foreground",
                                      validationErrors["委托开始日期"] && "border-destructive"
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {formValues.delegationInfo.startDate ? formatDate(formValues.delegationInfo.startDate) : "选择日期"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={formValues.delegationInfo.startDate || undefined}
                                    onSelect={(date) => handleDelegationChange("startDate", date)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              {validationErrors["委托开始日期"] && (
                                <p className="text-xs text-destructive mt-1">请选择委托开始日期</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="delegationEndDate" className="flex items-center">
                                委托结束日期 <span className="text-destructive ml-1">*</span>
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !formValues.delegationInfo.endDate && "text-muted-foreground",
                                      validationErrors["委托结束日期"] && "border-destructive"
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {formValues.delegationInfo.endDate ? formatDate(formValues.delegationInfo.endDate) : "选择日期"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={formValues.delegationInfo.endDate || undefined}
                                    onSelect={(date) => handleDelegationChange("endDate", date)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              {validationErrors["委托结束日期"] && (
                                <p className="text-xs text-destructive mt-1">请选择委托结束日期</p>
                              )}
                            </div>
                          </>
                        )}
                        

                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 延期变更 */}
            {isChangeTypeSelected("delay") && (
              <div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                  <div className="text-blue-500">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium">延期变更</h3>
                </div>
                <div className="mt-3">
                  <Card className="border-muted/50">
                    <CardContent className="p-5">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="originalEndDate">
                            原结束日期 <Badge variant="secondary" className="ml-1">项目自动获取</Badge>
                          </Label>
                          <div className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{formValues.originalEndDate ? formatDate(formValues.originalEndDate) : "未获取到项目结束日期"}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newEndDate" className="flex items-center">
                            新结束日期 <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  validationErrors["新结束日期"] && "border-destructive"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {formValues.newEndDate ? formatDate(formValues.newEndDate) : "选择日期"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={formValues.newEndDate || undefined}
                                onSelect={(date) => handleChange("newEndDate", date)}
                                initialFocus
                                disabled={date => {
                                  // 确保只能选择比原结束日期晚的日期
                                  if (formValues.originalEndDate) {
                                    return date <= formValues.originalEndDate;
                                  }
                                  return false;
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          {validationErrors["新结束日期"] && (
                            <p className="text-xs text-destructive mt-1">请选择新结束日期</p>
                          )}
                        </div>
                        

                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 负责人变更 */}
            {isChangeTypeSelected("leader") && (
              <div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                  <div className="text-blue-500">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium">负责人变更</h3>
                </div>
                <div className="mt-3">
                  <Card className="border-muted/50">
                    <CardContent className="p-5">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>
                            原负责人 <Badge variant="secondary" className="ml-1">项目自动获取</Badge>
                          </Label>
                          <div className="flex items-center p-3 bg-muted/30 rounded-md">
                            <div className="space-y-1">
                              <p className="font-medium">{formValues.originalLeader || "未获取到负责人信息"}</p>
                              <p className="text-xs text-muted-foreground">
                                {formValues.originalLeaderTitle} | {formValues.originalLeaderUnit}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newLeader" className="flex items-center">
                            新负责人 <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input
                            id="newLeader"
                            value={formValues.newLeader || ""}
                            onChange={(e) => handleChange("newLeader", e.target.value)}
                            placeholder="请输入新负责人姓名"
                            className={cn(
                              validationErrors["新负责人"] && "border-destructive"
                            )}
                          />
                          {validationErrors["新负责人"] && (
                            <p className="text-xs text-destructive mt-1">请输入新负责人</p>
                          )}
                        </div>
                        

                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 终止变更 */}
            {isChangeTypeSelected("termination") && (
              <div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                  <div className="text-blue-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium">终止变更</h3>
                </div>
                <div className="mt-3">
                  <Card className="border-muted/50">
                    <CardContent className="p-5">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="terminationReason" className="flex items-center">
                            终止原因 <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Textarea
                            id="terminationReason"
                            value={formValues.terminationReason || ""}
                            onChange={(e) => handleChange("terminationReason", e.target.value)}
                            placeholder="请详细描述项目终止原因"
                            rows={3}
                            className={cn(
                              validationErrors["终止原因"] && "border-destructive"
                            )}
                          />
                          {validationErrors["终止原因"] && (
                            <p className="text-xs text-destructive mt-1">请输入终止原因</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectAchievement">项目成果</Label>
                          <Textarea
                            id="projectAchievement"
                            value={formValues.projectAchievement || ""}
                            onChange={(e) => handleChange("projectAchievement", e.target.value)}
                            placeholder="请描述项目已完成的成果"
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* 右侧 - 项目信息固定显示 */}
          {selectedProject && (
            <div className="lg:w-96 lg:sticky lg:top-6 lg:self-start">
              <div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                  <div className="text-blue-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium">项目信息</h3>
                </div>
                <div className="mt-3">
                  <Card className="border-muted/50">
                    <CardContent className="p-5">
                      <div className="bg-muted/40 p-4 rounded-md border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-lg font-medium">{selectedProject.name}</div>
                          <Badge variant="outline" className="px-3 py-1 text-xs">
                            {selectedProject.projectNumber}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">负责人:</span>
                            <span className="font-medium">{selectedProject.leader.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">所属单位:</span>
                            <span className="font-medium">{selectedProject.source}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">项目分类:</span>
                            <span className="font-medium">{selectedProject.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">批准经费:</span>
                            <span className="font-medium">{selectedProject.budget.toLocaleString()} 元</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">立项日期:</span>
                            <span className="font-medium">{selectedProject.startDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">终止日期:</span>
                            <span className="font-medium">{selectedProject.endDate}</span>
                          </div>
                        </div>
                        {selectedProject.description && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-start gap-2">
                              <InfoIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <span className="text-sm text-muted-foreground">项目简介:</span>
                                <p className="text-sm mt-1">{selectedProject.description}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 底部按钮 - 仅在选择项目后显示 */}
      {selectedProject && !showProjectInfo && !isLoading && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end space-x-4 z-10">
          <Button variant="outline" onClick={handleSaveDraft}>
            暂存
          </Button>
          <Button onClick={handleComplete}>
            提交申请
          </Button>
        </div>
      )}

      {/* 成功提交对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>变更申请已提交</DialogTitle>
            <DialogDescription>
              您的项目变更申请已成功提交，等待审核。
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:flex-1" onClick={handleContinueAdd}>
              继续添加
            </Button>
            <Button className="sm:flex-1" onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
