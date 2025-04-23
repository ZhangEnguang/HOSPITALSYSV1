"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Bell, Clock, Download, FileText, Loader2, Mail, MessageSquare, Phone, Send, Upload, X } from "lucide-react"
import { ExpertInfo } from "../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

// 扩展专家信息接口
interface ExtendedExpertInfo extends ExpertInfo {
  specialty?: string;
  source?: string;
  workplace?: string;
  highestDegree?: string;
  primaryDiscipline?: string;
  email?: string;
  phone?: string;
}

// 通知模板接口
interface NotificationTemplate {
  id: string
  name: string
  subject: string
  content: string
  description: string
  category: string
}

// 通知发送渠道
type NotificationChannel = "email" | "sms" | "app";

// 定时发送时间
interface ScheduleTime {
  enabled: boolean
  date: string
  time: string
}

// 通知状态类型
type NotificationStatus = "success" | "pending" | "failed";

// 通知监控记录接口
interface NotificationRecord {
  id: string;
  expertId: string;
  expertName: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  sentTime: string;
  readTime?: string;
  failReason?: string;
  retryCount: number;
}

export default function SendNotificationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedExperts, setSelectedExperts] = useState<ExtendedExpertInfo[]>([])
  const [batchId, setBatchId] = useState<string | null>(null)
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [notificationSubject, setNotificationSubject] = useState("")
  const [notificationContent, setNotificationContent] = useState("")
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(["email", "app"])
  const [scheduleTime, setScheduleTime] = useState<ScheduleTime>({
    enabled: false,
    date: new Date().toISOString().split('T')[0],
    time: "09:00"
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [notificationRecords, setNotificationRecords] = useState<NotificationRecord[]>([])
  const [showMonitorBoard, setShowMonitorBoard] = useState(false)
  
  // 初始化数据
  useEffect(() => {
    const storedExperts = sessionStorage.getItem('selectedExperts')
    const storedBatchId = sessionStorage.getItem('batchId')
    
    const loadData = async () => {
      try {
        setLoading(true)
        
        // 从sessionStorage获取专家数据
        if (storedExperts) {
          const expertIds = JSON.parse(storedExperts) as string[]
          // 这里应该是从API获取专家详细信息
          // 模拟异步获取专家数据
          await new Promise(resolve => setTimeout(resolve, 800))
          
          // 测试数据
          const expertsData: ExtendedExpertInfo[] = expertIds.map((id, index) => ({
            id,
            name: `专家${index + 1}`,
            specialty: ['计算机科学', '人工智能', '数据分析', '软件工程', '网络安全'][Math.floor(Math.random() * 5)],
            source: ['校内专家', '校外专家', '企业专家', '其他单位'][Math.floor(Math.random() * 4)],
            workplace: ['北京大学', '清华大学', '中国科学院', '华为技术有限公司', '腾讯科技', '阿里巴巴集团'][Math.floor(Math.random() * 6)],
            title: ['教授', '副教授', '高级工程师', '研究员', '首席科学家'][Math.floor(Math.random() * 5)],
            highestDegree: ['博士', '硕士', '学士'][Math.floor(Math.random() * 3)],
            primaryDiscipline: ['计算机科学与技术', '人工智能', '数据科学', '信息安全', '软件工程', '通信工程', '电子科学与技术'][Math.floor(Math.random() * 7)],
            email: `expert${index + 1}@example.com`,
            phone: `1391234${(5678 + index).toString().padStart(4, '0')}`,
          }))
          
          setSelectedExperts(expertsData)
        }
        
        if (storedBatchId) {
          setBatchId(storedBatchId)
        }
        
        // 加载通知模板
        // 模拟异步获取模板数据
        await new Promise(resolve => setTimeout(resolve, 400))
        
        // 测试模板数据
        const templatesData: NotificationTemplate[] = [
          {
            id: "template-1",
            name: "评审邀请函",
            subject: "邀请您参与科研项目评审工作",
            content: "尊敬的{专家姓名}：\n\n诚挚地邀请您参与我校{项目名称}的评审工作。您的专业知识和经验对我们项目评估至关重要。评审时间为{评审开始日期}至{评审截止日期}，请您在此期间登录评审系统完成相关工作。\n\n感谢您的支持与配合！",
            description: "向专家发送项目评审邀请",
            category: "邀请通知"
          },
          {
            id: "template-2",
            name: "评审即将截止提醒",
            subject: "项目评审即将截止通知",
            content: "尊敬的{专家姓名}：\n\n温馨提醒您，{项目名称}的评审工作将于{评审截止日期}截止，请您及时登录评审系统完成评审工作。如已完成，请忽略此条提醒。\n\n感谢您的支持与配合！",
            description: "提醒专家评审即将截止",
            category: "提醒通知"
          },
          {
            id: "template-3",
            name: "评审结果确认通知",
            subject: "请确认您的项目评审意见",
            content: "尊敬的{专家姓名}：\n\n您关于{项目名称}的评审工作已完成，请您再次核对评审意见并确认提交。确认后评审意见将无法修改。\n\n感谢您的支持与配合！",
            description: "请专家确认最终评审意见",
            category: "确认通知"
          }
        ]
        
        setNotificationTemplates(templatesData)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
    
    // 组件卸载时清除sessionStorage中的数据
    return () => {
      sessionStorage.removeItem('selectedExperts')
      sessionStorage.removeItem('batchId')
    }
  }, [])
  
  // 处理模板选择
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = notificationTemplates.find(t => t.id === templateId)
    if (template) {
      setNotificationSubject(template.subject)
      setNotificationContent(template.content)
    }
  }
  
  // 处理渠道选择
  const handleChannelToggle = (channel: NotificationChannel) => {
    setSelectedChannels(prev => {
      if (prev.includes(channel)) {
        return prev.filter(c => c !== channel)
      } else {
        return [...prev, channel]
      }
    })
  }
  
  // 处理定时发送选项
  const handleScheduleToggle = (checked: boolean) => {
    setScheduleTime(prev => ({
      ...prev,
      enabled: checked
    }))
  }
  
  // 处理发送通知
  const handleSendNotification = () => {
    setShowConfirmation(true)
  }
  
  // 确认发送通知
  const handleConfirmSend = async () => {
    setSending(true)
    try {
      // 模拟发送请求
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 生成通知记录
      const records: NotificationRecord[] = []
      
      selectedExperts.forEach(expert => {
        selectedChannels.forEach(channel => {
          // 随机状态，实际应该根据发送结果设置
          const statuses: NotificationStatus[] = ["success", "pending", "failed"]
          const status = statuses[Math.floor(Math.random() * statuses.length)]
          
          records.push({
            id: `notification-${expert.id}-${channel}-${Date.now()}`,
            expertId: expert.id,
            expertName: expert.name,
            channel,
            status,
            sentTime: new Date().toISOString(),
            readTime: status === "success" && Math.random() > 0.5 ? new Date().toISOString() : undefined,
            failReason: status === "failed" ? ["邮箱地址无效", "短信发送失败", "网络连接超时"][Math.floor(Math.random() * 3)] : undefined,
            retryCount: status === "failed" ? Math.floor(Math.random() * 3) : 0
          })
        })
      })
      
      setNotificationRecords(records)
      setShowConfirmation(false)
      setShowMonitorBoard(true)
      setSending(false)
    } catch (error) {
      console.error('发送失败', error)
      setSending(false)
    }
  }
  
  // 重试失败的通知
  const handleRetry = (recordId: string) => {
    setNotificationRecords(prev => 
      prev.map(record => 
        record.id === recordId
          ? { 
              ...record, 
              status: Math.random() > 0.3 ? "success" : "pending", 
              retryCount: record.retryCount + 1,
              sentTime: new Date().toISOString()
            }
          : record
      )
    )
  }
  
  // 获取通知状态的样式
  const getStatusStyles = (status: NotificationStatus) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "";
    }
  }
  
  // 获取通知渠道的图标
  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "app":
        return <Bell className="h-4 w-4" />;
      default:
        return null;
    }
  }
  
  // 格式化时间
  const formatTime = (isoTime?: string) => {
    if (!isoTime) return "-";
    
    try {
      const date = new Date(isoTime);
      return format(date, "yyyy-MM-dd HH:mm:ss");
    } catch (e) {
      return isoTime;
    }
  }
  
  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }
  
  // 移除上传的文件
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  // 处理移除专家
  const handleRemoveExpert = (expertId: string) => {
    setSelectedExperts(prev => prev.filter(expert => expert.id !== expertId));
  }
  
  // 返回到上一页
  const handleBack = () => {
    router.back()
  }
  
  // 处理内容变量替换
  const processContent = (content: string): string => {
    // 简单的变量替换逻辑，实际应用中可能需要更复杂的处理
    return content
      .replace(/{专家姓名}/g, selectedExperts[0]?.name || '{专家姓名}')
      .replace(/{项目名称}/g, '项目名称示例')
      .replace(/{评审开始日期}/g, '2024-07-01')
      .replace(/{评审截止日期}/g, '2024-07-15')
  }
  
  return (
    <div className="container mx-auto py-6">
      {/* 页面标题和返回按钮 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">发送评审通知</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={handleBack}
          >
            取消
          </Button>
          <Button 
            disabled={sending || loading || selectedExperts.length === 0 || !notificationContent.trim()}
            onClick={handleSendNotification}
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                发送中...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                发送通知
              </>
            )}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">加载中...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：专家列表 */}
          <div className="lg:col-span-1">
            <Card className="flex flex-col shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>通知专家</CardTitle>
                  <Badge variant="secondary">{selectedExperts.length} 位专家</Badge>
                </div>
                <CardDescription>
                  已选择的专家将收到此通知
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="w-full" style={{
                  height: selectedExperts.length === 0 ? '100px' : 
                          selectedExperts.length <= 8 ? `calc(${selectedExperts.length} * 110px + ${selectedExperts.length - 1} * 0.75rem)` : 
                          'calc(8 * 110px + 7 * 0.75rem)'
                }}>
                  <div className="space-y-3 pr-4">
                    {selectedExperts.map((expert, index) => (
                      <div 
                        key={expert.id} 
                        className="flex items-start p-3 border rounded-lg space-x-3 relative group  transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{expert.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{expert.name}</div>
                          <div className="text-sm text-muted-foreground">{expert.title} · {expert.workplace}</div>
                          <div className="flex flex-col mt-2 space-y-1">
                            <div className="flex items-center text-xs text-slate-500">
                              <Mail className="h-3 w-3 mr-1.5" />
                              {expert.email}
                            </div>
                            <div className="flex items-center text-xs text-slate-500">
                              <Phone className="h-3 w-3 mr-1.5" />
                              {expert.phone}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-opacity rounded-full"
                          onClick={() => handleRemoveExpert(expert.id)}
                          title="删除"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* 右侧：通知内容和设置 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 发送设置 */}
            <Card>
              <CardHeader>
                <CardTitle>发送设置</CardTitle>
                <CardDescription>
                  配置通知发送方式和时间
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">发送渠道</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="channel-email" 
                          checked={selectedChannels.includes("email")}
                          onCheckedChange={() => handleChannelToggle("email")}
                        />
                        <Label htmlFor="channel-email" className="flex items-center cursor-pointer">
                          <Mail className="h-4 w-4 mr-1.5" />
                          电子邮件
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="channel-sms" 
                          checked={selectedChannels.includes("sms")}
                          onCheckedChange={() => handleChannelToggle("sms")}
                        />
                        <Label htmlFor="channel-sms" className="flex items-center cursor-pointer">
                          <MessageSquare className="h-4 w-4 mr-1.5" />
                          短信
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="channel-app" 
                          checked={selectedChannels.includes("app")}
                          onCheckedChange={() => handleChannelToggle("app")}
                        />
                        <Label htmlFor="channel-app" className="flex items-center cursor-pointer">
                          <Bell className="h-4 w-4 mr-1.5" />
                          系统消息
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox 
                        id="schedule-enable" 
                        checked={scheduleTime.enabled}
                        onCheckedChange={(checked) => handleScheduleToggle(!!checked)}
                      />
                      <Label htmlFor="schedule-enable" className="font-medium cursor-pointer flex items-center">
                        <Clock className="h-4 w-4 mr-1.5" />
                        定时发送
                      </Label>
                    </div>
                    
                    {scheduleTime.enabled && (
                      <div className="pl-7 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="schedule-date">发送日期</Label>
                          <Input 
                            id="schedule-date" 
                            type="date" 
                            value={scheduleTime.date}
                            onChange={(e) => setScheduleTime(prev => ({...prev, date: e.target.value}))}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schedule-time">发送时间</Label>
                          <Input 
                            id="schedule-time" 
                            type="time" 
                            value={scheduleTime.time}
                            onChange={(e) => setScheduleTime(prev => ({...prev, time: e.target.value}))}
                          />
                        </div>
                        <p className="col-span-2 text-xs text-muted-foreground">
                          系统将在 {scheduleTime.date} {scheduleTime.time} 自动发送通知
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* 通知内容编辑 */}
            <Card>
              <CardHeader>
                <CardTitle>通知内容</CardTitle>
                <CardDescription>
                  编辑通知内容，支持富文本格式和变量插入
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="template" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="template">通知模板</TabsTrigger>
                    <TabsTrigger value="custom">自定义内容</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="template" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-select">选择通知模板</Label>
                      <Select 
                        value={selectedTemplate} 
                        onValueChange={handleTemplateChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择一个通知模板" />
                        </SelectTrigger>
                        <SelectContent>
                          {notificationTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {selectedTemplate 
                          ? notificationTemplates.find(t => t.id === selectedTemplate)?.description 
                          : "请选择一个适合的通知模板"}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="custom" className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      创建自定义通知内容，可使用以下变量：
                      <Badge variant="outline" className="ml-2 cursor-pointer hover:bg-primary/10">{"{专家姓名}"}</Badge>
                      <Badge variant="outline" className="ml-2 cursor-pointer hover:bg-primary/10">{"{项目名称}"}</Badge>
                      <Badge variant="outline" className="ml-2 cursor-pointer hover:bg-primary/10">{"{评审开始日期}"}</Badge>
                      <Badge variant="outline" className="ml-2 cursor-pointer hover:bg-primary/10">{"{评审截止日期}"}</Badge>
                    </p>
                  </TabsContent>
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="notification-subject">通知标题</Label>
                      <Input 
                        id="notification-subject" 
                        placeholder="输入通知标题" 
                        value={notificationSubject}
                        onChange={(e) => setNotificationSubject(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notification-content">通知内容</Label>
                      <div className="border rounded-md p-1 bg-white">
                        <div className="flex items-center space-x-1 p-1 border-b">
                          {/* 简化的富文本工具栏 */}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="font-bold">B</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="italic">I</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-500">
                            <span className="underline">U</span>
                          </Button>
                          <div className="w-px h-6 bg-gray-200 mx-1" />
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <span className="text-xs">链接</span>
                          </Button>
                          <div className="ml-auto" />
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex items-center text-xs text-blue-600 hover:underline">
                              <Upload className="h-3.5 w-3.5 mr-1" />
                              附件
                            </div>
                            <Input 
                              id="file-upload" 
                              type="file" 
                              className="hidden" 
                              onChange={handleFileUpload}
                              multiple
                            />
                          </Label>
                        </div>
                        
                        <Textarea 
                          className="border-0 focus-visible:ring-0 resize-none min-h-[200px]"
                          placeholder="请输入通知内容..."
                          value={notificationContent}
                          onChange={(e) => setNotificationContent(e.target.value)}
                        />
                        
                        {uploadedFiles.length > 0 && (
                          <div className="border-t p-2">
                            <Label className="text-xs text-muted-foreground mb-2">附件</Label>
                            <div className="space-y-2">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                    <span className="text-slate-700">{file.name}</span>
                                    <span className="ml-2 text-xs text-slate-500">
                                      ({(file.size / 1024).toFixed(0)} KB)
                                    </span>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 text-slate-500 hover:text-red-500"
                                    onClick={() => handleRemoveFile(index)}
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-slate-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">通知预览</h4>
                    <div className="bg-white p-3 border rounded-md text-sm whitespace-pre-line">
                      {processContent(notificationContent)}
                    </div>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
            

          </div>
        </div>
      )}
      
      {/* 发送确认弹框 - 将在后面实现 */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认发送通知</AlertDialogTitle>
            <AlertDialogDescription>
              您将向 <strong>{selectedExperts.length}</strong> 位专家发送通知。确认以下发送信息：
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-700">通知标题</h4>
                <p className="text-sm">{notificationSubject}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-700">通知内容</h4>
                <div className="text-sm bg-slate-50 p-2 rounded border whitespace-pre-line max-h-40 overflow-y-auto">
                  {processContent(notificationContent)}
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-700">发送方式</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChannels.map(channel => (
                    <Badge key={channel} variant="outline" className="flex items-center gap-1.5">
                      {channel === "email" ? <Mail className="h-4 w-4" /> : 
                       channel === "sms" ? <MessageSquare className="h-4 w-4" /> : 
                       <Bell className="h-4 w-4" />}
                      <span>
                        {channel === "email" ? "电子邮件" : 
                         channel === "sms" ? "短信" : "系统消息"}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
              
              {scheduleTime.enabled && (
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-700">发送时间</h4>
                  <p className="text-sm">{scheduleTime.date} {scheduleTime.time}</p>
                </div>
              )}
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-700">附件</h4>
                  <ul className="text-sm list-disc list-inside">
                    {uploadedFiles.map((file, i) => (
                      <li key={i}>{file.name} ({(file.size / 1024).toFixed(0)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmSend} 
              disabled={sending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  确认发送
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      

    </div>
  )
} 