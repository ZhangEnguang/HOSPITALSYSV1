"use client"

import { useState } from "react"
import { 
  Calendar, 
  FileText, 
  User, 
  Award, 
  Medal, 
  BarChart,
  Users,
  ChevronDown,
  ChevronUp,
  Link,
  GitBranch,
  Building
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from "framer-motion"
import AISummary from "@/app/achievements/achievement-awards/[id]/components/ai-summary"

interface AchievementAwardOverviewTabProps {
  data: any
}

export default function AchievementAwardOverviewTab({ data }: AchievementAwardOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI 摘要 */}
      <AISummary data={data} />
      
      {/* 基本信息 */}
      <BasicInfo data={data} />
      
      {/* 获奖信息 */}
      <AwardInfo data={data} />
      
      {/* 完成人员 */}
      <TeamInfo data={data} />
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
                    <h4 className="text-sm font-medium text-slate-500 mb-1">成果名称</h4>
                    <p className="text-slate-900">{data.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">奖项级别</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                        {data.level}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">获奖状态</h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          data.status === "已获奖"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : data.status === "申报中"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {data.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">所属项目</h4>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-slate-400" />
                      <Link className="text-primary hover:underline" href={`/projects/${data.project.id}`}>
                        {data.project.name}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">获奖日期</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{data.date || "未获奖"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">颁奖机构</h4>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span>{data.venue || "未知"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">奖项名称</h4>
                    <div className="flex items-center gap-2">
                      <Medal className="h-4 w-4 text-slate-400" />
                      <span>{data.awardName || "未知"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">完成人数</h4>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{data.coAuthors ? data.coAuthors.length + 1 : 1} 人</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">成果描述</h4>
                <p className="text-slate-700 text-sm leading-relaxed">{data.description}</p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// 获奖信息组件
function AwardInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 模拟获奖详情数据
  const awardDetails = {
    awardCategory: data.level === "国家级" ? "国家科学技术奖" : 
                  data.level === "省部级" ? "省级科学技术奖" : 
                  data.level === "市厅级" ? "市级科学技术奖" : "其他奖项",
    awardGrade: data.awardName.includes("一等奖") ? "一等奖" : 
               data.awardName.includes("二等奖") ? "二等奖" : 
               data.awardName.includes("三等奖") ? "三等奖" : "特等奖",
    certificateNo: `${data.date?.split('-')[0]}-${data.level.charAt(0)}${data.id.padStart(3, '0')}`,
    applicationDate: data.date ? new Date(new Date(data.date).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : "未知",
    evaluationDate: data.date ? new Date(new Date(data.date).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : "未知",
    awardDate: data.date,
    awardingBody: data.venue,
    contribution: "该成果在相关领域具有重要的理论意义和应用价值，推动了行业技术进步和创新发展。",
    innovationPoints: [
      "提出了新型的技术架构和解决方案",
      "解决了行业关键技术难题",
      "实现了技术的产业化应用"
    ]
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>获奖详情</span>
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
                {/* 奖项信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">奖项类别</h4>
                      <p className="text-slate-700">{awardDetails.awardCategory}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">奖项等级</h4>
                      <p className="text-slate-700">{awardDetails.awardGrade}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">证书编号</h4>
                      <p className="text-slate-700">{awardDetails.certificateNo}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">颁奖单位</h4>
                      <p className="text-slate-700">{awardDetails.awardingBody}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">申报日期</h4>
                      <p className="text-slate-700">{awardDetails.applicationDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">评审日期</h4>
                      <p className="text-slate-700">{awardDetails.evaluationDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">获奖日期</h4>
                      <p className="text-slate-700">{awardDetails.awardDate}</p>
                    </div>
                  </div>
                </div>
                
                {/* 贡献说明 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">成果贡献</h4>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <p className="text-slate-700 text-sm leading-relaxed">{awardDetails.contribution}</p>
                  </div>
                </div>
                
                {/* 创新点 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">主要创新点</h4>
                  <div className="space-y-2">
                    {awardDetails.innovationPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="mt-1 h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 text-sm">{point}</p>
                      </div>
                    ))}
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

// 完成人员组件
function TeamInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 合并主要完成人和其他完成人
  const allMembers = [
    { name: data.author.name, title: "第一完成人", affiliation: "计算机科学学院", contribution: "负责项目的总体设计和技术架构" },
    ...(data.coAuthors || []).map((author, index) => ({
      name: author.name,
      title: `第${index + 2}完成人`,
      affiliation: "计算机科学学院",
      contribution: index === 0 ? "负责核心算法研发" : 
                   index === 1 ? "负责系统实现和测试" : 
                   index === 2 ? "负责数据分析和处理" : 
                   "负责项目其他工作"
    }))
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>完成人员</span>
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
                {allMembers.map((member, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-lg">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          <Badge variant="secondary" className="text-xs">{member.title}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">{member.affiliation}</p>
                      </div>
                    </div>
                    <div className="md:ml-4 flex-1">
                      <div className="bg-slate-50 p-2 rounded text-sm text-slate-700">
                        <span className="font-medium text-slate-900">贡献：</span>
                        {member.contribution}
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
