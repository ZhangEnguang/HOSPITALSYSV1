"use client"

import { useState, useEffect } from 'react'
import { 
  Clock, 
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface TimeRangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTimeRangeChange?: (range: string, startDate?: string, endDate?: string) => void
  currentRange: string
  currentStartDate: string
  currentEndDate: string
}

export default function TimeRangeDialog({ 
  open, 
  onOpenChange, 
  onTimeRangeChange,
  currentRange,
  currentStartDate,
  currentEndDate
}: TimeRangeDialogProps) {
  // 统计时间设置 - 默认选中自定义
  const [statisticsRange, setStatisticsRange] = useState('custom')
  const [customStartDate, setCustomStartDate] = useState(currentStartDate)
  const [customEndDate, setCustomEndDate] = useState(currentEndDate)

  // 当弹框打开时，更新本地状态
  useEffect(() => {
    if (open) {
      // 弹框总是默认选中自定义范围
      setStatisticsRange('custom')
      setCustomStartDate(currentStartDate)
      setCustomEndDate(currentEndDate)
    }
  }, [open, currentStartDate, currentEndDate])

  // 管理body滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // 保存设置
  const handleSaveSettings = () => {
    if (onTimeRangeChange) {
      onTimeRangeChange(statisticsRange, customStartDate, customEndDate)
    }
    onOpenChange(false)
  }

  // 取消设置
  const handleCancel = () => {
    // 恢复到原始值
    setStatisticsRange('custom')
    setCustomStartDate(currentStartDate)
    setCustomEndDate(currentEndDate)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[500px] flex flex-col">
        {/* 标题栏 */}
        <DialogHeader className="text-left shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">统计时间范围设置</DialogTitle>
          </div>
        </DialogHeader>

        {/* 内容区域 - 固定高度 */}
        <div className="flex-1 space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="statistics-range">时间范围</Label>
              <Select value={statisticsRange} onValueChange={setStatisticsRange} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">自定义范围</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">开始时间</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">结束时间</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">自定义时间范围预览</span>
            </div>
            <div className="mt-1 text-sm text-blue-600">
              {customStartDate && customEndDate 
                ? `${customStartDate} 至 ${customEndDate}`
                : '请选择开始和结束日期'
              }
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t shrink-0">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSaveSettings}>
            确定
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 