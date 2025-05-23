"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function EquipmentBookingPage() {
  const router = useRouter()
  const params = useParams()
  const equipmentId = params.id as string

  const [formData, setFormData] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    purpose: "",
    project: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 表单验证
    if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime || !formData.purpose) {
      toast({
        title: "表单验证失败",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // 模拟提交预约
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "预约成功",
        description: "您的仪器预约申请已提交，请等待审核",
        duration: 3000,
      })

      router.push("/laboratory/equipment")
    } catch (error) {
      toast({
        title: "预约失败",
        description: "提交预约时发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <h1 className="text-2xl font-semibold">仪器预约</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              预约仪器
            </CardTitle>
            <CardDescription>
              请填写预约信息，管理员审核后方可使用仪器
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 预约日期 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">开始日期 *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : "选择开始日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">结束日期 *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : "选择结束日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                        disabled={(date) => date < new Date() || (formData.startDate && date < formData.startDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* 预约时间 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">开始时间 *</Label>
                  <Select value={formData.startTime} onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择开始时间" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">结束时间 *</Label>
                  <Select value={formData.endTime} onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择结束时间" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 使用目的 */}
              <div className="space-y-2">
                <Label htmlFor="purpose">使用目的 *</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="请输入使用目的"
                  required
                />
              </div>

              {/* 所属项目 */}
              <div className="space-y-2">
                <Label htmlFor="project">所属项目</Label>
                <Input
                  id="project"
                  value={formData.project}
                  onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                  placeholder="请输入所属项目名称"
                />
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <Label htmlFor="notes">备注说明</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="请输入备注说明"
                  rows={3}
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  取消
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "提交中..." : "提交预约"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 