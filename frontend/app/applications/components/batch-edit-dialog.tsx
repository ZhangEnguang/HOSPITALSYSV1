"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BatchBasicInfoStep } from "../batches/form/form-steps/batch-basic-info"
import { BatchConfigStep } from "../batches/form/form-steps/batch-config-step"
import { BatchMaterialsStep } from "../batches/form/form-steps/batch-materials-step"
import { toast } from "@/hooks/use-toast"
import { Save, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// 示例数据 - 申报批次
const sampleApplicationBatchData = {
  "批次名称": "2025年度第一批校级科研项目申报",
  "批次编号": "XKKY-2025-01",
  "批次类型": "申报批次",
  "项目类型": "校级科研项目",
  "开始日期": "2025-02-01T00:00:00.000Z",
  "结束日期": "2025-03-01T00:00:00.000Z",
  "批次说明": "本批次面向全校教师，采用线上申报方式，申报手续简化。\n\n重点支持人工智能、新能源、新材料等领域的基础研究和应用研究。",
  "每人最大申报数量": "2",
  "项目预算上限": "10",
  "批次状态": "已发布",
  "是否公开": "是",
  "要求_职称要求": true,
  "职称要求": "副高及以上",
  "要求_部门限制": false,
  "申报材料": [
    {
      "id": "1",
      "名称": "申报书",
      "必填": true,
      "说明": "请下载模板填写，并转成PDF格式上传"
    },
    {
      "id": "2",
      "名称": "研究计划书",
      "必填": true,
      "说明": "请下载模板填写，包含研究背景、意义、目标、内容、方法、创新点等"
    },
    {
      "id": "3",
      "名称": "预算申请表",
      "必填": true,
      "说明": "请按照模板要求详细列出各项经费预算"
    },
    {
      "id": "4",
      "名称": "作者简历",
      "必填": false,
      "说明": "请提供项目负责人和主要参与人的简历"
    }
  ]
}

// 示例数据 - 评审批次
const sampleReviewBatchData = {
  "批次名称": "2025年度校级创新创业项目评审",
  "批次编号": "REVIEW-2025-01",
  "批次类型": "评审批次",
  "项目类型": "创新创业项目",
  "开始日期": "2025-04-01T00:00:00.000Z",
  "结束日期": "2025-04-28T00:00:00.000Z",
  "批次说明": "对校内申报的创新创业项目进行评审，包括学生创新项目、创业孵化项目等多个类别。",
  "每人最大评审数量": "5",
  "评审周期(天)": "14",
  "批次状态": "未发布",
  "是否公开": "是",
  "要求_职称要求": true,
  "职称要求": "副高及以上",
  "要求_部门限制": false,
  "评审材料": [
    {
      "id": "1",
      "名称": "评审表",
      "必填": true,
      "说明": "请按照评审要点逐项打分，并提供评审意见"
    },
    {
      "id": "2",
      "名称": "评审总结",
      "必填": true,
      "说明": "请对项目的创新性、可行性、价值等方面进行综合评价"
    }
  ]
}

interface BatchEditDialogProps {
  batch?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (batchData: any) => void
}

export function BatchEditDialog({ batch, open, onOpenChange, onSubmit }: BatchEditDialogProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 当对话框打开或批次数据变化时，初始化表单数据
  useEffect(() => {
    if (open && batch) {
      // 实际项目中应从API获取完整批次数据
      // 这里使用示例数据模拟，根据批次类型选择不同的示例数据
      if (batch.batch === "评审批次") {
        setFormData(sampleReviewBatchData)
      } else {
        setFormData(sampleApplicationBatchData)
      }
    }
  }, [open, batch])

  // 判断是否为评审批次
  const isReviewBatch = formData["批次类型"] === "评审批次" || batch?.batch === "评审批次"
  
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
    }
  }
  
  // 验证表单
  const validateForm = () => {
    let errors: Record<string, string> = {}
    
    // 基本信息验证
    if (!formData["批次名称"]) errors["批次名称"] = "批次名称不能为空"
    if (!formData["批次编号"]) errors["批次编号"] = "批次编号不能为空"
    if (!formData["批次类型"]) errors["批次类型"] = "请选择批次类型"
    if (!formData["项目类型"]) errors["项目类型"] = "请选择项目类型"
    if (!formData["开始日期"]) errors["开始日期"] = "请选择开始日期"
    if (!formData["结束日期"]) errors["结束日期"] = "请选择结束日期"
    
    if (formData["开始日期"] && formData["结束日期"]) {
      const startDate = new Date(formData["开始日期"])
      const endDate = new Date(formData["结束日期"])
      if (endDate < startDate) {
        errors["结束日期"] = "结束日期不能早于开始日期"
      }
    }
    
    // 批次配置验证 - 根据批次类型验证不同字段
    if (isReviewBatch) {
      // 评审批次特有的验证
      if (!formData["每人最大评审数量"]) errors["每人最大评审数量"] = "请设置每人最大评审数量"
      if (!formData["评审周期(天)"]) errors["评审周期(天)"] = "请设置评审周期"
    } else {
      // 申报批次特有的验证
      if (!formData["每人最大申报数量"]) errors["每人最大申报数量"] = "请设置每人最大申报数量"
      if (!formData["项目预算上限"]) errors["项目预算上限"] = "请设置项目预算上限"
    }
    
    if (!formData["批次状态"]) errors["批次状态"] = "请选择批次状态"
    if (!formData["是否公开"]) errors["是否公开"] = "请选择是否公开"
    
    if (formData["要求_职称要求"] && !formData["职称要求"]) {
      errors["职称要求"] = "请选择职称要求"
    }
    
    if (formData["要求_部门限制"] && !formData["部门限制"]) {
      errors["部门限制"] = "请选择部门限制"
    }
    
    // 材料验证 - 根据批次类型验证不同字段
    const materialsFieldName = isReviewBatch ? "评审材料" : "申报材料";
    if (formData[materialsFieldName] && formData[materialsFieldName].length > 0) {
      formData[materialsFieldName].forEach((material: any, index: number) => {
        if (!material.名称) {
          errors[`材料${index + 1}名称`] = "材料名称不能为空"
        }
      })
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  // 处理表单提交
  const handleSubmit = async () => {
    if (!validateForm()) {
      // 显示错误提示
      toast({
        title: "表单验证失败",
        description: "请检查并修正表单中的错误",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 调用提交回调
      if (onSubmit) {
        onSubmit(formData)
      }
      
      // 关闭对话框
      onOpenChange(false)
      
      // 显示成功提示
      toast({
        title: "保存成功",
        description: "批次信息已更新",
      })
    } catch (error) {
      console.error("保存失败", error)
      toast({
        title: "保存失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // 获取材料标签页标题
  const getMaterialsTabTitle = () => {
    return isReviewBatch ? "评审材料" : "申报材料";
  }
  
  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!isSubmitting) {
        onOpenChange(value)
      }
    }}>
      <DialogContent className="max-w-4xl flex flex-col p-0 gap-0 h-[80vh] overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {isReviewBatch ? "编辑评审批次" : "编辑申报批次"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="config">配置信息</TabsTrigger>
                <TabsTrigger value="materials">{getMaterialsTabTitle()}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-6">
          <div className="min-h-[400px]">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="basic" className="mt-4 p-1">
                <BatchBasicInfoStep 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  validationErrors={validationErrors}
                />
              </TabsContent>
              
              <TabsContent value="config" className="mt-4 p-1">
                <BatchConfigStep 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  validationErrors={validationErrors}
                />
              </TabsContent>
              
              <TabsContent value="materials" className="mt-4 p-1">
                <BatchMaterialsStep 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  validationErrors={validationErrors}
                />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        
        <div className="p-6 border-t mt-auto">
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
} 