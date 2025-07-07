"use client"
import { ClipboardCheck } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ReviewTab from "./review-tab"
import ReviewHistoryTab from "./review-history-tab"
import OperationHistoryTab from "./operation-history-tab"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface ReviewHistoryItem {
  date: string
  user: string
  action: string
  comment: string
  details?: string // 添加详情字段用于展示修改内容
}

interface ReviewSidebarProps {
  status?: string
  getStatusColor?: (status: string) => string
  projectId?: string
  projectTitle?: string
  reviewHistory?: ReviewHistoryItem[]
  operationHistory?: Array<{
    date: string
    user: string
    action: string
    detail: string
  }>
  showReviewTab?: boolean
  showReviewHistoryTab?: boolean
  showOperationHistoryTab?: boolean
  projectData?: any
  returnPath?: string  // 新增：自定义返回路径
}

export default function ReviewSidebar({
  status = "进行中",
  getStatusColor,
  projectId,
  projectTitle,
  reviewHistory = [
    {
      date: "2024-03-15",
      user: "科研院审核员",
      action: "科研院已审核",
      comment: "研究方向符合学校重点发展领域，同意立项",
    },
    { date: "2024-02-20", user: "学院主管", action: "学院已审核", comment: "研究计划合理，推荐上报科研院" },
    { date: "2024-01-10", user: "系统", action: "已创建", comment: "项目申请已提交系统" },
    {
      date: "2023-12-25",
      user: "科研处处长",
      action: "已退回",
      comment: "研究方案需要进一步完善，请修改后重新提交",
      details:
        "1. 研究背景文献综述不够全面，需要补充国内外最新研究进展\n2. 研究方法部分缺乏创新性，建议结合多学科交叉方法\n3. 经费预算中设备采购比例过高，需要调整\n4. 研究团队中缺少跨学科合作人员，建议补充相关领域专家",
    },
    { date: "2023-12-20", user: "项目负责人", action: "已提交", comment: "提交《高校人工智能教学应用研究》项目申请" },
  ],
  operationHistory = [
    { date: "2024-03-18", user: "项目负责人", action: "修改", detail: "更新了研究方法和技术路线" },
    { date: "2024-03-10", user: "研究员张教授", action: "添加", detail: "上传了文献综述报告" },
    { date: "2024-02-28", user: "科研秘书", action: "分配", detail: "将子任务分配给研究团队成员" },
    { date: "2024-02-15", user: "系统", action: "提醒", detail: "项目中期报告提交截止日提醒" },
    { date: "2024-02-01", user: "项目负责人", action: "更新", detail: "调整了研究进度计划" },
  ],
  showReviewTab = true,
  showReviewHistoryTab = true,
  showOperationHistoryTab = true,
  projectData,
  returnPath,
}: ReviewSidebarProps) {
  const router = useRouter()

  // 如果提供了projectData，则从中提取相关信息
  if (projectData) {
    projectId = projectData.id || projectId
    projectTitle = projectData.title || projectTitle
    status = projectData.status || status
    reviewHistory = projectData.approvalHistory || reviewHistory
    operationHistory = projectData.operationHistory || operationHistory
  }

  // 添加状态来控制是否显示审核标签
  const [showReviewTabState, setShowReviewTabState] = useState(showReviewTab)
  // 添加状态来存储审核历史记录
  const [reviewHistoryState, setReviewHistoryState] = useState(reviewHistory)
  // 添加状态来控制默认选中的标签
  const [activeTab, setActiveTab] = useState<string>("review")

  // 添加事件监听器，用于更新审核历史记录和隐藏审核标签
  useEffect(() => {
    const handleUpdateReviewHistory = (event: any) => {
      const { newRecord, hideReviewTab } = event.detail

      // 更新审核历史记录
      if (newRecord) {
        setReviewHistoryState((prev) => [newRecord, ...prev])
      }

      // 隐藏审核标签
      if (hideReviewTab) {
        setShowReviewTabState(false)
        // 自动切换到审核记录标签
        setActiveTab("reviewHistory")
      }
    }

    window.addEventListener("updateReviewHistory", handleUpdateReviewHistory as EventListener)
    return () => {
      window.removeEventListener("updateReviewHistory", handleUpdateReviewHistory as EventListener)
    }
  }, [])

  // 根据状态判断是否应该显示审核标签
  useEffect(() => {
    if (status === "已通过" || status === "已退回") {
      setShowReviewTabState(false)
      // 如果当前选中的是审核标签，则切换到审核记录标签
      if (activeTab === "review") {
        setActiveTab("reviewHistory")
      }
    }
  }, [status, activeTab])

  // 计算可见标签数量
  const visibleTabsCount = [
    showReviewTabState && status !== "已通过" && status !== "已退回",
    showReviewHistoryTab,
    showOperationHistoryTab,
  ].filter(Boolean).length

  return (
    <div
      className="fixed right-0 w-[350px] overflow-hidden z-10 flex flex-col"
      style={{
        top: '110px',
        height: 'calc(100vh - 110px)',
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20427319383-hG1U0gKlYCq6lImzR5m61JqdH1dm6N.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderLeft: "1px solid transparent",
        borderImageSource: "linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5))",
        borderImageSlice: "1",
      }}
    >
      <div className="p-4 border-b border-slate-200/40 flex items-center bg-white/30 backdrop-blur-md">
        <h3 className="font-semibold flex items-center gap-2 text-slate-800">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
            <ClipboardCheck className="h-3.5 w-3.5 text-blue-600" />
          </div>
          审核信息
        </h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col overflow-hidden">
        {visibleTabsCount > 1 && (
          <div className="px-4 pt-3 pb-2">
            <TabsList
              className={`grid ${visibleTabsCount === 3 ? "grid-cols-3" : "grid-cols-2"} h-9 bg-transparent backdrop-blur-md rounded-lg`}
            >
              {showReviewTabState && status !== "已通过" && status !== "已退回" && (
                <TabsTrigger
                  value="review"
                  className="text-sm flex items-center justify-center relative text-slate-600 data-[state=active]:text-blue-600 transition-all duration-300 ease-in-out hover:text-blue-500 after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 data-[state=active]:after:w-2/3 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-500"
                >
                  审核
                </TabsTrigger>
              )}
              {showReviewHistoryTab && (
                <TabsTrigger
                  value="reviewHistory"
                  className="text-sm flex items-center justify-center relative text-slate-600 data-[state=active]:text-blue-600 transition-all duration-300 ease-in-out hover:text-blue-500 after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 data-[state=active]:after:w-2/3 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-500"
                >
                  审核记录
                </TabsTrigger>
              )}
              {showOperationHistoryTab && (
                <TabsTrigger
                  value="operationHistory"
                  className="text-sm flex items-center justify-center relative text-slate-600 data-[state=active]:text-blue-600 transition-all duration-300 ease-in-out hover:text-blue-500 after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 data-[state=active]:after:w-2/3 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-500"
                >
                  操作记录
                </TabsTrigger>
              )}
            </TabsList>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {showReviewTabState && status !== "已通过" && status !== "已退回" && (
            <TabsContent value="review" className="mt-0 h-full">
              <ReviewTab projectId={projectId} projectTitle={projectTitle} returnPath={returnPath} />
            </TabsContent>
          )}

          {showReviewHistoryTab && (
            <TabsContent value="reviewHistory" className="mt-0 px-5 py-4 h-full overflow-auto">
              <ReviewHistoryTab reviewHistory={reviewHistoryState} />
            </TabsContent>
          )}

          {showOperationHistoryTab && (
            <TabsContent value="operationHistory" className="mt-0 px-5 py-4 h-full overflow-auto">
              <OperationHistoryTab operationHistory={operationHistory} />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}
