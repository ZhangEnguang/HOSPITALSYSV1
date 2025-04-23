"use client"

import { useState } from "react"
import { 
  Calendar, 
  FileText, 
  User, 
  Lightbulb, 
  BookOpen, 
  BarChart,
  Users,
  ChevronDown,
  ChevronUp,
  Link,
  GitBranch,
  Building,
  FileCheck,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from "framer-motion"
import AISummary from "@/app/achievements/patents/[id]/components/ai-summary"

interface PatentOverviewTabProps {
  data: any
}

export default function PatentOverviewTab({ data }: PatentOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI 摘要 */}
      <AISummary data={data} />
      
      {/* 基本信息 */}
      <BasicInfo data={data} />
      
      {/* 专利详情 */}
      <PatentDetails data={data} />
      
      {/* 发明人员 */}
      <InventorsInfo data={data} />
    </div>
  )
}

// 基本信息组件
function BasicInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>基本信息</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">专利名称</h4>
                    <p className="text-slate-900">{data.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">专利类型</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                        {data.patentType || "发明专利"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">专利状态</h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          data.status === "已授权"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : data.status === "申请中"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : data.status === "已公开"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {data.status || "申请中"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">所属项目</h4>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-slate-400" />
                      <Link className="text-primary hover:underline" href={`/projects/${data.project?.id || "#"}`}>
                        {data.project?.name || "未关联项目"}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">专利号</h4>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>{data.patentNumber || "CN123456789A"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">申请日期</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{data.applicationDate || data.date}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">授权日期</h4>
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-slate-400" />
                      <span>{data.grantDate || (data.status === "已授权" ? "2024-03-15" : "尚未授权")}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">发明人数</h4>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{data.coAuthors ? data.coAuthors.length + 1 : 1} 人</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">专利摘要</h4>
                <p className="text-slate-700 text-sm leading-relaxed">{data.description}</p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// 专利详情组件
function PatentDetails({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 模拟专利详情数据
  const patentDetails = {
    patentType: data.patentType || "发明专利",
    applicationNumber: data.patentNumber?.replace(/[A-Z]/g, "") || "123456789",
    applicationDate: data.applicationDate || data.date,
    publicationNumber: data.patentNumber || "CN123456789A",
    publicationDate: data.publicationDate || new Date(new Date(data.applicationDate || data.date).getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    grantNumber: data.status === "已授权" ? (data.patentNumber?.replace("A", "B") || "CN123456789B") : "尚未授权",
    grantDate: data.grantDate || (data.status === "已授权" ? "2024-03-15" : "尚未授权"),
    applicant: "智能平台科技有限公司",
    ipcClassification: "G06F 16/00",
    agent: "北京专利代理有限公司",
    agentNumber: "11000",
    examiner: "李明",
    priorityData: "无",
    abstractFigure: "图1",
    legalStatus: data.status || "申请中",
    technicalField: "本发明涉及计算机技术领域，特别是涉及一种数据处理方法及系统。",
    backgroundArt: "随着信息技术的发展，数据处理系统在各个领域得到了广泛应用。然而，现有技术中的数据处理方法存在效率低下、准确性不足等问题。",
    inventionContent: "本发明提供了一种新的数据处理方法及系统，能够高效、准确地处理大量数据，解决了现有技术中存在的问题。",
    implementationMode: "本发明通过创新的算法和架构设计，实现了数据的高效处理和分析，具体实施方式包括数据采集、预处理、分析和输出等环节。",
    beneficialEffects: "本发明相比现有技术，具有处理速度快、准确率高、资源消耗少等优点，能够显著提升数据处理效率。"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>专利详情</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="space-y-6">
                {/* 专利基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">专利类型</h4>
                      <p className="text-slate-700">{patentDetails.patentType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">申请号</h4>
                      <p className="text-slate-700">{patentDetails.applicationNumber}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">申请日期</h4>
                      <p className="text-slate-700">{patentDetails.applicationDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">公开号</h4>
                      <p className="text-slate-700">{patentDetails.publicationNumber}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">公开日期</h4>
                      <p className="text-slate-700">{patentDetails.publicationDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">授权号</h4>
                      <p className="text-slate-700">{patentDetails.grantNumber}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">授权日期</h4>
                      <p className="text-slate-700">{patentDetails.grantDate}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">申请人</h4>
                      <p className="text-slate-700">{patentDetails.applicant}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">IPC分类号</h4>
                      <p className="text-slate-700">{patentDetails.ipcClassification}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">代理机构</h4>
                      <p className="text-slate-700">{patentDetails.agent}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">代理机构代码</h4>
                      <p className="text-slate-700">{patentDetails.agentNumber}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">审查员</h4>
                      <p className="text-slate-700">{patentDetails.examiner}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">优先权数据</h4>
                      <p className="text-slate-700">{patentDetails.priorityData}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">法律状态</h4>
                      <p className="text-slate-700">
                        <Badge
                          className={
                            patentDetails.legalStatus === "已授权"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : patentDetails.legalStatus === "申请中"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : patentDetails.legalStatus === "已公开"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {patentDetails.legalStatus}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* 技术领域 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">技术领域</h4>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <p className="text-slate-700 text-sm leading-relaxed">{patentDetails.technicalField}</p>
                  </div>
                </div>
                
                {/* 背景技术 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">背景技术</h4>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <p className="text-slate-700 text-sm leading-relaxed">{patentDetails.backgroundArt}</p>
                  </div>
                </div>
                
                {/* 发明内容 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">发明内容</h4>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <p className="text-slate-700 text-sm leading-relaxed">{patentDetails.inventionContent}</p>
                  </div>
                </div>
                
                {/* 实施方式 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">具体实施方式</h4>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <p className="text-slate-700 text-sm leading-relaxed">{patentDetails.implementationMode}</p>
                  </div>
                </div>
                
                {/* 有益效果 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">有益效果</h4>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <p className="text-slate-700 text-sm leading-relaxed">{patentDetails.beneficialEffects}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// 发明人员组件
function InventorsInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 合并主要发明人和其他发明人
  const allInventors = [
    { name: data.author.name, title: "第一发明人", affiliation: "计算机科学学院", contribution: "负责发明的总体设计和技术方案" },
    ...(data.coAuthors || []).map((author, index) => ({
      name: author.name,
      title: `第${index + 2}发明人`,
      affiliation: "计算机科学学院",
      contribution: index === 0 ? "负责核心算法设计" : 
                   index === 1 ? "负责系统实现和测试" : 
                   index === 2 ? "负责技术分析和验证" : 
                   "负责发明其他工作"
    }))
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>发明人员</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="space-y-4">
                {allInventors.map((inventor, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-lg">
                        {inventor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{inventor.name}</p>
                          <Badge variant="secondary" className="text-xs">{inventor.title}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">{inventor.affiliation}</p>
                      </div>
                    </div>
                    <div className="md:ml-4 flex-1">
                      <div className="bg-slate-50 p-2 rounded text-sm text-slate-700">
                        <span className="font-medium text-slate-900">贡献：</span>
                        {inventor.contribution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
