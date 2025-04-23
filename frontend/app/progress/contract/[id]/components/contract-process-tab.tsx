"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Plus
} from "lucide-react"

interface ContractProcessTabProps {
  data: any
}

export default function ContractProcessTab({ data }: ContractProcessTabProps) {
  // 模拟合同执行过程数据
  const processSteps = [
    {
      id: "step1",
      name: "合同拟定",
      status: "已完成",
      startDate: "2024-01-10",
      endDate: "2024-01-25",
      progress: 100,
      responsible: data.applicant,
      description: "完成合同条款拟定，明确合同内容、权责划分和技术指标"
    },
    {
      id: "step2",
      name: "合同评审",
      status: "已完成",
      startDate: "2024-01-26",
      endDate: "2024-02-15",
      progress: 100,
      responsible: "法务部门",
      description: "完成合同法律评审，确保合同条款合法合规，风险可控"
    },
    {
      id: "step3",
      name: "合同认定",
      status: "进行中",
      startDate: "2024-02-16",
      endDate: "2024-03-10",
      progress: 65,
      responsible: data.department,
      description: "进行合同技术内容认定，评估合同可行性和价值"
    },
    {
      id: "step4",
      name: "合同签署",
      status: "未开始",
      startDate: "2024-03-11",
      endDate: "2024-03-20",
      progress: 0,
      responsible: "项目负责人",
      description: "双方签署合同，确认合同生效"
    },
    {
      id: "step5",
      name: "合同执行",
      status: "未开始",
      startDate: "2024-03-21",
      endDate: "2024-08-30",
      progress: 0,
      responsible: "项目团队",
      description: "按照合同约定执行合同内容，完成技术交付"
    },
    {
      id: "step6",
      name: "合同验收",
      status: "未开始",
      startDate: "2024-09-01",
      endDate: "2024-09-15",
      progress: 0,
      responsible: "验收小组",
      description: "进行合同成果验收，确认合同目标达成"
    }
  ]

  // 获取状态对应的颜色和图标
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "已完成":
        return { 
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        }
      case "进行中":
        return { 
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock className="h-4 w-4 text-blue-500" />
        }
      case "未开始":
        return { 
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <Clock className="h-4 w-4 text-slate-500" />
        }
      case "已延期":
        return { 
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <AlertCircle className="h-4 w-4 text-red-500" />
        }
      default:
        return { 
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <Clock className="h-4 w-4 text-slate-500" />
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* 执行过程概览 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">执行过程概览</CardTitle>
          <CardDescription>合同认定及执行的各个阶段</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {processSteps.map((step, index) => {
              const statusInfo = getStatusInfo(step.status)
              
              return (
                <div key={step.id} className="relative">
                  {index < processSteps.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-slate-200"></div>
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 bg-white z-10">
                      {statusInfo.icon}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="font-medium">{step.name}</div>
                        <Badge className={statusInfo.color}>
                          {step.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-600 gap-2 sm:gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{step.startDate} 至 {step.endDate}</span>
                        </div>
                        <div>负责人: {step.responsible}</div>
                      </div>
                      
                      <div className="text-sm text-slate-600">
                        {step.description}
                      </div>
                      
                      <div className="pt-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>完成度</span>
                          <span>{step.progress}%</span>
                        </div>
                        <Progress value={step.progress} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            
            <div className="pt-2 flex justify-center">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>添加执行步骤</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 合同里程碑 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">合同里程碑</CardTitle>
          <CardDescription>合同执行的关键节点</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-md border border-green-100 bg-green-50">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="font-medium">合同评审通过</div>
                  <div className="text-sm text-slate-600">2024-02-15</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  完成合同法律评审，确认合同条款合法合规
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-md border border-blue-100 bg-blue-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="font-medium">合同认定完成</div>
                  <div className="text-sm text-slate-600">2024-03-10 (预计)</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  完成合同技术内容认定，确认合同技术可行性
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-md border border-slate-100 bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="font-medium">合同签署完成</div>
                  <div className="text-sm text-slate-600">2024-03-20 (预计)</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  双方签署合同，合同正式生效
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-md border border-slate-100 bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="font-medium">首次交付</div>
                  <div className="text-sm text-slate-600">2024-05-30 (预计)</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  完成第一阶段技术交付，提交初步成果
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-md border border-slate-100 bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="font-medium">最终验收</div>
                  <div className="text-sm text-slate-600">2024-09-15 (预计)</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  完成全部合同内容，进行最终验收
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex justify-center">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>添加里程碑</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
