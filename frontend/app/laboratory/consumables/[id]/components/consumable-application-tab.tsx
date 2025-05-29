"use client"

import { useState } from "react"
import { Calendar, User, FileText, Plus, Search, Filter, Download, ShoppingCart, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface ConsumableApplicationTabProps {
  data: any
}

// 模拟申领记录数据
const mockApplicationRecords = [
  {
    id: "1",
    date: "2023/11/20",
    applicant: "张三",
    department: "生物实验室",
    project: "细胞培养实验",
    quantity: 50,
    unit: "包",
    purpose: "微量离心管用于细胞样本处理",
    status: "已批准",
    approver: "李主任",
    approveDate: "2023/11/20",
    notes: "紧急使用",
  },
  {
    id: "2",
    date: "2023/11/15",
    applicant: "李四",
    department: "分子生物实验室",
    project: "PCR扩增实验",
    quantity: 100,
    unit: "盒",
    purpose: "移液器吸头用于PCR反应体系配制",
    status: "已发放",
    approver: "王主任",
    approveDate: "2023/11/15",
    notes: "常规实验用量",
  },
  {
    id: "3",
    date: "2023/11/10",
    applicant: "王五",
    department: "分析检测实验室",
    project: "样品分析",
    quantity: 20,
    unit: "块",
    purpose: "深孔微孔板用于高通量样品处理",
    status: "待审批",
    approver: "",
    approveDate: "",
    notes: "月度常规申领",
  },
  {
    id: "4",
    date: "2023/11/08",
    applicant: "赵六",
    department: "生物实验室",
    project: "蛋白表达实验",
    quantity: 30,
    unit: "块",
    purpose: "微孔板用于蛋白检测分析",
    status: "已发放",
    approver: "李主任",
    approveDate: "2023/11/08",
    notes: "专项实验使用",
  },
]

export default function ConsumableApplicationTab({ data }: ConsumableApplicationTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [records, setRecords] = useState(mockApplicationRecords)

  // 过滤记录
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.project.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 计算统计信息
  const totalApplications = records.length
  const approvedApplications = records.filter(r => r.status === "已批准" || r.status === "已发放").length
  const totalQuantity = records.filter(r => r.status === "已发放").reduce((sum, record) => sum + record.quantity, 0)
  const pendingApplications = records.filter(r => r.status === "待审批").length

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
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">已批准</p>
                <p className="text-2xl font-bold text-gray-900">{approvedApplications}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">已发放量</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuantity.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{data.unit}</p>
              </div>
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">待审批</p>
                <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
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
              <CardTitle className="text-lg font-semibold">申领明细记录</CardTitle>
              <CardDescription className="text-gray-600">耗材的历史申领记录</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出记录
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                新建申领
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
                  placeholder="搜索申请人、部门或项目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="申领状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="待审批">待审批</SelectItem>
                <SelectItem value="已批准">已批准</SelectItem>
                <SelectItem value="已发放">已发放</SelectItem>
                <SelectItem value="已拒绝">已拒绝</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 记录表格 */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">申领日期</TableHead>
                  <TableHead className="font-medium">申请人</TableHead>
                  <TableHead className="font-medium">部门</TableHead>
                  <TableHead className="font-medium">项目</TableHead>
                  <TableHead className="font-medium">申领数量</TableHead>
                  <TableHead className="font-medium">用途说明</TableHead>
                  <TableHead className="font-medium">状态</TableHead>
                  <TableHead className="font-medium">审批人</TableHead>
                  <TableHead className="font-medium">审批日期</TableHead>
                  <TableHead className="font-medium">备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{record.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{record.applicant}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{record.department}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{record.project}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{record.quantity.toLocaleString()}{record.unit}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 max-w-xs truncate">{record.purpose}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          record.status === "已发放" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : record.status === "已批准"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : record.status === "待审批"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{record.approver || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{record.approveDate || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{record.notes}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无申领记录</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" ? "没有找到匹配的记录" : "还没有申领记录"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 