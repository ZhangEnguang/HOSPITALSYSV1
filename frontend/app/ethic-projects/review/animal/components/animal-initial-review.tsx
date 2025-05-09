"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"

// 默认项目数据
const DEFAULT_PROJECT_DATA = {
  projectTitle: "实验性大鼠药代动力学研究",
  animalType: "大鼠",
  animalCount: "85",
  facilityUnit: "基础医学实验中心",
  leaderName: "张教授",
  department: "基础医学院",
  ethicsCommittee: "医学院伦理审查委员会"
}

// 动物伦理初始审查表单组件
export function AnimalInitialReview({
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
      const animalType = searchParams.get('animalType')
      const animalCount = searchParams.get('animalCount')
      const facilityUnit = searchParams.get('facilityUnit')
      
      if (projectId) {
        // 更新项目数据
        setProjectData(prev => ({
          ...prev,
          projectTitle: decodeURIComponent(projectId),
          // 如果有其他参数则更新，否则保持默认值
          ...(animalType && { animalType: decodeURIComponent(animalType) }),
          ...(animalCount && { animalCount: decodeURIComponent(animalCount) }),
          ...(facilityUnit && { facilityUnit: decodeURIComponent(facilityUnit) }),
        }))
      }
    }
  }, [searchParams])

  // 项目信息字段定义
  const projectInfoFields: ProjectInfoField[] = [
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: true, span: "half" },
    { key: "animalType", label: "动物种类", value: projectData.animalType, disabled: true, span: "half" },
    { key: "animalCount", label: "动物数量", value: projectData.animalCount, disabled: true, span: "half" },
    { key: "facilityUnit", label: "动物实施设备单位", value: projectData.facilityUnit, disabled: true, span: "half" },
    { key: "leaderName", label: "负责人名称", value: projectData.leaderName, disabled: true, span: "half" },
    { key: "department", label: "所属单位", value: projectData.department, disabled: true, span: "half" },
    { key: "ethicsCommittee", label: "伦理委员会", value: projectData.ethicsCommittee, disabled: true, span: "half" }
  ]

  // 动物伦理初始审查的送审文件清单
  const initialReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "动物伦理审查申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/animal-ethics-application-form.docx"
    },
    {
      id: 2,
      fileName: "项目研究方案",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究方案",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/research-protocol-template.docx"
    },
    {
      id: 3,
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
      id: 4,
      fileName: "调查问卷",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "不限制",
      fileType: "调查问卷",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 5,
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
    console.log("提交动物伦理初始审查表单:", data)
    toast({
      title: "提交成功",
      description: "动物伦理初始审查表单已提交成功"
    })
  }

  return (
    <ReviewFormBase
      title="新增动物伦理初始审查"
      returnPath="/ethic-projects/animal"
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