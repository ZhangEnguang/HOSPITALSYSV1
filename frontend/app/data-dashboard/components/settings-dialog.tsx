"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Clock, 
  RefreshCw, 
  Settings, 
  Database, 
  Eye,
  Calendar,
  Monitor,
  Bell,
  Download,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  // 统计时间设置
  const [statisticsRange, setStatisticsRange] = useState('year')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  
  // 数据刷新设置
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState('5')
  
  // 显示设置
  const [showAnimations, setShowAnimations] = useState(true)
  const [theme, setTheme] = useState('light')
  const [cardLayout, setCardLayout] = useState('grid')
  const [chartType, setChartType] = useState('mixed')
  
  // 数据设置
  const [dataSource, setDataSource] = useState('primary')
  const [cacheEnabled, setCacheEnabled] = useState(true)
  const [realTimeSync, setRealTimeSync] = useState(true)
  
  // 通知设置
  const [alertEnabled, setAlertEnabled] = useState(true)
  const [alertThreshold, setAlertThreshold] = useState('10')
  
  // 导出设置
  const [exportFormat, setExportFormat] = useState('excel')
  const [includeCharts, setIncludeCharts] = useState(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden h-[80vh] flex flex-col"
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">数据看板设置</h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="statistics" className="w-full flex flex-col h-full">
            <div className="px-6">
                             <TabsList className="grid w-full grid-cols-4 mt-3 mb-4 shrink-0 h-12 p-1">
                <TabsTrigger value="statistics" className="flex items-center gap-1.5 text-sm px-3 py-2 h-10 min-w-0">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="truncate">统计时间</span>
                </TabsTrigger>
                <TabsTrigger value="display" className="flex items-center gap-1.5 text-sm px-3 py-2 h-10 min-w-0">
                  <Monitor className="h-4 w-4 shrink-0" />
                  <span className="truncate">显示设置</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-1.5 text-sm px-3 py-2 h-10 min-w-0">
                  <Database className="h-4 w-4 shrink-0" />
                  <span className="truncate">数据设置</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-1.5 text-sm px-3 py-2 h-10 min-w-0">
                  <Download className="h-4 w-4 shrink-0" />
                  <span className="truncate">导出设置</span>
                </TabsTrigger>
            </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {/* 统计时间设置 */}
              <TabsContent value="statistics" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      统计时间范围
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="statistics-range">时间范围</Label>
                        <Select value={statisticsRange} onValueChange={setStatisticsRange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">近一周</SelectItem>
                            <SelectItem value="month">近一个月</SelectItem>
                            <SelectItem value="quarter">近三个月</SelectItem>
                            <SelectItem value="semester">本学期</SelectItem>
                            <SelectItem value="year">本学年</SelectItem>
                            <SelectItem value="academic_year">本学术年度</SelectItem>
                            <SelectItem value="custom">自定义范围</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {statisticsRange === 'custom' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="start-date">开始日期</Label>
                            <Input
                              id="start-date"
                              type="date"
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-date">结束日期</Label>
                            <Input
                              id="end-date"
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                      学期设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>当前学期</Label>
                        <Select defaultValue="spring2024">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spring2024">2024年春季学期</SelectItem>
                            <SelectItem value="fall2024">2024年秋季学期</SelectItem>
                            <SelectItem value="spring2025">2025年春季学期</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>学年度</Label>
                        <Select defaultValue="2024">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2023">2023学年</SelectItem>
                            <SelectItem value="2024">2024学年</SelectItem>
                            <SelectItem value="2025">2025学年</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>



              {/* 显示设置 */}
              <TabsContent value="display" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Eye className="h-5 w-5 text-purple-600" />
                      界面显示设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>主题模式</Label>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">浅色模式</SelectItem>
                            <SelectItem value="dark">深色模式</SelectItem>
                            <SelectItem value="auto">跟随系统</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>卡片布局</Label>
                        <Select value={cardLayout} onValueChange={setCardLayout}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">网格布局</SelectItem>
                            <SelectItem value="list">列表布局</SelectItem>
                            <SelectItem value="masonry">瀑布流布局</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>图表类型</Label>
                        <Select value={chartType} onValueChange={setChartType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mixed">混合图表</SelectItem>
                            <SelectItem value="simple">简化图表</SelectItem>
                            <SelectItem value="detailed">详细图表</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={showAnimations}
                          onCheckedChange={setShowAnimations}
                        />
                        <Label>启用动画效果</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 数据设置 */}
              <TabsContent value="data" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <RefreshCw className="h-5 w-5 text-blue-600" />
                      自动刷新设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={autoRefresh}
                        onCheckedChange={setAutoRefresh}
                      />
                      <Label htmlFor="auto-refresh">启用自动刷新</Label>
                    </div>
                    
                    {autoRefresh && (
                      <div className="space-y-2">
                        <Label htmlFor="refresh-interval">刷新频率</Label>
                        <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">每1分钟</SelectItem>
                            <SelectItem value="5">每5分钟</SelectItem>
                            <SelectItem value="10">每10分钟</SelectItem>
                            <SelectItem value="30">每30分钟</SelectItem>
                            <SelectItem value="60">每1小时</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Database className="h-5 w-5 text-green-600" />
                      数据源配置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>主数据源</Label>
                        <Select value={dataSource} onValueChange={setDataSource}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">主数据库</SelectItem>
                            <SelectItem value="backup">备份数据库</SelectItem>
                            <SelectItem value="cloud">云端数据源</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={cacheEnabled}
                          onCheckedChange={setCacheEnabled}
                        />
                        <Label>启用数据缓存</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={realTimeSync}
                          onCheckedChange={setRealTimeSync}
                        />
                        <Label>实时数据同步</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bell className="h-5 w-5 text-orange-600" />
                      数据预警设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={alertEnabled}
                        onCheckedChange={setAlertEnabled}
                      />
                      <Label>启用数据预警</Label>
                    </div>
                    
                    {alertEnabled && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="alert-threshold">预警阈值 (%)</Label>
                          <Input
                            id="alert-threshold"
                            type="number"
                            value={alertThreshold}
                            onChange={(e) => setAlertThreshold(e.target.value)}
                            placeholder="10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>预警方式</Label>
                          <Select defaultValue="popup">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="popup">弹窗提醒</SelectItem>
                              <SelectItem value="email">邮件通知</SelectItem>
                              <SelectItem value="both">弹窗+邮件</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-red-600" />
                      数据权限设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>数据访问级别</Label>
                      <Select defaultValue="department">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">个人数据</SelectItem>
                          <SelectItem value="department">部门数据</SelectItem>
                          <SelectItem value="college">学院数据</SelectItem>
                          <SelectItem value="university">全校数据</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 导出设置 */}
              <TabsContent value="export" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Download className="h-5 w-5 text-indigo-600" />
                      导出配置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>默认导出格式</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                            <SelectItem value="csv">CSV (.csv)</SelectItem>
                            <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                            <SelectItem value="word">Word (.docx)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={includeCharts}
                          onCheckedChange={setIncludeCharts}
                        />
                        <Label>包含图表</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              重置默认
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              保存设置
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 