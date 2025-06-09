"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  AlertCircle, 
  Check, 
  FileCheck, 
  ChevronRight,
  Search,
  Download,
  Eye,
  User,
  Calendar,
  MapPin,
  BarChart3,
  ClipboardList,
  CheckCircle2,
  FileText,
  Filter
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// 导入新的自定义组件
import { ReviewTimelineCard as ReviewCard, AnimationStyles } from "./review-progress-card"

// 使用新的增强版审查流程卡片组件
const ReviewTimelineCard = ({ 
  review, 
  type = "progress",
  getDocumentStatusColor,
  index = 0
}: { 
  review: any, 
  type?: "progress" | "completed",
  getDocumentStatusColor: (status: string) => string,
  index?: number
}) => {
  // 直接返回新的ReviewCard组件，传入index=-1确保默认收起
  return (
    <ReviewCard 
      review={review}
      type={type}
      getDocumentStatusColor={getDocumentStatusColor}
      index={-1} // 传入-1确保所有卡片默认收起
    />
  );
};

export default function ReviewProgressTab({ projectId, projectType = "animal" }: { projectId?: string; projectType?: "animal" | "human" }) {
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // 根据项目类型生成审查数据
  const getReviewData = (type: "animal" | "human") => {
    if (type === "human") {
      return [
        {
          id: "1",
          type: "人体伦理研究初始审查",
          status: "审核中",
          submittedDate: "2024-01-20",
          expectedCompletionDate: "2024-02-25",
          submittedBy: "王教授",
          currentStep: "专家评审",
          progress: 75,
          hasLatestUpdate: true,
          latestUpdateDate: "2024-02-05",
          latestUpdateAction: "专家评审中",
          documentsCount: 4,
          reviewHistory: [
            {
              date: "2024-01-20",
              action: "提交申请",
              operator: "王教授",
              comments: "已提交完整的人体伦理研究审查申请材料，包括研究方案、知情同意书等文档。"
            },
            {
              date: "2024-01-25",
              action: "初步审查",
              operator: "伦理委员会秘书处",
              comments: "材料齐全，符合审查要求，转入专家评审环节。"
            },
            {
              date: "2024-02-05",
              action: "专家评审中",
              operator: "评审专家组",
              comments: "正在进行详细的专家评审，重点关注受试者权益保护措施和研究伦理性。最新进展：已完成3位专家的评审意见收集。"
            }
          ],
          documents: [
            { name: "人体研究申请书.pdf", uploadDate: "2024-01-20", status: "已审核" },
            { name: "临床研究方案.docx", uploadDate: "2024-01-20", status: "已审核" },
            { name: "知情同意书.pdf", uploadDate: "2024-01-20", status: "已审核" },
            { name: "研究人员资质证明.pdf", uploadDate: "2024-01-20", status: "已审核" }
          ]
        },
        {
          id: "2",
          type: "临床试验变更申请审查",
          status: "审核中",
          submittedDate: "2024-01-15",
          expectedCompletionDate: "2024-02-20",
          submittedBy: "李研究员",
          currentStep: "材料补充",
          progress: 45,
          hasLatestUpdate: false,
          documentsCount: 3,
          reviewHistory: [
            {
              date: "2024-01-15",
              action: "提交变更申请",
              operator: "李研究员",
              comments: "申请增加受试者数量和延长试验周期。"
            },
            {
              date: "2024-01-22",
              action: "初步审查",
              operator: "伦理委员会秘书处",
              comments: "需要补充变更理由说明书和风险评估报告。"
            },
            {
              date: "2024-01-30",
              action: "等待材料补充",
              operator: "伦理委员会",
              comments: "申请人需在2月10日前提交补充材料。"
            }
          ],
          documents: [
            { name: "试验变更申请书.pdf", uploadDate: "2024-01-15", status: "已审核" },
            { name: "变更理由说明.docx", uploadDate: "2024-01-15", status: "需修改" },
            { name: "风险评估报告.pdf", uploadDate: "2024-01-15", status: "待审核" }
          ]
        },
        {
          id: "3", 
          type: "临床试验终止报告审查",
          status: "审核中",
          submittedDate: "2024-01-28",
          expectedCompletionDate: "2024-02-28",
          submittedBy: "张教授",
          currentStep: "形式审查",
          progress: 25,
          hasLatestUpdate: false,
          documentsCount: 3,
          reviewHistory: [
            {
              date: "2024-01-28",
              action: "提交终止报告",
              operator: "张教授",
              comments: "由于研究目标已达成，申请提前终止临床试验。"
            },
            {
              date: "2024-02-02",
              action: "形式审查中",
              operator: "伦理委员会秘书处",
              comments: "正在检查终止报告的完整性和规范性。"
            }
          ],
          documents: [
            { name: "试验终止报告.pdf", uploadDate: "2024-01-28", status: "待审核" },
            { name: "受试者数据汇总.xlsx", uploadDate: "2024-01-28", status: "待审核" },
            { name: "不良事件记录.pdf", uploadDate: "2024-01-28", status: "待审核" }
          ]
        },
        {
          id: "4",
          type: "临床研究项目备案审核", 
          status: "已完成",
          submittedDate: "2023-12-10",
          completedDate: "2023-12-20",
          submittedBy: "刘研究员",
          currentStep: "已完成",
          progress: 100,
          result: "备案批准",
          remarks: "经审核，该临床研究项目符合相关规定和伦理要求，予以备案批准。请严格按照备案内容执行，如有变更需及时报告。",
          hasLatestUpdate: false,
          documentsCount: 3,
          reviewHistory: [
            {
              date: "2023-12-10",
              action: "提交备案申请",
              operator: "刘研究员",
              comments: "提交临床研究项目备案申请及相关材料。"
            },
            {
              date: "2023-12-15",
              action: "专家评审",
              operator: "评审委员会",
              comments: "对项目进行全面评审，确认符合伦理要求。"
            },
            {
              date: "2023-12-20",
              action: "审核通过",
              operator: "伦理委员会",
              comments: "项目通过审核，正式备案批准。"
            }
          ],
          documents: [
            { name: "项目备案申请书.pdf", uploadDate: "2023-12-10", status: "已审核" },
            { name: "临床研究方案.docx", uploadDate: "2023-12-10", status: "已审核" },
            { name: "伦理审查报告.pdf", uploadDate: "2023-12-20", status: "已审核" }
          ]
        },
        {
          id: "5",
          type: "临床试验年度检查",
          status: "已完成",
          submittedDate: "2023-11-15",
          completedDate: "2023-12-01",
          submittedBy: "赵教授",
          currentStep: "已完成",
          progress: 100,
          result: "检查通过",
          remarks: "年度检查结果良好，试验操作规范，受试者权益保障到位，建议继续按计划执行。",
          hasLatestUpdate: false,
          documentsCount: 4,
          reviewHistory: [
            {
              date: "2023-11-15",
              action: "提交年检材料",
              operator: "赵教授",
              comments: "提交临床试验年度检查报告和相关材料。"
            },
            {
              date: "2023-11-20",
              action: "现场检查",
              operator: "检查专家组",
              comments: "对试验现场和受试者管理情况进行现场检查。"
            },
            {
              date: "2023-11-25",
              action: "材料审核",
              operator: "伦理委员会",
              comments: "审核年检报告和现场检查记录。"
            },
            {
              date: "2023-12-01",
              action: "检查通过",
              operator: "伦理委员会",
              comments: "年度检查合格，同意继续开展临床试验。"
            }
          ],
          documents: [
            { name: "年度检查报告.pdf", uploadDate: "2023-11-15", status: "已审核" },
            { name: "受试者记录汇总.xlsx", uploadDate: "2023-11-15", status: "已审核" },
            { name: "现场检查记录.pdf", uploadDate: "2023-11-20", status: "已审核" },
            { name: "整改措施报告.docx", uploadDate: "2023-11-25", status: "已审核" }
          ]
        }
      ];
    } else {
      // 动物伦理项目数据
      return [
        {
          id: "1",
          type: "动物实验伦理初始审查",
          status: "审核中",
          submittedDate: "2024-01-20",
          expectedCompletionDate: "2024-02-25",
          submittedBy: "王教授",
          currentStep: "专家评审",
          progress: 75,
          hasLatestUpdate: true,
          latestUpdateDate: "2024-02-05",
          latestUpdateAction: "专家评审中",
          documentsCount: 4,
          reviewHistory: [
            {
              date: "2024-01-20",
              action: "提交申请",
              operator: "王教授",
              comments: "已提交完整的动物实验伦理审查申请材料，包括实验方案、动物使用计划等文档。"
            },
            {
              date: "2024-01-25",
              action: "初步审查",
              operator: "伦理委员会秘书处",
              comments: "材料齐全，符合审查要求，转入专家评审环节。"
            },
            {
              date: "2024-02-05",
              action: "专家评审中",
              operator: "评审专家组",
              comments: "正在进行详细的专家评审，重点关注动物福利保护措施和实验必要性。最新进展：已完成3位专家的评审意见收集。"
            }
          ],
          documents: [
            { name: "动物实验申请书.pdf", uploadDate: "2024-01-20", status: "已审核" },
            { name: "实验方案书.docx", uploadDate: "2024-01-20", status: "已审核" },
            { name: "动物使用计划.pdf", uploadDate: "2024-01-20", status: "已审核" },
            { name: "研究人员资质证明.pdf", uploadDate: "2024-01-20", status: "已审核" }
          ]
        },
        {
          id: "2",
          type: "动物实验变更申请审查",
          status: "审核中",
          submittedDate: "2024-01-15",
          expectedCompletionDate: "2024-02-20",
          submittedBy: "李研究员",
          currentStep: "材料补充",
          progress: 45,
          hasLatestUpdate: false,
          documentsCount: 3,
          reviewHistory: [
            {
              date: "2024-01-15",
              action: "提交变更申请",
              operator: "李研究员",
              comments: "申请增加实验动物数量和延长实验周期。"
            },
            {
              date: "2024-01-22",
              action: "初步审查",
              operator: "伦理委员会秘书处",
              comments: "需要补充变更理由说明书和风险评估报告。"
            },
            {
              date: "2024-01-30",
              action: "等待材料补充",
              operator: "伦理委员会",
              comments: "申请人需在2月10日前提交补充材料。"
            }
          ],
          documents: [
            { name: "实验变更申请书.pdf", uploadDate: "2024-01-15", status: "已审核" },
            { name: "变更理由说明.docx", uploadDate: "2024-01-15", status: "需修改" },
            { name: "风险评估报告.pdf", uploadDate: "2024-01-15", status: "待审核" }
          ]
        },
        {
          id: "3", 
          type: "动物实验终止报告审查",
          status: "审核中",
          submittedDate: "2024-01-28",
          expectedCompletionDate: "2024-02-28",
          submittedBy: "张教授",
          currentStep: "形式审查",
          progress: 25,
          hasLatestUpdate: false,
          documentsCount: 3,
          reviewHistory: [
            {
              date: "2024-01-28",
              action: "提交终止报告",
              operator: "张教授",
              comments: "由于研究目标已达成，申请提前终止动物实验。"
            },
            {
              date: "2024-02-02",
              action: "形式审查中",
              operator: "伦理委员会秘书处",
              comments: "正在检查终止报告的完整性和规范性。"
            }
          ],
          documents: [
            { name: "实验终止报告.pdf", uploadDate: "2024-01-28", status: "待审核" },
            { name: "实验数据汇总.xlsx", uploadDate: "2024-01-28", status: "待审核" },
            { name: "动物处置记录.pdf", uploadDate: "2024-01-28", status: "待审核" }
          ]
        },
        {
          id: "4",
          type: "科研试验项目备案审核", 
          status: "已完成",
          submittedDate: "2023-12-10",
          completedDate: "2023-12-20",
          submittedBy: "刘研究员",
          currentStep: "已完成",
          progress: 100,
          result: "备案批准",
          remarks: "经审核，该科研试验项目符合相关规定和伦理要求，予以备案批准。请严格按照备案内容执行，如有变更需及时报告。",
          hasLatestUpdate: false,
          documentsCount: 3,
          reviewHistory: [
            {
              date: "2023-12-10",
              action: "提交备案申请",
              operator: "刘研究员",
              comments: "提交科研试验项目备案申请及相关材料。"
            },
            {
              date: "2023-12-15",
              action: "专家评审",
              operator: "评审委员会",
              comments: "对项目进行全面评审，确认符合伦理要求。"
            },
            {
              date: "2023-12-20",
              action: "审核通过",
              operator: "伦理委员会",
              comments: "项目通过审核，正式备案批准。"
            }
          ],
          documents: [
            { name: "项目备案申请书.pdf", uploadDate: "2023-12-10", status: "已审核" },
            { name: "研究方案.docx", uploadDate: "2023-12-10", status: "已审核" },
            { name: "伦理审查报告.pdf", uploadDate: "2023-12-20", status: "已审核" }
          ]
        },
        {
          id: "5",
          type: "动物实验年度检查",
          status: "已完成",
          submittedDate: "2023-11-15",
          completedDate: "2023-12-01",
          submittedBy: "赵教授",
          currentStep: "已完成",
          progress: 100,
          result: "检查通过",
          remarks: "年度检查结果良好，实验操作规范，动物福利保障到位，建议继续按计划执行。",
          hasLatestUpdate: false,
          documentsCount: 4,
          reviewHistory: [
            {
              date: "2023-11-15",
              action: "提交年检材料",
              operator: "赵教授",
              comments: "提交动物实验年度检查报告和相关材料。"
            },
            {
              date: "2023-11-20",
              action: "现场检查",
              operator: "检查专家组",
              comments: "对实验室和动物饲养环境进行现场检查。"
            },
            {
              date: "2023-11-25",
              action: "材料审核",
              operator: "伦理委员会",
              comments: "审核年检报告和现场检查记录。"
            },
            {
              date: "2023-12-01",
              action: "检查通过",
              operator: "伦理委员会",
              comments: "年度检查合格，同意继续开展动物实验。"
            }
          ],
          documents: [
            { name: "年度检查报告.pdf", uploadDate: "2023-11-15", status: "已审核" },
            { name: "实验记录汇总.xlsx", uploadDate: "2023-11-15", status: "已审核" },
            { name: "现场检查记录.pdf", uploadDate: "2023-11-20", status: "已审核" },
            { name: "整改措施报告.docx", uploadDate: "2023-11-25", status: "已审核" }
          ]
        }
      ];
    }
  };

  const [reviewData] = useState(() => getReviewData(projectType));

  // 过滤数据
  const filteredData = reviewData.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currentStep.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type.includes(typeFilter)
    
    return matchesSearch && matchesStatus && matchesType
  })

  // 统计信息
  const totalReviews = reviewData.length
  const inProgressReviews = reviewData.filter(item => item.status === "审核中").length
  const completedReviews = reviewData.filter(item => item.status === "已完成").length
  const avgProgress = Math.round(reviewData.reduce((sum, item) => sum + item.progress, 0) / reviewData.length)
  const hasUpdates = reviewData.filter(item => item.hasLatestUpdate).length

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "审核中":
        return "bg-blue-100 text-blue-700";
      case "已完成":
        return "bg-green-100 text-green-700";
      case "已拒绝":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "已审核":
        return "text-green-600";
      case "待审核":
        return "text-yellow-600";
      case "需修改":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // 处理查看详情
  const handleViewDetail = (review: any) => {
    toast({
      title: "查看审查详情",
      description: `正在查看${review.type}的详细信息`
    })
  }

  // 处理导出数据
  const handleExportData = () => {
    toast({
      title: "导出数据",
      description: "正在准备审查进度数据导出..."
    })
  }

  // 处理创建审查
  const handleCreateReview = () => {
    toast({
      title: "创建审查",
      description: "正在跳转到审查申请页面..."
    })
  }

  return (
    <div className="space-y-6">
      {/* 添加全局动画样式 */}
      <AnimationStyles />
      
      {/* 审查数据概览统计卡片 */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <ClipboardList className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  审查进度概览
                  <Badge variant="outline" className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2">
                    {totalReviews}项审查
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-500">
                  项目审查流程统计与进度跟踪
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={() => handleCreateReview()}
              className="h-8 gap-1 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <FileCheck className="h-3.5 w-3.5" />
              创建审查
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{inProgressReviews}</div>
              <div className="text-xs text-slate-500 mt-0.5">审核中</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{completedReviews}</div>
              <div className="text-xs text-slate-500 mt-0.5">已完成</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{hasUpdates}</div>
              <div className="text-xs text-slate-500 mt-0.5">有新进展</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{avgProgress}%</div>
              <div className="text-xs text-slate-500 mt-0.5">平均进度</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索和筛选 */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索审查类型、提交人或当前步骤..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="审核中">审核中</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                  <SelectItem value="已拒绝">已拒绝</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="初始">初始审查</SelectItem>
                  <SelectItem value="变更">变更申请</SelectItem>
                  <SelectItem value="终止">终止报告</SelectItem>
                  <SelectItem value="备案">备案审核</SelectItem>
                  <SelectItem value="年度">年度检查</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportData}
                className="h-9 gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                导出
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 审查进度列表 */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((review, index) => (
            <ReviewTimelineCard 
              key={review.id} 
              review={review} 
              type={review.status === "已完成" ? "completed" : "progress"}
              getDocumentStatusColor={getDocumentStatusColor}
              index={index}
            />
          ))
        ) : (
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无审查记录</h3>
                <p className="text-gray-500 mb-4">当前条件下没有找到相关的审查记录</p>
                <Button onClick={handleCreateReview} className="gap-2">
                  <FileCheck className="h-4 w-4" />
                  创建新审查
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 