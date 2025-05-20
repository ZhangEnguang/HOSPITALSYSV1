"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"
import { ReviewSubmitDialog } from "@/components/ethic-review/review-submit-dialog"
import { FileReviewIssue } from "@/app/services/ai-file-review"
import { Button } from "@/components/ui/button"
import { SendHorizontal } from "lucide-react"

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

// 人体伦理初始审查表单组件
export function HumanInitialReview({
  projectData: initialProjectData = DEFAULT_PROJECT_DATA
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 用于管理项目数据的状态
  const [projectData, setProjectData] = useState(initialProjectData)
  
  // 显示提交对话框的状态
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  
  // 存储文件对象的Map
  const [filesMap, setFilesMap] = useState<Map<number, File[]>>(new Map())
  
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
  const [reviewFiles, setReviewFiles] = useState<ReviewFileItem[]>(initialReviewFiles)
  
  // 更新文件列表，并维护文件对象Map
  const handleFilesChange = useCallback((newFiles: ReviewFileItem[]) => {
    console.log("文件列表已更新:", newFiles)
    
    // 更新文件状态
    setReviewFiles(newFiles)
    
    // 更新文件对象Map
    const newFilesMap = new Map<number, File[]>()
    
    newFiles.forEach(item => {
      if (item.files && item.files.length > 0) {
        // 为每个文件项保存实际的File对象
        const fileObjects: File[] = []
        
        // 这里我们模拟File对象，实际应用中这些应该是真实的File对象
        item.files.forEach(fileInfo => {
          if (fileInfo instanceof File) {
            // 如果已经是File对象
            fileObjects.push(fileInfo)
          } else if (fileInfo.file instanceof File) {
            // 如果有file属性且是File对象
            fileObjects.push(fileInfo.file)
          } else {
            // 创建一个模拟的File对象
            const mockFile = new File(
              ["mock content"], 
              fileInfo.name || "未命名文件", 
              { type: fileInfo.type || "application/octet-stream" }
            )
            fileObjects.push(mockFile)
          }
        })
        
        if (fileObjects.length > 0) {
          newFilesMap.set(item.id, fileObjects)
        }
      }
    })
    
    setFilesMap(newFilesMap)
  }, [])

  // 检查是否有必填文件未上传
  const hasMissingRequiredFiles = useCallback(() => {
    const missingFiles = reviewFiles.filter(
      file => file.required && (!file.files || file.files.length === 0)
    )
    return missingFiles.length > 0
  }, [reviewFiles])

  // 处理表单提交前的验证
  const handlePreSubmit = () => {
    // 检查必填文件
    if (hasMissingRequiredFiles()) {
      toast({
        title: "文件不完整",
        description: "请上传所有必需的文件后再提交",
        variant: "destructive"
      })
      return
    }
    
    setShowSubmitDialog(true)
  }

  // 处理文件问题更新
  const handleUpdateFileIssues = (issues: FileReviewIssue[], updatedFiles?: Map<number, File[]>) => {
    // 这里可以根据修复的问题更新文件列表
    console.log("文件问题已更新:", issues)
    
    // 如果AI修复了文件，更新文件对象
    if (updatedFiles && updatedFiles.size > 0) {
      setFilesMap(new Map(updatedFiles))
      
      // 根据修复后的文件，更新文件列表UI
      const updatedReviewFiles = [...reviewFiles]
      
      issues.forEach(issue => {
        if (issue.fixed) {
          // 找到对应的文件项
          const fileIndex = updatedReviewFiles.findIndex(file => file.id === issue.fileId)
          if (fileIndex !== -1) {
            const fileItem = updatedReviewFiles[fileIndex]
            
            // 获取修复后的文件
            const fixedFiles = updatedFiles.get(issue.fileId)
            if (fixedFiles && fixedFiles.length > 0) {
              // 更新文件信息
              const updatedFileList = fixedFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                file: file // 保存File对象引用
              }))
              
              // 如果是版本号问题，更新版本号字段
              if (issue.issueType === 'version') {
                const versionMatch = fixedFiles[0].name.match(/[vV](\d+(\.\d+)*)/i)
                if (versionMatch) {
                  updatedReviewFiles[fileIndex] = {
                    ...fileItem,
                    files: updatedFileList,
                    versionNumber: versionMatch[1]
                  }
                } else {
                  updatedReviewFiles[fileIndex] = {
                    ...fileItem,
                    files: updatedFileList
                  }
                }
              } else {
                // 其他问题类型只更新文件列表
                updatedReviewFiles[fileIndex] = {
                  ...fileItem,
                  files: updatedFileList
                }
              }
            }
          }
        }
      })
      
      // 更新状态
      setReviewFiles(updatedReviewFiles)
    }
  }

  // 处理表单最终提交
  const handleFinalSubmit = () => {
    console.log("提交人体伦理初始审查表单:", { projectData, reviewFiles })
    
    // 关闭对话框
    setShowSubmitDialog(false)
    
    // 模拟API提交
    setTimeout(() => {
      // 显示成功提示
      toast({
        title: "提交成功",
        description: "人体伦理初始审查表单已提交成功，将进入审查流程"
      })
      
      // 提交成功后跳转到项目列表页
      setTimeout(() => {
        router.push("/ethic-projects/human")
      }, 1500)
    }, 500)
  }

  return (
    <>
      <ReviewFormBase
        title="新建初始审查"
        returnPath="/ethic-projects/human"
        projectInfo={projectData}
        fileList={reviewFiles}
        customSubmitButton={
          <Button onClick={handlePreSubmit} className="bg-primary">
            <SendHorizontal className="mr-2 h-4 w-4" />
            提交送审
          </Button>
        }
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
          onChange={handleFilesChange}
        />
      </ReviewFormBase>
      
      {/* 提交确认对话框 */}
      <ReviewSubmitDialog
        isOpen={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        fileList={reviewFiles}
        onConfirmSubmit={handleFinalSubmit}
        onUpdateFileIssues={handleUpdateFileIssues}
        files={filesMap}
      />
    </>
  )
} 