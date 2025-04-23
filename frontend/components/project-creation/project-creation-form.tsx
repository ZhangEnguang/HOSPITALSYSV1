"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Save, Edit } from "lucide-react"
import { StepNavigation, STEPS } from "../../app/projects/create/vertical/components/step-navigation"
import { StepInfo as VerticalStepInfo } from "../../app/projects/create/vertical/components/form-steps/step-info"
import { StepInfo as HorizontalStepInfo } from "../../app/projects/create/horizontal/components/form-steps/step-info"
import { StepMembers as VerticalStepMembers } from "../../app/projects/create/vertical/components/form-steps/step-members"
import { StepMembers as HorizontalStepMembers } from "../../app/projects/create/horizontal/components/form-steps/step-members"
import { StepBudget as VerticalStepBudget } from "../../app/projects/create/vertical/components/form-steps/step-budget"
import { StepBudget as HorizontalStepBudget } from "../../app/projects/create/horizontal/components/form-steps/step-budget"
import { StepDocuments } from "../../app/projects/create/vertical/components/form-steps/step-documents"
import { StepDocuments as HorizontalStepDocuments } from "../../app/projects/create/horizontal/components/form-steps/step-documents"
import { StepComplete as VerticalStepComplete } from "../../app/projects/create/vertical/components/form-steps/step-complete"
import { StepComplete as HorizontalStepComplete } from "../../app/projects/create/horizontal/components/form-steps/step-complete"
import { CompletionNotice } from "../../app/projects/create/vertical/components/completion-notice"
import { SuccessView } from "../../app/projects/create/vertical/components/success-view"
import { AIAnalysisPanel } from "../../app/projects/create/vertical/components/ai-analysis-panel"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  createHorizontalProject,
  updateHorizontalProject,
  submitHorizontalProject,
  mapFormDataToHorizontalProject
} from "@/lib/api/horizontal-project"
import { ApiResponse } from "@/lib/api"
import { Dict } from "../dict"

export interface ProjectFormData {
  批准号: string
  项目名称: string
  所属单位: string
  项目分类: string
  项目级别: string
  经费来源: string
  项目状态: string
  开始日期: string
  结束日期: string
  项目负责人: string
  职称: string
  联系电话: string
  电子邮箱: string
  身份证号: string
  项目经办人: string
  经办人电话: string
  团队成员: string[]
  预算金额: string
  项目类型: string
  [key: string]: any // Allow for additional fields specific to project types
}

export interface ProjectCreationFormProps {
  projectType: string
  mockAnalysisResult?: Record<string, any>
  additionalFields?: string[]
  localStorageKey?: string
  redirectPath?: string
  showAIPanel?: boolean
  defaultPanelCollapsed?: boolean
  isEditMode?: boolean
}

export function ProjectCreationForm({
  projectType = "纵向",
  mockAnalysisResult,
  additionalFields = [],
  localStorageKey = "projectFormData",
  redirectPath = "/projects",
  showAIPanel = true,
  defaultPanelCollapsed = false,
  isEditMode = false,
}: ProjectCreationFormProps) {
  const router = useRouter()
  const titleInputRef = useRef<HTMLInputElement>(null)
  const documentsRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Initialize form data based on project type
  const getInitialFormData = (): ProjectFormData => {
    // 如果是编辑模式且有mockAnalysisResult，直接使用它
    if (isEditMode && mockAnalysisResult) {
      console.log('ProjectCreationForm - 编辑模式，使用提供的数据:', mockAnalysisResult);
      return mockAnalysisResult as ProjectFormData;
    }
    
    const baseFormData: ProjectFormData = {
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
      团队成员: [""], // 初始化为包含一个空字符串的数组
      预算金额: "",
      项目类型: projectType,
    }

    // Add additional fields for specific project types
    if (projectType === "horizontal") {
      return {
        ...baseFormData,
        合作企业: "",
        合同编号: "",
        知识产权归属: "",
        保密等级: "",
      }
    }

    return baseFormData
  }

  const [formData, setFormData] = useState<ProjectFormData>(getInitialFormData())
  const [analysisResult, setAnalysisResult] = useState<Record<string, any>>(mockAnalysisResult || {})
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
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(defaultPanelCollapsed)
  const [userEditedFields, setUserEditedFields] = useState<string[]>([])
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isReuploading, setIsReuploading] = useState(false)
  const [showTypeChangeDialog, setShowTypeChangeDialog] = useState(false)
  const [pendingProjectType, setPendingProjectType] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Load analysis result based on project type
  useEffect(() => {
    let storageKey = "analysisResult"
    if (projectType === "horizontal") {
      storageKey = "horizontalAnalysisResult"
    } else if (projectType === "校级") {
      storageKey = "schoolAnalysisResult"
    }

    // 1. 优先使用传入的mockAnalysisResult
    if (mockAnalysisResult && Object.keys(mockAnalysisResult).length > 0) {
      console.log("使用传入的mockAnalysisResult填充表单:", mockAnalysisResult);
      setAnalysisResult(mockAnalysisResult);

      // 将分析结果同步到表单数据
      setFormData(prevData => {
        const newData = { ...prevData };

        // 遍历分析结果，填充到表单
        Object.entries(mockAnalysisResult).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            newData[key] = value;
          }
        });

        return newData;
      });
    }
    // 2. 否则尝试从localStorage读取
    else {
      const storedResult = localStorage.getItem(storageKey)
      if (storedResult) {
        const result = JSON.parse(storedResult)
        setAnalysisResult(result)

        if (result.项目类型) {
          setFormData((prev) => ({
            ...prev,
            项目类型: result.项目类型,
          }))
        }
      }
    }

    // Set up auto-save
    const interval = setInterval(
      () => {
        handleSaveDraft(true)
      },
      10 * 60 * 1000, // 10 minutes
    )

    setAutoSaveInterval(interval)

    // Set CSS variable for AI analysis panel positioning
    document.documentElement.style.setProperty("--header-height", "104px")

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [projectType, mockAnalysisResult])

  // Add large screen adaptation
  useEffect(() => {
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

    // Update container class
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

    // Initial update
    updateContainerClass()

    // Listen for window resize
    window.addEventListener("resize", updateContainerClass)

    return () => {
      document.head.removeChild(styleEl)
      window.removeEventListener("resize", updateContainerClass)
    }
  }, [isPanelCollapsed])

  // Auto-focus title input when editing
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [editingTitle])

  // Form validation
  const validateForm = (step: number) => {
    const errors: Record<string, boolean> = {}

    // Validate step 1 (basic info)
    if (step === 0) {
      if (!formData.项目名称) errors.项目名称 = true
      if (!formData.所属单位) errors.所属单位 = true
      if (!formData.项目分类) errors.项目分类 = true
      if (!formData.项目级别) errors.项目级别 = true
      if (!formData.项目负责人) errors.项目负责人 = true
      if (!formData.开始日期) errors.开始日期 = true
      if (!formData.结束日期) errors.结束日期 = true

      // Additional validation for horizontal projects
      if (projectType === "horizontal") {
        // if (!formData.合作企业) errors.合作企业 = true
        // if (!formData.合同编号) errors.合同编号 = true
      }
    }

    // Validate step 2 (team members)
    if (step === 1) {
      if (projectType === "horizontal") {
        // 横向项目团队成员验证（对象数组格式）
        const hasValidMember = formData.团队成员.some((member: any) => 
          typeof member === 'object' && member !== null && member.name && member.name.trim() !== ""
        );
        if (!hasValidMember) {
          errors.团队成员 = true;
        }
      } else {
        // 纵向项目团队成员验证（字符串数组格式）
        const hasValidMember = formData.团队成员.some((member: string) => 
          member && member.trim() !== ""
        );
        if (!hasValidMember) {
          errors.团队成员 = true;
        }
      }
    }

    // Validate step 3 (budget)
    if (step === 2) {
      if (!formData.预算金额) errors.预算金额 = true
    }

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      // Only show toast for horizontal projects (as per original code)
      if (projectType === "horizontal") {
        toast({
          title: "表单验证失败",
          description: "请填写所有必填项（标有*的字段）",
          variant: "destructive",
        })
      }
      return false
    }

    // If validation passes, add current step to completed steps
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step])
    }

    return true
  }

  const handleInputChange = (field: string, value: any) => {
    if (field === 'budgets') {
      // 修复：编辑过程中不要过滤掉不完整的预算项
      // 允许用户先选择分类，后面再填写金额
      const formattedBudgets = value.map((budget: any) => ({
        category: budget.category || '',
        amount: parseFloat(budget.amount) || 0,
        description: budget.description || ''
      }));

      // 更新表单数据，包括预算明细和总预算
      setFormData((prev) => ({
        ...prev,
        budgets: formattedBudgets,
        预算金额: formattedBudgets.reduce((total: number, budget: any) => 
          total + (parseFloat(budget.amount) || 0), 0).toString()
      }));
      console.log("更新预算项:", formattedBudgets);
    } else if (field === '团队成员') {
      // 特殊处理团队成员数据 - 修复：不要过滤掉空字符串，因为添加新成员时就是空字符串
      // 只在提交表单时才过滤
      const members = Array.isArray(value) ? value : [];
      console.log("更新团队成员:", members);
      
      setFormData((prev) => ({
        ...prev,
        团队成员: members
      }));
    } else {
      // 处理其他字段
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Handle submit - 修改提交函数，对接后端API
  const handleSubmit = async () => {
    // 验证必填字段
    const requiredFields = ["项目名称", "所属单位", "项目负责人", "开始日期", "结束日期"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      toast({
        title: "请完成必填字段",
        description: `以下字段为必填: ${missingFields.join(", ")}`
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 提交前处理表单数据
      const submittingData = {
        ...formData,
        // 过滤掉空的团队成员
        团队成员: formData.团队成员 ? formData.团队成员.filter((member: any) => {
          // 如果是字符串类型
          if (typeof member === 'string') {
            return member && member.trim() !== '';
          }
          // 如果是对象类型，检查name属性
          return member && member.name && typeof member.name === 'string' && member.name.trim() !== '';
        }) : [],
        // 过滤掉不完整的预算项
        budgets: formData.budgets ? formData.budgets.filter((budget: any) => budget.category && budget.amount) : []
      };
      console.log("提交前处理团队成员:", submittingData.团队成员);
      console.log("提交前处理预算项:", submittingData.budgets);
      
      // 将表单数据映射为API所需的格式
      const projectData = mapFormDataToHorizontalProject(submittingData)
      let response: ApiResponse<string>;

      console.log("提交项目 - 当前表单数据:", submittingData);
      
      // 根据是否有ID决定是创建新项目还是更新已有项目
      if (formData.id) {
        console.log("更新已有项目ID:", formData.id);
        response = await updateHorizontalProject(formData.id, projectData);
        
        // 更新成功后，标记项目状态为已提交
        if (response.code === 200) {
          // 调用提交API
          const submitResponse = await submitHorizontalProject({
            ...projectData,
            id: formData.id
          });
          
          if (submitResponse.code === 200) {
            toast({
              title: "项目提交成功",
              description: "项目已成功提交"
            });
          } else {
            throw new Error(submitResponse.message || "提交失败");
          }
        } else {
          throw new Error(response.message || "更新失败");
        }
      } else {
        // 创建并提交新项目
        console.log("创建新项目");
        response = await createHorizontalProject(projectData);
        
        if (response.code === 200) {
          // 保存创建返回的ID
          const projectId = response.data;
          
          if (projectId) {
            // 更新表单数据中的ID
            setFormData(prev => ({
              ...prev,
              id: projectId
            }));
            
            // 提交刚创建的项目
            const submitResponse = await submitHorizontalProject({
              ...projectData,
              id: projectId
            });
            
            if (submitResponse.code === 200) {
              toast({
                title: "项目提交成功",
                description: "项目已成功创建并提交"
              });
            } else {
              throw new Error(submitResponse.message || "提交失败");
            }
          } else {
            throw new Error("创建成功但未返回项目ID");
          }
        } else {
          throw new Error(response.message || "创建失败");
        }
      }

      // 清除本地存储的草稿
      localStorage.removeItem(localStorageKey);

      // 设置完成状态
      setIsCompleted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "提交失败",
        description: error instanceof Error ? error.message : "请稍后重试或联系管理员",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save draft functionality - 修改保存草稿功能，返回Promise以表示操作成功或失败
  const handleSaveDraft = async (isAutoSave = false): Promise<boolean> => {
    // 如果已经在保存中，避免重复操作
    if (isSaving) return false;
    
    setIsSaving(true);

    try {
      // 1. 始终保存到本地存储，作为备份
      localStorage.setItem(localStorageKey, JSON.stringify(formData));

      // 2. 保存到服务器
      // 转换数据为API格式
      const projectData = mapFormDataToHorizontalProject(formData);

      // 根据是否有ID决定创建还是更新
      let response: ApiResponse<string>;
      if (formData.id) {
        // 更新已有项目
        console.log('更新项目:', formData.id);
        response = await updateHorizontalProject(formData.id, projectData);
      } else {
        // 创建新项目
        console.log('创建新项目');
        response = await createHorizontalProject(projectData);
        
        // 保存返回的ID
        if (response.code === 200 && response.data) {
          console.log('获取新ID:', response.data);
          setFormData(prev => ({
            ...prev,
            id: response.data
          }));
          
          // 同时更新本地存储
          localStorage.setItem(localStorageKey, JSON.stringify({
            ...formData,
            id: response.data
          }));
        }
      }

      // 保存成功
      if (response && response.code === 200) {
        // 提示保存成功不再需要，由调用方负责
        setLastSaved(new Date());
        return true; // 表示保存成功
      } else {
        // 保存失败，显示错误
        if (!isAutoSave) {
          toast({
            title: "保存失败",
            description: response?.message || "无法保存到服务器",
            variant: "destructive",
            duration: 3000,
          });
        }
        return false; // 表示保存失败
      }
    } catch (error) {
      console.error("保存到服务器失败:", error);
      
      // 仅在非自动保存时显示错误提示
      if (!isAutoSave) {
        toast({
          title: "保存失败",
          description: "无法保存到服务器，已保存到本地",
          variant: "destructive",
          duration: 3000,
        });
      }
      return false; // 表示保存失败
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate fill time (seconds)
  const calculateFillTime = () => {
    if (fillStartTime && fillEndTime) {
      return ((fillEndTime - fillStartTime) / 1000).toFixed(2)
    }
    return "0.00"
  }

  // Step navigation functions
  const goToNextStep = async () => {
    if (currentStep < STEPS.length - 1) {
      // 如果当前是文档步骤且是横向项目，需要验证文档上传
      if (currentStep === 3 && projectType === "horizontal" && documentsRef.current) {
        console.log("验证文档上传...", documentsRef.current);
        // 调用文档组件的validate方法
        try {
          const validationResult = documentsRef.current.validate();
          console.log("文档验证结果:", validationResult);
          
          if (!validationResult.valid) {
            // 显示验证错误
            toast({
              title: "文档验证失败",
              description: validationResult.message,
              variant: "destructive"
            });
            return;
          }
        } catch (error) {
          console.error("文档验证出错:", error);
          toast({
            title: "文档验证错误",
            description: "验证文档时出现问题",
            variant: "destructive"
          });
          return;
        }
      }
      
      // 验证当前步骤
      if (validateForm(currentStep)) {
        try {
          // 显示保存中状态
          setIsSaving(true);
          
          // 先保存数据，等待保存完成
          const projectData = mapFormDataToHorizontalProject(formData);
          
          // 根据是否有ID决定创建还是更新
          let response: ApiResponse<string>;
          if (formData.id) {
            // 更新已有项目
            response = await updateHorizontalProject(formData.id, projectData);
          } else {
            // 创建新项目
            response = await createHorizontalProject(projectData);
            
            // 保存返回的ID
            if (response.code === 200 && response.data) {
              setFormData(prev => ({
                ...prev,
                id: response.data
              }));
              
              // 同时更新本地存储
              localStorage.setItem(localStorageKey, JSON.stringify({
                ...formData,
                id: response.data
              }));
            }
          }
          
          // 保存成功后才进入下一步
          if (response && response.code === 200) {
            setLastSaved(new Date());
            setCurrentStep((prev) => prev + 1);
          } else {
            // 保存失败提示
            toast({
              title: "保存失败",
              description: response?.message || "无法保存数据，请稍后再试",
              variant: "destructive",
              duration: 3000,
            });
          }
        } catch (error) {
          // 保存失败提示
          console.error("保存数据失败:", error);
          toast({
            title: "保存失败",
            description: error instanceof Error ? error.message : "无法保存数据，请稍后再试",
            variant: "destructive", 
            duration: 3000,
          });
        } finally {
          setIsSaving(false);
        }
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
      // If moving forward, validate current step
      if (stepIndex > currentStep) {
        if (validateForm(currentStep)) {
          setCurrentStep(stepIndex)
        }
      } else {
        setCurrentStep(stepIndex)
      }
    }
  }

  // Get project type info
  const getProjectTypeInfo = (type: string) => {
    switch (type) {
      case "horizontal":
        return { color: "bg-primary", textColor: "text-primary", description: "企业合作项目" }
      case "vertical":
        return { color: "bg-primary", textColor: "text-primary", description: "政府资助项目" }
      case "schoolLevel":
        return { color: "bg-primary", textColor: "text-primary", description: "校内立项项目" }
      default:
        return { color: "bg-gray-500", textColor: "text-gray-600", description: "未知类型" }
    }
  }

  // AI analysis result related functions
  const handleFillField = (field: string) => {
    setFillingField(field)

    // Set form data
    setFormData((prev) => ({
      ...prev,
      [field]: analysisResult[field] || "",
    }))

    // Add to filled fields list
    setTimeout(() => {
      setFilledFields((prev) => [...prev, field])
      setFillingField(null)

      // Clear validation errors for this field
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
    // Record start time
    const startTime = Date.now()
    setFillStartTime(startTime)

    // Fill all fields in sequence with animation
    const fields = Object.keys(analysisResult)
    let index = 0

    const fillNextField = () => {
      if (index < fields.length) {
        const field = fields[index]
        setFillingField(field)

        // Set form data
        setFormData((prev) => ({
          ...prev,
          [field]: analysisResult[field] || "",
        }))

        // Add to filled fields list
        setTimeout(() => {
          setFilledFields((prev) => [...prev, field])
          setFillingField(null)
          index++
          setTimeout(fillNextField, 80) // Delay between fields
        }, 120) // Fill animation duration
      } else {
        // All fields filled, record end time
        const endTime = Date.now()
        setFillEndTime(endTime)

        // Clear validation errors
        setValidationErrors({})
      }
    }

    fillNextField()
  }

  // Handle user edit
  const handleUserEdit = (field: string) => {
    // Remove from filled fields
    setFilledFields((prev) => prev.filter((f) => f !== field))
    // Add to user edited fields
    setUserEditedFields((prev) => [...prev, field])
  }

  // Refill field
  const handleRefill = (field: string) => {
    setFillingField(field)

    // Set form data
    setFormData((prev) => ({
      ...prev,
      [field]: analysisResult[field] || "",
    }))

    // Add to filled fields, remove from user edited
    setTimeout(() => {
      setFilledFields((prev) => [...prev, field])
      setUserEditedFields((prev) => prev.filter((f) => f !== field))
      setFillingField(null)

      // Clear validation errors
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }, 500)
  }

  // Handle project type change
  const handleProjectTypeChange = (type: string) => {
    // If type hasn't changed, no need to confirm
    if (formData.项目类型 === type) return

    // Set pending type and show confirmation dialog
    setPendingProjectType(type)
    setShowTypeChangeDialog(true)
  }

  // Confirm project type change
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

      // Close dialog and clear pending type
      setShowTypeChangeDialog(false)
      setPendingProjectType(null)
    }
  }

  // Cancel project type change
  const cancelProjectTypeChange = () => {
    setShowTypeChangeDialog(false)
    setPendingProjectType(null)
  }

  // Handle reupload
  const handleReupload = () => {
    setIsReuploading(true)

    toast({
      title: "准备重新上传",
      description: "正在跳转到文件上传页面...",
      duration: 2000,
    })

    // Delay redirect for visual feedback
    setTimeout(() => {
      router.push("/projects/create/vertical")
    }, 1000)
  }

  // 为不同项目类型创建路由映射
  const getProjectCreateRoute = (type: string) => {
    switch (type) {
      case "horizontal":
        return "/projects/create/horizontal";
      case "vertical":
        return "/projects/create/vertical";
      case "schoolLevel":
        return "/projects/create/school";
      default:
        return "/projects/create/vertical"; // 默认回到纵向项目
    }
  };

  // 添加重置表单的函数
  const resetForm = () => {
    // 清除本地存储
    localStorage.removeItem(localStorageKey);
    
    // 重置所有状态
    setFormData(getInitialFormData());
    setFilledFields([]);
    setUserEditedFields([]);
    setCompletedSteps([]);
    setValidationErrors({});
    setCurrentStep(0);
    setLastSaved(null);
    
    // 如果保存了分析结果，也需要清除
    if (projectType === "horizontal") {
      localStorage.removeItem("horizontalAnalysisResult");
    } else if (projectType === "校级") {
      localStorage.removeItem("schoolAnalysisResult");
    } else {
      localStorage.removeItem("analysisResult");
    }
  };

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

  // Get current step name
  const currentStepName = STEPS[currentStep]?.name || "项目信息"

  // Get project type info
  const projectTypeInfo = getProjectTypeInfo(formData.项目类型)

  // Get project period
  const getProjectPeriod = () => {
    if (formData.开始日期 && formData.结束日期) {
      return `${formData.开始日期.split("-")[0]}~${formData.结束日期.split("-")[0]}`
    }
    return "未设置周期"
  }

  const getTitle = () => {
    let projectType = '未分类';
    let time = '未设置周期';
    let status = '未设置状态';
    
    if (formData.项目分类) {
      projectType = formData.项目分类;
    }
    if (formData.项目状态) {
      status = formData.项目状态;
    }
    if (formData.开始日期 && formData.结束日期) {
      time = `${formData.开始日期}~${formData.结束日期}`;
    }
    
    return (
      <>
        <Dict dictCode="project_type_yf" displayType="text" value={projectType}/>
        {` · ${time} · `}
        <Dict dictCode="project_status" displayType="text" value={status}/>
      </>
    );
  }

  const pageTitle = isEditMode ? "编辑项目" : (
    <>
      创建<Dict dictCode="project_type" displayType="text" value={projectType}/>项目
    </>
  );
  if (isCompleted) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16">
        <div className="flex flex-col items-center justify-center space-y-6 text-center bg-white p-10 rounded-lg shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">提交成功</h2>
          <p className="text-muted-foreground max-w-md">
            您的项目信息已经成功提交，我们将尽快处理您的申请。
          </p>
          <div className="pt-6">
            <Button onClick={() => router.push(redirectPath)} className="mr-4">
              返回项目列表
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCompleted(false);
                // 清除表单数据
                resetForm();
                // 根据当前项目类型跳转到对应的新增页面
                router.push(getProjectCreateRoute(projectType));
              }}
            >
              创建新项目
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full relative transition-all duration-300 form-result-container ${
        isPanelCollapsed || !showAIPanel ? "max-w-[1440px] mx-auto xl:px-4 2xl:px-0" : "pr-[350px]"
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-small-white/[0.2] bg-[length:20px_20px] dark:bg-grid-small-white/[0.05] -z-10" />
      <div className="absolute h-full w-full bg-background/60 backdrop-blur-sm [mask-image:radial-gradient(black,transparent_70%)] -z-10" />

      <div className="flex flex-col">
        <div className="mb-2">
          <div className="flex flex-col mb-3">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="ml-2 flex-1">
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
                    {formData.项目名称 ? formData.项目名称 : pageTitle}
                    <Edit className="ml-2 h-4 w-4 text-muted-foreground opacity-70" />
                  </h1>
                )}

                {/* Subtitle and save history in the same line */}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground">
                    {getTitle()}
                  </p>

                  {/* Save history moved to the right */}
                  <div className="flex items-center gap-2">
                    {lastSaved && (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Save className="h-3 w-3 mr-1" />
                        上次保存: {lastSaved.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Main content area */}
        <div className="flex-1">
          {/* 提交成功显示在预览区域上方 */}
          {isCompleted ? (
            <div className="mb-6">
              <SuccessView 
                onReturn={() => {
                  router.push(redirectPath);
                }}
                onPrint={() => {
                  // 打印项目信息
                  window.print();
                }}
                onSave={() => {
                  // 保存项目信息
                  toast({
                    title: "保存成功",
                    description: "项目信息已保存",
                  });
                }}
              />
            </div>
          ) : null}
          
          {/* Step navigation bar */}
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
                {/* Step content */}
                {currentStep === 0 && (
                  projectType === "horizontal" 
                    ? <HorizontalStepInfo
                        formData={formData}
                        fillingField={fillingField}
                        filledFields={filledFields}
                        handleInputChange={handleInputChange}
                        validationErrors={validationErrors}
                        analysisResult={analysisResult}
                        handleRefill={handleRefill}
                        handleUserEdit={handleUserEdit}
                      />
                    : <VerticalStepInfo
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
                  projectType === "horizontal" 
                  ? <HorizontalStepMembers
                    formData={formData}
                    handleInputChange={handleInputChange}
                    validationErrors={validationErrors}
                  />
                  : <VerticalStepMembers
                    formData={formData}
                    handleInputChange={handleInputChange}
                    validationErrors={validationErrors}
                  />
                )}

                {currentStep === 2 && (
                  projectType === "horizontal" 
                  ? <HorizontalStepBudget
                    formData={formData}
                    handleInputChange={handleInputChange}
                    validationErrors={validationErrors}
                  />
                  : <VerticalStepBudget
                    formData={formData}
                    handleInputChange={handleInputChange}
                    validationErrors={validationErrors}
                  />
                )}

                {currentStep === 3 && (
                  projectType === "horizontal" 
                    ? <HorizontalStepDocuments 
                        ref={documentsRef} 
                        key="horizontalDocs" // 添加key确保组件不会复用
                      />
                    : <StepDocuments />
                )}
                {currentStep === 4 && (
                  projectType === "horizontal" 
                    ? <HorizontalStepComplete formData={formData} onSubmit={handleSubmit} isSubmitted={isCompleted} />
                    : <VerticalStepComplete formData={formData} onSubmit={handleSubmit} isSubmitted={isCompleted} />
                )}
              </CardContent>

              <CardFooter className="flex justify-between border-t border-muted/30 py-4">
                <div className="flex items-center gap-3">
                  {!isCompleted && (
                    <Button variant="outline" onClick={async () => {
                      const result = await handleSaveDraft(false);
                      if (result) {
                        toast({
                          title: "保存成功",
                          description: "项目草稿已保存",
                          duration: 3000,
                        });
                      }
                    }} disabled={isSaving} className="relative">
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
                  )}

                  {lastSaved && !isCompleted && (
                    <span className="text-xs text-muted-foreground">上次保存: {lastSaved.toLocaleTimeString()}</span>
                  )}

                  {isCompleted && (
                    <Button variant="outline" onClick={() => router.push(redirectPath)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      返回项目列表
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isCompleted && (
                    <>
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
                    </>
                  )}
                  
                  {isCompleted && (
                    <Button 
                      onClick={() => {
                        setIsCompleted(false);
                        // 清除表单数据
                        resetForm();
                        // 根据当前项目类型跳转到对应的新增页面
                        router.push(getProjectCreateRoute(projectType));
                      }}
                    >
                      创建新项目
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI analysis panel - only show if enabled */}
      {showAIPanel && (
        <div
          className={`fixed transition-all duration-300 right-0 top-[var(--header-height,104px)] ${
            isPanelCollapsed ? "translate-x-[calc(100%-20px)] hover:translate-x-[calc(100%-40px)]" : ""
          }`}
          style={{ height: "calc(100vh - var(--header-height, 104px))", zIndex: 48 }}
        >
          <AIAnalysisPanel
            mockAnalysisResult={analysisResult}
            filledFields={filledFields}
            handleFillField={handleFillField}
            handleFillAll={handleFillAll}
            isPanelCollapsed={isPanelCollapsed}
            setIsPanelCollapsed={(collapsed) => setIsPanelCollapsed(collapsed)}
            defaultAnalysisMode={projectType === "horizontal"}
          />
        </div>
      )}

      {/* Completion notice */}
      <CompletionNotice
        showCompletionNotice={showCompletionNotice}
        setShowCompletionNotice={setShowCompletionNotice}
        calculateFillTime={calculateFillTime}
      />

      {/* Project type change confirmation dialog */}
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

      {/* 此处不再需要重复的提交成功提示 */}
    </div>
  )
}
