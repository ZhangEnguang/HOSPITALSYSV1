"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InfoIcon, Save, ArrowLeft, CheckCircle } from "lucide-react"
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

import BasicInfoForm from "./components/basic-info-form"

export default function CreateReviewWorksheetPage() {
  const [formData, setFormData] = useState({
    basicInfo: {},
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSaveDraft = () => {
    console.log("保存草稿", formData)
    // 实现保存草稿逻辑
    toast({
      title: "暂存成功",
      description: "评审工作表已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/auxiliary?tab=reviewWorksheet")
    }, 1000)
  }

  const handleComplete = () => {
    // 验证表单
    if (validateForm()) {
      console.log("提交评审工作表", formData)
      // 实现提交逻辑
      setShowSuccessDialog(true)
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

  const handleContinueAdd = () => {
    // 重置表单数据
    setFormData({
      basicInfo: {},
    })
    setShowSuccessDialog(false)
    setValidationErrors({})
  }

  const handleReturnToList = () => {
    router.push("/auxiliary?tab=reviewWorksheet")
  }

  const updateFormData = (data: any) => {
    // 防止无限循环，只在数据真正变化时更新
    if (JSON.stringify(formData.basicInfo) !== JSON.stringify(data)) {
      setFormData((prev) => ({
        ...prev,
        basicInfo: data
      }))
    }
  }

  // 验证表单
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // 验证基本信息
    const { name, code, projectType, type } = formData.basicInfo as any
    
    if (!name) errors["名称"] = "请输入评审方案名称"
    if (!projectType) errors["项目类型"] = "请选择项目类型"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/auxiliary?tab=reviewWorksheet" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">新增评审方案</h1>
      </div>

      <motion.div 
        className="mx-8 mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
      >
        <Card className="border-muted/50 overflow-hidden">
          <CardContent className="pt-6">
  
            <BasicInfoForm 
              data={formData.basicInfo} 
              onUpdate={updateFormData} 
              validationErrors={validationErrors}
            />
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存草稿
            </Button>
            <div className="space-x-2">
              <Button onClick={handleComplete}>
                提交
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* 提交成功弹框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              提交成功
            </DialogTitle>
            <DialogDescription>
              评审方案已成功创建，您可以继续添加新的评审方案或返回列表查看。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="outline" onClick={handleContinueAdd}>
              继续添加
            </Button>
            <Button onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 