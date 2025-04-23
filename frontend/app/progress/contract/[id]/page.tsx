"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UniversalDetailAdapter } from "@/components/universal-detail"
import { 
  Calendar, 
  FileText, 
  BarChart, 
  GitBranch, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  Trash2,
  Link
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import ContractOverviewTab from "./components/contract-overview-tab"
import ContractDocumentsTab from "./components/contract-documents-tab"
import ContractRelatedProjectsTab from "./components/contract-related-projects-tab"
import ContractProcessTab from "./components/contract-process-tab"
import ContractFundsTab from "./components/contract-funds-tab"
import ContractAchievementsTab from "./components/contract-achievements-tab"

// 导入示例数据
import { contractRecognitionItems } from "../../data/progress-demo-data"

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [contract, setContract] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 从示例数据中查找合同认定数据
      const foundContract = contractRecognitionItems.find(item => item.id === id)
      
      if (foundContract) {
        // 将示例数据转换为详情页面所需的格式
        setContract({
          id: foundContract.id,
          title: foundContract.name,
          status: foundContract.status,
          statusLabel: foundContract.status,
          applicant: foundContract.assignee?.name || "未指定",
          leader: foundContract.assignee?.name || "未指定",
          date: `${foundContract.dueDate} 至 ${foundContract.actualDate || "未完成"}`,
          department: "科研管理处",
          changeType: foundContract.contractType,
          originalEndDate: foundContract.dueDate,
          newEndDate: foundContract.actualDate || foundContract.dueDate,
          reason: foundContract.description,
          impact: "合同认定影响分析信息",
          contractAmount: foundContract.contractAmount,
          contractParty: foundContract.contractParty,
          recognitionStatus: foundContract.recognitionStatus,
          attachments: [
            { name: "合同认定申请表.pdf", size: "1.0MB", date: foundContract.dueDate },
            { name: "合同文本.pdf", size: "2.5MB", date: foundContract.dueDate }
          ],
          approvalStatus: foundContract.recognitionStatus,
          approvalHistory: [
            { date: foundContract.dueDate, user: foundContract.assignee?.name || "未指定", action: "提交申请", comment: "提交合同认定申请" }
          ],
          progressBefore: [
            { phase: "合同拟定", status: "已完成", completionRate: 100, endDate: foundContract.dueDate }
          ],
          progressAfter: [
            { phase: "合同认定", status: "进行中", completionRate: 50, endDate: foundContract.actualDate || foundContract.dueDate }
          ]
        })
      }
    } catch (error) {
      console.error("Error fetching contract data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/progress")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (contract) {
      setContract({ ...contract, title: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此合同认定记录吗？")) {
      alert("删除成功")
      router.push("/progress")
    }
  }

  // 自定义状态颜色
  const statusColors = {
    "待审核": "bg-amber-50 text-amber-700 border-amber-200",
    "已通过": "bg-green-50 text-green-700 border-green-200",
    "已退回": "bg-red-50 text-red-700 border-red-200",
    "进行中": "bg-blue-50 text-blue-700 border-blue-200",
    "已完成": "bg-slate-50 text-slate-700 border-slate-200"
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到合同认定记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "applicant",
      label: "申请人",
      value: contract.applicant,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "changeDate",
      label: "变更日期",
      value: contract.approvalHistory?.[0]?.date || "未知",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: contract.department,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "contractType",
      label: "合同类型",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {contract.changeType}
        </Badge>
      ),
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "approvalStatus",
      label: "审批状态",
      value: (
        <Badge 
          className={
            contract.approvalStatus === "已通过" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : contract.approvalStatus === "已退回" 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
          }
        >
          {contract.approvalStatus}
        </Badge>
      ),
      icon: contract.approvalStatus === "已通过" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : contract.approvalStatus === "已退回" 
          ? <AlertCircle className="h-4 w-4 text-red-500" /> 
          : <Clock className="h-4 w-4 text-amber-500" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={contract}
        showRightSidebar={false}
        hiddenTabs={["risks", "reports", "statistics", "members"]} 
        hiddenFields={["period"]} 
        hiddenActions={[]} 
        tabComponents={{
          overview: <ContractOverviewTab data={contract} />,
          documents: <ContractDocumentsTab data={contract} />,
          process: <ContractProcessTab data={contract} />,
          funds: <ContractFundsTab data={contract} />,
          achievements: <ContractAchievementsTab data={contract} />,
          custom: <ContractRelatedProjectsTab data={contract} />
        }}
        customTabLabels={{
          overview: "合同概览",
          documents: "文档管理",
          process: "执行过程",
          funds: "经费管理",
          achievements: "成果管理",
          custom: "关联项目"
        }}
        tabsHeight={45}
        headerHeight={65}
        buttonsHeight={42}
        moduleType="progress"
        customBackPath="/progress"
        statusColors={statusColors}
        onBack={handleBack}
        onTitleEdit={handleTitleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
