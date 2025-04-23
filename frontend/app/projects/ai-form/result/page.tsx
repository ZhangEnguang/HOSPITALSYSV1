"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Save,
  Edit,
  AlertTriangle,
  FileText,
  Building2,
  GraduationCap,
  Check,
} from "lucide-react"
import { StepNavigation, STEPS } from "../components/step-navigation"
import { StepInfo } from "../components/form-steps/step-info"
import { StepMembers } from "../components/form-steps/step-members"
import { StepBudget } from "../components/form-steps/step-budget"
import { StepDocuments } from "../components/form-steps/step-documents"
import { StepComplete } from "../components/form-steps/step-complete"
import { CompletionNotice } from "../components/completion-notice"
import { Badge } from "@/components/ui/badge"
import { AIAnalysisPanel } from "../components/ai-analysis-panel"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 在文件顶部添加toast导入
import { toast } from "@/hooks/use-toast"

// 在文件顶部导入Dialog组件
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AIFormResultPage() {
  const router = useRouter()
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    批准号: "",
    项目名称: "",
    所属单位: "",
    项目分类: "",
    项目级别: "",
    经费来源: "",
    项目状态: "",
    开始日期: "",
    结束日期: "",
    项目负责人: "",
    职称: "",
    联系电话: "",
    电子邮箱: "",
    身份证号: "",
    项目经办人: "",
    经办人电话: "",
    团队成员: [""], // 初始化为包含一个空字符串的数组，而不是空数组
    预算金额: "", // 添加预算金额字段
    项目类型: "纵向", // 默认为纵向项目
  })
  const [analysisResult, setAnalysisResult] = useState<Record<string, any>>({})
  const [fillingField, setFillingField] = useState<string | null>(null)
  const [filledFields, setFilledFields] = useState<string[]>([])
  const [fillStartTime, setFillStartTime] = useState<number | null>(null)
  const [fillEndTime, setFillEndTime] = useState<number | null>(null)
  const [showCompletionNotice, setShowCompletionNotice] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [editingTitle, setEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  // 添加用户编辑状态跟踪和重新填充功能
  // 在state部分添加
  const [userEditedFields, setUserEditedFields] = useState<string[]>([])
  // 添加已完成步骤的状态
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  // 添加重新上传状态
  const [isReuploading, setIsReuploading] = useState(false)
  // 在state部分添加以下状态
  const [showTypeChangeDialog, setShowTypeChangeDialog] = useState(false)
  const [pendingProjectType, setPendingProjectType] = useState<string | null>(null)

  // 从localStorage获取分析结果，但不自动填充到表单
  useEffect(() => {
    // 模拟分析结果数据 - 确保字段名与表单完全匹配
    const mockResult = {
      批准号: "XM2025001",
      项目名称: "基于人工智能的智慧校园管理系统研发",
      所属单位: "信息工程学院",
      项目分类: "工程技术",
      项目级别: "省级",
      经费来源: "省科技厅专项资金",
      项目状态: "申请中",
      开始日期: "2025-04-01",
      结束日期: "2026-03-31",
      项目负责人: "张三",
      职称: "教授",
      联系电话: "13800138000",
      电子邮箱: "zhangsan@example.com",
      身份证号: "110101199001011234",
      项目经办人: "李四",
      经办人电话: "13900139000",
      项目类型: "纵向", // 添加项目类型
    }

    // 保存到localStorage以便刷新后仍能使用
    localStorage.setItem("analysisResult", JSON.stringify(mockResult))

    const storedResult = localStorage.getItem("analysisResult")
    if (storedResult) {
      const result = JSON.parse(storedResult)
      // 只保存分析结果，不填充到表单
      setAnalysisResult(result)

      // 设置项目类型
      if (result.项目类型) {
        setFormData((prev) => ({
          ...prev,
          项目类型: result.项目类型,
        }))
      }

      setLoading(false)
    } else {
      router.push("/projects/ai-form")
    }

    // 设置自动保存
    const interval = setInterval(
      () => {
        handleSaveDraft(true)
      },
      10 * 60 * 1000,
    )

    setAutoSaveInterval(interval)

    // 设置CSS变量，用于AI分析面板的定位
    document.documentElement.style.setProperty("--header-height", "104px") // 调整为实际页签高度

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [router])

  // 添加大屏幕适配
  useEffect(() => {
    // 创建一个style元素来添加自定义媒体查询
    const styleEl = document.createElement("style")
    styleEl.textContent = `
    @media (min-width: 1600px) {
      .content-container-collapsed {
        max-width: 1440px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    }
  `
    document.head.appendChild(styleEl)

    // 更新容器类
    const updateContainerClass = () => {
      const container = document.querySelector(".form-result-container")
      if (container) {
        if (isPanelCollapsed && window.innerWidth >= 1600) {
          container.classList.add("content-container-collapsed")
        } else {
          container.classList.remove("content-container-collapsed")
        }
      }
    }

    // 初始更新
    updateContainerClass()

    // 监听窗口大小变化
    window.addEventListener("resize", updateContainerClass)

    return () => {
      // 清理
      document.head.removeChild(styleEl)
      window.removeEventListener("resize", updateContainerClass)
    }
  }, [isPanelCollapsed])

  // 当编辑标题时，自动聚焦输入框
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [editingTitle])

  // 修改validateForm函数
  const validateForm = (step: number) => {
    const errors: Record<string, boolean> = {}

    // 验证第一步
    if (step === 0) {
      if (!formData.项目名称) errors.项目名称 = true
      if (!formData.所属单位) errors.所属单位 = true
      if (!formData.项目分类) errors.项目分类 = true
      // 添加其他必填项验证
    }

    // 验证第二步 - 修改验证逻辑，允许有一个空字符串的成员
    if (step === 1) {
      // 检查是否至少有一个非空的团队成员
      const hasValidMember = formData.团队成员.some((member) => member.trim() !== "")
      if (!hasValidMember) {
        errors.团队成员 = true
      }
    }

    // 验证第三步 - 只验证预算金额
    if (step === 2) {
      if (!formData.预算金额) errors.预算金额 = true
    }

    // 步骤四（文档上传）不需要验证，是可选的
    // 步骤五（完成确认）不需要验证，只是确认信息

    setValidationErrors(errors)

    // 如果有错误，显示提示
    if (Object.keys(errors).length > 0) {
      // 添加toast提示
      toast({
        title: "表单验证失败",
        description: "请填写所有必填项（标有*的字段）",
        variant: "destructive",
      })
      return false
    }

    // 如果验证通过，将当前步骤添加到已完成步骤列表中
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step])
    }

    return true
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除相关字段的验证错误
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = () => {
    router.push("/projects")
  }

  // 保存草稿功能
  const handleSaveDraft = (isAutoSave = false) => {
    setIsSaving(true)

    // 模拟保存操作
    setTimeout(() => {
      // 保存表单数据到localStorage
      localStorage.setItem("formDraft", JSON.stringify(formData))

      setIsSaving(false)
      setLastSaved(new Date())

      // 如果不是自动保存，显示保存成功提示
      if (!isAutoSave) {
        toast({
          title: "保存成功",
          description: "表单数据已保存为草稿",
          duration: 3000,
        })
      }
    }, 800)
  }

  // 计算填充耗时（秒）
  const calculateFillTime = () => {
    if (fillStartTime && fillEndTime) {
      return ((fillEndTime - fillStartTime) / 1000).toFixed(2)
    }
    return "0.00"
  }

  // 步骤导航函数
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // 验证当前步骤
      if (validateForm(currentStep)) {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      // 如果是向前跳转，需要验证当前步骤
      if (stepIndex > currentStep) {
        if (validateForm(currentStep)) {
          setCurrentStep(stepIndex)
        }
      } else {
        setCurrentStep(stepIndex)
      }
    }
  }

  // 获取项目类型的颜色和描述
  const getProjectTypeInfo = (type: string) => {
    switch (type) {
      case "horizontal":
        return { color: "bg-green-500", textColor: "text-green-600", description: "企业合作项目" }
      case "vertical":
        return { color: "bg-blue-500", textColor: "text-blue-600", description: "政府资助项目" }
      case "schoolLevel":
        return { color: "bg-amber-500", textColor: "text-amber-600", description: "校内立项项目" }
      default:
        return { color: "bg-gray-500", textColor: "text-gray-600", description: "未知类型" }
    }
  }

  // AI分析结果相关函数
  // 修改一键填充函数，移除"AI已填充"文字，只显示对号
  const handleFillField = (field: string) => {
    setFillingField(field)

    // 设置表单数据
    setFormData((prev) => ({
      ...prev,
      [field]: analysisResult[field] || "",
    }))

    // 添加到已填充字段列表
    setTimeout(() => {
      setFilledFields((prev) => [...prev, field])
      setFillingField(null)

      // 清除相关字段的验证错误
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }, 500)
  }

  const handleFillAll = () => {
    // 记录开始时间
    const startTime = Date.now()
    setFillStartTime(startTime)

    // 按顺序填充所有字段，带有动画效果
    const fields = Object.keys(analysisResult)
    let index = 0

    const fillNextField = () => {
      if (index < fields.length) {
        const field = fields[index]
        setFillingField(field)

        // 设置表单数据
        setFormData((prev) => ({
          ...prev,
          [field]: analysisResult[field] || "",
        }))

        // 添加到已填充字段列表
        setTimeout(() => {
          setFilledFields((prev) => [...prev, field])
          setFillingField(null)
          index++
          setTimeout(fillNextField, 80) // 每个字段填充后的延迟，从150减少到80
        }, 120) // 填充动画持续时间，从250减少到120
      } else {
        // 所有字段填充完成，记录结束时间
        const endTime = Date.now()
        setFillEndTime(endTime)

        // 不显示完成提示
        // setShowCompletionNotice(true)

        // 清除验证错误
        setValidationErrors({})
      }
    }

    fillNextField()
  }

  // 添加处理用户编辑的函数
  const handleUserEdit = (field: string) => {
    // 从已填充字段中移除
    setFilledFields((prev) => prev.filter((f) => f !== field))
    // 添加到用户编辑字段列表
    setUserEditedFields((prev) => [...prev, field])
  }

  // 添加重新填充字段的函数
  const handleRefill = (field: string) => {
    setFillingField(field)

    // 设置表单数据
    setFormData((prev) => ({
      ...prev,
      [field]: analysisResult[field] || "",
    }))

    // 添加到已填充字段列表，从用户编辑列表中移除
    setTimeout(() => {
      setFilledFields((prev) => [...prev, field])
      setUserEditedFields((prev) => prev.filter((f) => f !== field))
      setFillingField(null)

      // 清除相关字段的验证错误
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }, 500)
  }

  // 处理项目类型变更
  // 修改项目类型变更函数，添加确认对话框
  const handleProjectTypeChange = (type: string) => {
    // 如果类型没有变化，不需要确认
    if (formData.项目类型 === type) return

    // 设置待确认的项目类型并显示确认对话框
    setPendingProjectType(type)
    setShowTypeChangeDialog(true)
  }

  // 添加确认项目类型变更的函数
  const confirmProjectTypeChange = () => {
    if (pendingProjectType) {
      setFormData((prev) => ({
        ...prev,
        项目类型: pendingProjectType,
      }))

      toast({
        title: "项目类型已更改",
        description: `项目类型已更改为${pendingProjectType}项目`,
        duration: 3000,
      })

      // 关闭对话框并清除待确认的项目类型
      setShowTypeChangeDialog(false)
      setPendingProjectType(null)
    }
  }

  // 添加取消项目类型变更的函数
  const cancelProjectTypeChange = () => {
    setShowTypeChangeDialog(false)
    setPendingProjectType(null)
  }

  // 处理重新上传文件
  const handleReupload = () => {
    setIsReuploading(true)

    // 模拟上传过程
    toast({
      title: "准备重新上传",
      description: "正在跳转到文件上传页面...",
      duration: 2000,
    })

    // 延迟跳转，给用户一些视觉反馈
    setTimeout(() => {
      router.push("/projects/ai-form")
    }, 1000)
  }

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">正在加载分析结果...</p>
        </div>
      </div>
    )
  }

  // 获取当前步骤的名称
  const currentStepName = STEPS[currentStep]?.name || "项目信息"

  // 获取项目类型信息
  const projectTypeInfo = getProjectTypeInfo(formData.项目类型)

  // 修改页面布局，为右侧固定面板留出空间
  return (
    <div
      className={`w-full relative transition-all duration-300 form-result-container ${isPanelCollapsed ? "max-w-[1440px] mx-auto xl:px-4 2xl:px-0" : "pr-[350px]"}`}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-small-white/[0.2] bg-[length:20px_20px] dark:bg-grid-small-white/[0.05] -z-10" />
      <div className="absolute h-full w-full bg-background/60 backdrop-blur-sm [mask-image:radial-gradient(black,transparent_70%)] -z-10" />

      {/* 重新上传按钮 - 固定在右下角 */}

      <div className="flex flex-col">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {editingTitle ? (
                <div className="flex items-center">
                  <Input
                    ref={titleInputRef}
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="text-xl font-bold h-9 w-[400px]"
                    onBlur={() => {
                      setEditingTitle(false)
                      if (tempTitle.trim()) {
                        handleInputChange("项目名称", tempTitle.trim())
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingTitle(false)
                        if (tempTitle.trim()) {
                          handleInputChange("项目名称", tempTitle.trim())
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <h1
                  className="text-2xl font-bold text-foreground cursor-pointer group flex items-center"
                  onClick={() => {
                    setTempTitle(formData.项目名称 || "")
                    setEditingTitle(true)
                  }}
                >
                  {formData.项目名称 ? formData.项目名称 : `创建${formData.项目类型}项目`}
                  <Edit className="ml-2 h-4 w-4 text-muted-foreground" />
                </h1>
              )}
              <Badge variant="outline" className="ml-3 bg-primary/10 hover:bg-primary/20 transition-colors">
                AI辅助
              </Badge>
            </div>
          </div>

          {/* 项目类型识别结果 - 始终显示在顶部标题下方 */}
          <div className="flex items-center justify-between bg-primary/5 p-2 px-3 rounded-md border border-primary/20 mb-3">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <span className="text-sm font-medium">
                AI已识别为{formData.项目类型}项目（{projectTypeInfo.description}）
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  识别有误?
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>选择项目类型</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleProjectTypeChange("纵向")}
                  className={formData.项目类型 === "纵向" ? "bg-primary/10" : ""}
                >
                  <FileText className="mr-2 h-4 w-4 text-blue-500" />
                  <span>纵向项目</span>
                  {formData.项目类型 === "纵向" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProjectTypeChange("horizontal")}
                  className={formData.项目类型 === "horizontal" ? "bg-primary/10" : ""}
                >
                  <Building2 className="mr-2 h-4 w-4 text-green-500" />
                  <span>横向项目</span>
                  {formData.项目类型 === "horizontal" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProjectTypeChange("校级")}
                  className={formData.项目类型 === "校级" ? "bg-primary/10" : ""}
                >
                  <GraduationCap className="mr-2 h-4 w-4 text-amber-500" />
                  <span>校级项目</span>
                  {formData.项目类型 === "校级" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {/* 左侧主内容区域 */}
        <div className="flex-1">
          {/* 步骤导航条 - 与表单对齐 */}
          <div className="mb-6">
            <StepNavigation
              currentStep={currentStep}
              goToStep={goToStep}
              validationErrors={validationErrors}
              completedSteps={completedSteps}
            />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="border-muted/50 overflow-hidden">
              <CardContent className="pt-6">
                {/* 步骤内容 */}
                {currentStep === 0 && (
                  <StepInfo
                    formData={formData}
                    fillingField={fillingField}
                    filledFields={filledFields}
                    handleInputChange={handleInputChange}
                    validationErrors={validationErrors}
                    analysisResult={analysisResult}
                    handleRefill={handleRefill}
                    handleUserEdit={handleUserEdit}
                  />
                )}

                {currentStep === 1 && (
                  <StepMembers
                    formData={formData}
                    handleInputChange={handleInputChange}
                    validationErrors={validationErrors}
                  />
                )}

                {currentStep === 2 && (
                  <StepBudget
                    formData={formData}
                    handleInputChange={handleInputChange}
                    validationErrors={validationErrors}
                  />
                )}

                {currentStep === 3 && <StepDocuments />}

                {currentStep === 4 && <StepComplete formData={formData} />}
              </CardContent>

              <CardFooter className="flex justify-between border-t border-muted/30 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => handleSaveDraft()} disabled={isSaving} className="relative">
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                        正在保存...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        保存草稿
                      </>
                    )}
                  </Button>

                  {lastSaved && (
                    <span className="text-xs text-muted-foreground">上次保存: {lastSaved.toLocaleTimeString()}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={goToPrevStep} disabled={currentStep === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    上一步
                  </Button>

                  {currentStep < STEPS.length - 1 ? (
                    <Button onClick={goToNextStep}>
                      下一步
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                      >
                        提交项目
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 固定在右侧的AI分析结果 */}
      <AIAnalysisPanel
        mockAnalysisResult={analysisResult}
        filledFields={filledFields}
        handleFillField={handleFillField}
        handleFillAll={handleFillAll}
        isPanelCollapsed={isPanelCollapsed}
        setIsPanelCollapsed={(collapsed) => setIsPanelCollapsed(collapsed)}
      />

      {/* 填充完成提示 */}
      <CompletionNotice
        showCompletionNotice={showCompletionNotice}
        setShowCompletionNotice={setShowCompletionNotice}
        calculateFillTime={calculateFillTime}
      />

      {/* 项目类型变更确认对话框 */}
      <Dialog open={showTypeChangeDialog} onOpenChange={setShowTypeChangeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>确认更改项目类型</DialogTitle>
            <DialogDescription>
              您确定要将项目类型从"{formData.项目类型}"更改为"{pendingProjectType}"吗？
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              不同项目类型可能需要填写不同的字段信息。更改项目类型可能会导致部分已填写的信息需要重新调整。
            </p>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={cancelProjectTypeChange}>
              取消
            </Button>
            <Button onClick={confirmProjectTypeChange}>确认更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

