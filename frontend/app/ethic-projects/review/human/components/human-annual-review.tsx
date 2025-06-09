"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"

// 默认项目数据
const DEFAULT_PROJECT_DATA = {
  projectTitle: "多人种样本基因测序与健康风险预测",
  projectType: "心理学研究",
  projectSource: "院内立项",
  researchUnit: "外科学系",
  leaderName: "刘教授",
  department: "内分泌科",
  ethicsCommittee: "北京医学伦理委员会"
}

// 人体伦理年度/定期审查表单组件
export function HumanAnnualReview({
  projectData: initialProjectData = DEFAULT_PROJECT_DATA
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 用于管理项目数据的状态
  const [projectData, setProjectData] = useState(initialProjectData)
  
  // 从URL参数中获取项目ID和其他信息，并更新项目数据
  useEffect(() => {
    if (searchParams) {
      const projectId = searchParams.get('projectId')
      if (projectId) {
        // 实际应用中，这里应该是一个API调用来获取项目详细信息
        // 简化起见，我们这里仅使用projectId作为项目标题
        setProjectData({
          ...projectData, 
          projectTitle: decodeURIComponent(projectId)
        })
      }
    }
  }, [searchParams])

  // 项目信息字段定义
  const projectInfoFields: ProjectInfoField[] = [
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: true, span: "half" },
    { key: "projectType", label: "研究类型", value: projectData.projectType, disabled: true, span: "half" },
    { key: "projectSource", label: "项目来源", value: projectData.projectSource, disabled: true, span: "half" },
    { key: "researchUnit", label: "研究单位", value: projectData.researchUnit, disabled: true, span: "half" },
    { key: "leaderName", label: "负责人名称", value: projectData.leaderName, disabled: true, span: "half" },
    { key: "department", label: "所属单位", value: projectData.department, disabled: true, span: "half" },
    { key: "ethicsCommittee", label: "伦理委员会", value: projectData.ethicsCommittee, disabled: true, span: "half" }
  ]

  // 人体伦理年度/定期审查的送审文件清单
  const annualReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "人体伦理年度/定期审查申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/human-ethics-annual-review-form.docx"
    },
    {
      id: 2,
      fileName: "研究进展报告",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/annual-progress-report-template.docx"
    },
    {
      id: 3,
      fileName: "受试者/参与者统计表",
      format: "PDF/Word/Excel",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/subject-statistics-template.xlsx"
    },
    {
      id: 4,
      fileName: "知情同意执行情况说明",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/informed-consent-implementation-report.docx"
    },
    {
      id: 5,
      fileName: "不良事件汇总报告",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/adverse-events-summary.docx"
    },
    {
      id: 6,
      fileName: "原伦理批准文件",
      format: "PDF",
      required: true,
      quantity: "1",
      fileType: "伦理批件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 7,
      fileName: "数据安全监测报告",
      format: "PDF/Word",
      required: false,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 8,
      fileName: "其他支持性文件",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "不限制",
      fileType: "其他",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    }
  ]

  // 管理送审文件清单状态
  const [reviewFiles, setReviewFiles] = useState(annualReviewFiles)

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交人体伦理年度/定期审查表单:", data)
    toast({
      title: "提交成功",
      description: "人体伦理年度/定期审查表单已提交成功"
    })
  }

  return (
    <ReviewFormBase
      title="新建年度/定期审查"
      returnPath="/ethic-projects/human"
      projectInfo={projectData}
      fileList={reviewFiles}
      onSubmit={handleSubmit}
    >
      {/* 项目信息卡片 */}
      <ProjectInfoCard 
        title="项目信息"
        fields={projectInfoFields}
      />

      {/* 送审文件列表 */}
      <ReviewFileList
        title="送审文件信息"
        fileList={reviewFiles}
        onChange={setReviewFiles}
      />
    </ReviewFormBase>
  )
} 