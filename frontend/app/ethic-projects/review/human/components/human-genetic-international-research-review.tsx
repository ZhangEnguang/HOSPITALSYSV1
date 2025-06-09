"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"

// 默认项目数据
const DEFAULT_PROJECT_DATA = {
  projectTitle: "多人样本采集与健康风险预测",
  projectSource: "院内立项",
  researchUnit: "医学研究院",
  projectType: "人类遗传资源国际合作科学研究",
  leaderName: "王教授",
  department: "遗传学研究所",
  ethicsCommittee: "医学院伦理审查委员会"
}

// 人体伦理国际合作科学研究审批组件
export function HumanGeneticInternationalResearchReview({
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
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: true, span: "full" },
    { key: "projectSource", label: "项目来源", value: projectData.projectSource, disabled: true, span: "half" },
    { key: "researchUnit", label: "研究单位", value: projectData.researchUnit, disabled: true, span: "half" },
    { key: "projectType", label: "研究类型", value: projectData.projectType, disabled: true, span: "half" },
    { key: "leaderName", label: "负责人", value: projectData.leaderName, disabled: true, span: "half" },
    { key: "department", label: "所属部门", value: projectData.department, disabled: true, span: "half" },
    { key: "ethicsCommittee", label: "伦理委员会", value: projectData.ethicsCommittee, disabled: true, span: "half" }
  ]

  // 国际合作科学研究审批送审文件清单
  const initialReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "国际合作科学研究申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/international-research-application.docx"
    },
    {
      id: 2,
      fileName: "国际合作研究方案",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究方案",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/international-research-protocol.docx"
    },
    {
      id: 3,
      fileName: "合作协议",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "合作协议",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/cooperation-agreement-template.docx"
    },
    {
      id: 4,
      fileName: "外方机构资质证明",
      format: "PDF",
      required: true,
      quantity: "1",
      fileType: "资质证明",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 5,
      fileName: "数据安全和隐私保护措施",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "安全措施",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/data-security-measures.docx"
    },
    {
      id: 6,
      fileName: "伦理审查通过证明",
      format: "PDF",
      required: true,
      quantity: "1",
      fileType: "伦理证明",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 7,
      fileName: "知情同意书",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "知情同意",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/informed-consent-template.docx"
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
  const [reviewFiles, setReviewFiles] = useState(initialReviewFiles)

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交人体伦理国际合作科学研究审批表单:", data)
    toast({
      title: "提交成功",
      description: "人体伦理国际合作科学研究审批表单已提交成功"
    })
  }

  return (
    <ReviewFormBase
      title="新建国际合作科学研究审批"
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