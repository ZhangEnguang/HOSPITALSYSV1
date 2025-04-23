"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Info, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 重用创建表单的组件
import { StepNavigation, getStepsByFormType } from "../create/components/step-navigation"
import { CompletionNotice } from "../create/components/completion-notice"
import {
  BasicInfoStep,
  TeamMembersStep,
  ProjectDetailStep,
  BudgetPlanStep,
  AttachmentsStep,
  CompletionPreviewStep
} from "../create/form-steps"

// 导入申报数据
import { extendedApplicationItems } from "../../data/applications-data"

export default function EditApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const batchId = searchParams?.get('batchId') || ''
  
  // 判断是否为评审批次
  const isReviewBatch = batchId?.startsWith('review-')
  
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [validationErrorFlags, setValidationErrorFlags] = useState<Record<string, boolean>>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [batchInfo, setBatchInfo] = useState<{ formGenerationType?: string } | null>(null)
  const [steps, setSteps] = useState<Array<{ id: number; name: string; description?: string }>>([])
  
  // 加载申报数据
  useEffect(() => {
    if (batchId) {
      try {
        // 处理URL中的ID格式
        // 从URL中的"2022-batch-1-project-1"格式提取出"2022-batch-1"部分
        let searchId = batchId;
        
        if (batchId.includes("-project-")) {
          const parts = batchId.split("-project-");
          searchId = parts[0];
        }
        
        console.log("搜索的批次ID:", searchId);
        
        // 查找对应ID的申报批次
        const foundBatch = extendedApplicationItems.find(item => item.id === searchId);
        
        if (foundBatch) {
          console.log("找到匹配的申报批次数据:", foundBatch);
          
          // 获取申报书生成方式
          const formGenerationType = foundBatch.formGenerationType || "全流程在线生成";
          
          // 设置批次信息
          setBatchInfo({
            formGenerationType: formGenerationType
          });
          
          // 设置步骤
          setSteps(getStepsByFormType(formGenerationType));
          
          // 转换批次数据为表单数据格式
          const initialFormData = {
            "批次ID": foundBatch.id,
            "项目名称": foundBatch.name || "",
            "项目描述": foundBatch.description || "",
            "项目分类": foundBatch.category || "",
            "项目类型": foundBatch.type || "",
            "申请经费": foundBatch.amount || 0,
            "研究开始日期": foundBatch.date || "",
            "研究结束日期": foundBatch.deadline || "",
            "批次编号": foundBatch.batchNumber || "",
            "申请书生成方式": formGenerationType,
            "申请人": typeof foundBatch.applicant === 'object' ? foundBatch.applicant.name : (foundBatch.applicant || ""),
            "所属单位": "科研处", // 默认值，实际应从数据中获取
            "性别": "男", // 默认值
            "一级学科": "理学", // 默认值
            "关键词": "人工智能,大数据,机器学习", // 默认值
            "项目摘要": "本项目旨在探索人工智能与大数据在科研领域的应用...", // 默认值
            "预期成果": ["论文", "专利", "软件著作权"], // 默认值
            
            // 根据生成方式设置不同的默认值
            ...(formGenerationType === "全流程在线生成" ? {
              "研究背景": "该项目旨在解决当前科研领域面临的关键问题...", // 示例默认值
              "研究目标": "通过创新性研究方法，实现突破性成果...", // 示例默认值
              "研究内容": "1. 开展理论研究\n2. 进行实验验证\n3. 分析实验数据\n4. 提出创新方法", // 示例默认值
              "预期成果详情": "预期发表高水平论文2-3篇，申请专利1-2项，开发原型系统一套。", // 示例默认值
            } : {}),
            
            // 项目成员默认值
            "项目成员": [
              {
                name: typeof foundBatch.applicant === 'object' ? foundBatch.applicant.name : (foundBatch.applicant || "张三"),
                title: "教授",
                department: "计算机科学与技术学院",
                responsibilities: "项目总负责",
                email: "zhangsan@example.com",
                phone: "13800138000"
              },
              {
                name: "李四",
                title: "副教授",
                department: "计算机科学与技术学院",
                responsibilities: "技术研发",
                email: "lisi@example.com",
                phone: "13900139000"
              }
            ],
            
            // 预算明细默认值
            "总预算": foundBatch.amount || 10,
            "预算明细": [
              { name: "设备费", amount: "3.5" },
              { name: "材料费", amount: "2.0" },
              { name: "测试化验加工费", amount: "1.5" },
              { name: "差旅费", amount: "1.0" },
              { name: "会议费", amount: "1.0" },
              { name: "劳务费", amount: "1.0" }
            ],
            "经费说明": "本项目经费主要用于设备购置、材料采购、测试加工、人员劳务等方面支出，确保项目顺利开展。"
          }
          
          setFormData(initialFormData);
          
          // 只标记第一步为已完成，其他步骤需要用户手动完成
          setCompletedSteps([0]);
          
          // 初始状态设置为第一步
          setCurrentStep(0);
        } else {
          console.error("未找到对应的申报书:", batchId);
          console.log("可用的批次IDs:", extendedApplicationItems.map(item => item.id));
          
          toast({
            title: "数据加载失败",
            description: `未找到对应的申报书，请返回列表重试`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(`加载申报书数据失败:`, error)
        toast({
          title: "数据加载失败",
          description: "加载数据时发生错误，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      // 没有批次ID参数
      setIsLoading(false)
      toast({
        title: "缺少参数",
        description: "没有指定要编辑的申报书",
        variant: "destructive",
      })
      // 延迟返回列表页
      setTimeout(() => {
        router.push("/applications")
      }, 2000)
    }
  }, [batchId, router])
  
  // 处理输入变化
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除该字段的验证错误
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
      
      setValidationErrorFlags((prev) => ({
        ...prev,
        [field]: false,
      }))
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    let errors: Record<string, string> = {}
    let errorFlags: Record<string, boolean> = {}
    
    const currentStepName = steps[currentStep]?.name || "";
    
    if (currentStepName === "基本信息") {
      // 基本信息验证
      if (!formData["项目名称"]) {
        errors["项目名称"] = "项目名称不能为空"
        errorFlags["项目名称"] = true
      }
      if (!formData["项目分类"]) {
        errors["项目分类"] = "请选择项目分类"
        errorFlags["项目分类"] = true
      }
      if (!formData["申请人"]) {
        errors["申请人"] = "请填写申请人信息"
        errorFlags["申请人"] = true
      }
      if (!formData["所属单位"]) {
        errors["所属单位"] = "请选择所属单位"
        errorFlags["所属单位"] = true
      }
      if (!formData["性别"]) {
        errors["性别"] = "请选择性别"
        errorFlags["性别"] = true
      }
      if (!formData["研究开始日期"]) {
        errors["研究开始日期"] = "请选择研究开始日期"
        errorFlags["研究开始日期"] = true
      }
      if (!formData["研究结束日期"]) {
        errors["研究结束日期"] = "请选择研究结束日期"
        errorFlags["研究结束日期"] = true
      }
      if (!formData["申请经费"]) {
        errors["申请经费"] = "请填写申请经费"
        errorFlags["申请经费"] = true
      }
      if (!formData["一级学科"]) {
        errors["一级学科"] = "请选择一级学科"
        errorFlags["一级学科"] = true
      }
      if (!formData["预期成果"] || 
          !Array.isArray(formData["预期成果"]) || 
          formData["预期成果"].length === 0) {
        errors["预期成果"] = "请至少选择一项预期成果"
        errorFlags["预期成果"] = true
      }
      if (!formData["关键词"]) {
        errors["关键词"] = "请填写关键词"
        errorFlags["关键词"] = true
      }
      if (!formData["项目摘要"]) {
        errors["项目摘要"] = "请填写项目摘要"
        errorFlags["项目摘要"] = true
      }
    } else if (currentStepName === "成员信息") {
      // 成员信息验证
      if (!formData["项目成员"] || !Array.isArray(formData["项目成员"]) || formData["项目成员"].length === 0) {
        errors["项目成员"] = "请至少添加一名项目成员"
        errorFlags["项目成员"] = true
      }
    } else if (currentStepName === "经费预算") {
      // 经费预算验证
      if (!formData["总预算"]) {
        errors["总预算"] = "请填写总预算"
        errorFlags["总预算"] = true
      }
      if (formData["总预算"] && isNaN(Number(formData["总预算"]))) {
        errors["总预算"] = "总预算必须是数字"
        errorFlags["总预算"] = true
      }
    } else if (currentStepName === "正文信息") {
      // 项目详情验证 - 根据申请书生成方式进行不同的验证
      const isIntelligentGeneration = formData["申请书生成方式"] === "智能协同生成";
      
      if (isIntelligentGeneration) {
        // 智能协同生成模式下验证正文文件
        if (!formData["申报书正文"]) {
          errors["申报书正文"] = "请上传申报书正文文件"
          errorFlags["申报书正文"] = true
        }
      } else {
        // 全流程在线生成模式下验证具体字段
        if (!formData["研究背景"]) {
          errors["研究背景"] = "请填写研究背景"
          errorFlags["研究背景"] = true
        }
        if (!formData["研究目标"]) {
          errors["研究目标"] = "请填写研究目标"
          errorFlags["研究目标"] = true
        }
        if (!formData["研究内容"]) {
          errors["研究内容"] = "请填写研究内容"
          errorFlags["研究内容"] = true
        }
        if (!formData["预期成果详情"]) {
          errors["预期成果详情"] = "请填写预期成果详情"
          errorFlags["预期成果详情"] = true
        }
      }
    } else if (currentStepName === "附件材料") {
      // 附件材料验证 - 线下模板化时需要上传附件
      // 这里可以根据需要添加附件上传的验证
    }

    setValidationErrors(errors)
    setValidationErrorFlags(errorFlags)
    return Object.keys(errors).length === 0
  }

  // 下一步
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        // 记录完成的步骤
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps((prev) => [...prev, currentStep])
        }
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  // 上一步
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // 跳转到特定步骤
  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  // 处理表单提交
  const handleSubmit = async () => {
    // 保存当前步骤
    const originalStep = currentStep
    
    // 验证所有步骤
    let allValid = true
    for (let step = 0; step < steps.length - 1; step++) {
      setCurrentStep(step)
      if (!validateCurrentStep()) {
        allValid = false
        break
      }
    }
    
    // 恢复到原来的步骤
    setCurrentStep(originalStep)
    
    if (!allValid) {
      toast({
        title: "表单验证失败",
        description: "请检查并修正表单中的错误",
        variant: "destructive",
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      console.log(`更新申报书数据:`, formData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // 模拟成功响应
      setIsCompleted(true)
      setShowCompletionDialog(true)
      
      toast({
        title: "更新成功",
        description: "申报书信息已成功更新",
      })
      
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: "更新失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 返回列表页
  const handleBackToList = () => {
    router.push("/applications")
  }

  // 继续编辑
  const handleContinueEdit = () => {
    setShowCompletionDialog(false)
  }

  // 渲染步骤内容
  const renderStepContent = () => {
    const currentStepName = steps[currentStep]?.name || "";
    
    switch (currentStepName) {
      case "基本信息":
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case "成员信息":
        return (
          <TeamMembersStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case "经费预算":
        return (
          <BudgetPlanStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case "正文信息":
        return (
          <ProjectDetailStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
            batchInfo={batchInfo || {
              formGenerationType: formData["申请书生成方式"] || "全流程在线生成"
            }}
          />
        )
      case "附件材料":
        return (
          <AttachmentsStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case "预览确认":
        return (
          <CompletionPreviewStep
            formData={formData}
          />
        )
      default:
        return null
    }
  }

  // 如果步骤列表还没有加载，显示加载状态
  if (isLoading || steps.length === 0) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <h1 className="text-2xl font-semibold">编辑申报书</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">加载中...</span>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <h1 className="text-2xl font-semibold">编辑申报书</h1>
        </div>
        <Card className="border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">申报书更新成功</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            您已成功更新申报书信息，可以继续编辑或返回列表
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleContinueEdit}>
              继续编辑
            </Button>
            <Button onClick={handleBackToList}>
              返回列表
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      {/* 页面标题和返回按钮 */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToList}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-semibold">编辑申报书</h1>
      </div>

      {/* 步骤条导航 */}
      <StepNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
        validationErrors={validationErrorFlags}
      />

      {/* 表单主体 */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          {/* 步骤内容 */}
          {renderStepContent()}
        </CardContent>

        {/* 表单底部操作按钮 */}
        <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              onClick={handlePrevStep}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              上一步
            </Button>
          ) : (
            <div></div>
          )}
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNextStep}>
                下一步
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "保存更改"}
                <Save className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* 成功提交对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑完成</DialogTitle>
            <DialogDescription>
              您已成功更新申报书信息
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleContinueEdit}>
              继续编辑
            </Button>
            <Button onClick={handleBackToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 