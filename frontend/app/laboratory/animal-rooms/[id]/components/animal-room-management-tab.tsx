"use client"

import { useState } from "react"
import { Calendar, Clock, FileText, AlertCircle, Tag, Building, MapPin, User, Settings, Package, ChevronDown, ChevronRight, Eye, Users, Activity, Clipboard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { format } from "date-fns"

interface AnimalRoomManagementTabProps {
  data: any
}

// 模拟饲养管理记录数据
const mockManagementRecords = [
  {
    id: "MR-001",
    date: "2024-01-15",
    type: "日常清洁",
    operator: "张三",
    duration: "2小时",
    status: "已完成",
    description: "进行房间全面清洁和消毒，更换饲料和饮水",
    details: {
      cleaningItems: ["笼具清洗", "地面消毒", "通风系统检查"],
      materials: ["消毒液", "清洁剂", "新鲜饲料"],
      notes: "发现通风系统运行正常，动物健康状况良好",
      beforeCondition: "房间有轻微异味，部分笼具需要深度清洁",
      afterCondition: "房间清洁干净，异味消除，环境良好"
    }
  },
  {
    id: "MR-002", 
    date: "2024-01-12",
    type: "健康检查",
    operator: "李四",
    duration: "3小时",
    status: "已完成",
    description: "对房间内所有动物进行健康状况检查和记录",
    details: {
      checkedAnimals: 42,
      healthyCount: 40,
      observationCount: 2,
      issues: ["2只小鼠出现轻微咳嗽症状"],
      treatments: ["隔离观察", "调整饮食"],
      notes: "整体健康状况良好，已对异常动物进行标记和隔离",
      recommendations: ["加强通风", "监控温湿度", "定期健康检查"]
    }
  },
  {
    id: "MR-003",
    date: "2024-01-10", 
    type: "环境维护",
    operator: "王五",
    duration: "4小时",
    status: "已完成",
    description: "检查和维护房间环境控制系统，调整温湿度参数",
    details: {
      maintenanceItems: ["温控系统检查", "湿度调节器校准", "通风管道清洁"],
      beforeParams: { temperature: "23°C", humidity: "60%" },
      afterParams: { temperature: "22°C", humidity: "55%" },
      equipmentStatus: "所有设备运行正常",
      notes: "已将温湿度调整到最适宜范围，设备运行稳定",
      nextMaintenance: "2024-02-10"
    }
  },
  {
    id: "MR-004",
    date: "2024-01-08",
    type: "饲料补充",
    operator: "赵六",
    duration: "1小时",
    status: "已完成", 
    description: "补充房间饲料供应，检查饮水系统",
    details: {
      feedTypes: ["标准小鼠饲料", "营养强化饲料"],
      quantities: ["50kg标准饲料", "20kg强化饲料"],
      waterSystem: "自动饮水系统运行正常",
      consumption: "日均饲料消耗约2.5kg",
      notes: "饲料新鲜，动物食欲正常，饮水系统无异常",
      nextSupply: "2024-01-22"
    }
  },
  {
    id: "MR-005",
    date: "2024-01-05",
    type: "设备检修",
    operator: "孙七",
    duration: "5小时",
    status: "已完成",
    description: "定期设备检修，更换老化部件，升级监控系统",
    details: {
      repairedItems: ["通风扇轴承", "温度传感器", "照明灯具"],
      replacedParts: ["过滤网", "密封条", "控制面板"],
      upgrades: ["新增环境监控摄像头", "升级温控系统软件"],
      cost: "￥2,500",
      notes: "所有设备检修完毕，系统运行更加稳定可靠",
      warranty: "新更换部件保修1年"
    }
  }
]

export default function AnimalRoomManagementTab({ data }: AnimalRoomManagementTabProps) {
  const [expandedRecords, setExpandedRecords] = useState<string[]>([])

  const toggleRecord = (recordId: string) => {
    setExpandedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "日常清洁":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "健康检查":
        return "bg-green-50 text-green-700 border-green-200"
      case "环境维护":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "饲料补充":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "设备检修":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "日常清洁":
        return <Settings className="h-4 w-4" />
      case "健康检查":
        return <Activity className="h-4 w-4" />
      case "环境维护":
        return <Package className="h-4 w-4" />
      case "饲料补充":
        return <Users className="h-4 w-4" />
      case "设备检修":
        return <Settings className="h-4 w-4" />
      default:
        return <Clipboard className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 管理统计 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">管理统计</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">本月清洁次数</div>
              <div className="text-lg font-semibold text-blue-600">8次</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">健康检查次数</div>
              <div className="text-lg font-semibold text-green-600">4次</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">设备维护次数</div>
              <div className="text-lg font-semibold text-orange-600">2次</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">异常事件</div>
              <div className="text-lg font-semibold text-red-600">0次</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 饲养管理记录 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold">饲养管理记录</span>
            </div>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              共 {mockManagementRecords.length} 条记录
            </Badge>
          </div>
          
          <div className="space-y-3">
            {mockManagementRecords.map((record) => (
              <Collapsible key={record.id}>
                <div className="border border-gray-200 rounded-lg">
                  <CollapsibleTrigger 
                    className="w-full p-4 hover:bg-gray-50 transition-colors"
                    onClick={() => toggleRecord(record.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {expandedRecords.includes(record.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          {getTypeIcon(record.type)}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={getTypeColor(record.type)}>
                            {record.type}
                          </Badge>
                          <span className="font-medium text-gray-900">{record.description}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{record.operator}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{record.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{record.date}</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="mt-4 space-y-4">
                        {/* 根据不同类型显示不同的详细信息 */}
                        {record.type === "日常清洁" && record.details && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">清洁项目</div>
                              <div className="flex flex-wrap gap-1">
                                {record.details.cleaningItems?.map((item: string, index: number) => (
                                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">使用材料</div>
                              <div className="flex flex-wrap gap-1">
                                {record.details.materials?.map((material: string, index: number) => (
                                  <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                                    {material}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <div className="text-sm font-medium text-gray-700">清洁前状况</div>
                              <p className="text-sm text-gray-600">{record.details.beforeCondition}</p>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <div className="text-sm font-medium text-gray-700">清洁后状况</div>
                              <p className="text-sm text-gray-600">{record.details.afterCondition}</p>
                            </div>
                          </div>
                        )}
                        
                        {record.type === "健康检查" && record.details && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">检查统计</div>
                              <div className="space-y-1 text-sm">
                                <div>检查动物数: <span className="font-medium">{record.details.checkedAnimals}只</span></div>
                                <div>健康动物: <span className="font-medium text-green-600">{record.details.healthyCount}只</span></div>
                                <div>观察动物: <span className="font-medium text-amber-600">{record.details.observationCount}只</span></div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">发现问题</div>
                              <div className="space-y-1">
                                {record.details.issues?.map((issue: string, index: number) => (
                                  <div key={index} className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                                    {issue}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <div className="text-sm font-medium text-gray-700">处理措施</div>
                              <div className="flex flex-wrap gap-1">
                                {record.details.treatments?.map((treatment: string, index: number) => (
                                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                    {treatment}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {record.type === "环境维护" && record.details && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">维护项目</div>
                              <div className="flex flex-wrap gap-1">
                                {record.details.maintenanceItems?.map((item: string, index: number) => (
                                  <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">参数调整</div>
                              <div className="space-y-1 text-sm">
                                <div>调整前: {record.details.beforeParams?.temperature} / {record.details.beforeParams?.humidity}</div>
                                <div>调整后: <span className="font-medium text-green-600">{record.details.afterParams?.temperature} / {record.details.afterParams?.humidity}</span></div>
                              </div>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <div className="text-sm font-medium text-gray-700">下次维护</div>
                              <p className="text-sm text-gray-600">{record.details.nextMaintenance}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-3 border-t border-gray-100">
                          <div className="text-sm font-medium text-gray-700 mb-2">备注</div>
                          <p className="text-sm text-gray-600">{record.details?.notes}</p>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
} 