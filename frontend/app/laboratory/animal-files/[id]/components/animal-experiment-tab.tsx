"use client"

import { useState } from "react"
import { Calendar, Clock, FlaskConical, User, AlertCircle, ChevronDown, ChevronRight, Activity, Pill, FileText, Plus, Microscope, Target, Shield, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { format } from "date-fns"

interface AnimalExperimentTabProps {
  data: any
}

export default function AnimalExperimentTab({ data }: AnimalExperimentTabProps) {
  const [expandedRecords, setExpandedRecords] = useState<string[]>([])

  // 模拟实验记录数据
  const experimentRecords = [
    {
      id: "exp-001",
      experimentDate: "2024-01-20",
      experimentType: "药效学试验",
      projectId: "PROJ-2024-001",
      projectName: "新型镇痛药物安全性评估",
      researcher: "张教授",
      assistant: "赵技师",
      // 实验前准备
      fastingHours: "12",
      premedication: "生理盐水预处理",
      anesthesia: "吸入麻醉",
      anesthesiaDosage: "异氟烷 2%",
      // 实验过程
      procedure: "腹腔注射给药，观察镇痛效果，记录行为学变化。使用热板法测定痛阈值变化，每30分钟记录一次数据。",
      duration: "180",
      sampleType: "血液",
      sampleAmount: "0.5ml",
      administrationRoute: "腹腔注射",
      dosage: "10mg/kg",
      // 观察记录
      vitalSigns: "心率: 450次/分, 呼吸频率: 140次/分, 体温: 36.8°C",
      behavioralChanges: "给药后30分钟活动度略有下降，2小时后恢复正常",
      adverseEvents: "无明显不良反应",
      complications: "无并发症",
      // 实验结果
      outcomes: "镇痛效果明显，痛阈值提高约40%，持续时间3小时",
      measurements: "痛阈值: 给药前52±3秒，给药后1h 73±5秒，2h 69±4秒，3h 58±3秒",
      dataCollected: "行为学数据已存储至实验数据库 EXP-DB-001",
      specimens: "血样编号: BS-2024-001, 保存于-80°C冰箱",
      // 术后处理
      postCare: "术后密切观察24小时，提供充足水食",
      painManagement: "给予布洛芬镇痛处理",
      monitoring: "每2小时观察一次生命体征",
      recovery: "术后6小时完全恢复正常活动",
      // 伦理合规
      ethicsApproval: "IACUC-2024-001",
      animalWelfare: "严格按照3R原则执行，确保动物福利",
      humaneEndpoint: "如出现严重痛苦或体重下降>20%立即终止",
      // 其他信息
      notes: "实验顺利完成，数据质量良好，动物状态稳定",
      nextExperiment: "2024-01-27",
      followUp: "继续观察7天，记录任何延迟反应",
      status: "已完成"
    },
    {
      id: "exp-002",
      experimentDate: "2024-01-13",
      experimentType: "毒理学试验",
      projectId: "PROJ-2024-002",
      projectName: "化合物急性毒性评估",
      researcher: "李博士",
      assistant: "钱助理",
      fastingHours: "16",
      premedication: "无",
      anesthesia: "无麻醉",
      anesthesiaDosage: "无",
      procedure: "经口给药，观察急性毒性反应。给药后连续观察14天，记录体重变化、临床症状、死亡率等指标。",
      duration: "30",
      sampleType: "血液、组织",
      sampleAmount: "血液1ml，肝、肾组织各100mg",
      administrationRoute: "口服",
      dosage: "500mg/kg",
      vitalSigns: "给药前后生命体征稳定",
      behavioralChanges: "给药后2小时出现轻微活动度下降，24小时后恢复",
      adverseEvents: "轻微胃肠道反应，腹泻1次",
      complications: "无严重并发症",
      outcomes: "未观察到明显急性毒性，LD50>500mg/kg",
      measurements: "体重变化: -0.5g (第1天), +0.3g (第3天), +0.8g (第7天)",
      dataCollected: "毒理学数据库 TOX-DB-002",
      specimens: "组织样本编号: TS-2024-002, 病理学检查中",
      postCare: "加强营养支持，监测体重变化",
      painManagement: "无需镇痛",
      monitoring: "前3天每日观察，后续每3天观察一次",
      recovery: "给药后48小时完全恢复",
      ethicsApproval: "IACUC-2024-002",
      animalWelfare: "提供丰富化环境，减少应激",
      humaneEndpoint: "体重下降>15%或出现严重症状",
      notes: "动物耐受性良好，符合预期结果",
      nextExperiment: "2024-01-27",
      followUp: "14天观察期结束后进行组织病理学检查",
      status: "观察中"
    },
    {
      id: "exp-003",
      experimentDate: "2024-01-06",
      experimentType: "行为学试验",
      projectId: "PROJ-2024-003",
      projectName: "认知功能评估研究",
      researcher: "王医生",
      assistant: "孙学生",
      fastingHours: "0",
      premedication: "适应性训练3天",
      anesthesia: "无麻醉",
      anesthesiaDosage: "无",
      procedure: "Morris水迷宫实验，测试空间学习记忆能力。连续训练5天，每天4次试验，记录逃逸潜伏期和游泳路径。",
      duration: "45",
      sampleType: "无",
      sampleAmount: "无",
      administrationRoute: "无给药",
      dosage: "无",
      vitalSigns: "实验期间生命体征正常",
      behavioralChanges: "学习能力正常，逃逸潜伏期逐日缩短",
      adverseEvents: "无不良反应",
      complications: "无",
      outcomes: "认知功能正常，空间记忆能力良好",
      measurements: "第1天潜伏期58±12秒，第5天潜伏期15±3秒",
      dataCollected: "行为学视频数据已存档，编号BV-2024-003",
      specimens: "无样本采集",
      postCare: "实验后吹干被毛，保温处理",
      painManagement: "无需镇痛",
      monitoring: "实验期间持续观察",
      recovery: "无需恢复期",
      ethicsApproval: "IACUC-2024-003",
      animalWelfare: "控制水温26±1°C，避免应激",
      humaneEndpoint: "如出现游泳困难立即救援",
      notes: "实验数据可靠，动物配合度良好",
      nextExperiment: "2024-01-20",
      followUp: "间隔2周后进行记忆保持测试",
      status: "已完成"
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "已完成": { className: "bg-green-50 text-green-700 border-green-200" },
      "进行中": { className: "bg-blue-50 text-blue-700 border-blue-200" },
      "观察中": { className: "bg-amber-50 text-amber-700 border-amber-200" },
      "已暂停": { className: "bg-gray-50 text-gray-700 border-gray-200" },
      "已终止": { className: "bg-red-50 text-red-700 border-red-200" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["已完成"]
    return <Badge className={config.className}>{status}</Badge>
  }

  const getExperimentTypeIcon = (type: string) => {
    switch (type) {
      case "药效学试验":
        return <Pill className="h-4 w-4 text-blue-500" />
      case "毒理学试验":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "药代动力学试验":
        return <Activity className="h-4 w-4 text-purple-500" />
      case "行为学试验":
        return <Target className="h-4 w-4 text-green-500" />
      case "外科手术":
        return <Microscope className="h-4 w-4 text-orange-500" />
      default:
        return <FlaskConical className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 实验概况 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">实验概况</span>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => window.open(`/laboratory/animal-files/experiment/${data.id}`, "_self")}
            >
              <Plus className="h-4 w-4" />
              新增实验记录
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{experimentRecords.length}</div>
              <div className="text-sm text-blue-700">总实验次数</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {experimentRecords.filter(r => r.status === "已完成").length}
              </div>
              <div className="text-sm text-green-700">已完成</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {experimentRecords.filter(r => r.status === "观察中").length}
              </div>
              <div className="text-sm text-amber-700">观察中</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {experimentRecords[0]?.experimentDate ? format(new Date(experimentRecords[0].experimentDate), "MM/dd") : "未知"}
              </div>
              <div className="text-sm text-purple-700">最近实验</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 实验记录列表 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">实验记录历史</span>
            <div className="text-sm text-gray-500">
              共 {experimentRecords.length} 条记录
            </div>
          </div>
          
          <div className="space-y-3">
            {experimentRecords.map((record) => (
              <Collapsible key={record.id}>
                <Card className="border border-gray-200">
                  <CollapsibleTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getExperimentTypeIcon(record.experimentType)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{record.experimentType}</span>
                              {getStatusBadge(record.status)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              实验时间: {format(new Date(record.experimentDate), "yyyy年MM月dd日")} · 主实验员: {record.researcher}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              项目: {record.projectName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right text-sm text-gray-500">
                            <div>时长: {record.duration}分钟</div>
                            <div>给药: {record.administrationRoute}</div>
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
                              <span className="text-gray-500">实验日期:</span>
                              <span>{format(new Date(record.experimentDate), "yyyy-MM-dd")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">实验类型:</span>
                              <span>{record.experimentType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">项目编号:</span>
                              <span>{record.projectId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">主实验员:</span>
                              <span>{record.researcher}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">实验助手:</span>
                              <span>{record.assistant}</span>
                            </div>
                          </div>
                        </div>

                        {/* 实验前准备 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-500" />
                            实验前准备
                          </h4>
                          <div className="space-y-2 text-sm">
                            {record.fastingHours && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">禁食时间:</span>
                                <span>{record.fastingHours}小时</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-500">预处理:</span>
                              <span>{record.premedication || "无"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">麻醉方式:</span>
                              <span>{record.anesthesia || "无"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">麻醉剂量:</span>
                              <span>{record.anesthesiaDosage || "无"}</span>
                            </div>
                          </div>
                        </div>

                        {/* 实验过程 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-green-500" />
                            实验过程
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">实验时长:</span>
                              <span>{record.duration}分钟</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">给药途径:</span>
                              <span>{record.administrationRoute || "无给药"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">给药剂量:</span>
                              <span>{record.dosage || "无"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">样品类型:</span>
                              <span>{record.sampleType || "无采样"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">采样量:</span>
                              <span>{record.sampleAmount || "无"}</span>
                            </div>
                          </div>
                        </div>

                        {/* 观察记录 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-orange-500" />
                            观察记录
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">生命体征:</span>
                              <p className="mt-1">{record.vitalSigns}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">行为变化:</span>
                              <p className="mt-1">{record.behavioralChanges}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">不良事件:</span>
                              <p className="mt-1">{record.adverseEvents}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">并发症:</span>
                              <p className="mt-1">{record.complications}</p>
                            </div>
                          </div>
                        </div>

                        {/* 实验结果 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            实验结果
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">实验结果:</span>
                              <p className="mt-1">{record.outcomes}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">测量数据:</span>
                              <p className="mt-1">{record.measurements}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">数据存储:</span>
                              <p className="mt-1">{record.dataCollected}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">标本信息:</span>
                              <p className="mt-1">{record.specimens}</p>
                            </div>
                          </div>
                        </div>

                        {/* 术后处理 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-500" />
                            术后处理
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">术后护理:</span>
                              <p className="mt-1">{record.postCare}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">疼痛管理:</span>
                              <p className="mt-1">{record.painManagement}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">监护要求:</span>
                              <p className="mt-1">{record.monitoring}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">恢复情况:</span>
                              <p className="mt-1">{record.recovery}</p>
                            </div>
                          </div>
                        </div>

                        {/* 伦理合规 */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-purple-500" />
                            伦理合规
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">伦理审批号:</span>
                              <span>{record.ethicsApproval}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">动物福利:</span>
                              <p className="mt-1">{record.animalWelfare}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">人道终点:</span>
                              <p className="mt-1">{record.humaneEndpoint}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 实验程序详情 */}
                      <div className="mt-6 space-y-3">
                        <h4 className="font-medium text-gray-900">实验程序</h4>
                        <div className="text-sm bg-gray-50 p-3 rounded-lg">
                          <p>{record.procedure}</p>
                        </div>
                      </div>

                      {/* 其他信息 */}
                      <div className="mt-6 space-y-3">
                        <h4 className="font-medium text-gray-900">其他信息</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">后续安排:</span>
                            <p className="mt-1">{record.followUp}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">下次实验:</span>
                            <p className="mt-1">{record.nextExperiment ? format(new Date(record.nextExperiment), "yyyy-MM-dd") : "未安排"}</p>
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