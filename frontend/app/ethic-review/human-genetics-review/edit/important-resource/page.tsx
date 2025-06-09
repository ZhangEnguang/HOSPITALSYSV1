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

// 重要家系资源备案编辑页面
export default function EditImportantResourceReviewPage() {
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

  // 重要家系资源备案送审文件清单 - 带有演示数据
  const importantResourceReviewFiles: CustomReviewFileItem[] = [
    {
      id: 1,
      fileName: "重要遗传家系和特定地区人遗资源备案表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [
        {
          name: "重要遗传家系备案表-V1.1.pdf",
          uploadedAt: "2024-03-28",
          size: 1.6,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-28",
      versionNumber: "V1.1",
      hasTemplate: true,
      templateUrl: "/templates/important-genetic-resource-filing-form.docx"
    },
    {
      id: 2,
      fileName: "资源来源与保存说明",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "资源说明",
      files: [
        {
          name: "资源来源保存说明-V1.2.pdf",
          uploadedAt: "2024-03-25",
          size: 1.8,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-25",
      versionNumber: "V1.2",
      hasTemplate: true,
      templateUrl: "/templates/resource-source-preservation-description.docx"
    },
    {
      id: 3,
      fileName: "资源详细清单",
      format: "PDF/Word/Excel",
      required: true,
      quantity: "1",
      fileType: "资源清单",
      files: [
        {
          name: "资源详细清单-V1.0.xlsx",
          uploadedAt: "2024-03-20",
          size: 1.5,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-20",
      versionNumber: "V1.0",
      hasTemplate: true,
      templateUrl: "/templates/important-genetic-resource-list.xlsx"
    },
    {
      id: 4,
      fileName: "研究方案",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究方案",
      files: [
        {
          name: "研究方案-V2.1.pdf",
          uploadedAt: "2024-03-22",
          size: 2.2,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-22",
      versionNumber: "V2.1",
      hasTemplate: true,
      templateUrl: "/templates/research-protocol-template.docx"
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
          name: "知情同意书-V1.3.pdf",
          uploadedAt: "2024-03-15",
          size: 1.4,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-15",
      versionNumber: "V1.3",
      hasTemplate: true,
      templateUrl: "/templates/informed-consent-template.docx"
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
          name: "伦理审查通过证明-2024-03-01.pdf",
          uploadedAt: "2024-03-05",
          size: 1.2,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-01",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 7,
      fileName: "资源获取合法性证明",
      format: "PDF",
      required: true,
      quantity: "1",
      fileType: "合法证明",
      files: [
        {
          name: "资源获取合法性证明.pdf",
          uploadedAt: "2024-03-10",
          size: 1.3,
          status: "已上传"
        }
      ],
      versionDate: "2024-02-25",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 8,
      fileName: "数据安全与隐私保护措施",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "安全措施",
      files: [
        {
          name: "数据安全与隐私保护-V1.2.pdf",
          uploadedAt: "2024-03-18",
          size: 1.7,
          status: "已上传"
        }
      ],
      versionDate: "2024-03-18",
      versionNumber: "V1.2",
      hasTemplate: true,
      templateUrl: "/templates/data-security-privacy-measures.docx"
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
          name: "家系图谱示例.pdf",
          uploadedAt: "2024-03-25",
          size: 2.1,
          status: "已上传"
        },
        {
          name: "资源利用计划.pdf",
          uploadedAt: "2024-03-25",
          size: 1.5,
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
  const [reviewFiles, setReviewFiles] = useState<CustomReviewFileItem[]>(importantResourceReviewFiles)

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交重要家系资源备案表单:", data)
    toast({
      title: "提交成功",
      description: "重要家系资源备案表单已提交成功"
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
      title="编辑重要遗传家系和特定地区人遗资源"
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