"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  PieChart, 
  BarChart,
  Plus
} from "lucide-react"

interface ContractFundsTabProps {
  data: any
}

export default function ContractFundsTab({ data }: ContractFundsTabProps) {
  // 模拟合同经费数据
  const contractAmount = data.contractAmount || "100万元"
  const receivedAmount = "65万元"
  const receivedPercentage = 65
  
  // 模拟经费收支记录
  const fundsRecords = [
    {
      id: "fund1",
      type: "收入",
      amount: "30万元",
      date: "2024-02-20",
      description: "合同首付款",
      status: "已到账"
    },
    {
      id: "fund2",
      type: "收入",
      amount: "35万元",
      date: "2024-04-05",
      description: "合同第二期款项",
      status: "已到账"
    },
    {
      id: "fund3",
      type: "支出",
      amount: "12万元",
      date: "2024-02-25",
      description: "设备采购",
      status: "已支出"
    },
    {
      id: "fund4",
      type: "支出",
      amount: "8万元",
      date: "2024-03-10",
      description: "材料费用",
      status: "已支出"
    },
    {
      id: "fund5",
      type: "支出",
      amount: "15万元",
      date: "2024-04-15",
      description: "人员劳务费",
      status: "已支出"
    },
    {
      id: "fund6",
      type: "收入",
      amount: "35万元",
      date: "2024-08-30",
      description: "合同尾款",
      status: "未到账"
    }
  ]
  
  // 模拟经费使用计划
  const fundsPlans = [
    {
      id: "plan1",
      category: "设备费",
      plannedAmount: "25万元",
      usedAmount: "12万元",
      percentage: 48
    },
    {
      id: "plan2",
      category: "材料费",
      plannedAmount: "15万元",
      usedAmount: "8万元",
      percentage: 53
    },
    {
      id: "plan3",
      category: "测试化验加工费",
      plannedAmount: "10万元",
      usedAmount: "0万元",
      percentage: 0
    },
    {
      id: "plan4",
      category: "燃料动力费",
      plannedAmount: "5万元",
      usedAmount: "0万元",
      percentage: 0
    },
    {
      id: "plan5",
      category: "差旅费",
      plannedAmount: "5万元",
      usedAmount: "0万元",
      percentage: 0
    },
    {
      id: "plan6",
      category: "会议费",
      plannedAmount: "5万元",
      usedAmount: "0万元",
      percentage: 0
    },
    {
      id: "plan7",
      category: "国际合作与交流费",
      plannedAmount: "5万元",
      usedAmount: "0万元",
      percentage: 0
    },
    {
      id: "plan8",
      category: "劳务费",
      plannedAmount: "20万元",
      usedAmount: "15万元",
      percentage: 75
    },
    {
      id: "plan9",
      category: "专家咨询费",
      plannedAmount: "5万元",
      usedAmount: "0万元",
      percentage: 0
    },
    {
      id: "plan10",
      category: "其他支出",
      plannedAmount: "5万元",
      usedAmount: "0万元",
      percentage: 0
    }
  ]
  
  // 计算总收入和总支出
  const totalIncome = fundsRecords
    .filter(record => record.type === "收入" && record.status === "已到账")
    .reduce((sum, record) => sum + parseInt(record.amount), 0)
  
  const totalExpense = fundsRecords
    .filter(record => record.type === "支出" && record.status === "已支出")
    .reduce((sum, record) => sum + parseInt(record.amount), 0)
  
  // 获取状态对应的颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "已到账":
        return "bg-green-50 text-green-700 border-green-200"
      case "未到账":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "已支出":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }
  
  // 获取类型对应的图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "收入":
        return <ArrowDown className="h-4 w-4 text-green-500" />
      case "支出":
        return <ArrowUp className="h-4 w-4 text-blue-500" />
      default:
        return <DollarSign className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 经费概览 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">经费概览</CardTitle>
          <CardDescription>合同经费总体情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
              <div className="text-sm text-slate-600 mb-1">合同总金额</div>
              <div className="text-2xl font-semibold text-slate-900 flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-green-600" />
                {contractAmount}
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
              <div className="text-sm text-slate-600 mb-1">已收款金额</div>
              <div className="text-2xl font-semibold text-slate-900 flex items-center gap-1">
                <ArrowDown className="h-5 w-5 text-green-600" />
                {receivedAmount}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                已收款比例: {receivedPercentage}%
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
              <div className="text-sm text-slate-600 mb-1">已支出金额</div>
              <div className="text-2xl font-semibold text-slate-900 flex items-center gap-1">
                <ArrowUp className="h-5 w-5 text-blue-600" />
                35万元
              </div>
              <div className="text-xs text-slate-500 mt-1">
                已支出比例: 35%
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">收支情况</div>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <PieChart className="h-3.5 w-3.5" />
                  <span>查看报表</span>
                </Button>
              </div>
              <div className="h-40 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-16 w-16 text-slate-300 mx-auto mb-2" />
                  <div className="text-sm text-slate-500">收支情况图表</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">经费使用趋势</div>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <BarChart className="h-3.5 w-3.5" />
                  <span>查看报表</span>
                </Button>
              </div>
              <div className="h-40 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-16 w-16 text-slate-300 mx-auto mb-2" />
                  <div className="text-sm text-slate-500">经费使用趋势图表</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 经费收支记录 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">经费收支记录</CardTitle>
          <CardDescription>合同经费收入和支出详情</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fundsRecords.map((record) => (
              <div 
                key={record.id} 
                className="flex items-center justify-between p-3 rounded-md border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    record.type === "收入" ? "bg-green-50" : "bg-blue-50"
                  }`}>
                    {getTypeIcon(record.type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{record.description}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {record.date}
                      </span>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className={`font-medium ${
                  record.type === "收入" ? "text-green-600" : "text-blue-600"
                }`}>
                  {record.type === "收入" ? "+" : "-"}{record.amount}
                </div>
              </div>
            ))}
            
            <div className="pt-2 flex justify-center">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>添加收支记录</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 经费使用计划 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">经费使用计划</CardTitle>
          <CardDescription>合同经费分类使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fundsPlans.map((plan) => (
              <div key={plan.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{plan.category}</div>
                  <div className="text-sm">
                    <span className="text-blue-600">{plan.usedAmount}</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span>{plan.plannedAmount}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${plan.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>已使用: {plan.percentage}%</span>
                  <span>剩余: {100 - plan.percentage}%</span>
                </div>
              </div>
            ))}
            
            <div className="pt-2 flex justify-center">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>添加经费计划</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
