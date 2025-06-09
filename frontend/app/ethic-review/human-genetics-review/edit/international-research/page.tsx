"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"
import { useLoading } from "@/hooks/use-loading"
import { humanGeneticsReviewItems } from "../../data/human-genetics-review-demo-data"
import { CustomFile } from "../../types"

// 从demo数据中获取项目信息
const getProjectInfoFromId = (id: string) => {
  // 实际应用中，这里应该从API获取项目数据
  const currentProject = humanGeneticsReviewItems.find(item => item.id === id)
  
  if (!currentProject) {
    return {
      projectTitle: "无法找到项目",
      projectType: "人遗",
      projectSource: "未知来源",
      researchUnit: "未知单位",
      leaderName: "未知",
      department: "未知部门",
      ethicsCommittee: "未知伦理委员会"
    }
  }
  
  return {
    projectTitle: currentProject.name,
    projectType: currentProject.projectType,
    projectSource: currentProject.projectId,
    researchUnit: currentProject.department,
    leaderName: currentProject.projectLeader?.name || "未指定",
    department: currentProject.department,
    ethicsCommittee: currentProject.ethicsCommittee
  }
}

// 重写ReviewFileItem类型，使用CustomFile替代File
type CustomReviewFileItem = Omit<ReviewFileItem, 'files'> & {
  files: CustomFile[];
}

// 国际合作科研审批编辑页面
export default function EditInternationalResearchReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoading, startLoading, stopLoading } = useLoading()
  const id = searchParams?.get("id") || ""
  
  // 用于管理项目数据的状态
  const [projectData, setProjectData] = useState(getProjectInfoFromId(id))
  
  // 加载项目数据
  useEffect(() => {
    startLoading()
    
    try {
      // 实际应用中，这里应该是一个API调用来获取项目详细信息
      const data = getProjectInfoFromId(id)
      setProjectData(data)
      stopLoading()
    } catch (error) {
      console.error("加载项目数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目数据，请稍后重试",
        variant: "destructive"
      })
      stopLoading()
    }
  }, [id, startLoading, stopLoading])

  // 项目信息字段定义
  const projectInfoFields: ProjectInfoField[] = [
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: false, span: "full" },
    { key: "projectSource", label: "项目来源", value: projectData.projectSource, disabled: false, span: "half" },
    { key: "researchUnit", label: "研究单位", value: projectData.researchUnit, disabled: false, span: "half" },
    { key: "projectType", label: "研究类型", value: projectData.projectType, disabled: false, span: "half" },
    { key: "leaderName", label: "负责人", value: projectData.leaderName, disabled: false, span: "half" },
    { key: "department", label: "所属部门", value: projectData.department, disabled: false, span: "half" },
    { key: "ethicsCommittee", label: "伦理委员会", value: projectData.ethicsCommittee, disabled: false, span: "half" }
  ]

  // 国际合作科研审批送审文件清单 - 带有演示数据
  const internationalResearchReviewFiles: CustomReviewFileItem[] = [
    {
      id: 1,
      fileName: "国际合作科研项目申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [
        {
          name: "国际合作科研申请表-V1.3.pdf",
          uploadedAt: "2024-03-27",
          size: 1.4,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-27",
      versionNumber: "V1.3",
      hasTemplate: true,
      templateUrl: "/templates/international-research-application.docx"
    },
    {
      id: 2,
      fileName: "科研合作协议",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "合作协议",
      files: [
        {
          name: "科研合作协议-V2.0.pdf",
          uploadedAt: "2024-03-20",
          size: 2.6,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-20",
      versionNumber: "V2.0",
      hasTemplate: true,
      templateUrl: "/templates/research-cooperation-agreement.docx"
    },
    {
      id: 3,
      fileName: "研究方案",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究方案",
      files: [
        {
          name: "研究方案-V2.2.pdf",
          uploadedAt: "2024-03-22",
          size: 3.1,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-22",
      versionNumber: "V2.2",
      hasTemplate: true,
      templateUrl: "/templates/research-protocol.docx"
    },
    {
      id: 4,
      fileName: "合作方资质证明",
      format: "PDF",
      required: true,
      quantity: "1",
      fileType: "资质证明",
      files: [
        {
          name: "合作方资质证明.pdf",
          uploadedAt: "2024-03-15",
          size: 1.8,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-05",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 5,
      fileName: "知情同意书",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "知情同意",
      files: [
        {
          name: "知情同意书-V1.5.pdf",
          uploadedAt: "2024-03-18",
          size: 1.6,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-18",
      versionNumber: "V1.5",
      hasTemplate: true,
      templateUrl: "/templates/informed-consent.docx"
    },
    {
      id: 6,
      fileName: "伦理审查通过证明",
      format: "PDF",
      required: true,
      quantity: "1",
      fileType: "伦理证明",
      files: [
        {
          name: "伦理审查通过证明-2024-03-10.pdf",
          uploadedAt: "2024-03-12",
          size: 1.1,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-10",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 7,
      fileName: "数据管理与共享计划",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "数据管理",
      files: [
        {
          name: "数据管理与共享计划-V1.3.pdf",
          uploadedAt: "2024-03-23",
          size: 1.7,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-23",
      versionNumber: "V1.3",
      hasTemplate: true,
      templateUrl: "/templates/data-management-sharing-plan.docx"
    },
    {
      id: 8,
      fileName: "知识产权协议",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "知识产权",
      files: [
        {
          name: "知识产权协议-V1.2.pdf",
          uploadedAt: "2024-03-24",
          size: 1.9,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-24",
      versionNumber: "V1.2",
      hasTemplate: true,
      templateUrl: "/templates/intellectual-property-agreement.docx"
    },
    {
      id: 9,
      fileName: "其他支持性文件",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "不限制",
      fileType: "其他",
      files: [
        {
          name: "前期合作成果.pdf",
          uploadedAt: "2024-03-25",
          size: 1.5,
          status: "已上传"
        },
        {
          name: "项目背景资料.pdf",
          uploadedAt: "2024-03-25",
          size: 2.3,
          status: "已上传"
        }
      ],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    }
  ]

  // 管理送审文件清单状态
  const [reviewFiles, setReviewFiles] = useState<CustomReviewFileItem[]>(internationalResearchReviewFiles)

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交国际合作科研审批表单:", data)
    toast({
      title: "提交成功",
      description: "国际合作科研审批表单已提交成功"
    })
    
    // 提交成功后返回列表页
    router.push("/ethic-review/human-genetics-review")
  }

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium">正在加载...</div>
        <div className="text-sm text-gray-500 mt-2">请稍候，正在加载项目数据</div>
      </div>
    )
  }

  return (
    <ReviewFormBase
      title="编辑国际合作科研审批"
      returnPath="/ethic-review/human-genetics-review"
      projectInfo={projectData}
      fileList={reviewFiles as any}
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
        fileList={reviewFiles as any}
        onChange={(newFiles) => setReviewFiles(newFiles as any)}
      />
    </ReviewFormBase>
  )
} 