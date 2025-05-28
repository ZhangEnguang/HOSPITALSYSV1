"use client"

import { useState } from "react"
import { Calendar, User, FileText, Plus, Search, Filter, Download, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface ReagentApplicationTabProps {
  data: any
}

// 模拟申领记录数据
const mockApplicationRecords = [
  {
    id: "1",
    applicationDate: "2023/09/15",
    applicant: "张三",
    department: "有机化学实验室",
    quantity: 500,
    unit: "mL",
    purpose: "科研实验",
    urgency: "普通",
    status: "已批准",
    approver: "李三",
    approvalDate: "2023/09/16",
    actualQuantity: 500,
    pickupDate: "2023/09/17",
    reason: "有机合成实验需要，预计使用周期2周",
    notes: "已按时领取",
  },
  {
    id: "2",
    applicationDate: "2023/09/10",
    applicant: "王五",
    department: "分析化学实验室",
    quantity: 200,
    unit: "mL",
    purpose: "教学实验",
    urgency: "紧急",
    status: "已批准",
    approver: "李三",
    approvalDate: "2023/09/10",
    actualQuantity: 200,
    pickupDate: "2023/09/11",
    reason: "HPLC分析实验急需",
    notes: "紧急申请，当日批准",
  },
  {
    id: "3",
    applicationDate: "2023/09/05",
    applicant: "赵六",
    department: "物理化学实验室",
    quantity: 300,
    unit: "mL",
    purpose: "质量检测",
    urgency: "普通",
    status: "待审批",
    approver: "-",
    approvalDate: "-",
    actualQuantity: 0,
    pickupDate: "-",
    reason: "产品质量检测需要",
    notes: "等待部门主管审批",
  },
  {
    id: "4",
    applicationDate: "2023/08/28",
    applicant: "孙七",
    department: "有机化学实验室",
    quantity: 150,
    unit: "mL",
    purpose: "科研实验",
    urgency: "普通",
    status: "已拒绝",
    approver: "李三",
    approvalDate: "2023/08/29",
    actualQuantity: 0,
    pickupDate: "-",
    reason: "合成反应溶剂",
    notes: "库存不足，建议使用替代溶剂",
  },
]

export default function ReagentApplicationTab({ data }: ReagentApplicationTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [records, setRecords] = useState(mockApplicationRecords)

  // 过滤记录
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 计算统计信息
  const totalApplications = records.length
  const approvedApplications = records.filter(r => r.status === "已批准").length
  const pendingApplications = records.filter(r => r.status === "待审批").length
  const rejectedApplications = records.filter(r => r.status === "已拒绝").length
  const totalQuantityApplied = records.filter(r => r.status === "已批准").reduce((sum, record) => sum + record.actualQuantity, 0)

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已批准":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "已拒绝":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "待审批":
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">申领次数</p>
                <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">已批准</p>
                <p className="text-2xl font-bold text-green-600">{approvedApplications}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">待审批</p>
                <p className="text-2xl font-bold text-amber-600">{pendingApplications}</p>
              </div>
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">累计申领量</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuantityApplied.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{data.unit}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 申领记录列表 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">申领明细</CardTitle>
              <CardDescription className="text-gray-600">试剂的申领详细记录</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出记录
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                新增申领
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选 */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索申请人、部门或用途..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="审批状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="已批准">已批准</SelectItem>
                <SelectItem value="待审批">待审批</SelectItem>
                <SelectItem value="已拒绝">已拒绝</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 记录表格 */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">申请日期</TableHead>
                  <TableHead className="font-medium">申请人</TableHead>
                  <TableHead className="font-medium">部门</TableHead>
                  <TableHead className="font-medium">申请数量</TableHead>
                  <TableHead className="font-medium">用途</TableHead>
                  <TableHead className="font-medium">紧急程度</TableHead>
                  <TableHead className="font-medium">状态</TableHead>
                  <TableHead className="font-medium">审批人</TableHead>
                  <TableHead className="font-medium">领取日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {record.applicationDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {record.applicant}
                        </div>
                      </TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        <span className="font-medium">{record.quantity.toLocaleString()}</span>
                        <span className="text-gray-500 ml-1">{record.unit}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {record.purpose}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            record.urgency === "紧急" 
                              ? "bg-red-50 text-red-700 border-red-200" 
                              : record.urgency === "特急"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {record.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <Badge 
                            className={
                              record.status === "已批准" 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : record.status === "已拒绝"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                            }
                          >
                            {record.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.approver !== "-" ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {record.approver}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.pickupDate !== "-" ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {record.pickupDate}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      暂无申领记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页信息 */}
          {filteredRecords.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <div>
                显示 {filteredRecords.length} 条记录，共 {records.length} 条
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  上一页
                </Button>
                <Button variant="outline" size="sm" disabled>
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 