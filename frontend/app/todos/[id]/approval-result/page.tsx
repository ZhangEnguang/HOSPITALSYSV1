"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, ArrowLeft, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ApprovalResultDialog } from "../../../components/approval-result-dialog"

function ApprovalResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get("action") as "approval" | "rejection"
  const projectId = searchParams.get("id") || ""
  const projectTitle = searchParams.get("title") || "未命名项目"

  const [dialogOpen, setDialogOpen] = useState(true)

  // 如果对话框关闭，重定向到项目列表
  useEffect(() => {
    if (!dialogOpen) {
      router.push("/todos")
    }
  }, [dialogOpen, router])

  const handleBackToList = () => {
    router.push("/todos")
  }

  const handleViewDetails = () => {
    router.push(`/todos/${projectId}`)
  }

  return (
    <div className="container mx-auto py-8">
      {/* 使用对话框组件 */}
      <ApprovalResultDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={projectId}
        projectTitle={decodeURIComponent(projectTitle)}
        action={action}
        onBackToList={handleBackToList}
        onViewDetails={handleViewDetails}
      />

      {/* 备用内容，通常不会显示，因为对话框会占据主要交互 */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${action === "approval" ? "bg-green-50" : "bg-amber-50"}`}>
              {action === "approval" ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <XCircle className="h-12 w-12 text-amber-500" />
              )}
            </div>
          </div>
          <CardTitle className="text-center text-xl">{action === "approval" ? "审核通过" : "已退回修改"}</CardTitle>
          <CardDescription className="text-center">
            项目 "{decodeURIComponent(projectTitle)}" {action === "approval" ? "已审核通过" : "已退回修改"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <ListChecks className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-slate-800">项目详情</h3>
                <p className="text-sm text-slate-500 mt-1">项目ID: {projectId}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
          <Button onClick={handleViewDetails}>查看详情</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function ApprovalResultPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">加载中...</div>}>
      <ApprovalResultContent />
    </Suspense>
  )
}

