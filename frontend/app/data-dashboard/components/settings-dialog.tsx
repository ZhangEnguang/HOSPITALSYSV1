"use client"

import { useState, useEffect } from 'react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
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

  // 管理body滚动
  useEffect(() => {
    if (open) {
      // 弹框打开时禁用body滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 弹框关闭时恢复body滚动
      document.body.style.overflow = 'unset'
    }

    // 清理函数
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // 保存设置
  const handleSaveSettings = () => {
    // 这里可以添加其他设置的保存逻辑
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        {/* 标题栏 */}
        <DialogHeader className="flex flex-col space-y-1.5 text-left px-6 pt-5 pb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">数据看板设置</DialogTitle>
          </div>
        </DialogHeader>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="display" className="w-full flex flex-col h-full">
            <div className="px-6 shrink-0">
              <TabsList className="grid w-full grid-cols-3 mt-3 mb-4 h-12 p-1">
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
        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              重置默认
            </Button>
            <Button onClick={handleSaveSettings}>
              保存设置
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 