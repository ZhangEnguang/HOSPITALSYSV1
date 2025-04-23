import { FileText, Calendar, Users, DollarSign } from "lucide-react"

export default function CompletionStep({ formData }) {
  // 格式化日期显示
  const formatDate = (date) => {
    if (!date) return "未设置"
    return new Date(date).toLocaleDateString("zh-CN")
  }

  // 获取合同类型文本
  const getContractTypeText = (type) => {
    const types = {
      purchase: "采购合同",
      service: "服务合同",
      cooperation: "合作合同",
      research: "研究合同",
      other: "其他",
    }
    return types[type] || "未设置"
  }

  // 获取合同状态文本
  const getContractStatusText = (status) => {
    const statuses = {
      draft: "草稿",
      pending: "待审批",
      active: "生效中",
      completed: "已完成",
      terminated: "已终止",
    }
    return statuses[status] || "未设置"
  }

  // 获取支付方式文本
  const getPaymentMethodText = (method) => {
    const methods = {
      onetime: "一次性付款",
      installment: "分期付款",
      milestone: "里程碑付款",
      other: "其他",
    }
    return methods[method] || "未设置"
  }

  // 获取币种文本
  const getCurrencyText = (currency) => {
    const currencies = {
      CNY: "人民币 (CNY)",
      USD: "美元 (USD)",
      EUR: "欧元 (EUR)",
      GBP: "英镑 (GBP)",
      JPY: "日元 (JPY)",
    }
    return currencies[currency] || "未设置"
  }

  // 获取审批级别文本
  const getApprovalLevelText = (level) => {
    const levels = {
      department: "部门级",
      division: "分部级",
      company: "公司级",
      group: "集团级",
    }
    return levels[level] || "未设置"
  }

  // 获取合同分类文本
  const getContractCategoryText = (category) => {
    const categories = {
      standard: "标准合同",
      custom: "定制合同",
      framework: "框架合同",
      supplement: "补充合同",
    }
    return categories[category] || "未设置"
  }

  // 获取合同来源文本
  const getContractSourceText = (source) => {
    const sources = {
      bidding: "招投标",
      negotiation: "商务谈判",
      renewal: "续签",
      other: "其他",
    }
    return sources[source] || "未设置"
  }

  // 获取发票类型文本
  const getInvoiceTypeText = (type) => {
    const types = {
      vat: "增值税专用发票",
      general: "增值税普通发票",
      electronic: "电子发票",
      none: "无需发票",
    }
    return types[type] || "未设置"
  }

  // 获取审批优先级文本
  const getApprovalPriorityText = (priority) => {
    const priorities = {
      low: "低",
      normal: "普通",
      high: "高",
      urgent: "紧急",
    }
    return priorities[priority] || "未设置"
  }

  // 获取保密级别文本
  const getConfidentialityLevelText = (level) => {
    const levels = {
      public: "公开",
      internal: "内部",
      confidential: "保密",
      secret: "机密",
    }
    return levels[level] || "未设置"
  }

  const { basicInfo, contractDetails, financialInfo, approvalInfo } = formData

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-blue-500" />
          <h4 className="text-lg font-medium">基本信息</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
          <div>
            <p className="text-gray-500">合同编号</p>
            <p className="font-medium">{basicInfo?.contractNumber || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">合同名称</p>
            <p className="font-medium">{basicInfo?.contractName || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">合同类型</p>
            <p className="font-medium">{getContractTypeText(basicInfo?.contractType)}</p>
          </div>
          <div>
            <p className="text-gray-500">合同分类</p>
            <p className="font-medium">{getContractCategoryText(basicInfo?.contractCategory)}</p>
          </div>
          <div>
            <p className="text-gray-500">合同来源</p>
            <p className="font-medium">{getContractSourceText(basicInfo?.contractSource)}</p>
          </div>
          <div>
            <p className="text-gray-500">合同状态</p>
            <p className="font-medium">{getContractStatusText(basicInfo?.contractStatus)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">合同目的</p>
            <p className="font-medium">{basicInfo?.contractPurpose || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">关联项目编号</p>
            <p className="font-medium">{basicInfo?.projectNumber || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">关联项目名称</p>
            <p className="font-medium">{basicInfo?.projectName || "未填写"}</p>
          </div>
        </div>
      </div>

      {/* 合同详情 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-blue-500" />
          <h4 className="text-lg font-medium">合同详情</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
          <div>
            <p className="text-gray-500">甲方</p>
            <p className="font-medium">{contractDetails?.partyA || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">乙方</p>
            <p className="font-medium">{contractDetails?.partyB || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">签订日期</p>
            <p className="font-medium">{formatDate(contractDetails?.signingDate)}</p>
          </div>
          <div>
            <p className="text-gray-500">签约地点</p>
            <p className="font-medium">{contractDetails?.contractLocation || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">合同期限</p>
            <p className="font-medium">{contractDetails?.contractDuration || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">合同见证人</p>
            <p className="font-medium">{contractDetails?.contractWitness || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">生效日期</p>
            <p className="font-medium">{formatDate(contractDetails?.effectiveDate)}</p>
          </div>
          <div>
            <p className="text-gray-500">到期日期</p>
            <p className="font-medium">{formatDate(contractDetails?.expirationDate)}</p>
          </div>
          <div>
            <p className="text-gray-500">保密级别</p>
            <p className="font-medium">{getConfidentialityLevelText(contractDetails?.confidentialityLevel)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">合同范围</p>
            <p className="font-medium">{contractDetails?.contractScope || "未填写"}</p>
          </div>
        </div>
      </div>

      {/* 财务信息 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-5 w-5 text-blue-500" />
          <h4 className="text-lg font-medium">财务信息</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
          <div>
            <p className="text-gray-500">合同金额</p>
            <p className="font-medium">{financialInfo?.contractAmount || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">币种</p>
            <p className="font-medium">{getCurrencyText(financialInfo?.currency)}</p>
          </div>
          <div>
            <p className="text-gray-500">支付方式</p>
            <p className="font-medium">{getPaymentMethodText(financialInfo?.paymentMethod)}</p>
          </div>
          <div>
            <p className="text-gray-500">发票类型</p>
            <p className="font-medium">{getInvoiceTypeText(financialInfo?.invoiceType)}</p>
          </div>
          <div>
            <p className="text-gray-500">付款截止日期</p>
            <p className="font-medium">{formatDate(financialInfo?.paymentDeadline)}</p>
          </div>
          <div>
            <p className="text-gray-500">财务联系人</p>
            <p className="font-medium">{financialInfo?.financialContact || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">税率</p>
            <p className="font-medium">{financialInfo?.taxRate ? `${financialInfo.taxRate}%` : "未设置"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">违约金条款</p>
            <p className="font-medium">{financialInfo?.penaltyClause || "未填写"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">支付计划</p>
            <p className="font-medium">{financialInfo?.paymentSchedule || "未填写"}</p>
          </div>
        </div>
      </div>

      {/* 审批信息 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h4 className="text-lg font-medium">审批信息</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
          <div>
            <p className="text-gray-500">审批级别</p>
            <p className="font-medium">{getApprovalLevelText(approvalInfo?.approvalLevel)}</p>
          </div>
          <div>
            <p className="text-gray-500">审批部门</p>
            <p className="font-medium">{approvalInfo?.approvalDepartment || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">审批人</p>
            <p className="font-medium">{approvalInfo?.approver || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">备选审批人</p>
            <p className="font-medium">{approvalInfo?.alternateApprover || "未填写"}</p>
          </div>
          <div>
            <p className="text-gray-500">预计审批日期</p>
            <p className="font-medium">{formatDate(approvalInfo?.expectedApprovalDate)}</p>
          </div>
          <div>
            <p className="text-gray-500">审批优先级</p>
            <p className="font-medium">{getApprovalPriorityText(approvalInfo?.approvalPriority)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">审批要求</p>
            <p className="font-medium">{approvalInfo?.approvalRequirements || "未填写"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">备注</p>
            <p className="font-medium">{approvalInfo?.comments || "未填写"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
