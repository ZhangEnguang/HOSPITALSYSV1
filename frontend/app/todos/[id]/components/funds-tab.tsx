"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Upload,
  RefreshCw,
  Plus,
  FileText,
  DollarSign,
  Users,
  Edit,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import FundsBurndownChart from "./funds-charts/funds-burndown-chart"
import FundsSankeyChart from "./funds-charts/funds-sankey-chart"
import {
  mockBudgetItems,
  mockPartnerUnits,
  mockFundsAllocation,
  mockFundsTrend,
  mockFundsFlow,
  mockEnterpriseDatabase,
} from "../data/funds-mock-data"
import { validateBankAccount } from "../utils/bank-validator"

export default function FundsTab() {
  const [editingTotalBudget, setEditingTotalBudget] = useState(false)
  const [editingDetails, setEditingDetails] = useState(false)
  const [totalBudget, setTotalBudget] = useState(1200000)
  const [spentAmount, setSpentAmount] = useState(450000)
  const [externalAmount, setExternalAmount] = useState(300000)
  const [matchingAmount, setMatchingAmount] = useState(200000)
  const [selfRaisedAmount, setSelfRaisedAmount] = useState(700000)

  const [budgetItems, setBudgetItems] = useState(mockBudgetItems)
  const [partnerUnits, setPartnerUnits] = useState(mockPartnerUnits)
  const [fundsAllocation, setFundsAllocation] = useState(mockFundsAllocation)

  const [showAddBudgetDialog, setShowAddBudgetDialog] = useState(false)
  const [showAddPartnerDialog, setShowAddPartnerDialog] = useState(false)
  const [showAdjustDialog, setShowAdjustDialog] = useState(false)
  const [adjustAmount, setAdjustAmount] = useState<{ [key: string]: number }>({})
  const [adjustError, setAdjustError] = useState("")

  const [newBudgetItem, setNewBudgetItem] = useState({
    category: "",
    plannedAmount: 0,
    actualAmount: 0,
  })
  const [newPartnerUnit, setNewPartnerUnit] = useState({
    name: "",
    responsible: "",
    contractAmount: 0,
    type: "",
    bankName: "",
    accountNumber: "",
    paymentProgress: 0,
    contractExecution: 0,
  })
  const [accountError, setAccountError] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  // 自动补全企业信息
  const handleEnterpriseSelect = (name: string) => {
    const enterprise = mockEnterpriseDatabase.find((e) => e.name === name)
    if (enterprise) {
      setNewPartnerUnit({
        ...newPartnerUnit,
        name: enterprise.name,
        responsible: enterprise.responsible,
        type: enterprise.type,
        bankName: enterprise.bankName,
        accountNumber: enterprise.accountNumber,
      })
    }
  }

  // 验证银行账号
  const handleAccountNumberChange = (value: string) => {
    setNewPartnerUnit({ ...newPartnerUnit, accountNumber: value })
    const validation = validateBankAccount(value)
    setAccountError(validation.valid ? "" : validation.message)
  }

  // 添加预算项
  const handleAddBudgetItem = () => {
    if (!newBudgetItem.category || newBudgetItem.plannedAmount <= 0) return

    const totalPlanned = budgetItems.reduce((sum, item) => sum + item.plannedAmount, 0) + newBudgetItem.plannedAmount
    const percentage = (newBudgetItem.plannedAmount / totalBudget) * 100

    const newItem = {
      ...newBudgetItem,
      id: `budget-${Date.now()}`,
      percentage: percentage.toFixed(2),
    }

    setBudgetItems([...budgetItems, newItem])
    setShowAddBudgetDialog(false)
    setNewBudgetItem({
      category: "",
      plannedAmount: 0,
      actualAmount: 0,
    })
  }

  // 添加合作单位
  const handleAddPartnerUnit = () => {
    if (!newPartnerUnit.name || !newPartnerUnit.responsible || newPartnerUnit.contractAmount <= 0) return
    if (accountError) return

    const newUnit = {
      ...newPartnerUnit,
      id: `partner-${Date.now()}`,
    }

    setPartnerUnits([...partnerUnits, newUnit])
    setShowAddPartnerDialog(false)
    setNewPartnerUnit({
      name: "",
      responsible: "",
      contractAmount: 0,
      type: "",
      bankName: "",
      accountNumber: "",
      paymentProgress: 0,
      contractExecution: 0,
    })
  }

  // 上传预算扫描件
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (uploadedFiles.length + files.length > 10) {
      alert("最多只能上传10个文件")
      return
    }

    const newFiles = Array.from(files).map((file) => file.name)
    setUploadedFiles([...uploadedFiles, ...newFiles])
  }

  // 计算剩余经费
  const remainingBudget = totalBudget - spentAmount

  return (
    <div className="space-y-4">
      {/* 经费概览部分 - 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">批准经费</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditingTotalBudget(!editingTotalBudget)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {editingTotalBudget ? (
                <Input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="text-2xl font-bold"
                  onBlur={() => setEditingTotalBudget(false)}
                />
              ) : (
                <div className="text-2xl font-bold">¥{totalBudget.toLocaleString()}</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-sm font-medium text-muted-foreground">已支出</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">¥{spentAmount.toLocaleString()}</div>
              <Badge variant="outline" className="bg-muted">
                {((spentAmount / totalBudget) * 100).toFixed(1)}%
              </Badge>
            </div>
            <Progress value={(spentAmount / totalBudget) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-sm font-medium text-muted-foreground">剩余经费</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div
                className={`text-2xl font-bold ${remainingBudget < 0 || remainingBudget / totalBudget < 0.2 ? "text-red-500" : "text-green-500"}`}
              >
                ¥{remainingBudget.toLocaleString()}
              </div>
              <Badge
                variant="outline"
                className={remainingBudget < 0 || remainingBudget / totalBudget < 0.2 ? "bg-red-50" : "bg-green-50"}
              >
                {((remainingBudget / totalBudget) * 100).toFixed(1)}%
              </Badge>
            </div>
            <Progress
              value={(remainingBudget / totalBudget) * 100}
              className={`h-2 mt-2 ${remainingBudget < 0 || remainingBudget / totalBudget < 0.2 ? "bg-red-100" : ""}`}
              indicatorClassName={remainingBudget < 0 || remainingBudget / totalBudget < 0.2 ? "bg-red-500" : ""}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">经费明细</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditingDetails(!editingDetails)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">外拨经费:</span>
              {editingDetails ? (
                <Input
                  type="number"
                  value={externalAmount}
                  onChange={(e) => setExternalAmount(Number(e.target.value))}
                  className="w-32 h-7 text-right"
                />
              ) : (
                <span>¥{externalAmount.toLocaleString()}</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">配套经费:</span>
              {editingDetails ? (
                <Input
                  type="number"
                  value={matchingAmount}
                  onChange={(e) => setMatchingAmount(Number(e.target.value))}
                  className="w-32 h-7 text-right"
                />
              ) : (
                <span>¥{matchingAmount.toLocaleString()}</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">自筹经费:</span>
              {editingDetails ? (
                <Input
                  type="number"
                  value={selfRaisedAmount}
                  onChange={(e) => setSelfRaisedAmount(Number(e.target.value))}
                  className="w-32 h-7 text-right"
                />
              ) : (
                <span>¥{selfRaisedAmount.toLocaleString()}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 预算明细部分 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">预算明细</h2>
            <div className="flex items-center space-x-2">
              <Dialog open={showAddBudgetDialog} onOpenChange={setShowAddBudgetDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    新增预算
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新增预算项</DialogTitle>
                    <DialogDescription>添加新的预算类别和计划金额</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        预算类别
                      </Label>
                      <Select onValueChange={(value) => setNewBudgetItem({ ...newBudgetItem, category: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="选择预算类别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="设备费">设备费</SelectItem>
                          <SelectItem value="材料费">材料费</SelectItem>
                          <SelectItem value="测试化验加工费">测试化验加工费</SelectItem>
                          <SelectItem value="燃料动力费">燃料动力费</SelectItem>
                          <SelectItem value="差旅费">差旅费</SelectItem>
                          <SelectItem value="会议费">会议费</SelectItem>
                          <SelectItem value="国际合作与交流费">国际合作与交流费</SelectItem>
                          <SelectItem value="出版/文献/信息传播/知识产权事务费">
                            出版/文献/信息传播/知识产权事务费
                          </SelectItem>
                          <SelectItem value="劳务费">劳务费</SelectItem>
                          <SelectItem value="专家咨询费">专家咨询费</SelectItem>
                          <SelectItem value="其他支出">其他支出</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="plannedAmount" className="text-right">
                        计划金额
                      </Label>
                      <Input
                        id="plannedAmount"
                        type="number"
                        className="col-span-3"
                        value={newBudgetItem.plannedAmount || ""}
                        onChange={(e) => setNewBudgetItem({ ...newBudgetItem, plannedAmount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="actualAmount" className="text-right">
                        实际使用
                      </Label>
                      <Input
                        id="actualAmount"
                        type="number"
                        className="col-span-3"
                        value={newBudgetItem.actualAmount || ""}
                        onChange={(e) => setNewBudgetItem({ ...newBudgetItem, actualAmount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddBudgetDialog(false)}>
                      取消
                    </Button>
                    <Button onClick={handleAddBudgetItem}>添加</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Input
                        type="file"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        上传扫描件
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>最多上传10个文件</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>

              <Button variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length > 0 && (
            <div className="bg-muted p-3 rounded-md mb-4">
              <h4 className="text-sm font-medium mb-2">已上传文件 ({uploadedFiles.length}/10)</h4>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {file}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>预算类别</TableHead>
                <TableHead className="text-right">计划金额</TableHead>
                <TableHead className="text-right">实际使用</TableHead>
                <TableHead className="text-right">使用率</TableHead>
                <TableHead className="text-right">经费占比</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell className="text-right">¥{item.plannedAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">¥{item.actualAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {item.plannedAmount > 0 ? ((item.actualAmount / item.plannedAmount) * 100).toFixed(1) : 0}%
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="mr-2">{item.percentage}%</span>
                      <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">合计</TableCell>
                <TableCell className="text-right font-bold">
                  ¥{budgetItems.reduce((sum, item) => sum + item.plannedAmount, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-bold">
                  ¥{budgetItems.reduce((sum, item) => sum + item.actualAmount, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {budgetItems.reduce((sum, item) => sum + item.plannedAmount, 0) > 0
                    ? (
                        (budgetItems.reduce((sum, item) => sum + item.actualAmount, 0) /
                          budgetItems.reduce((sum, item) => sum + item.plannedAmount, 0)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </TableCell>
                <TableCell className="text-right font-bold">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* 图表分析部分 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <h2 className="text-lg font-semibold">经费消耗趋势</h2>
          </CardHeader>
          <CardContent className="h-80 relative">
            <div className="absolute inset-0">
              <FundsBurndownChart data={mockFundsTrend} />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <h2 className="text-lg font-semibold">经费流转关系</h2>
          </CardHeader>
          <CardContent className="h-80 relative">
            <div className="absolute inset-0">
              <FundsSankeyChart data={mockFundsFlow} />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 合作单位部分 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">合作单位</h2>
            <Dialog open={showAddPartnerDialog} onOpenChange={setShowAddPartnerDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  新增合作单位
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>新增合作单位</DialogTitle>
                  <DialogDescription>添加项目合作单位信息</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">单位名称</Label>
                      <Select onValueChange={handleEnterpriseSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择或输入单位名称" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockEnterpriseDatabase.map((enterprise) => (
                            <SelectItem key={enterprise.id} value={enterprise.name}>
                              {enterprise.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsible">负责人</Label>
                      <Input
                        id="responsible"
                        value={newPartnerUnit.responsible}
                        onChange={(e) => setNewPartnerUnit({ ...newPartnerUnit, responsible: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractAmount">合同金额</Label>
                      <Input
                        id="contractAmount"
                        type="number"
                        value={newPartnerUnit.contractAmount || ""}
                        onChange={(e) =>
                          setNewPartnerUnit({ ...newPartnerUnit, contractAmount: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">单位类型</Label>
                      <Select
                        value={newPartnerUnit.type}
                        onValueChange={(value) => setNewPartnerUnit({ ...newPartnerUnit, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择单位类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="高校">高校</SelectItem>
                          <SelectItem value="科研院所">科研院所</SelectItem>
                          <SelectItem value="企业">企业</SelectItem>
                          <SelectItem value="事业单位">事业单位</SelectItem>
                          <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">银行名称</Label>
                      <Input
                        id="bankName"
                        value={newPartnerUnit.bankName}
                        onChange={(e) => setNewPartnerUnit({ ...newPartnerUnit, bankName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">银行账号</Label>
                      <Input
                        id="accountNumber"
                        value={newPartnerUnit.accountNumber}
                        onChange={(e) => handleAccountNumberChange(e.target.value)}
                        className={accountError ? "border-red-500" : ""}
                      />
                      {accountError && <p className="text-red-500 text-xs">{accountError}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentProgress">付款进度 (%)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="paymentProgress"
                          type="number"
                          min="0"
                          max="100"
                          value={newPartnerUnit.paymentProgress || ""}
                          onChange={(e) =>
                            setNewPartnerUnit({ ...newPartnerUnit, paymentProgress: Number(e.target.value) })
                          }
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractExecution">合同执行率 (%)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="contractExecution"
                          type="number"
                          min="0"
                          max="100"
                          value={newPartnerUnit.contractExecution || ""}
                          onChange={(e) =>
                            setNewPartnerUnit({ ...newPartnerUnit, contractExecution: Number(e.target.value) })
                          }
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddPartnerDialog(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddPartnerUnit} disabled={!!accountError}>
                    添加
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>单位名称</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead className="text-right">合同金额</TableHead>
                <TableHead>单位类型</TableHead>
                <TableHead>银行信息</TableHead>
                <TableHead>付款进度</TableHead>
                <TableHead>合同执行</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.responsible}</TableCell>
                  <TableCell className="text-right">¥{unit.contractAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{unit.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{unit.bankName}</div>
                      <div className="text-muted-foreground">{unit.accountNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{unit.paymentProgress}%</span>
                      </div>
                      <Progress value={unit.paymentProgress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{unit.contractExecution}%</span>
                      </div>
                      <Progress
                        value={unit.contractExecution}
                        className={`h-2 ${unit.contractExecution < unit.paymentProgress ? "bg-red-100" : ""}`}
                        indicatorClassName={unit.contractExecution < unit.paymentProgress ? "bg-red-500" : ""}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {partnerUnits.some((unit) => unit.contractExecution < unit.paymentProgress) && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>注意：部分合作单位的合同执行率低于付款进度，请关注相关风险。</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 经费分配部分 - 全新设计 */}
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-muted/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">经费分配</h2>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/10"
              onClick={() => setShowAdjustDialog(true)}
            >
              <Users className="h-4 w-4 mr-2" />
              调整分配
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-6 pb-6">
          {/* 总体分配统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-primary/5 rounded-lg p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">总分配金额</span>
              <span className="text-2xl font-bold mt-1">
                ¥{fundsAllocation.reduce((sum, m) => sum + m.claimedAmount, 0).toLocaleString()}
              </span>
              <div className="mt-2 text-xs text-muted-foreground">
                占总预算{" "}
                {((fundsAllocation.reduce((sum, m) => sum + m.claimedAmount, 0) / totalBudget) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">已使用金额</span>
              <span className="text-2xl font-bold mt-1">
                ¥{fundsAllocation.reduce((sum, m) => sum + m.usedAmount, 0).toLocaleString()}
              </span>
              <div className="mt-2 text-xs text-muted-foreground">
                使用率{" "}
                {(
                  (fundsAllocation.reduce((sum, m) => sum + m.usedAmount, 0) /
                    fundsAllocation.reduce((sum, m) => sum + m.claimedAmount, 0)) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">分配成员数</span>
              <span className="text-2xl font-bold mt-1">{fundsAllocation.length}</span>
              <div className="mt-2 text-xs text-muted-foreground">
                人均 ¥
                {(
                  fundsAllocation.reduce((sum, m) => sum + m.claimedAmount, 0) / fundsAllocation.length
                ).toLocaleString()}
              </div>
            </div>
          </div>

          {/* 成员分配卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fundsAllocation.map((member) => {
              const usagePercentage = (member.usedAmount / member.claimedAmount) * 100
              const isHighUsage = usagePercentage > 80
              const isLowUsage = usagePercentage < 30

              return (
                <Card
                  key={member.id}
                  className="rounded-xl overflow-hidden border border-primary/30 hover:border-primary/50 transition-all duration-300 group"
                >
                  <CardHeader className="pb-3 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            member.status === "已完成"
                              ? "bg-green-100 text-green-600"
                              : isHighUsage
                                ? "bg-orange-100 text-orange-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Badge
                        variant={member.status === "已完成" ? "outline" : "secondary"}
                        className={`${
                          member.status === "已完成" ? "border-green-200 bg-green-50 text-green-700" : "bg-muted"
                        }`}
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground mb-1">认领金额</span>
                        <span className="text-lg font-semibold">¥{member.claimedAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground mb-1">已使用</span>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold">¥{member.usedAmount.toLocaleString()}</span>
                          {isHighUsage && <ArrowUpRight className="h-4 w-4 text-orange-500 ml-1" />}
                          {isLowUsage && <ArrowDownRight className="h-4 w-4 text-blue-500 ml-1" />}
                        </div>
                      </div>
                    </div>

                    {member.subAllocations && member.subAllocations.length > 0 && (
                      <div className="mt-3">
                        <Separator className="mb-3" />
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">子分配明细</span>
                          <span className="text-xs text-muted-foreground">{member.subAllocations.length} 项</span>
                        </div>
                        <ScrollArea className="h-24 rounded-md border border-muted/60 p-2">
                          {member.subAllocations.map((sub, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-1.5 px-1 text-sm hover:bg-muted/30 rounded-sm"
                            >
                              <span className="flex items-center">
                                <ChevronRight className="h-3 w-3 text-muted-foreground mr-1" />
                                {sub.name}
                              </span>
                              <span className="font-medium">¥{sub.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>调整经费分配</DialogTitle>
            <DialogDescription>调整项目成员的经费分配比例</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fundsAllocation.map((member) => (
              <div key={member.id} className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="text-sm text-right">当前: ¥{member.claimedAmount.toLocaleString()}</div>
                <div>
                  <Input
                    type="number"
                    placeholder="调整金额"
                    value={adjustAmount[member.id] || member.claimedAmount}
                    onChange={(e) => {
                      const newValue = Number(e.target.value)
                      setAdjustAmount({
                        ...adjustAmount,
                        [member.id]: newValue,
                      })

                      // 验证总额不超过总预算
                      const totalAdjusted = fundsAllocation.reduce((sum, m) => {
                        return sum + (m.id === member.id ? newValue : adjustAmount[m.id] || m.claimedAmount)
                      }, 0)

                      if (totalAdjusted > totalBudget) {
                        setAdjustError(
                          `总分配金额 ¥${totalAdjusted.toLocaleString()} 超出总预算 ¥${totalBudget.toLocaleString()}`,
                        )
                      } else {
                        setAdjustError("")
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            ))}

            {adjustError && (
              <Alert variant="destructive">
                <AlertDescription>{adjustError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAdjustDialog(false)
                setAdjustAmount({})
                setAdjustError("")
              }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                // 更新经费分配
                const updatedAllocation = fundsAllocation.map((member) => ({
                  ...member,
                  claimedAmount: adjustAmount[member.id] || member.claimedAmount,
                }))
                setFundsAllocation(updatedAllocation)
                setShowAdjustDialog(false)
                setAdjustAmount({})
                setAdjustError("")
              }}
              disabled={!!adjustError}
            >
              保存调整
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

