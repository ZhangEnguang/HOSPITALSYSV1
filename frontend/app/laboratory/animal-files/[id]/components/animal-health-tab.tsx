"use client"

import { useState } from "react"
import { Calendar, Clock, Heart, User, AlertCircle, ChevronDown, ChevronRight, Thermometer, Activity, Eye, Stethoscope, Pill, FileText, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { format } from "date-fns"

interface AnimalHealthTabProps {
  data: any
}

export default function AnimalHealthTab({ data }: AnimalHealthTabProps) {
  const [expandedRecords, setExpandedRecords] = useState<string[]>([])

  // 模拟健康记录数据
  const healthRecords = [
    {
      id: "hr-001",
      checkDate: "2024-01-15",
      checker: "张医生",
      checkType: "定期检查",
      nextCheckDate: "2024-02-15",
      // 生理指标
      weight: "20.5g",
      temperature: "37.2°C",
      heartRate: "480次/分",
      respiratoryRate: "150次/分",
      bloodPressure: "正常",
      // 健康状态
      generalCondition: "良好",
      appetite: "正常",
      activityLevel: "活跃",
      mentalState: "机敏",
      // 体格检查
      coat: "光泽、清洁",
      eyes: "明亮、无分泌物",
      ears: "清洁、无异味",
      nose: "湿润、无分泌物",
      mouth: "牙齿整齐、牙龈粉红",
      limbs: "活动正常、无跛行",
      // 实验室检查
      bloodTest: "血常规正常",
      urineTest: "尿常规正常",
      fecalTest: "粪检正常",
      otherTests: "无异常",
      // 诊疗记录
      symptoms: "无异常症状",
      diagnosis: "健康",
      treatment: "无需治疗",
      medication: "无",
      // 其他信息
      followUp: "继续常规观察",
      advice: "保持当前饲养条件",
      notes: "动物健康状况良好，各项指标正常",
      images: [],
      status: "健康"
    },
    {
      id: "hr-002",
      checkDate: "2024-01-08",
      checker: "李医生",
      checkType: "周期检查",
      nextCheckDate: "2024-01-15",
      weight: "20.1g",
      temperature: "37.0°C",
      heartRate: "475次/分",
      respiratoryRate: "148次/分",
      bloodPressure: "正常",
      generalCondition: "良好",
      appetite: "正常",
      activityLevel: "活跃",
      mentalState: "机敏",
      coat: "光泽",
      eyes: "明亮",
      ears: "清洁",
      nose: "湿润",
      mouth: "正常",
      limbs: "正常",
      bloodTest: "正常",
      urineTest: "正常",
      fecalTest: "正常",
      otherTests: "无",
      symptoms: "无",
      diagnosis: "健康",
      treatment: "无",
      medication: "无",
      followUp: "定期检查",
      advice: "继续观察",
      notes: "继续保持良好状态",
      images: [],
      status: "健康"
    },
    {
      id: "hr-003",
      checkDate: "2024-01-01",
      checker: "王医生",
      checkType: "初次检查",
      nextCheckDate: "2024-01-08",
      weight: "19.8g",
      temperature: "36.8°C",
      heartRate: "470次/分",
      respiratoryRate: "145次/分",
      bloodPressure: "正常",
      generalCondition: "良好",
      appetite: "正常",
      activityLevel: "正常",
      mentalState: "正常",
      coat: "正常",
      eyes: "正常",
      ears: "正常",
      nose: "正常",
      mouth: "正常",
      limbs: "正常",
      bloodTest: "正常",
      urineTest: "正常",
      fecalTest: "正常",
      otherTests: "无",
      symptoms: "无",
      diagnosis: "健康",
      treatment: "无",
      medication: "无",
      followUp: "建立档案后定期检查",
      advice: "适应新环境",
      notes: "新入动物，健康状况良好",
      images: [],
      status: "健康"
    }
  ]

  const toggleRecord = (recordId: string) => {
    setExpandedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "健康": { className: "bg-green-50 text-green-700 border-green-200" },
      "观察中": { className: "bg-amber-50 text-amber-700 border-amber-200" },
      "治疗中": { className: "bg-blue-50 text-blue-700 border-blue-200" },
      "隔离": { className: "bg-red-50 text-red-700 border-red-200" },
      "异常": { className: "bg-orange-50 text-orange-700 border-orange-200" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["健康"]
    return <Badge className={config.className}>{status}</Badge>
  }

  const getCheckTypeIcon = (type: string) => {
    switch (type) {
      case "定期检查":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "周期检查":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "初次检查":
        return <Heart className="h-4 w-4 text-purple-500" />
      case "特殊检查":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Stethoscope className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 健康概况 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">健康概况</span>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => window.open(`/laboratory/animal-files/health/${data.id}`, "_self")}
            >
              <Plus className="h-4 w-4" />
              新增健康记录
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{healthRecords.length}</div>
              <div className="text-sm text-green-700">总检查次数</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.weight}g</div>
              <div className="text-sm text-blue-700">当前体重</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {healthRecords[0]?.status || data.status}
              </div>
              <div className="text-sm text-purple-700">健康状态</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {healthRecords[0]?.checkDate ? format(new Date(healthRecords[0].checkDate), "MM/dd") : "未知"}
              </div>
              <div className="text-sm text-amber-700">最后检查</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 健康记录列表 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">健康记录历史</span>
            <div className="text-sm text-gray-500">
              共 {healthRecords.length} 条记录
            </div>
          </div>
          
          <div className="space-y-3">
            {healthRecords.map((record) => (
              <Collapsible key={record.id}>
                <Card className="border border-gray-200">
                  <CollapsibleTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getCheckTypeIcon(record.checkType)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{record.checkType}</span>
                              {getStatusBadge(record.status)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              检查时间: {format(new Date(record.checkDate), "yyyy年MM月dd日")} · 检查人员: {record.checker}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right text-sm text-gray-500">
                            <div>体重: {record.weight}</div>
                            <div>体温: {record.temperature}</div>
                          </div>
                          {expandedRecords.includes(record.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* 基本信息 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            基本信息
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">检查日期:</span>
                              <span>{format(new Date(record.checkDate), "yyyy-MM-dd")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">检查人员:</span>
                              <span>{record.checker}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">检查类型:</span>
                              <span>{record.checkType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">下次检查:</span>
                              <span>{format(new Date(record.nextCheckDate), "yyyy-MM-dd")}</span>
                            </div>
                          </div>
                        </div>

                        {/* 生理指标 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-red-500" />
                            生理指标
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">体重:</span>
                              <span>{record.weight}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">体温:</span>
                              <span>{record.temperature}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">心率:</span>
                              <span>{record.heartRate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">呼吸频率:</span>
                              <span>{record.respiratoryRate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">血压:</span>
                              <span>{record.bloodPressure}</span>
                            </div>
                          </div>
                        </div>

                        {/* 健康状态 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            健康状态
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">一般状况:</span>
                              <span>{record.generalCondition}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">食欲:</span>
                              <span>{record.appetite}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">活动能力:</span>
                              <span>{record.activityLevel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">精神状态:</span>
                              <span>{record.mentalState}</span>
                            </div>
                          </div>
                        </div>

                        {/* 体格检查 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-purple-500" />
                            体格检查
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">被毛:</span>
                              <span>{record.coat}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">眼睛:</span>
                              <span>{record.eyes}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">耳朵:</span>
                              <span>{record.ears}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">鼻子:</span>
                              <span>{record.nose}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">口腔:</span>
                              <span>{record.mouth}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">四肢:</span>
                              <span>{record.limbs}</span>
                            </div>
                          </div>
                        </div>

                        {/* 实验室检查 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-blue-500" />
                            实验室检查
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">血液检查:</span>
                              <span>{record.bloodTest}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">尿液检查:</span>
                              <span>{record.urineTest}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">粪便检查:</span>
                              <span>{record.fecalTest}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">其他检查:</span>
                              <span>{record.otherTests}</span>
                            </div>
                          </div>
                        </div>

                        {/* 诊疗记录 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Pill className="h-4 w-4 text-orange-500" />
                            诊疗记录
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">症状描述:</span>
                              <span>{record.symptoms}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">诊断结果:</span>
                              <span>{record.diagnosis}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">治疗措施:</span>
                              <span>{record.treatment}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">用药记录:</span>
                              <span>{record.medication}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 其他信息 */}
                      <div className="mt-6 space-y-3">
                        <h4 className="font-medium text-gray-900">其他信息</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">随访安排:</span>
                            <p className="mt-1">{record.followUp}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">医疗建议:</span>
                            <p className="mt-1">{record.advice}</p>
                          </div>
                        </div>
                        {record.notes && (
                          <div className="text-sm">
                            <span className="text-gray-500">备注信息:</span>
                            <p className="mt-1 text-gray-700">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
} 