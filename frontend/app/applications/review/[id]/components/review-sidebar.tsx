"use client"
import { useState, useEffect } from "react"
import { ClipboardCheck } from "lucide-react"
import ReviewTab from "./review-tabs/review-tab"
import ReviewHistoryTab from "./review-tabs/review-history-tab"
import OperationHistoryTab from "./review-tabs/operation-history-tab"

interface ReviewSidebarProps {
  status?: string
  getStatusColor?: (status: string) => string
  projectId?: string
  projectTitle?: string
  reviewHistory?: Array<{
    date: string
    user: string
    action: string
    comment: string
  }>
  operationHistory?: Array<{
    date: string
    user: string
    action: string
    detail: string
  }>
  showReviewTab?: boolean
  showReviewHistoryTab?: boolean
  showOperationHistoryTab?: boolean
}

export default function ReviewSidebar({
  status = "进行中",
  getStatusColor,
  projectId,
  projectTitle,
  reviewHistory = [
    { date: "2024-03-15", user: "张主任", action: "已审核", comment: "项目进展顺利，继续保持" },
    { date: "2024-02-20", user: "李经理", action: "已提交", comment: "提交月度进展报告" },
    { date: "2024-01-10", user: "系统", action: "已创建", comment: "项目创建成功" },
    { date: "2023-12-25", user: "王总监", action: "已批准", comment: "项目立项已批准" },
    { date: "2023-12-20", user: "赵经理", action: "已提交", comment: "提交项目立项申请" },
  ],
  operationHistory = [
    { date: "2024-03-18", user: "王经理", action: "修改", detail: "更新了项目预算" },
    { date: "2024-03-10", user: "李研究员", action: "添加", detail: "上传了研究报告" },
    { date: "2024-02-28", user: "张主任", action: "分配", detail: "将任务分配给李研究员" },
    { date: "2024-02-15", user: "系统", action: "提醒", detail: "项目进度落后提醒" },
    { date: "2024-02-01", user: "赵经理", action: "更新", detail: "更新了项目时间线" },
  ],
  showReviewTab = true,
  showReviewHistoryTab = true,
  showOperationHistoryTab = true,
}: ReviewSidebarProps) {
  // 生成一个与当前项目相关的存储键，避免不同项目之间的状态冲突
  const storageKey = `reviewSidebarTab_${projectId || 'default'}`;

  // 计算可见标签数量
  const visibleTabs: string[] = [];
  if (showReviewTab) visibleTabs.push("review");
  if (showReviewHistoryTab) visibleTabs.push("reviewHistory");
  if (showOperationHistoryTab) visibleTabs.push("operationHistory");

  // 确定默认选中的标签
  const getDefaultTab = () => {
    if (visibleTabs.length === 0) return "";
    return visibleTabs[0];
  };

  // 使用状态控制活动标签
  const [activeTab, setActiveTab] = useState(getDefaultTab);

  // 在组件挂载时从localStorage读取状态（如果存在）
  useEffect(() => {
    try {
      // 尝试从localStorage读取上次的标签状态
      if (typeof window !== 'undefined') {
        const savedTab = localStorage.getItem(storageKey);
        // 确保恢复的状态是有效的标签
        if (savedTab && visibleTabs.includes(savedTab)) {
          setActiveTab(savedTab);
        } else {
          // 如果没有保存的状态或状态无效，则设置为默认值
          const defaultTab = getDefaultTab();
          setActiveTab(defaultTab);
          if (defaultTab) {
            localStorage.setItem(storageKey, defaultTab);
          }
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // 在标签改变时保存到localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && activeTab) {
        localStorage.setItem(storageKey, activeTab);
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [activeTab, storageKey]);

  // 确保在可见标签变化时更新activeTab
  useEffect(() => {
    // 如果当前活动标签不在可见标签列表中，或者activeTab为空，则选择第一个可见标签
    if (!visibleTabs.includes(activeTab) || !activeTab) {
      const newTab = getDefaultTab();
      setActiveTab(newTab);
      
      try {
        if (typeof window !== 'undefined' && newTab) {
          localStorage.setItem(storageKey, newTab);
        }
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }
  }, [showReviewTab, showReviewHistoryTab, showOperationHistoryTab, activeTab, visibleTabs]);

  return (
    <div
      className="fixed top-[101px] right-0 w-[350px] h-[calc(100vh-101px)] overflow-hidden z-10 flex flex-col transition-all duration-300 ease-in-out animate-slideInRight"
      style={{
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

      <div className="w-full flex-1 flex flex-col overflow-hidden">
        {visibleTabs.length > 1 && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex rounded-lg bg-slate-100/50 p-1">
              {showReviewTab && (
                <button
                  key="review-tab"
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-all duration-200 ${
                    activeTab === "review" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  审核
                </button>
              )}
              {showReviewHistoryTab && (
                <button
                  key="review-history-tab"
                  type="button"
                  onClick={() => setActiveTab("reviewHistory")}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-all duration-200 ${
                    activeTab === "reviewHistory" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  审核记录
                </button>
              )}
              {showOperationHistoryTab && (
                <button
                  key="operation-history-tab"
                  type="button"
                  onClick={() => setActiveTab("operationHistory")}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-all duration-200 ${
                    activeTab === "operationHistory" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  操作记录
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {activeTab === "review" && showReviewTab && (
            <div className="h-full">
              <ReviewTab projectId={projectId} projectTitle={projectTitle} />
            </div>
          )}

          {activeTab === "reviewHistory" && showReviewHistoryTab && (
            <div className="px-5 py-4 h-full overflow-auto">
              <ReviewHistoryTab reviewHistory={reviewHistory} />
            </div>
          )}

          {activeTab === "operationHistory" && showOperationHistoryTab && (
            <div className="px-5 py-4 h-full overflow-auto">
              <OperationHistoryTab operationHistory={operationHistory} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

