"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"

// 人体伦理初始审查表单组件
export function HumanInitialReview({
  projectData = {
    projectTitle: "新型糖尿病治疗药物临床研究",
    projectType: "临床研究",
    projectSource: "院内立项",
    researchUnit: "内科学系",
    leaderName: "刘教授",
    department: "内分泌科",
    ethicsCommittee: "医学院伦理审查委员会"
  }
}) {
  const router = useRouter()

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

  // 人体伦理初始审查的送审文件清单
  const initialReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "人体伦理审查申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/human-ethics-application-form.docx"
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
      fileName: "研究者手册",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/investigator-brochure.docx"
    },
    {
      id: 5,
      fileName: "受试者招募材料",
      format: "PDF/Word/JPG",
      required: false,
      quantity: "不限制",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 6,
      fileName: "病例报告表",
      format: "PDF/Word/Excel",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/case-report-form.docx"
    },
    {
      id: 7,
      fileName: "研究者资质证明",
      format: "PDF/JPG",
      required: true,
      quantity: "不限制",
      fileType: "资质证明",
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
  const [reviewFiles, setReviewFiles] = useState(initialReviewFiles)

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交人体伦理初始审查表单:", data)
    toast({
      title: "提交成功",
      description: "人体伦理初始审查表单已提交成功"
    })
  }

  return (
    <ReviewFormBase
      title="新增人体伦理初始审查"
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