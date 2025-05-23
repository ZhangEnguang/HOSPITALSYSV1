"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, FileText, CheckCircle, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { users } from "../config/reagent-config"
import { allDemoReagentItems } from "../data/reagent-demo-data"

// 模拟申领记录数据
const mockApplications = [
  {
    id: "app-001",
    reagentId: allDemoReagentItems[0].id,
    reagentName: allDemoReagentItems[0].name,
    reagentEnglishName: allDemoReagentItems[0].englishName,
    amount: 250,
    unit: allDemoReagentItems[0].unit,
    applicationDate: "2023/11/15",
    applicantId: "1",
    applicant: users[0],
    project: "人工智能安全研究项目",
    reason: "用于色谱分析实验，研究纳米颗粒的表面特性",
    status: "已批准",
    processDate: "2023/11/16",
    processor: users[2],
    comments: "符合申请要求，批准使用",
  },
  {
    id: "app-002",
    reagentId: allDemoReagentItems[1].id,
    reagentName: allDemoReagentItems[1].name,
    reagentEnglishName: allDemoReagentItems[1].englishName,
    amount: 500,
    unit: allDemoReagentItems[1].unit,
    applicationDate: "2023/11/10",
    applicantId: "4",
    applicant: users[3],
    project: "新型纳米材料开发",
    reason: "用于溶解纳米材料前体，合成新型导电材料",
    status: "已批准",
    processDate: "2023/11/11",
    processor: users[2],
    comments: "按需分配，请注意安全使用",
  },
  {
    id: "app-003",
    reagentId: allDemoReagentItems[2].id,
    reagentName: allDemoReagentItems[2].name,
    reagentEnglishName: allDemoReagentItems[2].englishName,
    amount: 10,
    unit: allDemoReagentItems[2].unit,
    applicationDate: "2023/11/18",
    applicantId: "5",
    applicant: users[4],
    project: "肿瘤标志物检测技术",
    reason: "用于蛋白质样品消化，分析肿瘤特异性标志物",
    status: "审核中",
    processDate: "",
    processor: null,
    comments: "",
  },
  {
    id: "app-004",
    reagentId: allDemoReagentItems[3].id,
    reagentName: allDemoReagentItems[3].name,
    reagentEnglishName: allDemoReagentItems[3].englishName,
    amount: 20,
    unit: allDemoReagentItems[3].unit,
    applicationDate: "2023/11/08",
    applicantId: "2",
    applicant: users[1],
    project: "肿瘤标志物检测技术",
    reason: "用于免疫荧光染色，检测特定细胞表面蛋白",
    status: "已拒绝",
    processDate: "2023/11/09",
    processor: users[2],
    comments: "该试剂即将过期，不建议用于重要实验",
  },
  {
    id: "app-005",
    reagentId: allDemoReagentItems[4].id,
    reagentName: allDemoReagentItems[4].name,
    reagentEnglishName: allDemoReagentItems[4].englishName,
    amount: 50,
    unit: allDemoReagentItems[4].unit,
    applicationDate: "2023/11/20",
    applicantId: "3",
    applicant: users[2],
    project: "环境污染物降解研究",
    reason: "用于重金属离子检测实验",
    status: "审核中",
    processDate: "",
    processor: null,
    comments: "",
  },
]

export default function ReagentApplicationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  // 根据tab过滤申请记录
  const filteredApplications = mockApplications.filter(app => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return app.status === "审核中"
    if (activeTab === "approved") return app.status === "已批准"
    if (activeTab === "rejected") return app.status === "已拒绝"
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "已批准":
        return <Badge className="bg-green-500">已批准</Badge>
      case "已拒绝":
        return <Badge variant="destructive">已拒绝</Badge>
      case "审核中":
        return <Badge variant="secondary">审核中</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已批准":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "已拒绝":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "审核中":
        return <Clock className="h-5 w-5 text-gray-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">试剂申领管理</h1>
        <Button onClick={() => router.push("/laboratory/reagent")}>
          返回试剂列表
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>申领记录</CardTitle>
          <CardDescription>
            查看和管理试剂申领记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">全部申请</TabsTrigger>
              <TabsTrigger value="pending">审核中</TabsTrigger>
              <TabsTrigger value="approved">已批准</TabsTrigger>
              <TabsTrigger value="rejected">已拒绝</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  没有找到符合条件的申领记录
                </div>
              ) : (
                filteredApplications.map((application) => (
                  <Card key={application.id} className="overflow-hidden">
                    <div className="flex items-center border-b border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="mr-3">{getStatusIcon(application.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">
                            {application.reagentName}
                            <span className="ml-2 text-sm text-muted-foreground">
                              {application.reagentEnglishName}
                            </span>
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          申请编号: {application.id} | 申请日期: {application.applicationDate}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">申领数量</p>
                          <p className="font-medium">{application.amount} {application.unit}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">所属项目</p>
                          <p className="font-medium">{application.project}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">申请人</p>
                          <p className="font-medium">{application.applicant.name} ({application.applicant.role})</p>
                        </div>
                        {application.processor && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">审批人</p>
                            <p className="font-medium">{application.processor.name}</p>
                          </div>
                        )}
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm text-muted-foreground">申领原因</p>
                          <p>{application.reason}</p>
                        </div>
                        {application.comments && (
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-sm text-muted-foreground">审批意见</p>
                            <p>{application.comments}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => router.push(`/laboratory/reagent/${application.reagentId}`)}
                        >
                          查看试剂详情
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 