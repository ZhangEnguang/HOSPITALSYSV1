"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"

// 默认项目数据
const DEFAULT_PROJECT_DATA = {
  projectTitle: "多人种群本基因测序与健康风险预测",
  projectSource: "院内立项",
  researchUnit: "医学研究院",
  projectType: "临床研究",
  leaderName: "王主任",
  department: "医学研究院",
  ethicsCommittee: "北京医学伦理委员会"
}

// 人体伦理研究完成审查组件
export function HumanCompletionReview({
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
      const projectSource = searchParams.get('projectSource')
      const researchUnit = searchParams.get('researchUnit')
      const projectType = searchParams.get('projectType')
      const leaderName = searchParams.get('leaderName')
      const department = searchParams.get('department')
      const ethicsCommittee = searchParams.get('ethicsCommittee')
      
      if (projectId) {
        // 更新项目数据
        setProjectData(prev => ({
          ...prev,
          projectTitle: decodeURIComponent(projectId),
          // 如果有其他参数则更新，否则保持默认值
          ...(projectSource && { projectSource: decodeURIComponent(projectSource) }),
          ...(researchUnit && { researchUnit: decodeURIComponent(researchUnit) }),
          ...(projectType && { projectType: decodeURIComponent(projectType) }),
          ...(leaderName && { leaderName: decodeURIComponent(leaderName) }),
          ...(department && { department: decodeURIComponent(department) }),
          ...(ethicsCommittee && { ethicsCommittee: decodeURIComponent(ethicsCommittee) }),
        }))
      }
    }
  }, [searchParams])

  // 项目信息字段定义
  const projectInfoFields: ProjectInfoField[] = [
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: true, span: "half" },
    { key: "projectSource", label: "项目来源", value: projectData.projectSource, disabled: true, span: "half" },
    { key: "researchUnit", label: "研究单位", value: projectData.researchUnit, disabled: true, span: "half" },
    { key: "projectType", label: "项目类型", value: projectData.projectType, disabled: true, span: "half" },
    { key: "leaderName", label: "负责人名称", value: projectData.leaderName, disabled: true, span: "half" },
    { key: "department", label: "所属单位", value: projectData.department, disabled: true, span: "half" },
    { key: "ethicsCommittee", label: "伦理委员会", value: projectData.ethicsCommittee, disabled: true, span: "half" }
  ]

  // 人体伦理研究完成审查的送审文件清单
  const completionReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "人体伦理研究完成申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/human-ethics-completion-form.docx"
    },
    {
      id: 2,
      fileName: "研究完成报告",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究报告",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/completion-report-template.docx"
    },
    {
      id: 3,
      fileName: "数据汇总与分析报告",
      format: "PDF/Word/Excel",
      required: true,
      quantity: "1",
      fileType: "数据报告",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/data-analysis-template.docx"
    },
    {
      id: 4,
      fileName: "研究结果摘要",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "结果摘要",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/result-summary-template.docx"
    },
    {
      id: 5,
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
      id: 6,
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
  const [reviewFiles, setReviewFiles] = useState(completionReviewFiles)

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交人体伦理研究完成审查表单:", data)
    toast({
      title: "提交成功",
      description: "人体伦理研究完成审查表单已提交成功"
    })
  }

  return (
    <ReviewFormBase
      title="新建研究完成审查"
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