"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Volume2,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Bell,
  Settings,
  Download,
  RefreshCw,
  Eye
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnimalRoomMonitoringDashboardProps {
  roomId: string
}

export function AnimalRoomMonitoringDashboard({ roomId }: AnimalRoomMonitoringDashboardProps) {
  const router = useRouter()

  // 模拟实时监控数据
  const [monitoringData, setMonitoringData] = useState({
    temperature: {
      current: 22.3,
      target: 22.0,
      range: { min: 20, max: 25 },
      status: "normal",
      trend: "stable",
      unit: "°C"
    },
    humidity: {
      current: 58.2,
      target: 55.0,
      range: { min: 50, max: 60 },
      status: "normal", 
      trend: "rising",
      unit: "%RH"
    },
    ventilation: {
      current: 15.8,
      target: 15.0,
      range: { min: 12, max: 20 },
      status: "normal",
      trend: "stable",
      unit: "次/小时"
    },
    lighting: {
      current: 250,
      target: 250,
      range: { min: 200, max: 300 },
      status: "normal",
      trend: "stable",
      unit: "勒克斯",
      cycle: "明期 (08:00-20:00)"
    },
    noise: {
      current: 45.2,
      target: 45.0,
      range: { min: 0, max: 60 },
      status: "normal",
      trend: "stable",
      unit: "分贝"
    },
    airQuality: {
      current: 98.5,
      target: 98.0,
      range: { min: 95, max: 100 },
      status: "excellent",
      trend: "stable",
      unit: "%洁净度"
    }
  })

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      message: "温度传感器2号异常读数，请检查设备",
      time: "10分钟前",
      resolved: false
    },
    {
      id: 2,
      type: "info", 
      message: "自动清洁程序将在2小时后启动",
      time: "30分钟前",
      resolved: false
    }
  ])

  // 历史数据（24小时）
  const [historicalData] = useState([
    { time: "00:00", temperature: 22.1, humidity: 55.8, noise: 42.3 },
    { time: "04:00", temperature: 22.0, humidity: 56.2, noise: 43.1 },
    { time: "08:00", temperature: 22.2, humidity: 57.1, noise: 48.5 },
    { time: "12:00", temperature: 22.4, humidity: 58.3, noise: 52.1 },
    { time: "16:00", temperature: 22.3, humidity: 58.0, noise: 49.2 },
    { time: "20:00", temperature: 22.1, humidity: 57.5, noise: 45.8 }
  ])

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600"
      case "normal": return "text-blue-600"
      case "warning": return "text-yellow-600"
      case "critical": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": 
      case "normal": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical": return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising": return <TrendingUp className="h-4 w-4 text-green-500" />
      case "falling": return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  // 返回动物房列表
  const handleReturnToList = () => {
    router.push('/laboratory/animal-rooms')
  }

  // 监控指标卡片组件
  const MonitoringCard = ({ 
    title, 
    icon, 
    data, 
    description 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    data: any; 
    description: string;
  }) => {
    const progressValue = ((data.current - data.range.min) / (data.range.max - data.range.min)) * 100
    
    return (
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-blue-500">
                {icon}
              </div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
            </div>
            {getStatusIcon(data.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{data.current}</span>
            <span className="text-muted-foreground">{data.unit}</span>
            {getTrendIcon(data.trend)}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>范围: {data.range.min}-{data.range.max}{data.unit}</span>
              <span>目标: {data.target}{data.unit}</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
          
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {data.cycle && (
            <Badge variant="outline" className="text-xs">
              {data.cycle}
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container py-6 space-y-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">环境监控</h1>
            <p className="text-muted-foreground">AR-{roomId} - SPF饲养间</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            监控设置
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新数据
          </Button>
        </div>
      </div>

      {/* 告警信息 */}
      {alerts.filter(alert => !alert.resolved).length > 0 && (
        <div className="space-y-2">
          {alerts.filter(alert => !alert.resolved).map(alert => (
            <Alert key={alert.id} variant={alert.type === "warning" ? "destructive" : "default"}>
              <Bell className="h-4 w-4" />
              <AlertDescription className="flex justify-between">
                <span>{alert.message}</span>
                <span className="text-sm text-muted-foreground">{alert.time}</span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* 监控面板 */}
      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">实时监控</TabsTrigger>
          <TabsTrigger value="history">历史数据</TabsTrigger>
          <TabsTrigger value="reports">监控报告</TabsTrigger>
          <TabsTrigger value="maintenance">设备维护</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          {/* 实时监控指标 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MonitoringCard
              title="温度监控"
              icon={<Thermometer className="h-5 w-5" />}
              data={monitoringData.temperature}
              description="维持动物舒适的体温调节环境，影响新陈代谢和实验结果"
            />
            
            <MonitoringCard
              title="湿度监控"
              icon={<Droplets className="h-5 w-5" />}
              data={monitoringData.humidity}
              description="防止呼吸道疾病，维持皮毛和粘膜健康状态"
            />
            
            <MonitoringCard
              title="通风监控"
              icon={<Wind className="h-5 w-5" />}
              data={monitoringData.ventilation}
              description="排除有害气体，提供新鲜空气，防止交叉感染"
            />
            
            <MonitoringCard
              title="光照监控"
              icon={<Sun className="h-5 w-5" />}
              data={monitoringData.lighting}
              description="调节生物钟，影响繁殖周期和行为表现"
            />
            
            <MonitoringCard
              title="噪音监控"
              icon={<Volume2 className="h-5 w-5" />}
              data={monitoringData.noise}
              description="减少应激反应，确保动物行为的自然性"
            />
            
            <MonitoringCard
              title="空气质量"
              icon={<Shield className="h-5 w-5" />}
              data={monitoringData.airQuality}
              description="维持SPF级洁净度，防止病原微生物污染"
            />
          </div>

          {/* 业务标准说明 */}
          <Card className="border-[#E9ECF2] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                业务标准与要求
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">环境参数标准</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 温度：20-25°C，精度±0.5°C</li>
                    <li>• 湿度：50-60%RH，精度±5%</li>
                    <li>• 换气：12-20次/小时</li>
                    <li>• 光照：200-300勒克斯，12h明暗循环</li>
                    <li>• 噪音：≤60分贝（日），≤45分贝（夜）</li>
                    <li>• 洁净度：SPF级标准</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">监控业务要求</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 24小时连续监控记录</li>
                    <li>• 异常参数自动报警</li>
                    <li>• 数据自动存储备份</li>
                    <li>• 定期设备校准维护</li>
                    <li>• 符合GLP标准要求</li>
                    <li>• 可追溯的监控档案</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-[#E9ECF2] shadow-sm">
            <CardHeader>
              <CardTitle>24小时历史数据</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>温度(°C)</TableHead>
                    <TableHead>湿度(%RH)</TableHead>
                    <TableHead>噪音(分贝)</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicalData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>{record.temperature}</TableCell>
                      <TableCell>{record.humidity}</TableCell>
                      <TableCell>{record.noise}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">正常</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* 报告生成器 */}
          <Card className="border-[#E9ECF2] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-500" />
                报告生成器
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">日报</h4>
                      <p className="text-sm text-muted-foreground">24小时监控数据汇总</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    包含温度、湿度、通风等关键指标的小时级统计
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-md">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">周报</h4>
                      <p className="text-sm text-muted-foreground">一周环境趋势分析</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    环境参数波动分析，异常事件统计和处理记录
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-md">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">月报</h4>
                      <p className="text-sm text-muted-foreground">合规性评估报告</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    GLP标准符合性评估，设备性能评价
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* 最近报告列表 */}
          <Card className="border-[#E9ECF2] shadow-sm">
            <CardHeader>
              <CardTitle>最近报告</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>报告类型</TableHead>
                    <TableHead>生成时间</TableHead>
                    <TableHead>报告期间</TableHead>
                    <TableHead>合规状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        日报
                      </div>
                    </TableCell>
                    <TableCell>2024-01-05 08:00</TableCell>
                    <TableCell>2024-01-04 00:00 - 23:59</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        正常
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          查看
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          下载
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        周报
                      </div>
                    </TableCell>
                    <TableCell>2024-01-01 09:00</TableCell>
                    <TableCell>2023-12-25 - 2023-12-31</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-yellow-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        异常2次
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          查看
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          下载
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        月报
                      </div>
                    </TableCell>
                    <TableCell>2023-12-31 17:00</TableCell>
                    <TableCell>2023-12-01 - 2023-12-31</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        合规
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          查看
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          下载
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 报告内容预览 */}
          <Card className="border-[#E9ECF2] shadow-sm">
            <CardHeader>
              <CardTitle>报告内容示例</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">📊 环境监控日报 - 2024年1月4日</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>房间信息：</strong>AR-009 - SPF饲养间，容量50只，当前42只</p>
                    <p><strong>温度监控：</strong>平均22.1°C，范围21.8-22.5°C，符合标准</p>
                    <p><strong>湿度监控：</strong>平均56.3%RH，范围54.2-58.1%RH，符合标准</p>
                    <p><strong>异常事件：</strong>03:15 温度传感器2号异常读数（已处理）</p>
                    <p><strong>设备状态：</strong>通风系统正常，温控系统正常，照明系统正常</p>
                    <p><strong>合规评价：</strong>✅ 符合GLP标准要求</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-md">
                  <h4 className="font-medium mb-2">📈 环境监控周报 - 第52周</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>监控摘要：</strong>本周环境参数整体稳定，出现2次轻微异常</p>
                    <p><strong>趋势分析：</strong>温度波动减小，湿度控制改善，通风效率提升</p>
                    <p><strong>异常分析：</strong>周三夜间短暂湿度偏高，已调整加湿系统</p>
                    <p><strong>维护记录：</strong>周二更换温度传感器，周五清洁通风管道</p>
                    <p><strong>改进建议：</strong>建议增加湿度传感器校准频率</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          {/* 设备状态总览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-[#E9ECF2] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-md">
                    <Thermometer className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">温控系统</p>
                    <p className="font-medium">正常运行</p>
                    <p className="text-xs text-green-600">最后维护：2024-01-01</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-[#E9ECF2] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-md">
                    <Wind className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">通风系统</p>
                    <p className="font-medium">正常运行</p>
                    <p className="text-xs text-green-600">最后维护：2023-12-28</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-[#E9ECF2] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-md">
                    <Sun className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">照明系统</p>
                    <p className="font-medium">需要维护</p>
                    <p className="text-xs text-yellow-600">下次维护：2024-01-08</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-[#E9ECF2] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-md">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">监控传感器</p>
                    <p className="font-medium">正常运行</p>
                    <p className="text-xs text-green-600">最后校准：2024-01-03</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 维护计划 */}
          <Card className="border-[#E9ECF2] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                维护计划
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>设备名称</TableHead>
                    <TableHead>维护类型</TableHead>
                    <TableHead>计划时间</TableHead>
                    <TableHead>负责人</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-blue-500" />
                        温度传感器组
                      </div>
                    </TableCell>
                    <TableCell>月度校准</TableCell>
                    <TableCell>2024-01-15</TableCell>
                    <TableCell>张工程师</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-blue-600">
                        已安排
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        LED照明系统
                      </div>
                    </TableCell>
                    <TableCell>例行检查</TableCell>
                    <TableCell>2024-01-08</TableCell>
                    <TableCell>李技师</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-yellow-600">
                        待执行
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        开始维护
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-green-500" />
                        HVAC通风系统
                      </div>
                    </TableCell>
                    <TableCell>深度清洁</TableCell>
                    <TableCell>2024-01-20</TableCell>
                    <TableCell>王师傅</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-gray-600">
                        未开始
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        安排维护
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        湿度控制系统
                      </div>
                    </TableCell>
                    <TableCell>季度保养</TableCell>
                    <TableCell>2024-01-25</TableCell>
                    <TableCell>赵工程师</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-blue-600">
                        已安排
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 维护记录 */}
          <Card className="border-[#E9ECF2] shadow-sm">
            <CardHeader>
              <CardTitle>最近维护记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-md">
                  <div className="p-2 bg-green-100 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">温度传感器2号更换</h4>
                      <span className="text-sm text-muted-foreground">2024-01-03 14:30</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      由于传感器异常读数，已更换为新的高精度传感器。更换后校准完成，运行正常。
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">维护人员：张工程师</span>
                      <span className="text-muted-foreground">耗时：45分钟</span>
                      <Badge variant="secondary" className="text-green-600">已完成</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 border rounded-md">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">通风管道清洁</h4>
                      <span className="text-sm text-muted-foreground">2023-12-28 09:00</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      例行通风管道深度清洁，清除积尘和微生物污染。清洁后进行空气质量检测，各项指标正常。
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">维护人员：王师傅</span>
                      <span className="text-muted-foreground">耗时：2小时</span>
                      <Badge variant="secondary" className="text-blue-600">已完成</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 border rounded-md">
                  <div className="p-2 bg-purple-100 rounded-md">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">监控系统升级</h4>
                      <span className="text-sm text-muted-foreground">2023-12-25 16:00</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      监控软件升级至v2.1版本，新增异常预警功能和数据分析模块。升级后系统稳定运行。
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">维护人员：李技师</span>
                      <span className="text-muted-foreground">耗时：1.5小时</span>
                      <Badge variant="secondary" className="text-purple-600">已完成</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 设备技术规格 */}
          <Card className="border-[#E9ECF2] shadow-sm">
            <CardHeader>
              <CardTitle>设备技术规格</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">监控设备清单</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>温度传感器：</span>
                      <span className="text-muted-foreground">PT1000，精度±0.1°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>湿度传感器：</span>
                      <span className="text-muted-foreground">电容式，精度±2%RH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>压差传感器：</span>
                      <span className="text-muted-foreground">0-500Pa，精度±1Pa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>空气质量检测：</span>
                      <span className="text-muted-foreground">激光散射式PM2.5/PM10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>噪音检测：</span>
                      <span className="text-muted-foreground">A计权，30-130dB</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">维护标准</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>日常巡检：</span>
                      <span className="text-muted-foreground">每日2次</span>
                    </div>
                    <div className="flex justify-between">
                      <span>传感器校准：</span>
                      <span className="text-muted-foreground">每月1次</span>
                    </div>
                    <div className="flex justify-between">
                      <span>设备保养：</span>
                      <span className="text-muted-foreground">每季度1次</span>
                    </div>
                    <div className="flex justify-between">
                      <span>深度清洁：</span>
                      <span className="text-muted-foreground">每半年1次</span>
                    </div>
                    <div className="flex justify-between">
                      <span>系统升级：</span>
                      <span className="text-muted-foreground">根据需要</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 