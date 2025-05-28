"use client"

import { useState } from "react"
import { Calendar, Package, User, FileText, Plus, Search, Filter, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface ReagentStockInTabProps {
  data: any
}

// 模拟入库记录数据
const mockStockInRecords = [
  {
    id: "1",
    date: "2023/09/01",
    batchNumber: "B230901001",
    quantity: 4000,
    unit: "mL",
    unitPrice: 0.245,
    totalPrice: 980,
    supplier: "西陆科学",
    operator: "李三",
    qualityStatus: "合格",
    storageLocation: "B栋试剂柜",
    expiryDate: "2025/09/01",
    notes: "新购入库，质检合格",
  },
  {
    id: "2", 
    date: "2023/08/15",
    batchNumber: "B230815001",
    quantity: 2000,
    unit: "mL",
    unitPrice: 0.245,
    totalPrice: 490,
    supplier: "西陆科学",
    operator: "李三",
    qualityStatus: "合格",
    storageLocation: "B栋试剂柜",
    expiryDate: "2025/08/15",
    notes: "补充库存",
  },
  {
    id: "3",
    date: "2023/07/20",
    batchNumber: "B230720001", 
    quantity: 1000,
    unit: "mL",
    unitPrice: 0.240,
    totalPrice: 240,
    supplier: "赛默飞世尔",
    operator: "王五",
    qualityStatus: "合格",
    storageLocation: "B栋试剂柜",
    expiryDate: "2025/07/20",
    notes: "紧急采购",
  },
]

export default function ReagentStockInTab({ data }: ReagentStockInTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [records, setRecords] = useState(mockStockInRecords)

  // 过滤记录
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.operator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.qualityStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // 计算统计信息
  const totalQuantity = records.reduce((sum, record) => sum + record.quantity, 0)
  const totalValue = records.reduce((sum, record) => sum + record.totalPrice, 0)
  const averagePrice = totalValue / totalQuantity

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">入库次数</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">累计入库量</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuantity.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{data.unit}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">累计金额</p>
                <p className="text-2xl font-bold text-gray-900">￥{totalValue.toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 rounded-md bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">平均单价</p>
                <p className="text-2xl font-bold text-gray-900">￥{averagePrice.toFixed(3)}</p>
                <p className="text-xs text-gray-500">/{data.unit}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 入库记录列表 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">入库明细记录</CardTitle>
              <CardDescription className="text-gray-600">试剂的历史入库记录</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出记录
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                新增入库
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
                  placeholder="搜索批次号、供应商或操作员..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="质检状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="合格">合格</SelectItem>
                <SelectItem value="不合格">不合格</SelectItem>
                <SelectItem value="待检验">待检验</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 记录表格 */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">入库日期</TableHead>
                  <TableHead className="font-medium">批次号</TableHead>
                  <TableHead className="font-medium">入库数量</TableHead>
                  <TableHead className="font-medium">单价</TableHead>
                  <TableHead className="font-medium">总价</TableHead>
                  <TableHead className="font-medium">供应商</TableHead>
                  <TableHead className="font-medium">操作员</TableHead>
                  <TableHead className="font-medium">质检状态</TableHead>
                  <TableHead className="font-medium">有效期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {record.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {record.batchNumber}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{record.quantity.toLocaleString()}</span>
                        <span className="text-gray-500 ml-1">{record.unit}</span>
                      </TableCell>
                      <TableCell>￥{record.unitPrice.toFixed(3)}</TableCell>
                      <TableCell className="font-medium">￥{record.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>{record.supplier}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {record.operator}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            record.qualityStatus === "合格" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : record.qualityStatus === "不合格"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {record.qualityStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={
                          new Date(record.expiryDate) < new Date() 
                            ? "text-red-600" 
                            : Math.ceil((new Date(record.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30
                              ? "text-amber-600"
                              : "text-gray-900"
                        }>
                          {record.expiryDate}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      暂无入库记录
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