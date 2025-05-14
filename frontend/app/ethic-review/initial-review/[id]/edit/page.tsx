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
    "ETH-A-2024-001": {
      projectTitle: "转基因小鼠模型在神经退行性疾病中的应用",
      projectType: "动物研究",
      projectSource: "院内立项",
      researchUnit: "神经科学研究院",
      leaderName: "张三",
      department: "神经科学研究院",
      ethicsCommittee: "动物实验伦理委员会"
    },
    "受理号自动生成": {
      projectTitle: "新型靶向生物药物在晚期肿瘤患者中的临床试验",
      projectType: "人体研究",
      projectSource: "合作研究",
      researchUnit: "肿瘤医学中心",
      leaderName: "李四",
      department: "肿瘤医学中心",
      ethicsCommittee: "医学伦理委员会"
    },
    "3": {
      projectTitle: "高血压患者运动干预效果及安全性评估",
      projectType: "人体研究",
      projectSource: "院内立项",
      researchUnit: "运动医学科学院",
      leaderName: "王五",
      department: "运动医学科学院",
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

// 初始审查编辑页面
export default function EditInitialReviewPage() {
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

  // 人体伦理初始审查的送审文件清单 - 带有演示数据
  const getInitialReviewFiles = (): ReviewFileItem[] => {
    const baseFiles = [
      {
        id: 1,
        fileName: "项目申请书",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "申请表",
        files: [],
        versionDate: "",
        versionNumber: "",
        hasTemplate: true,
        templateUrl: "/templates/project-application-form.docx"
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
      }
    ]
    
    // 根据项目类型添加不同的文件类型
    if (projectData.projectType === "人体研究" || projectData.projectType === "心理学研究") {
      return [
        ...baseFiles,
        {
          id: 3,
          fileName: "知情同意书",
          format: "PDF/Word",
          required: true,
          quantity: "1",
          fileType: "知情同意",
          files: [
            {
              id: "file-1",
              name: "知情同意书-V1.0.pdf",
              uploadedAt: "2023-12-15",
              size: "1.2MB",
              status: "已上传"
            }
          ],
          versionDate: "2023-12-15",
          versionNumber: "V1.0",
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
          files: [
            {
              id: "file-2",
              name: "研究者手册-V2.1.pdf",
              uploadedAt: "2023-12-10",
              size: "3.5MB",
              status: "已上传"
            }
          ],
          versionDate: "2023-12-10",
          versionNumber: "V2.1",
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
          files: [
            {
              id: "file-3",
              name: "受试者招募广告.pdf",
              uploadedAt: "2023-12-12",
              size: "0.8MB",
              status: "已上传"
            },
            {
              id: "file-4",
              name: "招募海报.jpg",
              uploadedAt: "2023-12-12",
              size: "1.5MB",
              status: "已上传"
            }
          ],
          versionDate: "2023-12-12",
          versionNumber: "V1.0",
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
          files: [
            {
              id: "file-5",
              name: "病例报告表-V1.0.xlsx",
              uploadedAt: "2023-12-14",
              size: "0.7MB",
              status: "已上传"
            }
          ],
          versionDate: "2023-12-14",
          versionNumber: "V1.0",
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
          files: [
            {
              id: "file-6",
              name: "主要研究者资质证明.pdf",
              uploadedAt: "2023-12-05",
              size: "2.2MB",
              status: "已上传"
            },
            {
              id: "file-7",
              name: "协同研究者资质证明.pdf",
              uploadedAt: "2023-12-05",
              size: "1.9MB",
              status: "已上传"
            }
          ],
          versionDate: "2023-12-05",
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
          files: [
            {
              id: "file-8",
              name: "项目预算表.xlsx",
              uploadedAt: "2023-12-10",
              size: "0.5MB",
              status: "已上传"
            },
            {
              id: "file-9",
              name: "药品说明书.pdf",
              uploadedAt: "2023-12-10",
              size: "1.3MB",
              status: "已上传"
            }
          ],
          versionDate: "",
          versionNumber: "",
          hasTemplate: false,
          templateUrl: ""
        }
      ]
    } else if (projectData.projectType === "动物研究") {
      return [
        ...baseFiles,
        {
          id: 3,
          fileName: "3R声明",
          format: "PDF/Word",
          required: true,
          quantity: "1",
          fileType: "声明",
          files: [
            {
              id: "file-1",
              name: "3R原则声明-V1.0.pdf",
              uploadedAt: "2023-12-15",
              size: "0.5MB",
              status: "已上传"
            }
          ],
          versionDate: "2023-12-15",
          versionNumber: "V1.0",
          hasTemplate: true,
          templateUrl: "/templates/3r-principle-statement.docx"
        },
        {
          id: 4,
          fileName: "动物福利保障措施",
          format: "PDF/Word",
          required: true,
          quantity: "1",
          fileType: "研究文件",
          files: [
            {
              id: "file-2",
              name: "动物福利保障方案-V1.0.pdf",
              uploadedAt: "2023-12-14",
              size: "1.7MB",
              status: "已上传"
            }
          ],
          versionDate: "2023-12-14",
          versionNumber: "V1.0",
          hasTemplate: true,
          templateUrl: "/templates/animal-welfare-measures.docx"
        },
        {
          id: 5,
          fileName: "实验方案设计",
          format: "PDF/Word",
          required: true,
          quantity: "1",
          fileType: "研究文件",
          files: [
            {
              id: "file-3",
              name: "实验方案设计-V2.0.pdf",
              uploadedAt: "2023-12-12",
              size: "2.3MB",
              status: "已上传"
            }
          ],
          versionDate: "2023-12-12",
          versionNumber: "V2.0",
          hasTemplate: true,
          templateUrl: "/templates/experimental-protocol.docx"
        },
        {
          id: 6,
          fileName: "实验人员资质证明",
          format: "PDF/JPG",
          required: true,
          quantity: "不限制",
          fileType: "资质证明",
          files: [
            {
              id: "file-4",
              name: "实验负责人资质证明.pdf",
              uploadedAt: "2023-12-10",
              size: "1.8MB",
              status: "已上传"
            },
            {
              id: "file-5",
              name: "动物实验人员培训证书.pdf",
              uploadedAt: "2023-12-10",
              size: "2.1MB",
              status: "已上传"
            }
          ],
          versionDate: "",
          versionNumber: "",
          hasTemplate: false,
          templateUrl: ""
        },
        {
          id: 7,
          fileName: "其他支持性文件",
          format: "PDF/Word/Excel",
          required: false,
          quantity: "不限制",
          fileType: "其他",
          files: [
            {
              id: "file-6",
              name: "实验设施说明.pdf",
              uploadedAt: "2023-12-08",
              size: "1.2MB",
              status: "已上传"
            }
          ],
          versionDate: "",
          versionNumber: "",
          hasTemplate: false,
          templateUrl: ""
        }
      ]
    } else {
      return baseFiles
    }
  }

  // 管理送审文件清单状态
  const [reviewFiles, setReviewFiles] = useState<ReviewFileItem[]>([])
  
  // 初始化送审文件
  useEffect(() => {
    setReviewFiles(getInitialReviewFiles())
  }, [projectData.projectType])

  // 处理表单提交
  const handleSubmit = (data: any) => {
    console.log("提交初始审查表单:", data)
    toast({
      title: "提交成功",
      description: "初始审查表单已成功更新"
    })
    
    // 提交后返回到详情页
    router.push(`/ethic-review/initial-review/${id}`)
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
      title="编辑初始审查"
      returnPath={`/ethic-review/initial-review`}
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