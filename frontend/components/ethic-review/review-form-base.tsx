"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  UploadIcon,
  FileText
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { ProjectInfoPreview, ReviewFilePreview, AmendmentDescriptionPreview } from "./review-preview"
import { ProjectInfoCard } from "./project-info-card"
import { ReviewFileList } from "./review-file-list"

// 通用伦理审查表单基础组件，可用于人体和动物伦理项目的不同审查类型
export function ReviewFormBase({
  title, // 页面标题
  returnPath, // 返回路径
  projectInfo, // 项目信息配置
  fileList, // 文件列表配置
  onSubmit, // 提交回调
  children, // 自定义内容区域
  amendmentDescription, // 修改说明（可选，仅用于修改审查）
  customSubmitButton, // 自定义提交按钮
  isSubmitting = false, // 是否正在提交
}: {
  title: string
  returnPath: string
  projectInfo: any
  fileList: any[]
  onSubmit?: (data: any) => void
  children?: React.ReactNode
  amendmentDescription?: string
  customSubmitButton?: React.ReactNode
  isSubmitting?: boolean
}) {
  const router = useRouter()
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 预览对话框显示状态
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 项目信息 - 从props中获取
    ...projectInfo,
    
    // 送审文件信息
    reviewDescription: "",
    reviewFiles: [] as File[]
  })
  
  // 管理送审文件清单
  const [reviewFiles, setReviewFiles] = useState(fileList)
  
  // 同步最新的fileList更新
  useEffect(() => {
    setReviewFiles(fileList);
  }, [fileList]);
  
  // 获取当前最新的文件列表
  const getCurrentFileList = () => {
    // 找到ReviewFileList组件并获取其当前文件列表
    const fileListComponent = React.Children.toArray(children).find(
      child => React.isValidElement(child) && 
      (child as React.ReactElement).type === ReviewFileList
    ) as React.ReactElement | undefined;
    
    if (fileListComponent && fileListComponent.props.fileList) {
      return fileListComponent.props.fileList;
    }
    
    return reviewFiles;
  };
  
  // 返回列表
  const handleReturnToList = () => {
    // 使用window.location跳转，确保一定会触发页面跳转
    window.location.href = returnPath
  }

  // 保存草稿
  const handleSaveDraft = () => {
    const currentFileList = getCurrentFileList();
    console.log("保存草稿:", formData, currentFileList)
    toast({
      title: "草稿已保存",
      description: "您可以稍后继续编辑"
    })
  }

  // 提交表单
  const handleSubmit = () => {
    const currentFileList = getCurrentFileList();
    console.log("提交表单:", formData, currentFileList)
    // 显示预览对话框
    setShowPreviewDialog(true)
  }

  // 确认预览并提交
  const handleConfirmSubmit = () => {
    // 关闭预览对话框
    setShowPreviewDialog(false)
    
    // 调用提交回调
    if (onSubmit) {
      onSubmit({
        formData,
        reviewFiles: getCurrentFileList()
      })
    }
    
    // 显示完成对话框
    setShowCompletionDialog(true)
  }

  // 继续添加
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单
    setFormData({
      ...projectInfo,
      reviewDescription: "",
      reviewFiles: []
    })
    
    // 重置文件列表
    setReviewFiles(fileList.map(item => ({
      ...item,
      files: []
    })))
    
    toast({
      title: "已清空表单",
      description: "可以继续添加新审查"
    })
  }

  // 自定义表单标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium text-slate-900">{title}</h3>
      </div>
    )
  }

  // 提取字段信息的辅助函数
  const getFieldsFromProjectInfoCard = () => {
    // 找到ProjectInfoCard组件
    const projectInfoCards = React.Children.toArray(children).filter(
      child => React.isValidElement(child) && 
      // 检查类型是否为ProjectInfoCard组件
      (child as React.ReactElement).type === ProjectInfoCard
    );
    
    if (projectInfoCards.length > 0) {
      // 获取第一个ProjectInfoCard的fields属性
      const card = projectInfoCards[0] as React.ReactElement;
      return card.props.fields || [];
    }
    
    return null;
  };

  return (
    <div className="container pb-6 px-6 space-y-6">
      {/* 头部 - 返回按钮和标题 */}
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>

      {/* 内容区域 - 可自定义 */}
      {children}

      {/* 底部操作按钮 */}
      <div className="flex justify-between items-center pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleSaveDraft} 
          className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
        >
          保存草稿
        </Button>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReturnToList} 
            className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
          >
            取消
          </Button>
          {customSubmitButton ? (
            customSubmitButton
          ) : (
            <Button 
              type="button" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "提交中..." : "确认"}
            </Button>
          )}
        </div>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-lg border border-[#E9ECF2]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              审查创建成功
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              伦理项目审查已成功创建并提交。您可以继续添加新审查或返回项目列表。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              className="sm:mr-auto border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" 
              type="button"
              onClick={handleReturnToList}
            >
              返回列表
            </Button>
            <Button 
              type="button"
              onClick={handleContinueAdding}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              继续添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 预览对话框 */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto rounded-lg border border-[#E9ECF2] p-0">
          <DialogHeader className="px-6 py-4 border-b bg-blue-50/50">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold leading-none tracking-tight text-blue-700">
              <FileTextIcon className="h-5 w-5 text-blue-500" />
              申请表单预览
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-1.5">
              请确认以下信息无误，确认后将提交审查申请
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-6">
            {/* 项目信息预览 - 使用传入组件的字段定义中的中文标签 */}
            <ProjectInfoPreview 
              title="项目基本信息" 
              fields={
                // 获取ProjectInfoCard中的字段
                getFieldsFromProjectInfoCard() || 
                // 否则使用默认映射
                Object.entries(projectInfo).map(([key, value]) => {
                  // 英文字段名到中文标签的映射
                  const labelMap: Record<string, string> = {
                    projectTitle: "项目名称",
                    animalType: "动物种类",
                    animalCount: "动物数量",
                    facilityUnit: "实施设备单位",
                    leaderName: "负责人姓名",
                    department: "所属单位",
                    ethicsCommittee: "伦理委员会",
                    projectType: "项目类型",
                    projectSource: "项目来源",
                    researchUnit: "研究单位",
                    subjectType: "受试者类型",
                    subjectNumber: "受试者数量",
                    initialApprovalDate: "初始批准日期",
                    approvalNumber: "批准号"
                  };
                  
                  return {
                    key,
                    label: labelMap[key] || key, // 如果映射中没有，则使用原字段名
                    value: value as string,
                    disabled: true,
                    span: "half"
                  };
                })
              }
            />
            
            {/* 如果有修改说明，则显示修改说明预览 */}
            {amendmentDescription && (
              <AmendmentDescriptionPreview 
                title="修改说明" 
                description={amendmentDescription} 
              />
            )}
            
            {/* 送审文件预览 - 使用最新的文件列表 */}
            <ReviewFilePreview 
              title="送审文件信息" 
              fileList={getCurrentFileList()} 
            />
            
            {/* 警告信息 */}
            <div className="text-amber-700 bg-amber-50 p-4 rounded-md text-sm flex items-start gap-3 border border-amber-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">请确认以上信息无误</p>
                <p className="text-xs mt-1.5 text-amber-600 leading-relaxed">
                  提交后，伦理委员会将对送审文件进行形式审查，您可能需要根据审查意见进行修改和补充。确认提交代表您同意遵守相关伦理审查规定。
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowPreviewDialog(false)}
              className="border-gray-300 hover:bg-gray-100 text-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回修改
            </Button>
            <Button 
              type="button"
              onClick={handleConfirmSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              确认无误，提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 