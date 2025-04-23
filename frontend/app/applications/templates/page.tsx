"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Globe,
  School,
  FlaskRoundIcon as Flask,
  Cpu,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 模板数据
const templates = [
  {
    id: "nsfc",
    name: "国家自然科学基金年度申报",
    title: "2025年度国家自然科学基金项目",
    icon: <Flask className="h-8 w-8 text-blue-500" />,
    category: "国家级",
    duration: "每年3月1日-3月20日",
    description: "国家自然科学基金委员会年度常规项目申报",
    tags: ["面上项目", "青年项目", "重点项目", "形式审查", "限项管理"],
    details: {
      cycle: "每年3月1日-3月20日（系统自动按年度+1更新）",
      fundingScope: ["面上项目：60-100万元", "青年项目：20-30万元", "重点项目：300-500万元"],
      materials: ["申请书（模板自动挂接最新版）", "申请人简历（在线生成）", "伦理审查证明（需上传）"],
      keyDates: ["校内截止：3月10日（可修改）", "形式审查：3月11-15日", "提交基金委：3月20日"],
      specialRequirements: ["限项说明：高级职称限2项（根据年度政策自动更新）", "合作单位盖章：需提前10个工作日申请"],
    },
  },
  {
    id: "provincial-rd",
    name: "省级重点研发计划申报",
    title: "2025Q2浙江省重点研发计划",
    icon: <Cpu className="h-8 w-8 text-purple-500" />,
    category: "省部级",
    duration: "每季度首月1日-10日",
    description: "省科技厅季度重点研发计划项目申报",
    tags: ["人工智能", "生物医药", "新材料", "预评审", "限额推荐"],
    details: {
      cycle: "每季度首月1日-10日（例：Q2为4月1日-10日）",
      fundingScope: ["人工智能：200-500万元", "生物医药：100-300万元", "新材料：150-400万元"],
      materials: ["可行性报告（省科技厅模板）", "预算书（财务处预审）", "联合申报协议（自动生成范本）"],
      processRules: ["校内预评审：季度首月5日前（可调整）", "限额推荐：每个学院限报3项", "公示要求：校内公示至少3天"],
    },
  },
  {
    id: "university-youth",
    name: "校级青年基金申报",
    title: "2025年度XX大学青年科研启动基金",
    icon: <School className="h-8 w-8 text-green-500" />,
    category: "校级",
    duration: "每年9月1日-9月30日",
    description: "面向青年教师的校级科研启动资金",
    tags: ["青年教师", "启动资金", "新入职", "专家评审"],
    details: {
      cycle: "每年9月1日-9月30日",
      fundingTarget: ["年龄≤35岁", "新入职3年内教师"],
      fundingAmount: ["理工科：10-20万元", "文科：5-10万元"],
      materials: ["研究计划书（校级模板）", "导师推荐信（仅限博士后）", "职称证明（人事处自动核验）"],
      reviewProcess: ["形式审查：10月1-7日", "专家评审：10月8-20日", "结果公示：10月25日"],
    },
  },
  {
    id: "international",
    name: "国际合作专项申报",
    title: "2025年度中德联合研究计划",
    icon: <Globe className="h-8 w-8 text-amber-500" />,
    category: "国际合作",
    duration: "指南发布后1周内",
    description: "中德科技合作联合研究项目",
    tags: ["国际合作", "双语申报", "伦理审查", "外方合作"],
    details: {
      trigger: '科技部发布"中德合作指南"后1周内',
      fundingFocus: ["新能源技术", "高端装备制造"],
      materials: ["中外双方案（中英文）", "德方合作意向书", "预算（欧元/人民币双版本）"],
      specialReminders: ["校内截止：指南截止前20天（自动推算）", "伦理审查：涉及人体实验需提前2个月"],
    },
  },
]

// 最近使用的模板
const recentTemplates = [
  templates[0], // 国家自然科学基金
  templates[2], // 校级青年基金
]

// 推荐模板
const recommendedTemplates = [
  templates[1], // 省级重点研发计划
  templates[3], // 国际合作专项
]

export default function TemplatesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // 过滤模板
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // 根据标签页过滤
  const displayTemplates =
    activeTab === "all"
      ? filteredTemplates
      : activeTab === "recent"
        ? recentTemplates.filter((template) => filteredTemplates.includes(template))
        : recommendedTemplates.filter((template) => filteredTemplates.includes(template))

  // 使用模板
  const handleUseTemplate = (templateId: string) => {
    console.log("使用模板创建申报批次:", templateId)
    // 使用router.push而不是router.replace，确保页面重新加载
    router.push(`/applications/create?template=${templateId}`)
  }

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">申报模板库</h1>
        </div>
      </div>

      {/* 搜索和标签页 */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索模板..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">全部模板</TabsTrigger>
            <TabsTrigger value="recent">最近使用</TabsTrigger>
            <TabsTrigger value="recommended">推荐模板</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 模板列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayTemplates.length > 0 ? (
          displayTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {template.icon}
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">{template.category}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {template.id === "nsfc" && "每年3月"}
                    {template.id === "provincial-rd" && "每季度首月"}
                    {template.id === "university-youth" && "每年9月"}
                    {template.id === "international" && "指南发布后"}
                  </span>
                </div>
                <Button variant="default" size="sm" className="gap-1" onClick={() => handleUseTemplate(template.id)}>
                  使用模板
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">未找到匹配的模板</h3>
            <p className="text-sm text-muted-foreground max-w-md">尝试使用不同的关键词或浏览全部模板列表</p>
          </div>
        )}
      </div>
    </div>
  )
}

