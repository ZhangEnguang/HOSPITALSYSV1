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
  projectType: "临床研究",
  projectSource: "院内立项",
  researchUnit: "医学研究院",
  leaderName: "王主任",
  department: "医学研究院",
  ethicsCommittee: "北京医学伦理委员会"
}

// 人体伦理偏离方案审查表单组件
export function HumanDeviationReview({
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
      const projectType = searchParams.get('projectType')
      const projectSource = searchParams.get('projectSource')
      const researchUnit = searchParams.get('researchUnit')
      const leaderName = searchParams.get('leaderName')
      const department = searchParams.get('department')
      const ethicsCommittee = searchParams.get('ethicsCommittee')
      
      if (projectId) {
        // 更新项目数据
        setProjectData(prev => ({
          ...prev,
          projectTitle: decodeURIComponent(projectId),
          ...(projectType && { projectType: decodeURIComponent(projectType) }),
          ...(projectSource && { projectSource: decodeURIComponent(projectSource) }),
          ...(researchUnit && { researchUnit: decodeURIComponent(researchUnit) }),
          ...(leaderName && { leaderName: decodeURIComponent(leaderName) }),
          ...(department && { department: decodeURIComponent(department) }),
          ...(ethicsCommittee && { ethicsCommittee: decodeURIComponent(ethicsCommittee) })
        }))
        
        // 如果没有获取到项目来源和研究单位，模拟获取项目详细信息
        if (!projectSource || !researchUnit) {
          // 模拟从API获取项目详情
          // 实际应用中应该是一个API调用
          console.log("模拟获取项目详情数据", projectId)
          
          // 模拟项目数据
          const mockProjectDetails = {
            projectSource: "院内立项",
            researchUnit: "医学研究院",
            projectType: "临床研究",
            leaderName: "王主任"
          }
          
          // 更新项目数据
          setProjectData(prev => ({
            ...prev,
            projectSource: mockProjectDetails.projectSource,
            researchUnit: mockProjectDetails.researchUnit,
            projectType: mockProjectDetails.projectType,
            leaderName: mockProjectDetails.leaderName
          }))
        }
      }
    }
  }, [searchParams])

  // 项目信息字段定义
  const projectInfoFields: ProjectInfoField[] = [
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: true, span: "half" },
    { key: "projectType", label: "项目类型", value: projectData.projectType, disabled: true, span: "half" },
    { key: "projectSource", label: "项目来源", value: projectData.projectSource, disabled: true, span: "half" },
    { key: "researchUnit", label: "研究单位", value: projectData.researchUnit, disabled: true, span: "half" },
    { key: "leaderName", label: "负责人名称", value: projectData.leaderName, disabled: true, span: "half" },
    { key: "department", label: "所属单位", value: projectData.department, disabled: true, span: "half" },
    { key: "ethicsCommittee", label: "伦理委员会", value: projectData.ethicsCommittee, disabled: true, span: "half" }
  ]

  // 人体伦理偏离方案审查的送审文件清单
  const initialReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "偏离方案申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/human-deviation-application-form.docx"
    },
    {
      id: 2,
      fileName: "偏离内容说明",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "说明书",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/deviation-content-description.docx"
    },
    {
      id: 3,
      fileName: "原批准方案或记录",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "方案文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 4,
      fileName: "对受试者影响的评估",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "评估报告",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/subject-impact-assessment.docx"
    },
    {
      id: 5,
      fileName: "涉及的知情同意书",
      format: "PDF/Word",
      required: false,
      quantity: "1",
      fileType: "知情同意",
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
  const [reviewFiles, setReviewFiles] = useState(initialReviewFiles)

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交人体伦理偏离方案审查表单:", data)
    toast({
      title: "提交成功",
      description: "人体伦理偏离方案审查申请已提交成功"
    })
  }

  return (
    <ReviewFormBase
      title="新建偏离方案审查"
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