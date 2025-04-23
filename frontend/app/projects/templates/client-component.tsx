"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Search,
  FlaskRoundIcon as Flask,
  Rocket,
  BookOpen,
  Building,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// 定义模板接口
interface Template {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  tags: string[];
  date: string;
  popular?: boolean;
  recommended?: boolean;
}

// 模板数据
const templates: Template[] = [
  {
    id: "1",
    title: "国家自然科学基金项目",
    icon: <Flask className="h-8 w-8 text-blue-500" />,
    description: "国家自然科学基金委员会年度项目申请模板",
    tags: ["基础研究", "青年项目", "重点项目", "联合基金", "地区基金"],
    date: "每年3月1日-3月20日",
    popular: true,
    recommended: true,
  },
  {
    id: "2",
    title: "国家重点研发计划项目",
    icon: <Rocket className="h-8 w-8 text-purple-500" />,
    description: "科技部重点研发计划项目申报模板",
    tags: ["人工智能", "生物医药", "新材料", "环保节能", "技术转移"],
    date: "每季度首月1日-10日",
    popular: true,
    recommended: false,
  },
  {
    id: "3",
    title: "教育部人文社科项目",
    icon: <BookOpen className="h-8 w-8 text-green-500" />,
    description: "面向高等教育的人文社科研究项目",
    tags: ["青年项目", "后期资助", "新人奖", "专著出版"],
    date: "每年9月1日-9月30日",
    popular: false,
    recommended: true,
  },
  {
    id: "4",
    title: "企业技术开发合同",
    icon: <Building className="h-8 w-8 text-amber-500" />,
    description: "企业间技术开发与合作项目合同模板",
    tags: ["技术合作", "联合开发", "成果转化", "知识产权"],
    date: "随时可用",
    popular: true,
    recommended: false,
  },
  {
    id: "5",
    title: "设备采购合同",
    icon: <ShoppingCart className="h-8 w-8 text-blue-500" />,
    description: "科研设备与物资采购合同标准模板",
    tags: ["设备采购", "试剂耗材", "大型仪器", "进口设备"],
    date: "随时可用",
    popular: false,
    recommended: true,
  },
  {
    id: "6",
    title: "横向科研项目合同",
    icon: <Building className="h-8 w-8 text-orange-500" />,
    description: "高校院所与企业横向合作项目合同",
    tags: ["产学研", "技术服务", "委托开发", "咨询服务"],
    date: "随时可用",
    popular: false,
    recommended: false,
  },
  {
    id: "7",
    title: "国际合作专项项目",
    icon: <Rocket className="h-8 w-8 text-amber-500" />,
    description: "中国科技合作伙伴合作项目",
    tags: ["国际合作", "双边项目", "化学能源", "外方合作"],
    date: "指南发布后申请",
    popular: false,
    recommended: false,
  },
  {
    id: "8",
    title: "省级科技计划项目",
    icon: <Flask className="h-8 w-8 text-green-500" />,
    description: "省级科技厅项目申报模板",
    tags: ["省级项目", "地方特色", "成果转化", "创新平台"],
    date: "每年5月1日-5月31日",
    popular: false,
    recommended: false,
  },
]

// 模板卡片组件
function TemplateCard({ template }: { template: Template }) {
  return (
    <Card className="bg-white overflow-hidden h-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-1">
          <div
            className="p-2 rounded-lg"
            style={{
              background: "rgba(39, 112, 255, 0.1)",
              color: "#2770FF",
            }}
          >
            {template.icon}
          </div>
          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">{template.date}</Badge>
        </div>
        <CardTitle className="text-xl mt-2">{template.title}</CardTitle>
        <CardDescription className="mt-1 line-clamp-2">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="flex flex-wrap gap-2 mt-1">
          {template.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-sm text-muted-foreground">20+ 项目使用</div>
        <Button variant="outline">使用模板</Button>
      </CardFooter>
    </Card>
  )
}

// 主内容组件
function ProjectTemplatesContent() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // 过滤模板
  const filteredTemplates = templates.filter((template) => {
    // 搜索过滤
    if (
      searchTerm &&
      !template.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !template.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false
    }

    // 标签页过滤
    if (activeTab === "popular" && !template.popular) return false
    if (activeTab === "recommended" && !template.recommended) return false

    return true
  })

  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/projects")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">模板库</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="text-base py-3">
              全部模板
            </TabsTrigger>
            <TabsTrigger value="popular" className="text-base py-3">
              最近使用
            </TabsTrigger>
            <TabsTrigger value="recommended" className="text-base py-3">
              推荐模板
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// 导出完整的模板页面组件
export default function TemplatesPage() {
  return (
    <div>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">加载中...</p>
        </div>
      </div>}>
        <ProjectTemplatesContent />
      </Suspense>
    </div>
  )
} 