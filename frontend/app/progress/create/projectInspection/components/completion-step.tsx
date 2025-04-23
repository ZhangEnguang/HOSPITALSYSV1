interface CompletionStepProps {
  formData: any
}

export default function CompletionStep({ formData }: CompletionStepProps) {
  const renderSection = (title: string, data: Record<string, string>) => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-800">{title}</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">{formatLabel(key)}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {value || <span className="text-gray-400 italic">未填写</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }

  const formatLabel = (key: string) => {
    const labels: Record<string, string> = {
      inspectionNumber: "检查编号",
      inspectionName: "检查名称",
      inspectionType: "检查类型",
      inspectionStatus: "检查状态",
      relatedProjectNumber: "关联项目编号",
      relatedProjectName: "关联项目名称",
      inspectionScope: "检查范围",
      methodology: "检查方法",
      standards: "适用标准",
      participants: "参与人员",
      observations: "观察发现",
      nonConformities: "不符合项",
      evidenceCollected: "收集的证据",
      riskLevel: "风险等级",
      correctiveActions: "纠正措施",
      preventiveActions: "预防措施",
      improvementOpportunities: "改进机会",
      followUpDate: "跟进日期",
      responsibleParty: "责任方",
    }

    return labels[key] || key
  }

  const basicInfo = {
    inspectionNumber: formData.inspectionNumber,
    inspectionName: formData.inspectionName,
    inspectionType: formData.inspectionType,
    inspectionStatus: formData.inspectionStatus,
    relatedProjectNumber: formData.relatedProjectNumber,
    relatedProjectName: formData.relatedProjectName,
  }

  const inspectionDetails = {
    inspectionScope: formData.inspectionScope,
    methodology: formData.methodology,
    standards: formData.standards,
    participants: formData.participants,
  }

  const findings = {
    observations: formData.observations,
    nonConformities: formData.nonConformities,
    evidenceCollected: formData.evidenceCollected,
    riskLevel: formData.riskLevel,
  }

  const recommendations = {
    correctiveActions: formData.correctiveActions,
    preventiveActions: formData.preventiveActions,
    improvementOpportunities: formData.improvementOpportunities,
    followUpDate: formData.followUpDate,
    responsibleParty: formData.responsibleParty,
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">项目检查信息确认</h2>
        <p className="text-gray-500">请确认以下信息无误，然后点击"提交"按钮完成项目检查表单的提交。</p>
      </div>

      {renderSection("基本信息", basicInfo)}
      {renderSection("检查详情", inspectionDetails)}
      {renderSection("发现问题", findings)}
      {renderSection("整改措施", recommendations)}
    </div>
  )
}

