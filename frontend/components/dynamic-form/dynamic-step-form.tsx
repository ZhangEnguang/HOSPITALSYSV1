"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Save, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export interface DynamicStepFormProps {
  // 步骤配置
  steps: Array<{
    id: string;
    name: string;
    component: React.ReactNode | ((props: any) => React.ReactElement);
    validation?: (data: Record<string, any>) => Record<string, string>;
  }>;
  // 表单数据和回调
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onSave?: (data: Record<string, any>) => void;
  // UI配置
  titleConfig: {
    field: string;
    label: string;
    editable?: boolean;
  };
  subtitleFields?: string[];
  // 导航配置
  returnPath: string;
  // 模式和类型
  moduleType: string;
  isEditMode?: boolean;
  // 可选功能
  showAIPanel?: boolean;
  aiPanelComponent?: React.ReactNode;
  localStorageKey?: string;
}

export function DynamicStepForm({
  steps,
  initialData = {},
  onSubmit,
  onSave,
  titleConfig,
  subtitleFields = [],
  returnPath,
  moduleType,
  isEditMode = false,
  showAIPanel = false,
  aiPanelComponent,
  localStorageKey,
}: DynamicStepFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);
  
  // 初始化表单数据
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else if (localStorageKey) {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
        } catch (e) {
          console.error("Error loading saved form data", e);
        }
      }
    }
  }, [initialData, localStorageKey]);
  
  // 表单输入变化处理
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除字段验证错误
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // 步骤导航
  const validateStep = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (step.validation) {
      const errors = step.validation(formData);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return false;
      }
    }
    return true;
  };
  
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        // 标记步骤为已完成
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps(prev => [...prev, currentStep]);
        }
      }
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const goToStep = (index: number) => {
    if (index < currentStep || validateStep(currentStep)) {
      setCurrentStep(index);
    }
  };
  
  // 保存草稿
  const handleSave = async (silent = false) => {
    setIsSaving(true);
    
    if (localStorageKey) {
      localStorage.setItem(localStorageKey, JSON.stringify(formData));
    }
    
    if (onSave) {
      try {
        await onSave(formData);
      } catch (e) {
        console.error("Error saving form data", e);
        if (!silent) {
          toast({
            title: "保存失败",
            description: "无法保存表单数据",
            variant: "destructive"
          });
        }
        setIsSaving(false);
        return;
      }
    }
    
    setLastSaved(new Date());
    setIsSaving(false);
    
    if (!silent) {
      toast({
        title: "已保存",
        description: "表单数据已成功保存",
      });
    }
  };
  
  // 提交表单
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }
    
    try {
      await onSubmit(formData);
      toast({
        title: "提交成功",
        description: `${moduleType}已成功提交`,
      });
      
      // 清除本地存储
      if (localStorageKey) {
        localStorage.removeItem(localStorageKey);
      }
      
      // 跳转回列表页
      setTimeout(() => {
        router.push(returnPath);
      }, 1500);
    } catch (e) {
      console.error("Error submitting form", e);
      toast({
        title: "提交失败",
        description: `无法提交${moduleType}，请稍后再试`,
        variant: "destructive"
      });
    }
  };

  // 标题渲染和编辑
  const renderTitle = () => {
    const titleValue = formData[titleConfig.field] || titleConfig.label;
    
    if (editingTitle && titleConfig.editable !== false) {
      return (
        <div className="flex items-center">
          <Input
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="text-xl font-bold h-9 w-[400px]"
            onBlur={() => {
              setEditingTitle(false);
              if (tempTitle.trim()) {
                handleInputChange(titleConfig.field, tempTitle.trim());
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingTitle(false);
                if (tempTitle.trim()) {
                  handleInputChange(titleConfig.field, tempTitle.trim());
                }
              }
            }}
            autoFocus
          />
        </div>
      );
    }
    
    return (
      <h1
        className={`text-2xl font-bold text-foreground flex items-center ${
          titleConfig.editable !== false ? "cursor-pointer group" : ""
        }`}
        onClick={() => {
          if (titleConfig.editable !== false) {
            setTempTitle(formData[titleConfig.field] || "");
            setEditingTitle(true);
          }
        }}
      >
        {titleValue}
        {titleConfig.editable !== false && (
          <Edit className="ml-2 h-4 w-4 text-muted-foreground opacity-70" />
        )}
      </h1>
    );
  };
  
  // 渲染子标题
  const renderSubtitle = () => {
    if (subtitleFields.length === 0) return null;
    
    return (
      <p className="text-sm text-muted-foreground">
        {subtitleFields.map((field, index) => (
          <React.Fragment key={field}>
            {formData[field] || `未设置${field}`}
            {index < subtitleFields.length - 1 && " · "}
          </React.Fragment>
        ))}
      </p>
    );
  };
  
  // 主渲染
  return (
    <div className={`w-full relative transition-all duration-300 ${
      isPanelCollapsed || !showAIPanel ? "max-w-[1440px] mx-auto xl:px-4 2xl:px-0" : "pr-[350px]"
    }`}>
      <div className="flex flex-col">
        {/* 页面头部 */}
        <div className="mb-2">
          <div className="flex flex-col mb-3">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10">
                <Button variant="ghost" size="icon" onClick={() => router.push(returnPath)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="ml-2 flex-1">
                {renderTitle()}
                <div className="flex justify-between items-center mt-1">
                  {renderSubtitle()}
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
      
      <div className="flex flex-col">
        {/* 步骤导航 */}
        <div className="mb-6">
          <div className="flex space-x-2 border-b pb-2">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={currentStep === index ? "default" : "ghost"}
                size="sm"
                onClick={() => goToStep(index)}
                className={`
                  ${
                    completedSteps.includes(index)
                      ? "text-primary border-primary/30"
                      : ""
                  }
                  ${
                    validationErrors[step.id]
                      ? "border-red-500"
                      : ""
                  }
                `}
              >
                {index + 1}. {step.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* 主内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-muted/50 overflow-hidden">
            <CardContent className="pt-6">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  {currentStep === index && (
                    typeof step.component === 'function' 
                      ? step.component({
                          formData,
                          handleInputChange,
                          validationErrors,
                        })
                      : step.component
                  )}
                </React.Fragment>
              ))}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-muted/30 py-4">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleSave()} 
                  disabled={isSaving}
                  className="relative"
                >
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
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={goToPrevStep} 
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
                
                {currentStep < steps.length - 1 ? (
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
                      提交{moduleType}
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* AI辅助面板(可选) */}
      {showAIPanel && aiPanelComponent && (
        <div className={`fixed top-0 right-0 w-[350px] h-screen border-l bg-background transition-all duration-300 ${
          isPanelCollapsed ? "translate-x-[350px]" : "translate-x-0"
        }`}>
          {aiPanelComponent}
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-4 left-[-2.5rem] bg-background border rounded-l-md" 
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          >
            {isPanelCollapsed ? "<" : ">"}
          </Button>
        </div>
      )}
    </div>
  );
}
