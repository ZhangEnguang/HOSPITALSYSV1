"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Settings, Clock, Users, Bell, Shield } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EquipmentConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config?: any
  onSave: (config: any) => void
  mode?: 'view' | 'edit' // 新增模式属性
}

export function EquipmentConfigDialog({
  open,
  onOpenChange,
  config,
  onSave,
  mode = 'edit', // 默认为编辑模式
}: EquipmentConfigDialogProps) {
  const [formData, setFormData] = useState({
    configName: "",
    configType: "通用",
    applicableScope: "",
    targetScope: "",
    status: "启用",
    
    // 基本配置
    maxAdvanceBookingDays: 30,
    requireApproval: true,
    allowWeekends: false,
    maxBookingDuration: 8,
    minBookingDuration: 1,
    emailNotifications: true,
    autoApproval: false,
    maxConcurrentBookings: 1,
    cancellationDeadline: 24,
    
    // 时间段配置
    bookingTimeSlots: ["09:00-12:00", "13:00-17:00"],
    
    // 审核配置
    approvalWorkflow: {
      level1: [] as string[],
      level2: [] as string[],
      autoApprovalConditions: [] as string[]
    },
    
    // 通知配置
    notificationSettings: {
      bookingConfirmation: true,
      reminderBeforeBooking: true,
      reminderHours: 2,
      cancellationNotification: true,
      statusChangeNotification: true
    },
    
    // 使用限制
    usageRestrictions: {
      allowedUserRoles: [],
      allowedDepartments: [],
      trainingRequired: false,
      certificationRequired: false
    }
  })

  const [newTimeSlot, setNewTimeSlot] = useState("")

  useEffect(() => {
    if (config) {
      setFormData({
        ...config,
        bookingTimeSlots: config.bookingTimeSlots || ["09:00-12:00", "13:00-17:00"],
        approvalWorkflow: config.approvalWorkflow || { level1: [] as string[], level2: [] as string[], autoApprovalConditions: [] as string[] },
        notificationSettings: config.notificationSettings || {
          bookingConfirmation: true,
          reminderBeforeBooking: true,
          reminderHours: 2,
          cancellationNotification: true,
          statusChangeNotification: true
        },
        usageRestrictions: config.usageRestrictions || {
          allowedUserRoles: [],
          allowedDepartments: [],
          trainingRequired: false,
          certificationRequired: false
        }
      })
    } else if (mode === 'view') {
      // 查看模式的演示数据
      setFormData({
        configName: "分析仪器专用预约配置",
        configType: "自定义",
        applicableScope: "仪器类别",
        targetScope: "分析仪器",
        status: "启用",
        maxAdvanceBookingDays: 30,
        requireApproval: true,
        allowWeekends: false,
        maxBookingDuration: 8,
        minBookingDuration: 1,
        emailNotifications: true,
        autoApproval: false,
        maxConcurrentBookings: 1,
        cancellationDeadline: 24,
        bookingTimeSlots: ["09:00-12:00", "13:00-17:00", "19:00-21:00"],
        approvalWorkflow: { 
          level1: ["zhang.san", "li.si"] as string[], 
          level2: ["prof.chen"] as string[], 
          autoApprovalConditions: [] as string[] 
        },
        notificationSettings: {
          bookingConfirmation: true,
          reminderBeforeBooking: true,
          reminderHours: 2,
          cancellationNotification: true,
          statusChangeNotification: true
        },
        usageRestrictions: {
          allowedUserRoles: [],
          allowedDepartments: [],
          trainingRequired: true,
          certificationRequired: true
        }
      })
    } else {
      // 重置为默认值
      setFormData({
        configName: "",
        configType: "通用",
        applicableScope: "",
        targetScope: "",
        status: "启用",
        maxAdvanceBookingDays: 30,
        requireApproval: true,
        allowWeekends: false,
        maxBookingDuration: 8,
        minBookingDuration: 1,
        emailNotifications: true,
        autoApproval: false,
        maxConcurrentBookings: 1,
        cancellationDeadline: 24,
        bookingTimeSlots: ["09:00-12:00", "13:00-17:00"],
        approvalWorkflow: { level1: [] as string[], level2: [] as string[], autoApprovalConditions: [] as string[] },
        notificationSettings: {
          bookingConfirmation: true,
          reminderBeforeBooking: true,
          reminderHours: 2,
          cancellationNotification: true,
          statusChangeNotification: true
        },
        usageRestrictions: {
          allowedUserRoles: [],
          allowedDepartments: [],
          trainingRequired: false,
          certificationRequired: false
        }
      })
    }
  }, [config, mode])

  const handleSave = () => {
    if (!formData.configName) {
      toast({
        title: "请填写必填项",
        description: "配置名称不能为空",
        variant: "destructive",
      })
      return
    }

    if (formData.configType === "自定义" && (!formData.applicableScope || !formData.targetScope)) {
      toast({
        title: "请填写必填项",
        description: "自定义配置需要指定适用范围",
        variant: "destructive",
      })
      return
    }

    onSave(formData)
  }

  const addTimeSlot = () => {
    if (newTimeSlot && !formData.bookingTimeSlots.includes(newTimeSlot)) {
      setFormData({
        ...formData,
        bookingTimeSlots: [...formData.bookingTimeSlots, newTimeSlot]
      })
      setNewTimeSlot("")
    }
  }

  const removeTimeSlot = (index: number) => {
    setFormData({
      ...formData,
      bookingTimeSlots: formData.bookingTimeSlots.filter((_, i) => i !== index)
    })
  }

  return (
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {mode === 'view' ? "查看仪器预约配置" : (config ? "编辑仪器预约配置" : "新建仪器预约配置")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="basic" className="h-full flex flex-col">
                      <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                基本配置
              </TabsTrigger>
              <TabsTrigger value="approval" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                审核流程
              </TabsTrigger>
              <TabsTrigger value="notification" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                通知设置
              </TabsTrigger>
              <TabsTrigger value="restrictions" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                使用限制
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-1 py-2">

              <TabsContent value="basic" className="space-y-6">
                <Card>
              <CardHeader>
                <CardTitle>配置信息</CardTitle>
                <CardDescription>配置基本信息和适用范围</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="configName">配置名称 *</Label>
                    <Input
                      id="configName"
                      value={formData.configName}
                      onChange={(e) => setFormData({ ...formData, configName: e.target.value })}
                      placeholder="请输入配置名称"
                      readOnly={mode === 'view'}
                      className={mode === 'view' ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">设备状态</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })} disabled={mode === 'view'}>
                      <SelectTrigger className={mode === 'view' ? "bg-muted" : ""}>
                        <SelectValue placeholder="选择设备状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="启用">启用</SelectItem>
                        <SelectItem value="禁用">禁用</SelectItem>
                        <SelectItem value="草稿">草稿</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="configType">配置类型</Label>
                    <Select value={formData.configType} onValueChange={(value) => setFormData({ ...formData, configType: value })} disabled={mode === 'view'}>
                      <SelectTrigger className={mode === 'view' ? "bg-muted" : ""}>
                        <SelectValue placeholder="选择配置类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="通用">通用</SelectItem>
                        <SelectItem value="自定义">自定义</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      {formData.configType === "通用" && "通用规则将应用于所有仪器的预约配置"}
                      {formData.configType === "自定义" && "自定义配置仅应用于指定的仪器，优先级高于通用规则"}
                    </div>
                  </div>
                </div>

                {formData.configType === "自定义" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="applicableScope">适用范围 *</Label>
                      <Select 
                        value={formData.applicableScope} 
                        onValueChange={(value) => setFormData({ ...formData, applicableScope: value })} 
                        disabled={mode === 'view'}
                      >
                        <SelectTrigger className={mode === 'view' ? "bg-muted" : ""}>
                          <SelectValue placeholder="选择适用范围" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="指定仪器">指定仪器</SelectItem>
                          <SelectItem value="仪器类别">仪器类别</SelectItem>
                          <SelectItem value="实验室">实验室</SelectItem>
                          <SelectItem value="部门">部门</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.applicableScope && (
                      <div className="space-y-2">
                        <Label htmlFor="targetScope">
                          {formData.applicableScope === "指定仪器" && "选择仪器"}
                          {formData.applicableScope === "仪器类别" && "选择类别"}
                          {formData.applicableScope === "实验室" && "选择实验室"}
                          {formData.applicableScope === "部门" && "选择部门"}
                        </Label>
                        <Select 
                          value={formData.targetScope} 
                          onValueChange={(value) => setFormData({ ...formData, targetScope: value })} 
                          disabled={mode === 'view'}
                        >
                          <SelectTrigger className={mode === 'view' ? "bg-muted" : ""}>
                            <SelectValue placeholder={`请选择${formData.applicableScope}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.applicableScope === "指定仪器" && (
                              <>
                                <SelectItem value="EQ001">气相色谱-质谱联用仪 (EQ001)</SelectItem>
                                <SelectItem value="EQ002">万能试验机 (EQ002)</SelectItem>
                                <SelectItem value="EQ003">荧光光谱仪 (EQ003)</SelectItem>
                                <SelectItem value="EQ004">电化学工作站 (EQ004)</SelectItem>
                              </>
                            )}
                            {formData.applicableScope === "仪器类别" && (
                              <>
                                <SelectItem value="分析仪器">分析仪器</SelectItem>
                                <SelectItem value="光学仪器">光学仪器</SelectItem>
                                <SelectItem value="电子仪器">电子仪器</SelectItem>
                                <SelectItem value="物理仪器">物理仪器</SelectItem>
                              </>
                            )}
                            {formData.applicableScope === "实验室" && (
                              <>
                                <SelectItem value="分析实验室A">分析实验室A栋</SelectItem>
                                <SelectItem value="材料实验室B">材料实验室B栋</SelectItem>
                                <SelectItem value="光学实验室C">光学实验室C栋</SelectItem>
                              </>
                            )}
                            {formData.applicableScope === "部门" && (
                              <>
                                <SelectItem value="化学系">化学系</SelectItem>
                                <SelectItem value="物理系">物理系</SelectItem>
                                <SelectItem value="材料系">材料系</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>预约规则</CardTitle>
                <CardDescription>设置预约的基本规则和限制</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAdvanceBookingDays">最大提前预约天数</Label>
                    <Input
                      id="maxAdvanceBookingDays"
                      type="number"
                      value={formData.maxAdvanceBookingDays}
                      onChange={(e) => setFormData({ ...formData, maxAdvanceBookingDays: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="365"
                      readOnly={mode === 'view'}
                      className={mode === 'view' ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBookingDuration">最大预约时长（小时）</Label>
                    <Input
                      id="maxBookingDuration"
                      type="number"
                      value={formData.maxBookingDuration}
                      onChange={(e) => setFormData({ ...formData, maxBookingDuration: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="24"
                      readOnly={mode === 'view'}
                      className={mode === 'view' ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minBookingDuration">最小预约时长（小时）</Label>
                    <Input
                      id="minBookingDuration"
                      type="number"
                      value={formData.minBookingDuration}
                      onChange={(e) => setFormData({ ...formData, minBookingDuration: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="24"
                      readOnly={mode === 'view'}
                      className={mode === 'view' ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxConcurrentBookings">最大并发预约数</Label>
                    <Input
                      id="maxConcurrentBookings"
                      type="number"
                      value={formData.maxConcurrentBookings}
                      onChange={(e) => setFormData({ ...formData, maxConcurrentBookings: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="10"
                      readOnly={mode === 'view'}
                      className={mode === 'view' ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancellationDeadline">取消预约截止时间（小时）</Label>
                    <Input
                      id="cancellationDeadline"
                      type="number"
                      value={formData.cancellationDeadline}
                      onChange={(e) => setFormData({ ...formData, cancellationDeadline: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="72"
                      readOnly={mode === 'view'}
                      className={mode === 'view' ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>需要审核</Label>
                      <div className="text-sm text-muted-foreground">
                        开启后，预约申请需要管理员审核
                      </div>
                    </div>
                    <Switch
                      checked={formData.requireApproval}
                      onCheckedChange={(checked) => setFormData({ ...formData, requireApproval: checked })}
                      disabled={mode === 'view'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>允许周末预约</Label>
                      <div className="text-sm text-muted-foreground">
                        开启后，用户可在周末进行预约
                      </div>
                    </div>
                    <Switch
                      checked={formData.allowWeekends}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowWeekends: checked })}
                      disabled={mode === 'view'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>自动审核</Label>
                      <div className="text-sm text-muted-foreground">
                        满足条件时自动通过审核
                      </div>
                    </div>
                    <Switch
                      checked={formData.autoApproval}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoApproval: checked })}
                      disabled={mode === 'view'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>邮件通知</Label>
                      <div className="text-sm text-muted-foreground">
                        发送预约相关的邮件通知
                      </div>
                    </div>
                    <Switch
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                      disabled={mode === 'view'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>预约时间段</CardTitle>
                <CardDescription>设置可预约的时间段</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mode !== 'view' && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="例如：09:00-12:00"
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                    />
                    <Button onClick={addTimeSlot} size="sm">
                      <Plus className="h-4 w-4" />
                      添加
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {formData.bookingTimeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{slot}</span>
                      {mode !== 'view' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

              <TabsContent value="approval" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>审核流程配置</CardTitle>
                    <CardDescription>设置预约申请的审核流程和自动审批规则</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>启用审核流程</Label>
                          <div className="text-sm text-muted-foreground">
                            预约申请需要经过审核才能确认
                          </div>
                        </div>
                        <Switch
                          checked={formData.requireApproval}
                          onCheckedChange={(checked) => 
                            setFormData({
                              ...formData,
                              requireApproval: checked
                            })
                          }
                          disabled={mode === 'view'}
                        />
                      </div>

                      {formData.requireApproval && (
                        <>
                          <Separator />
                          
                          <div className="space-y-4">
                            <div>
                              <Label className="text-base font-medium">一级审核人员</Label>
                              <div className="text-sm text-muted-foreground mb-3">
                                设置首级审核人员，通常为实验室管理员或设备负责人
                              </div>
                              <div className="space-y-2">
                                {mode !== 'view' && (
                                  <Select
                                    onValueChange={(value) => {
                                      const currentApprovers = formData.approvalWorkflow.level1 || []
                                      if (!currentApprovers.includes(value)) {
                                        setFormData({
                                          ...formData,
                                          approvalWorkflow: {
                                            ...formData.approvalWorkflow,
                                            level1: [...currentApprovers, value]
                                          }
                                        })
                                      }
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="选择审核人员" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="zhang.san">张三 - 实验室主任</SelectItem>
                                      <SelectItem value="li.si">李四 - 设备管理员</SelectItem>
                                      <SelectItem value="wang.wu">王五 - 技术负责人</SelectItem>
                                      <SelectItem value="zhao.liu">赵六 - 安全管理员</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                                
                                <div className="flex flex-wrap gap-2">
                                  {(formData.approvalWorkflow.level1 || []).map((approver, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                      {approver === "zhang.san" && "张三"}
                                      {approver === "li.si" && "李四"}
                                      {approver === "wang.wu" && "王五"}
                                      {approver === "zhao.liu" && "赵六"}
                                      {mode !== 'view' && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 hover:bg-destructive/20"
                                          onClick={() => {
                                            setFormData({
                                              ...formData,
                                              approvalWorkflow: {
                                                ...formData.approvalWorkflow,
                                                level1: formData.approvalWorkflow.level1.filter((_, i) => i !== index)
                                              }
                                            })
                                          }}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-base font-medium">二级审核人员（可选）</Label>
                              <div className="text-sm text-muted-foreground mb-3">
                                对于高价值设备或特殊实验，可设置二级审核
                              </div>
                              <div className="space-y-2">
                                {mode !== 'view' && (
                                  <Select
                                    onValueChange={(value) => {
                                      const currentApprovers = formData.approvalWorkflow.level2 || []
                                      if (!currentApprovers.includes(value)) {
                                        setFormData({
                                          ...formData,
                                          approvalWorkflow: {
                                            ...formData.approvalWorkflow,
                                            level2: [...currentApprovers, value]
                                          }
                                        })
                                      }
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="选择二级审核人员" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="prof.chen">陈教授 - 学科负责人</SelectItem>
                                      <SelectItem value="prof.liu">刘教授 - 实验室主任</SelectItem>
                                      <SelectItem value="prof.zhou">周教授 - 安全委员</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                                
                                <div className="flex flex-wrap gap-2">
                                  {(formData.approvalWorkflow.level2 || []).map((approver, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                      {approver === "prof.chen" && "陈教授"}
                                      {approver === "prof.liu" && "刘教授"}
                                      {approver === "prof.zhou" && "周教授"}
                                      {mode !== 'view' && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 hover:bg-destructive/20"
                                          onClick={() => {
                                            setFormData({
                                              ...formData,
                                              approvalWorkflow: {
                                                ...formData.approvalWorkflow,
                                                level2: formData.approvalWorkflow.level2.filter((_, i) => i !== index)
                                              }
                                            })
                                          }}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <div>
                              <Label className="text-base font-medium">自动审批规则</Label>
                              <div className="text-sm text-muted-foreground mb-3">
                                满足条件的预约申请可以自动通过审批
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>内部人员自动审批</Label>
                                <div className="text-sm text-muted-foreground">
                                  本实验室成员的预约申请自动审批
                                </div>
                              </div>
                              <Switch
                                checked={formData.autoApproval}
                                onCheckedChange={(checked) => 
                                  setFormData({
                                    ...formData,
                                    autoApproval: checked
                                  })
                                }
                                disabled={mode === 'view'}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="autoApprovalTime">自动审批时间段</Label>
                                <Select disabled={mode === 'view'}>
                                  <SelectTrigger className={mode === 'view' ? "bg-muted" : ""}>
                                    <SelectValue placeholder="选择时间段" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="work_hours">工作时间（9:00-17:00）</SelectItem>
                                    <SelectItem value="extended_hours">延长时间（8:00-20:00）</SelectItem>
                                    <SelectItem value="all_hours">全天24小时</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="maxAutoApprovalDuration">自动审批最长时长（小时）</Label>
                                <Input
                                  id="maxAutoApprovalDuration"
                                  type="number"
                                  placeholder="4"
                                  min="1"
                                  max="24"
                                  readOnly={mode === 'view'}
                                  className={mode === 'view' ? "bg-muted" : ""}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notification" className="space-y-6">
                <Card>
              <CardHeader>
                <CardTitle>通知设置</CardTitle>
                <CardDescription>配置各种通知的发送规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>预约确认通知</Label>
                      <div className="text-sm text-muted-foreground">
                        预约成功后发送确认通知
                      </div>
                    </div>
                    <Switch
                      checked={formData.notificationSettings.bookingConfirmation}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          notificationSettings: {
                            ...formData.notificationSettings,
                            bookingConfirmation: checked
                          }
                        })
                      }
                      disabled={mode === 'view'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>预约前提醒</Label>
                      <div className="text-sm text-muted-foreground">
                        在预约开始前发送提醒
                      </div>
                    </div>
                    <Switch
                      checked={formData.notificationSettings.reminderBeforeBooking}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          notificationSettings: {
                            ...formData.notificationSettings,
                            reminderBeforeBooking: checked
                          }
                        })
                      }
                      disabled={mode === 'view'}
                    />
                  </div>

                  {formData.notificationSettings.reminderBeforeBooking && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="reminderHours">提前提醒时间（小时）</Label>
                      <Input
                        id="reminderHours"
                        type="number"
                        value={formData.notificationSettings.reminderHours}
                        onChange={(e) => 
                          setFormData({
                            ...formData,
                            notificationSettings: {
                              ...formData.notificationSettings,
                              reminderHours: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        min="0"
                        max="72"
                        className={`w-32 ${mode === 'view' ? "bg-muted" : ""}`}
                        readOnly={mode === 'view'}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>取消通知</Label>
                      <div className="text-sm text-muted-foreground">
                        预约被取消时发送通知
                      </div>
                    </div>
                    <Switch
                      checked={formData.notificationSettings.cancellationNotification}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          notificationSettings: {
                            ...formData.notificationSettings,
                            cancellationNotification: checked
                          }
                        })
                      }
                      disabled={mode === 'view'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>状态变更通知</Label>
                      <div className="text-sm text-muted-foreground">
                        预约状态发生变化时发送通知
                      </div>
                    </div>
                    <Switch
                      checked={formData.notificationSettings.statusChangeNotification}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          notificationSettings: {
                            ...formData.notificationSettings,
                            statusChangeNotification: checked
                          }
                        })
                      }
                      disabled={mode === 'view'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

              <TabsContent value="restrictions" className="space-y-6">
                <Card>
              <CardHeader>
                <CardTitle>使用限制</CardTitle>
                <CardDescription>设置设备的使用权限和限制条件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>需要培训</Label>
                      <div className="text-sm text-muted-foreground">
                        用户需要完成培训才能预约
                      </div>
                    </div>
                    <Switch
                      checked={formData.usageRestrictions.trainingRequired}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          usageRestrictions: {
                            ...formData.usageRestrictions,
                            trainingRequired: checked
                          }
                        })
                      }
                      disabled={mode === 'view'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>需要认证</Label>
                      <div className="text-sm text-muted-foreground">
                        用户需要通过认证才能预约
                      </div>
                    </div>
                    <Switch
                      checked={formData.usageRestrictions.certificationRequired}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          usageRestrictions: {
                            ...formData.usageRestrictions,
                            certificationRequired: checked
                          }
                        })
                      }
                      disabled={mode === 'view'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {mode === 'view' ? '关闭' : '取消'}
          </Button>
          {mode !== 'view' && (
            <Button onClick={handleSave}>
              保存配置
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}