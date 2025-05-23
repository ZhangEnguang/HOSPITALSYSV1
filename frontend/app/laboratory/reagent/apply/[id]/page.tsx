"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, CircleAlert, Info } from "lucide-react"
import { allDemoReagentItems } from "../../data/reagent-demo-data"
import { users } from "../../config/reagent-config"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export default function ReagentApplyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [reagent, setReagent] = useState<any>(null)
  const [date, setDate] = useState<Date>(new Date())
  const [applyAmount, setApplyAmount] = useState<string>("")
  const [applyReason, setApplyReason] = useState<string>("")
  const [applyProject, setApplyProject] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 模拟加载特定试剂数据
  useEffect(() => {
    // 在实际应用中，这里会从API获取数据
    const found = allDemoReagentItems.find((item) => item.id === params.id)
    
    if (found) {
      setReagent(found)
    } else {
      // 如果找不到指定ID的试剂，重定向到列表页
      router.push("/laboratory/reagent")
    }
  }, [params.id, router])

  // 计算可申领的最大数量
  const maxAmount = reagent?.currentAmount || 0

  // 处理申请提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证输入
    if (!applyAmount || Number(applyAmount) <= 0) {
      toast({
        title: "申领失败",
        description: "请输入有效的申领数量",
        variant: "destructive",
      })
      return
    }

    if (Number(applyAmount) > maxAmount) {
      toast({
        title: "申领失败",
        description: `申领数量不能超过当前库存 (${maxAmount}${reagent?.unit})`,
        variant: "destructive",
      })
      return
    }

    if (!applyReason) {
      toast({
        title: "申领失败",
        description: "请输入申领原因",
        variant: "destructive",
      })
      return
    }

    // 模拟提交
    setIsSubmitting(true)
    
    // 模拟API调用延迟
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "申领成功",
        description: `已申领 ${applyAmount}${reagent?.unit} ${reagent?.name}`,
      })
      // 申领成功后返回列表页
      router.push("/laboratory/reagent")
    }, 1000)
  }

  if (!reagent) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-60">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          className="mr-2"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">试剂申领</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 试剂信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>试剂信息</CardTitle>
            <CardDescription>
              申领的试剂基本信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{reagent.name}</h3>
                <p className="text-sm text-muted-foreground">{reagent.englishName}</p>
              </div>
              <Badge variant={reagent.status === "正常" ? "success" as any : reagent.status === "低库存" ? "warning" as any : "destructive"}>
                {reagent.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">规格</p>
                <p className="font-medium">{reagent.specification}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">试剂类型</p>
                <p className="font-medium">{reagent.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">目录号</p>
                <p className="font-medium">{reagent.catalogNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">CAS号</p>
                <p className="font-medium">{reagent.casNumber || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">当前库存</p>
                <p className="font-medium">{reagent.currentAmount}{reagent.unit} / {reagent.initialAmount}{reagent.unit}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">存放位置</p>
                <p className="font-medium">{reagent.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">有效期至</p>
                <p className="font-medium">{format(new Date(reagent.expiryDate), "yyyy/MM/dd")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">所属部门</p>
                <p className="font-medium">{reagent.department}</p>
              </div>
            </div>

            {/* 危险等级提示 */}
            {reagent.dangerLevel === "高" && (
              <div className="flex items-start space-x-2 p-3 rounded-md bg-red-50 text-red-800">
                <CircleAlert className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">高危险试剂</p>
                  <p className="text-sm">此试剂为高危险等级，请严格按照安全规程使用。</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 申领表单卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>申领信息</CardTitle>
            <CardDescription>
              填写申领数量和用途等信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  申领日期 <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "yyyy/MM/dd") : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applyAmount">
                  申领数量 <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="applyAmount" 
                    type="number" 
                    placeholder={`最多可申领 ${maxAmount}`} 
                    min="0.01" 
                    max={maxAmount.toString()} 
                    step="0.01"
                    value={applyAmount}
                    onChange={(e) => setApplyAmount(e.target.value)}
                  />
                  <span className="text-muted-foreground">{reagent.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  当前库存: {reagent.currentAmount}{reagent.unit}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user">
                  申领人 <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="user1">
                  <SelectTrigger>
                    <SelectValue placeholder="选择申领人" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">
                  所属项目 <span className="text-destructive">*</span>
                </Label>
                <Select value={applyProject} onValueChange={setApplyProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择所属项目" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project1">人工智能安全研究项目</SelectItem>
                    <SelectItem value="project2">新型纳米材料开发</SelectItem>
                    <SelectItem value="project3">肿瘤标志物检测技术</SelectItem>
                    <SelectItem value="project4">环境污染物降解研究</SelectItem>
                    <SelectItem value="project5">药物递送系统优化</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">
                  申领原因 <span className="text-destructive">*</span>
                </Label>
                <Textarea 
                  id="reason" 
                  placeholder="请详细说明申领用途" 
                  rows={3}
                  value={applyReason}
                  onChange={(e) => setApplyReason(e.target.value)}
                />
              </div>

              <div className="flex items-start space-x-2 p-3 rounded-md bg-blue-50">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-blue-700">
                  试剂申领后需要管理员审批，审批通过后可到指定位置领取。申领的试剂应当在规定时间内使用完毕，并记录使用情况。
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  取消
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "提交中..." : "提交申领"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 