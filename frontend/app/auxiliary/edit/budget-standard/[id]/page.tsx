"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { post, get, put } from "@/lib/api"
import type { ApiResponse } from "@/lib/api"

// 复用从创建页面导入的组件
import { StepNavigation, STEPS } from "../../../create/budget-standard/components/step-navigation"
import BasicInfoForm from "../../../create/budget-standard/components/basic-info-form"
import BudgetItemsForm from "../../../create/budget-standard/components/budget-items-form"
import CompletionStep from "../../../create/budget-standard/components/completion-step"
import { BudgetStandardFormData } from "../../../create/budget-standard/components/basic-info-form"
import { BudgetItem } from "../../../create/budget-standard/components/budget-items-form"

// 在这里定义API基础URL
const API_BASE_URL = "/api/project/budgetStandard";

export default function EditBudgetStandardPage({ params }: { params: { id: string } }) {
  // 组件挂载状态追踪
  const isMountedRef = useRef(true);
  
  // 基本状态管理
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<{
    basicInfo: Partial<BudgetStandardFormData>,
    budgetItems: {
      budgetItems: BudgetItem[]
    }
  }>({
    basicInfo: {},
    budgetItems: {
      budgetItems: []
    }
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [dataNotFound, setDataNotFound] = useState(false) // 新增状态跟踪数据是否找到

  const router = useRouter()
  const { toast } = useToast()
  const { id } = params
  
  // 组件卸载时清理
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // 初始化数据
  useEffect(() => {
    if (initialized) return;
    
    const fetchBudgetStandard = async () => {
      try {
        console.log("开始获取预算标准数据，ID:", id);
        if (!isMountedRef.current) return;
        setIsLoading(true);
        
        try {
          // 发起真实API请求获取预算标准
          const response = await get<ApiResponse<any>>(`${API_BASE_URL}/detail/${id}`);
          
          if (!isMountedRef.current) return;
          
          if (response && response.code === 200 && response.data) {
            console.log("成功获取到预算标准数据:", response.data);
            
            // 格式化数据以匹配表单结构
            setFormData({
              basicInfo: {
                name: response.data.name,
                code: response.data.code,
                projectType: response.data.projectType,
                limitAmount: response.data.limitAmount?.toString(),
                description: response.data.description
              },
              budgetItems: {
                budgetItems: (response.data.budgetSubjects || []).map((item: any) => ({
                  id: item.id || `item-${Date.now()}-${Math.random()}`,
                  name: item.name,
                  code: item.code,
                  description: item.description,
                  adjustmentLimit: item.adjustmentLimit,
                  category: item.category || "直接费用",
                  limitAmount: item.limitAmount || "",
                  limitPercent: item.limitPercent || "",
                  isRequired: item.isRequired || false,
                  parentId: item.parentId || null
                }))
              }
            });
            
            // 标记所有步骤为已完成
            setCompletedSteps([0, 1]);
            setInitialized(true);
          } else {
            console.log("未找到预算标准数据或返回错误:", response);
            setDataNotFound(true);
            
            toast({
              title: "数据获取失败",
              description: response?.message || "未找到指定的预算标准",
              variant: "destructive",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("API请求失败:", error);
          setDataNotFound(true);
          
          toast({
            title: "数据获取失败",
            description: "请求API出错，请检查网络连接",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("获取预算标准数据失败:", error);
          toast({
            title: "数据获取失败",
            description: "无法加载预算标准数据，请稍后重试",
            variant: "destructive",
            duration: 3000,
          });
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchBudgetStandard();
  }, [id, toast, initialized]);
  
  // 处理数据未找到的情况，放在单独的useEffect中处理
  useEffect(() => {
    if (dataNotFound && !isLoading) {
      // 确保用户有足够时间看到toast提示
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          console.log("跳转回列表页面...");
          router.push("/auxiliary?tab=budgetStandard");
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [dataNotFound, isLoading, router]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
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

  const handleSaveDraft = async () => {
    try {
      // 创建要提交的数据对象
      const budgetStandard = {
        id,
        ...formData.basicInfo,
        status: "草稿",
        budgetItems: formData.budgetItems.budgetItems.map(item => ({
          id: item.id,
          name: item.name,
          code: item.code,
          description: item.description,
          adjustmentLimit: item.adjustmentLimit || "0",
          parentId: item.parentId || null,
          category: item.category || "",
          limitAmount: item.limitAmount || "",
          limitPercent: item.limitPercent || "",
          isRequired: item.isRequired || false
        }))
      };

      // 发送真实API请求
      const response = await put<ApiResponse<any>>(`${API_BASE_URL}/detail/${id}`, budgetStandard);
      
      if (response.code === 200) {
        toast({
          title: "暂存成功",
          description: "预算标准已保存为草稿",
          duration: 3000,
        });
        
        // 使用Next.js的路由导航，避免页面刷新
        setTimeout(() => {
          if (isMountedRef.current) {
            router.push("/auxiliary?tab=budgetStandard");
          }
        }, 1000);
      } else {
        toast({
          title: "保存失败",
          description: response.message || "请检查填写信息",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("保存草稿失败:", error);
      toast({
        title: "保存失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleComplete = async () => {
    try {
      // 创建要提交的数据对象
      const budgetStandard = {
        id,
        ...formData.basicInfo,
        status: "启用",
        budgetItems: formData.budgetItems.budgetItems.map(item => ({
          id: item.id,
          name: item.name,
          code: item.code,
          description: item.description,
          adjustmentLimit: item.adjustmentLimit || "0",
          parentId: item.parentId || null,
          category: item.category || "",
          limitAmount: item.limitAmount || "",
          limitPercent: item.limitPercent || "",
          isRequired: item.isRequired || false
        }))
      };
      
      // 发送真实API请求
      const response = await put<ApiResponse<any>>(`${API_BASE_URL}/${id}`, budgetStandard);
      
      if (response.code === 200) {
        setShowSuccessDialog(true);
      } else {
        toast({
          title: "提交失败",
          description: response.message || "请检查填写信息",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("提交预算标准失败:", error);
      toast({
        title: "提交失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleContinueEdit = () => {
    // 关闭成功对话框
    setShowSuccessDialog(false)
  }

  const handleReturnToList = () => {
    // 使用Next.js的路由导航，避免页面刷新
    router.push("/auxiliary?tab=budgetStandard");
  }

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
            newData.budgetItems = data
            break
          default:
            break
        }
        return newData
      })
    }
  }

  const getStepData = (step: number) => {
    switch (step) {
      case 0:
        return formData.basicInfo
      case 1:
        return formData.budgetItems
      default:
        return {}
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { name, code, projectType, limitAmount } = formData.basicInfo
      
      if (!name) errors["名称"] = true
      if (!code) errors["编码"] = true
      if (!projectType) errors["项目类型"] = true
      if (!limitAmount) errors["限额"] = true
    } 
    else if (currentStep === 1) {
      // 验证预算科目
      const { budgetItems } = formData.budgetItems
      
      if (!budgetItems || budgetItems.length === 0) {
        errors["预算科目"] = true
      } else {
        // 验证每个预算项
        let hasInvalidItem = false
        budgetItems.forEach((item) => {
          if (!item.name || !item.code) {
            hasInvalidItem = true
          }
        })
        if (hasInvalidItem) {
          errors["预算科目"] = true
        }
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤的下一步
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm 
            data={formData.basicInfo} 
            onUpdate={(data) => updateFormData(0, data)} 
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <BudgetItemsForm 
            data={formData.budgetItems} 
            onUpdate={(data) => updateFormData(1, data)} 
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <CompletionStep formData={formData} />
        )
      default:
        return null
    }
  }

  // 如果正在加载数据，显示加载状态
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-muted-foreground">正在加载预算标准数据...</p>
        </div>
      </div>
    )
  }
  
  // 如果数据未找到，显示加载失败状态
  if (dataNotFound) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <p className="text-lg font-medium mb-2">未找到预算标准数据</p>
          <p className="text-muted-foreground mb-4">无法加载ID为 {id} 的预算标准</p>
          <Button onClick={() => router.push("/auxiliary?tab=budgetStandard")}>
            返回列表
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/auxiliary?tab=budgetStandard" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">编辑预算标准</h1>
      </div>

      <div className="mx-8 mb-6">
        <StepNavigation 
          currentStep={currentStep} 
          goToStep={goToStep} 
          completedSteps={completedSteps} 
          validationErrors={validationErrors}
        />
      </div>

      <motion.div 
        className="mx-8 mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
      >
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
            <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存草稿
            </Button>
            <div className="space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
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
      </motion.div>

      {/* 成功提交对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>预算标准更新成功</DialogTitle>
            <DialogDescription>
              预算标准已成功更新并保存。您可以继续编辑或返回列表。
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="secondary" onClick={handleContinueEdit}>
              继续编辑
            </Button>
            <Button variant="default" onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 