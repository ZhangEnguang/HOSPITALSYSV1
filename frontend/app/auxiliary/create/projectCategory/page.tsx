"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { StepNavigation, STEPS } from "./components/step-navigation"
import { BasicInfoForm, type FormValues as BasicInfoFormValues } from "./components/basic-info-form"
import { BudgetInfoForm, type BudgetInfoFormValues } from "./components/budget-info-form"
import CompletionStep from "./components/completion-step"
import { get, post, put } from "@/lib/api"

// 创建一个被Suspense包裹的组件
function ProjectCategoryContent() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    basicInfo: {},
    budgetInfo: {},
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // 从URL参数中获取相关参数
  const parentId = searchParams?.get('parentId') || null
  const parentName = searchParams?.get('parentName') || null
  const isEditMode = searchParams?.get('edit') === 'true'
  const categoryId = searchParams?.get('id') || null
  
  // 初始化时检查是否有编辑模式参数
  useEffect(() => {
    if (isEditMode && categoryId) {
      setIsEditing(true)
      loadCategoryData(categoryId)
    } else if (parentId) {
      // 如果是子分类创建（有parentId参数）
      initSubCategoryForm()
    }
  }, [isEditMode, categoryId, parentId])
  
  // 加载项目分类数据
  const loadCategoryData = async (id: string) => {
    setIsLoading(true)
    try {
      // 调用API获取项目分类数据
      console.log("加载项目分类数据，ID:", id);
      const response = await get(`/api/project/projectType/detail/${id}`)
      console.log("获取项目分类详情响应:", response);
      
      if (response && response.code === 200 && response.data) {
        const categoryData = response.data
        
        // 预填充表单数据 - 根据后端字段匹配前端表单
        const basicInfo = {
          name: categoryData.name || "",
          code: categoryData.code || "",
          projectLevel: categoryData.projectLevel || "", // 使用后端的projectLevel字段
          category: categoryData.category || "zxproject", // 使用后端的category字段
          parentId: categoryData.parentId || "",
          isUsed: categoryData.isUsed === true, // 映射isUsed字段为前端enabled
          note: categoryData.note || "", // 将note作为前端的remarks使用
          feeCode: categoryData.feeCode || "",
          eduStatistics: categoryData.eduStatistics || "",
          projectSource: categoryData.projectSource || "",
          paymentSource: categoryData.paymentSource || "",
          budgetControl: categoryData.budgetControl === true,
        }
        
        // 预填充预算信息 - 将后端budgetStandards映射为前端的budgetItems
        const budgetInfo = {
          budgetItems: categoryData.budgetStandards?.map((item: any) => ({
            name: item.standard || "", // 使用standard字段作为名称
            code: item.id?.substring(0, 6) || "", // 使用ID的前6位作为编码
            type: "fixed", // 默认类型
            limitAmount: "0", // 默认金额
            startDate: item.startDate || "",
            endDate: item.endDate || "",
            note: item.note || ""
          })) || [],
        }
        
        console.log("解析后的表单数据:", { basicInfo, budgetInfo });
        
        // 更新表单数据
        setFormData({
          basicInfo,
          budgetInfo,
        })
        
        // 标记步骤已完成
        setCompletedSteps([0])
        
        toast({
          title: "数据加载成功",
          description: "已加载项目分类数据",
        })
      } else {
        handleLoadError(response?.message || "数据格式不正确")
      }
    } catch (error) {
      console.error("加载项目分类数据失败:", error)
      handleLoadError("网络错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }
  
  // 处理加载错误
  const handleLoadError = (message: string) => {
    toast({
      title: "加载数据失败",
      description: message,
      variant: "destructive",
    })
    
    // 返回列表页
    setTimeout(() => {
      router.push("/auxiliary?tab=projectCategory")
    }, 2000)
  }
  
  // 初始化子分类表单
  const initSubCategoryForm = async () => {
    if (!parentId) return;
    
    try {
      setIsLoading(true);
      
      // 获取父分类信息
      const response = await get(`/api/project/projectType/detail/${parentId}`);
      
      if (response && response.code === 200 && response.data) {
        const parentData = response.data;
        
        // 详细输出父分类信息，帮助调试
        console.log("获取到的父分类完整信息:", parentData);
        
        // 确保category值非空
        if (!parentData.category) {
          console.error("父分类的category值为空");
          toast({
            title: "父分类数据不完整",
            description: "无法获取父分类的项目类别信息",
            variant: "destructive",
          });
          
          // 使用默认值
          parentData.category = "zxproject";
        }
        
        // 初始默认值，包括parentId为父分类ID，强制category与父分类一致
        const defaultBasicInfo: Partial<BasicInfoFormValues> = {
          parentId: parentId,
          category: parentData.category, // 使用父分类的类别
          isUsed: true,
          // 其他字段保持默认空值
        };
        
        console.log("子分类初始化设置的表单数据:", defaultBasicInfo);
        
        // 更新表单数据状态
        setFormData(prev => {
          console.log("更新前的表单数据:", prev);
          const newData = {
            ...prev,
            basicInfo: defaultBasicInfo
          };
          console.log("更新后的表单数据:", newData);
          return newData;
        });
        
        // 请求生成编码
        setIsGeneratingCode(true);
        // 异步执行，避免阻塞UI
        setTimeout(() => {
          // 提前尝试生成编码
          generateCategoryCode(parentData.category, parentId);
        }, 100);
      } else {
        console.error("获取父分类数据失败:", response);
        toast({
          title: "获取父分类数据失败",
          description: response?.message || "请稍后重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("初始化子分类表单失败:", error);
      toast({
        title: "初始化子分类表单失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // 生成分类编码
  const generateCategoryCode = async (category: string, parentIdValue: string | null) => {
    if (!category) return;
    
    try {
      setIsGeneratingCode(true);
      
      const apiUrl = `/api/project/projectType/generateCode?category=${category}${parentIdValue ? `&parentId=${parentIdValue}` : ''}`;
      console.log("请求生成分类编码, URL:", apiUrl);
      
      const response = await get(apiUrl);
      
      if (response && response.code === 200 && response.data) {
        console.log("获取到编码:", response.data);
        // 更新表单基本信息中的code字段
        setFormData(prev => ({
          ...prev,
          basicInfo: {
            ...prev.basicInfo,
            code: response.data
          }
        }));
      } else {
        console.error("生成编码失败:", response);
        toast({
          title: "生成编码失败",
          description: response?.message || "请稍后重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("生成编码请求异常:", error);
      toast({
        title: "生成编码失败",
        description: "请求服务器出现异常",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCode(false);
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // 打印当前表单数据，帮助调试
      console.log("点击下一步，当前表单数据:", formData);
      
      // 验证当前步骤
      if (validateCurrentStep()) {
        // 标记当前步骤为已完成
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep])
        }
        setCurrentStep(currentStep + 1)
      } else {
        // 显示验证错误提示
        toast({
          title: "表单验证失败",
          description: "请填写所有必填项",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    console.log("保存草稿", formData)
    // 实现保存草稿逻辑
    toast({
      title: "暂存成功",
      description: "项目分类已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/auxiliary?tab=projectCategory")
    }, 1000)
  }

  const handleComplete = () => {
    console.log("点击完成按钮，准备提交项目分类数据", formData)
    
    try {
      // 验证当前步骤
      if (!validateCurrentStep()) {
        console.log("完成步骤验证失败")
        // 显示验证错误提示
        toast({
          title: "表单验证失败",
          description: "请检查所有必填项",
          variant: "destructive",
          duration: 3000,
        })
        return;
      }
      
      console.log("完成步骤验证通过，准备提交数据")
      
      // 实现提交逻辑
      if (isEditing && categoryId) {
        // 更新现有分类
        console.log("编辑模式，更新现有分类:", categoryId)
        updateProjectCategory(categoryId as string, formData)
      } else {
        // 创建新分类
        console.log("创建模式，创建新分类")
        createProjectCategory(formData)
      }
    } catch (error) {
      console.error("处理完成按钮点击事件时出错:", error)
      toast({
        title: "操作失败",
        description: "处理提交请求时发生错误",
        variant: "destructive",
      })
    }
  }

  const handleContinueAdd = () => {
    // 重置表单数据和步骤
    setFormData({
      basicInfo: {},
      budgetInfo: {},
    })
    setCurrentStep(0)
    setCompletedSteps([])
    setShowSuccessDialog(false)
    setValidationErrors({})
  }

  const handleReturnToList = () => {
    router.push("/auxiliary?tab=projectCategory")
  }

  const handleBasicInfoSubmit = (data: BasicInfoFormValues) => {
    console.log("主页面接收到BasicInfoForm提交的数据:", data);
    try {
      setFormData(prev => {
        const newData = {
          ...prev,
          basicInfo: data
        };
        console.log("更新formData后的状态:", newData);
        return newData;
      });
      
      // 检查预算管控是否勾选
      if (!data.budgetControl) {
        console.log("预算管控未勾选，直接跳转到完成页面");
        // 如果未勾选预算管控，跳过预算信息步骤，直接进入完成步骤
        if (!completedSteps.includes(0)) {
          setCompletedSteps(prev => [...prev, 0]);
        }
        setCurrentStep(2); // 直接设置为完成步骤
      } else {
        // 预算管控已勾选，正常进入下一步（预算信息步骤）
        console.log("预算管控已勾选，正常进入预算信息页面");
        if (!completedSteps.includes(0)) {
          setCompletedSteps(prev => [...prev, 0]);
        }
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("处理基本信息提交时出错:", error);
      toast({
        title: "操作失败",
        description: "处理表单数据时发生错误",
        variant: "destructive",
      });
    }
  };

  const handleBudgetInfoSubmit = (data: BudgetInfoFormValues) => {
    console.log("预算信息提交数据:", data);
    try {
      setFormData(prev => ({
        ...prev,
        budgetInfo: data
      }));
      // 调用handleNext函数
      handleNext();
    } catch (error) {
      console.error("处理预算信息提交时出错:", error);
      toast({
        title: "操作失败",
        description: "处理表单数据时发生错误",
        variant: "destructive",
      });
    }
  };

  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { name, code, projectLevel, category } = formData.basicInfo as any
      
      console.log("验证表单数据:", {
        name,
        code,
        projectLevel,
        category,
        完整数据: formData.basicInfo
      })
      
      if (!name) errors["名称"] = true
      if (!code) errors["编码"] = true
      if (!projectLevel) errors["项目级别"] = true
      if (!category) errors["项目类别"] = true
    } 
    else if (currentStep === 1) {
      // 验证预算信息 - 只有在预算管控开启时才验证
      const { budgetControl } = formData.basicInfo as any
      
      if (budgetControl) {
        const { budgetItems } = formData.budgetInfo as any
        if (!budgetItems || budgetItems.length === 0) {
          errors["预算项"] = true
        }
      } else {
        // 预算管控未开启，无需验证预算信息
        console.log("预算管控未开启，不验证预算信息");
        return true;
      }
    }
    else if (currentStep === 2) {
      // 完成步骤不需要额外验证，直接返回true
      console.log("完成步骤验证通过");
      return true;
    }

    setValidationErrors(errors)
    console.log("验证错误:", errors)
    return Object.keys(errors).length === 0
  }

  const goToStep = (step: number) => {
    if (step < currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm
            initialData={formData.basicInfo as Partial<BasicInfoFormValues>}
            onUpdate={(data) => updateFormData(0, data)}
            isLoading={isLoading}
            isGeneratingCode={isGeneratingCode}
            parentName={parentName || undefined}
            parentId={parentId || undefined}
            isCreatingChild={!!parentId}
            validationErrors={validationErrors}
          />
        );
      case 1:
        return (
          <BudgetInfoForm 
            initialData={formData.budgetInfo as BudgetInfoFormValues}
            onUpdate={(data) => updateFormData(1, data)}
            validationErrors={validationErrors}
          />
        );
      case 2:
        return (
          <CompletionStep 
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  // 创建项目分类 - 转换前端数据到后端格式
  const createProjectCategory = async (data: any) => {
    try {
      // 准备提交数据，将前端字段映射到后端字段
      const submitData = {
        name: data.basicInfo.name,
        code: data.basicInfo.code,
        category: data.basicInfo.category,
        projectLevel: data.basicInfo.projectLevel,
        parentId: data.basicInfo.parentId || null,
        isUsed: data.basicInfo.isUsed,
        note: data.basicInfo.note,
        feeCode: data.basicInfo.feeCode || "",
        eduStatistics: data.basicInfo.eduStatistics || "",
        projectSource: data.basicInfo.projectSource || "",
        paymentSource: data.basicInfo.paymentSource || "",
        budgetControl: data.basicInfo.budgetControl,
        // 预算标准
        budgetStandards: data.budgetInfo.budgetItems?.map((item: any) => ({
          standard: item.name, // 映射name到standard
          startDate: item.startDate || "",
          endDate: item.endDate || "",
          note: item.note || "",
        })) || []
      };

      console.log("准备提交的数据:", submitData);
      
      // 调用API创建项目分类
      const response = await post('/api/project/projectType/add', submitData)
      console.log("API响应:", response);
      
      if (response && response.code === 200) {
        setShowSuccessDialog(true);
        toast({
          title: "创建成功",
          description: "项目分类已成功创建"
        });
      } else {
        toast({
          title: "创建失败",
          description: response?.message || "服务器错误，请稍后重试",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("创建项目分类失败:", error);
      toast({
        title: "创建失败",
        description: "发生未知错误，请稍后重试",
        variant: "destructive"
      });
    }
  }
  
  // 更新项目分类 - 转换前端数据到后端格式
  const updateProjectCategory = async (id: string, data: any) => {
    try {
      // 准备提交数据，将前端字段映射到后端字段
      const submitData = {
        id,
        name: data.basicInfo.name,
        code: data.basicInfo.code,
        category: data.basicInfo.category,
        projectLevel: data.basicInfo.projectLevel,
        parentId: data.basicInfo.parentId || null,
        isUsed: data.basicInfo.isUsed,
        note: data.basicInfo.note,
        feeCode: data.basicInfo.feeCode || "",
        eduStatistics: data.basicInfo.eduStatistics || "",
        projectSource: data.basicInfo.projectSource || "",
        paymentSource: data.basicInfo.paymentSource || "",
        budgetControl: data.basicInfo.budgetControl,
        // 预算标准
        budgetStandards: data.budgetInfo.budgetItems?.map((item: any) => ({
          standard: item.name, // 映射name到standard
          startDate: item.startDate || "",
          endDate: item.endDate || "",
          note: item.note || "",
        })) || []
      };

      console.log("准备更新的数据:", submitData);
      
      // 调用API更新项目分类
      const response = await put('/api/project/projectType/update', submitData)
      console.log("API响应:", response);
      
      if (response && response.code === 200) {
        setShowSuccessDialog(true);
        toast({
          title: "更新成功",
          description: "项目分类已成功更新"
        });
      } else {
        toast({
          title: "更新失败",
          description: response?.message || "服务器错误，请稍后重试",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("更新项目分类失败:", error);
      toast({
        title: "更新失败",
        description: "发生未知错误，请稍后重试",
        variant: "destructive"
      });
    }
  };

  // 添加updateFormData函数
  const updateFormData = (step: number, data: any) => {
    // 防止无限循环，只在数据真正变化时更新
    const currentStepData = getStepData(step)
    if (JSON.stringify(currentStepData) !== JSON.stringify(data)) {
      setFormData((prev) => {
        const newData = { ...prev }
        switch (step) {
          case 0:
            newData.basicInfo = data
            break
          case 1:
            newData.budgetInfo = data
            break
          default:
            break
        }
        return newData
      })
    }
  }

  // 添加getStepData函数
  const getStepData = (step: number) => {
    switch (step) {
      case 0:
        return formData.basicInfo
      case 1:
        return formData.budgetInfo
      default:
        return {}
    }
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.push("/auxiliary?tab=projectCategory")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-4">
          {isEditing ? "编辑项目分类" : parentId ? `创建子分类${parentName ? ` - ${parentName}` : ''}` : "新建项目分类"}
        </h1>
      </div>

      <div className="mx-8 mb-6">
        <StepNavigation
          currentStep={currentStep}
          goToStep={goToStep}
          validationErrors={validationErrors}
          completedSteps={completedSteps}
        />
      </div>

      <div className="mx-8 mb-6">
        <Card className="border-muted/50 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md mb-4">
              <div className="text-primary">
                <InfoIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{STEPS[currentStep].name}</h3>
            </div>
            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft} 
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              保存草稿
            </Button>
            <div className="space-x-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  下一步
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>
                  完成
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* 成功对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>操作成功</DialogTitle>
            <DialogDescription>
              项目分类已{isEditing ? "更新" : "创建"}成功。
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="secondary" onClick={handleContinueAdd}>
              {isEditing ? "继续编辑" : "继续创建"}
            </Button>
            <Button variant="default" onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 主页面组件，使用Suspense包裹ProjectCategoryContent
export default function CreateProjectCategoryPage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center">加载中...</div>}>
      <ProjectCategoryContent />
    </Suspense>
  )
}