"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Save, InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

import { StepNavigation, STEPS } from "./step-navigation"
import { StepBasicInfo } from "./form-steps/step-basic-info"
import { StepAuthorInfo } from "./form-steps/step-author-info"
import { StepEvaluationDetails } from "./form-steps/step-evaluation-details"
import { StepDocumentUpload } from "./form-steps/step-document-upload"
import { StepCompletion } from "./form-steps/step-completion"

interface EvaluatedAchievementsEditFormProps {
  id: string
}

export function EvaluatedAchievementsEditForm({ id }: EvaluatedAchievementsEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showDialog, setShowDialog] = useState(false)
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    achievementId: "",
    title: "",
    type: "",
    evaluationOrg: "",
    evaluationDate: undefined as string | undefined,
    certificateNo: "",
    level: "",
    category: "",
    projectSource: "",

    // 完成人信息
    firstCompleter: "",
    secondCompleter: "",
    otherCompleters: "",
    contribution: "",
    rankingConfirmed: false,

    // 鉴定详情
    summary: "",
    expertNames: "",
    expertTitles: "",
    expertUnits: "",
    isPassed: "",

    // 文档上传
    files: [] as File[],
    
    // 验证错误
    validationErrors: {} as Record<string, boolean>,
  })

  // 从API获取数据（模拟）
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 获取演示数据
        const demoData = getDemoData(id)
        
        // 设置表单数据
        setFormData(prev => ({
          ...prev,
          ...demoData,
        }))
        
        // 设置所有步骤为已完成
        setCompletedSteps([0, 1, 2, 3])
        
        setLoading(false)
      } catch (error) {
        console.error("获取鉴定成果数据失败:", error)
        toast({
          title: "获取数据失败",
          description: "无法加载鉴定成果数据，请稍后重试",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id])

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    if (field === "validationErrors") {
      setFormData({ ...formData, validationErrors: value })
    } else {
      setFormData({ ...formData, [field]: value })
    }
  }

  // 验证当前步骤
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      if (!formData.title) errors["成果名称"] = true
      if (!formData.type) errors["成果类型"] = true
      if (!formData.evaluationOrg) errors["鉴定单位"] = true
      if (formData.evaluationDate === undefined) errors["鉴定日期"] = true
      if (!formData.certificateNo) errors["鉴定证书编号"] = true
      if (!formData.level) errors["鉴定水平"] = true
      if (!formData.category) errors["学科分类"] = true
    } else if (currentStep === 1) {
      // 验证完成人信息
      if (!formData.firstCompleter) errors["第一完成人"] = true
      if (!formData.contribution) errors["本人贡献"] = true
    } else if (currentStep === 2) {
      // 验证鉴定详情
      if (!formData.summary) errors["成果简介"] = true
      if (!formData.expertNames) errors["专家姓名"] = true
      if (!formData.isPassed) errors["是否通过鉴定"] = true
    }
    
    updateFormData("validationErrors", errors)
    return Object.keys(errors).length === 0
  }

  // 处理下一步
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  // 处理上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 处理完成
  const handleComplete = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setShowDialog(true)
    }
  }

  // 处理保存
  const handleSave = () => {
    console.log("保存数据:", formData)
    toast({
      title: "保存成功",
      description: "鉴定成果数据已保存",
    })
  }

  // 处理返回列表
  const handleReturnToList = () => {
    setShowDialog(false)
    router.push("/achievements")
  }

  // 获取演示数据
  const getDemoData = (achievementId: string) => {
    // 根据ID返回不同的演示数据
    if (achievementId === "1") {
      return {
        achievementId: "1",
        title: "智能交通信号控制系统关键技术",
        type: "科技成果",
        evaluationOrg: "交通部科技司",
        evaluationDate: "2023-06-15",
        certificateNo: "JTKT-2023-0123",
        level: "国家级",
        category: "交通运输工程",
        projectSource: "国家重点研发计划",
        
        firstCompleter: "张三",
        secondCompleter: "李四",
        otherCompleters: "王五,赵六,孙七",
        contribution: "负责项目总体架构设计和核心算法实现",
        rankingConfirmed: true,
        
        summary: "该成果提出了一种基于人工智能的交通信号自适应控制方法，解决了城市交通拥堵问题。系统利用深度学习和强化学习技术，通过分析实时交通流量数据，自动调整信号配时，提高交通效率。测试结果表明，该系统可减少车辆等待时间30%以上，显著缓解交通拥堵。",
        expertNames: "王教授,李教授,张教授,刘教授,陈教授",
        expertTitles: "教授,研究员,教授,教授,研究员",
        expertUnits: "清华大学,中国科学院,北京交通大学,同济大学,中国工程院",
        isPassed: "是",
      }
    } else if (achievementId === "2") {
      return {
        achievementId: "2",
        title: "新型环保材料在建筑领域的应用研究",
        type: "工程技术成果",
        evaluationOrg: "住建部科技与产业化发展中心",
        evaluationDate: "2023-08-20",
        certificateNo: "JKJC-2023-0456",
        level: "省部级",
        category: "建筑材料",
        projectSource: "省级重点项目",
        
        firstCompleter: "李四",
        secondCompleter: "张三",
        otherCompleters: "王五,钱六",
        contribution: "负责新材料性能测试与应用示范",
        rankingConfirmed: true,
        
        summary: "该成果开发了一种新型环保建筑材料，具有良好的隔热保温性能和环保特性。材料采用废弃农作物秸秆为原料，通过特殊工艺处理后制成，不仅解决了农业废弃物处理问题，还为建筑节能提供了新的解决方案。测试表明，该材料的导热系数比传统材料低30%，且生产过程碳排放量降低50%以上。",
        expertNames: "陈教授,张教授,李研究员,王教授",
        expertTitles: "教授,教授,研究员,教授",
        expertUnits: "同济大学,清华大学,中国建筑科学研究院,哈尔滨工业大学",
        isPassed: "是",
      }
    } else {
      // 默认演示数据
      return {
        achievementId: "3",
        title: "高性能光电探测器及其应用技术",
        type: "科技成果",
        evaluationOrg: "中国电子学会",
        evaluationDate: "2023-05-10",
        certificateNo: "DZXH-2023-0789",
        level: "国家级",
        category: "电子科学与技术",
        projectSource: "国家自然科学基金",
        
        firstCompleter: "王五",
        secondCompleter: "张三",
        otherCompleters: "李四,赵六",
        contribution: "负责器件设计与性能优化",
        rankingConfirmed: true,
        
        summary: "该成果研发了新一代高灵敏度、宽光谱响应的光电探测器，突破了传统器件在弱光信号探测中的技术瓶颈。探测器采用新型半导体复合材料，实现了在可见光到近红外波段的高效光电转换。该技术已在夜视系统、光通信和医学成像等领域得到应用，性能指标达到国际先进水平。",
        expertNames: "刘教授,孙教授,钱研究员,周教授",
        expertTitles: "教授,教授,研究员,教授",
        expertUnits: "北京大学,中国科学技术大学,中国科学院半导体研究所,华中科技大学",
        isPassed: "是",
      }
    }
  }

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBasicInfo 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 1:
        return (
          <StepAuthorInfo 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 2:
        return (
          <StepEvaluationDetails 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 3:
        return (
          <StepDocumentUpload 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 4:
        return <StepCompletion formData={formData} />
      default:
        return null
    }
  }

  // 前往指定步骤
  const goToStep = (step: number) => {
    // 只允许前往已完成的步骤或当前步骤
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">编辑鉴定成果</h1>
      </div>

      {/* 步骤导航 */}
      <StepNavigation 
        currentStep={currentStep} 
        goToStep={goToStep} 
        validationErrors={formData.validationErrors}
        completedSteps={completedSteps}
      />

      {/* 步骤内容 */}
      <Card>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          上一步
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button onClick={handleComplete}>
              完成
            </Button>
          ) : (
            <Button onClick={handleNext}>
              下一步
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 完成对话框 */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>鉴定成果已保存</AlertDialogTitle>
            <AlertDialogDescription>
              鉴定成果信息已成功保存并提交审核。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturnToList}>返回列表</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 