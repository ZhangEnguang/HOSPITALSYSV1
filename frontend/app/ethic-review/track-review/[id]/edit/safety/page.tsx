"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"
import { useLoading } from "@/hooks/use-loading"

// 从demo数据中获取项目信息
const getProjectInfoFromId = (id: string) => {
  // 实际应用中，这里应该从API获取项目数据
  // 这里简单模拟几个项目
  const projectsMap: Record<string, any> = {
    "ETH-H-2024-001": {
      projectTitle: "人体细胞治疗方案修正评估",
      projectType: "人体研究",
      projectSource: "院内立项",
      researchUnit: "免疫学科研中心",
      leaderName: "张三",
      department: "免疫学科研中心",
      ethicsCommittee: "医学伦理委员会"
    },
    "ETH-H-2024-023": {
      projectTitle: "脑中神经治疗方案额报告",
      projectType: "人体研究",
      projectSource: "合作研究",
      researchUnit: "神经科学系",
      leaderName: "孙七",
      department: "神经科学系",
      ethicsCommittee: "医学伦理委员会"
    },
    "ETH-H-2024-019": {
      projectTitle: "认知行为疗法研究成果",
      projectType: "人体研究",
      projectSource: "院内立项",
      researchUnit: "心理学院",
      leaderName: "周八",
      department: "心理学院",
      ethicsCommittee: "医学伦理委员会"
    }
  }

  return projectsMap[id] || {
    projectTitle: "多人种样本基因测序与健康风险预测",
    projectType: "心理学研究",
    projectSource: "院内立项",
    researchUnit: "外科学系",
    leaderName: "刘教授",
    department: "内分泌科",
    ethicsCommittee: "北京医学伦理委员会"
  }
}

// 安全性审查编辑页面
export default function EditSafetyReviewPage() {
  const router = useRouter()
  const params = useParams()
  const { isLoading, startLoading, stopLoading } = useLoading()
  const id = params?.id as string
  
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
  }, [id])

  // 项目信息字段定义
  const projectInfoFields: ProjectInfoField[] = [
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: false, span: "half" },
    { key: "projectType", label: "项目类型", value: projectData.projectType, disabled: false, span: "half" },
    { key: "projectSource", label: "项目来源", value: projectData.projectSource, disabled: false, span: "half" },
    { key: "researchUnit", label: "研究单位", value: projectData.researchUnit, disabled: false, span: "half" },
    { key: "leaderName", label: "负责人名称", value: projectData.leaderName, disabled: false, span: "half" },
    { key: "department", label: "所属单位", value: projectData.department, disabled: false, span: "half" },
    { key: "ethicsCommittee", label: "伦理委员会", value: projectData.ethicsCommittee, disabled: false, span: "half" }
  ]

  // 安全性审查的送审文件清单 - 带有演示数据
  const safetyReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "安全性审查申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [
        {
          name: "安全性审查申请表-V1.0.pdf",
          uploadedAt: "2024-02-15",
          size: 1.2,
          status: "已上传"
        }
      ],
      versionDate: "2024-02-15",
      versionNumber: "V1.0",
      hasTemplate: true,
      templateUrl: "/templates/human-safety-review-form.docx"
    },
    {
      id: 2,
      fileName: "不良事件报告表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [
        {
          name: "不良事件报告表-20240210.pdf",
          uploadedAt: "2024-02-10",
          size: 1.5,
          status: "已上传"
        }
      ],
      versionDate: "2024-02-10",
      versionNumber: "V1.0",
      hasTemplate: true,
      templateUrl: "/templates/adverse-event-report-form.docx"
    },
    {
      id: 3,
      fileName: "安全性问题分析报告",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [
        {
          name: "安全性问题分析报告-V1.1.pdf",
          uploadedAt: "2024-02-15",
          size: 2.7,
          status: "已上传"
        }
      ],
      versionDate: "2024-02-15",
      versionNumber: "V1.1",
      hasTemplate: true,
      templateUrl: "/templates/safety-analysis-report.docx"
    },
    {
      id: 4,
      fileName: "研究方案变更说明",
      format: "PDF/Word",
      required: false,
      quantity: "1",
      fileType: "研究方案",
      files: [
        {
          name: "研究方案变更说明-V1.0.pdf",
          uploadedAt: "2024-02-12",
          size: 1.8,
          status: "已上传"
        }
      ],
      versionDate: "2024-02-12",
      versionNumber: "V1.0",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 5,
      fileName: "受试者安全保障措施",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [
        {
          name: "受试者安全保障措施-V2.0.pdf",
          uploadedAt: "2024-02-14",
          size: 1.3,
          status: "已上传"
        }
      ],
      versionDate: "2024-02-14",
      versionNumber: "V2.0",
      hasTemplate: true,
      templateUrl: "/templates/subject-safety-measures.docx"
    },
    {
      id: 6,
      fileName: "原伦理批准文件",
      format: "PDF",
      required: true,
      quantity: "1",
      fileType: "伦理批件",
      files: [
        {
          name: "伦理批准文件-2023-10-20.pdf",
          uploadedAt: "2024-02-05",
          size: 1.0,
          status: "已上传"
        }
      ],
      versionDate: "2023-10-20",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 7,
      fileName: "数据安全监测委员会报告",
      format: "PDF/Word",
      required: false,
      quantity: "1",
      fileType: "研究文件",
      files: [
        {
          name: "数据安全监测委员会报告-20240208.pdf",
          uploadedAt: "2024-02-08",
          size: 2.2,
          status: "已上传"
        }
      ],
      versionDate: "2024-02-08",
      versionNumber: "V1.0",
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
      files: [
        {
          name: "专家咨询意见.pdf",
          uploadedAt: "2024-02-12",
          size: 0.8,
          status: "已上传"
        },
        {
          name: "药物相互作用分析.xlsx",
          uploadedAt: "2024-02-10",
          size: 1.2,
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
  const [reviewFiles, setReviewFiles] = useState(safetyReviewFiles)

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交安全性审查表单:", data)
    toast({
      title: "提交成功",
      description: "安全性审查表单已成功更新"
    })
    
    // 提交后返回到详情页
    router.push(`/ethic-review/track-review`)
  }

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium">加载中...</div>
        <div className="text-sm text-gray-500 mt-2">正在加载项目ID: {id} 的详情数据</div>
      </div>
    )
  }

  return (
    <ReviewFormBase
      title="编辑安全性审查"
      returnPath={`/ethic-review/track-review`}
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