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
  BookMarked,
  Hash,
  DollarSign,
  Globe,
  BookText
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from "framer-motion"
import AISummary from "@/app/achievements/academic-books/[id]/components/ai-summary"

interface AcademicBookOverviewTabProps {
  data: any
}

export default function AcademicBookOverviewTab({ data }: AcademicBookOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI 摘要 */}
      <AISummary data={data} />
      
      {/* 基本信息 */}
      <BasicInfo data={data} />
      
      {/* 作者信息 */}
      <AuthorInfo data={data} />

      {/* 章节信息 */}
      <ChaptersInfo data={data} />
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
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <BookMarked className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">出版社</p>
                      <p className="font-medium">{data.publisher}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">出版日期</p>
                      <p className="font-medium">{data.publishDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <Hash className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">ISBN</p>
                      <p className="font-medium">{data.isbn}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">页数</p>
                      <p className="font-medium">{data.pages} 页</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <BookOpen className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">版次</p>
                      <p className="font-medium">{data.edition}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <BookText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">分类</p>
                      <p className="font-medium">{data.category} / {data.subcategory}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <DollarSign className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">定价</p>
                      <p className="font-medium">¥ {data.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <Globe className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">语言</p>
                      <p className="font-medium">{data.language}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart className="h-5 w-5 text-blue-600" />
                      <p className="font-medium text-blue-700">销量数据</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-blue-600">累计销量</p>
                      <p className="font-medium text-blue-700">{data.sales} 册</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <p className="font-medium text-purple-700">学术影响</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-purple-600">引用次数</p>
                      <p className="font-medium text-purple-700">{data.citations} 次</p>
                    </div>
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

// 作者信息组件
function AuthorInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 合并主要作者和合著者
  const allAuthors = [
    { name: data.author.name, title: "主编", affiliation: "计算机科学学院" },
    ...(data.coAuthors || [])
  ]

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
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            主编
                          </Badge>
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

// 章节信息组件
function ChaptersInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>章节信息</span>
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
              <div className="space-y-3">
                {data.chapters && data.chapters.map((chapter: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-md hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-slate-600 font-medium">
                        {index + 1}
                      </div>
                      <p className="font-medium">{chapter.title}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      {chapter.pages} 页
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
