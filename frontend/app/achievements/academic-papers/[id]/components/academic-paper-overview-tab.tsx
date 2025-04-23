"use client"

import { useState } from "react"
import { 
  Calendar, 
  FileText, 
  User, 
  Award, 
  BookOpen, 
  BarChart,
  Users,
  ChevronDown,
  ChevronUp,
  Link
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from "framer-motion"
import AISummary from "@/app/achievements/academic-papers/[id]/components/ai-summary"

interface AcademicPaperOverviewTabProps {
  data: any
}

export default function AcademicPaperOverviewTab({ data }: AcademicPaperOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI 摘要 */}
      <AISummary data={data} />
      
      {/* 基本信息 */}
      <BasicInfo data={data} />
      
      {/* 作者信息 */}
      <AuthorInfo data={data} />
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
            className="h-8 w-8 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">论文级别</p>
                    <div className="font-medium">
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                        {data.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">发表期刊</p>
                    <p className="font-medium">{data.venue}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">发表日期</p>
                    <p className="font-medium">{data.date || "未发表"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">论文状态</p>
                    <div className="font-medium">
                      <Badge 
                        className={
                          data.status === "已发表" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : data.status === "审核中" 
                              ? "bg-amber-50 text-amber-700 border-amber-200" 
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {data.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <BarChart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">影响因子</p>
                    <p className="font-medium">{data.impact || "未知"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <Link className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">引用次数</p>
                    <p className="font-medium">{data.citations || 0}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">附件数量</p>
                    <p className="font-medium">{data.attachments || 0} 个附件</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="text-sm font-medium mb-3">论文摘要</h4>
                <p className="text-sm text-slate-600">{data.description || "无论文摘要"}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// 作者信息组件
function AuthorInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>作者信息</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <h4 className="text-sm font-medium mb-3">第一作者</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                    {data.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{data.author.name}</p>
                    <p className="text-xs text-slate-500">第一作者</p>
                  </div>
                </div>
              </div>
              
              {data.coAuthors && data.coAuthors.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="text-sm font-medium mb-3">合作作者</h4>
                    <div className="space-y-3">
                      {data.coAuthors.map((author: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                            {author.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{author.name}</p>
                            <p className="text-xs text-slate-500">合作作者 {index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">作者贡献：</span> 本论文共有 {data.coAuthors ? data.coAuthors.length + 1 : 1} 位作者参与，第一作者负责论文的主要研究工作和论文撰写。
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
