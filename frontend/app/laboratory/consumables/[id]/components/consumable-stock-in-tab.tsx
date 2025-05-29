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

interface ConsumableStockInTabProps {
  data: any
}

// 模拟入库记录数据
const mockStockInRecords = [
  {
    id: "1",
    date: "2023/11/05",
    batchNumber: "CON231105001",
    quantity: 800,
    unit: "包",
    unitPrice: 28.0,
    totalPrice: 22400,
    supplier: "德国艾本德（中国）有限公司",
    operator: "李三",
    qualityStatus: "合格",
    storageLocation: "A栋储物柜",
    notes: "新购入库，质检合格",
  },
  {
    id: "2",
    date: "2023/10/20",
    batchNumber: "CON231020001",
    quantity: 600,
    unit: "盒",
    unitPrice: 52.0,
    totalPrice: 31200,
    supplier: "德国艾本德（中国）有限公司",
    operator: "张四",
    qualityStatus: "合格",
    storageLocation: "A栋储物柜",
    notes: "补充库存",
  },
  {
    id: "3",
    date: "2023/09/15",
    batchNumber: "CON230915001",
    quantity: 50,
    unit: "块",
    unitPrice: 28.5,
    totalPrice: 1425,
    supplier: "康宁生命科学",
    operator: "王五",
    qualityStatus: "合格",
    storageLocation: "B栋试剂柜",
    notes: "紧急采购",
  },
  {
    id: "4",
    date: "2023/08/10",
    batchNumber: "CON230810001",
    quantity: 100,
    unit: "块",
    unitPrice: 12.5,
    totalPrice: 1250,
    supplier: "赛默飞世尔科技",
    operator: "李三",
    qualityStatus: "合格",
    storageLocation: "B栋试剂柜",
    notes: "定期采购",
  },
]

export default function ConsumableStockInTab({ data }: ConsumableStockInTabProps) {
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
                <p className="text-2xl font-bold text-gray-900">￥{averagePrice.toFixed(2)}</p>
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
              <CardDescription className="text-gray-600">耗材的历史入库记录</CardDescription>
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
                  <TableHead className="font-medium">数量</TableHead>
                  <TableHead className="font-medium">单价</TableHead>
                  <TableHead className="font-medium">总价</TableHead>
                  <TableHead className="font-medium">供应商</TableHead>
                  <TableHead className="font-medium">操作员</TableHead>
                  <TableHead className="font-medium">质检状态</TableHead>
                  <TableHead className="font-medium">存放位置</TableHead>
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
                      <span className="text-sm font-medium">{record.batchNumber}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{record.quantity.toLocaleString()}{record.unit}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">￥{record.unitPrice.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">￥{record.totalPrice.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{record.supplier}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{record.operator}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          record.qualityStatus === "合格" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : record.qualityStatus === "不合格"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {record.qualityStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{record.storageLocation}</span>
                      </div>
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
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无入库记录</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" ? "没有找到匹配的记录" : "还没有入库记录"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 