"use client"

import { useState } from "react"
import { 
  Calendar, 
  FileText, 
  User, 
  Award, 
  ClipboardCheck, 
  BarChart,
  Users,
  ChevronDown,
  ChevronUp,
  Link,
  GitBranch
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from "framer-motion"
import AISummary from "@/app/achievements/evaluated-achievements/[id]/components/ai-summary"

interface EvaluatedAchievementOverviewTabProps {
  data: any
}

export default function EvaluatedAchievementOverviewTab({ data }: EvaluatedAchievementOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI 摘要 */}
      <AISummary data={data} />
      
      {/* 基本信息 */}
      <BasicInfo data={data} />
      
      {/* 作者信息 */}
      <AuthorInfo data={data} />
      
      {/* 鉴定详情 */}
      <AppraisalDetails data={data} />
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
                    <h4 className="text-sm font-medium text-slate-500 mb-1">鉴定级别</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                        {data.level}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">鉴定状态</h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          data.status === "已鉴定"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : data.status === "鉴定中"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {data.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">鉴定机构</h4>
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-slate-400" />
                      <span>{data.venue || "未知"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">鉴定日期</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{data.date || "未鉴定"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">鉴定编号</h4>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>{data.appraisalNumber || "无"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">鉴定结果</h4>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-slate-400" />
                      <span>{data.appraisalResult || "待定"}</span>
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

// 作者信息组件
function AuthorInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 合并主要作者和合著者
  const allAuthors = [
    { name: data.author.name, title: "主要负责人", affiliation: "计算机科学学院" },
    ...(data.coAuthors || []).map(author => ({
      name: author.name,
      title: "参与人员",
      affiliation: "计算机科学学院"
    }))
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>参与人员</span>
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
                {allAuthors.map((author, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-lg">
                      {author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{author.name}</p>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">主要负责人</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{author.title} · {author.affiliation}</p>
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

// 鉴定详情组件
function AppraisalDetails({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 模拟鉴定详情数据
  const appraisalDetails = {
    committee: [
      { name: "张教授", title: "主任委员", organization: "中国科学院" },
      { name: "李教授", title: "委员", organization: "清华大学" },
      { name: "王教授", title: "委员", organization: "北京大学" },
    ],
    criteria: [
      { name: "技术创新性", score: 95, comment: "该成果在技术上具有较高的创新性" },
      { name: "应用价值", score: 90, comment: "该成果具有较高的应用价值和推广前景" },
      { name: "科学性", score: 88, comment: "该成果具有较高的科学性和严谨性" },
      { name: "完整性", score: 92, comment: "该成果体系完整，结构合理" },
    ],
    conclusion: data.appraisalResult || "该成果整体达到国内领先水平，具有较高的学术价值和应用前景。",
    recommendations: "建议进一步完善相关技术，加强成果转化和推广应用。"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>鉴定详情</span>
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
                {/* 鉴定委员会 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">鉴定委员会</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {appraisalDetails.committee.map((member, index) => (
                      <div key={index} className="bg-slate-50 p-3 rounded-md">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-slate-500">{member.title}</div>
                        <div className="text-xs text-slate-400">{member.organization}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 鉴定标准 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">鉴定评分</h4>
                  <div className="space-y-3">
                    {appraisalDetails.criteria.map((criterion, index) => (
                      <div key={index} className="bg-white border border-slate-200 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{criterion.name}</span>
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                            {criterion.score}分
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{criterion.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 鉴定结论 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">鉴定结论</h4>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                    <p className="text-slate-700">{appraisalDetails.conclusion}</p>
                  </div>
                </div>
                
                {/* 建议 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">改进建议</h4>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                    <p className="text-slate-700">{appraisalDetails.recommendations}</p>
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
