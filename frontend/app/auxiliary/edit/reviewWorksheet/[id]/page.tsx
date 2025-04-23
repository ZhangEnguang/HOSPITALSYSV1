"use client"

import { useState, useEffect } from "react"
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

import BasicInfoForm from "../../../create/reviewWorksheet/components/basic-info-form"

// 导入演示数据
import { allReviewWorksheets } from "../../../data/auxiliary-demo-data"

export default function EditReviewWorksheetPage({ params }: { params: { id: string } }) {
  const worksheetId = params.id;
  
  const [formData, setFormData] = useState({
    basicInfo: {},
  })
  const [initialFormData, setInitialFormData] = useState({
    basicInfo: {},
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  // 获取评审方案数据
  useEffect(() => {
    // 在实际开发中，这里应该是从API获取数据
    // 模拟API请求延迟
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 从演示数据中获取评审方案信息
        const worksheet = allReviewWorksheets.find(w => w.id === worksheetId)
        
        if (!worksheet) {
          toast({
            title: "未找到评审方案",
            description: "无法找到指定的评审方案",
            variant: "destructive",
            duration: 3000,
          })
          router.push("/auxiliary?tab=reviewWorksheet")
          return
        }
        
        // 模拟完整的评审方案数据
        const worksheetData = {
          basicInfo: {
            name: worksheet.name,
            code: worksheet.code,
            projectType: worksheet.projectType,
            type: "indicatorScoring", // 默认为指标评分制
            description: worksheet.description || "",
            businessScope: "",  // 由于demo data中不存在businessScope，使用空字符串
            requireComments: true,
            isEnabled: worksheet.status === "active",
            indicators: [
              {
                id: "indicator-1",
                name: "技术方案",
                weight: 30,
                subIndicators: [
                  { id: "sub-1-1", name: "技术创新性", score: 10 },
                  { id: "sub-1-2", name: "技术可行性", score: 10 }
                ]
              },
              {
                id: "indicator-2",
                name: "项目可行性",
                weight: 30,
                subIndicators: [
                  { id: "sub-2-1", name: "市场前景", score: 10 }
                ]
              },
              {
                id: "indicator-3",
                name: "团队能力",
                weight: 40,
                subIndicators: [
                  { id: "sub-3-1", name: "团队经验", score: 10 },
                  { id: "sub-3-2", name: "团队结构", score: 10 }
                ]
              }
            ],
            minPassingScore: 60
          }
        }
        
        // 设置初始表单数据
        setFormData(worksheetData)
        setInitialFormData(worksheetData)
      } catch (error) {
        console.error("获取评审方案数据出错:", error)
        toast({
          title: "数据加载失败",
          description: "无法加载评审方案数据，请重试",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [worksheetId, router, toast])

  const handleSaveDraft = () => {
    console.log("保存草稿", formData)
    // 实现保存草稿逻辑
    toast({
      title: "暂存成功",
      description: "评审方案已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/auxiliary?tab=reviewWorksheet")
    }, 1000)
  }

  const handleComplete = () => {
    // 验证表单
    if (validateForm()) {
      console.log("更新评审方案", formData)
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

  const handleContinueEdit = () => {
    // 关闭成功对话框
    setShowSuccessDialog(false)
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
    const { name, projectType } = formData.basicInfo as any
    
    if (!name) errors["名称"] = "请输入评审方案名称"
    if (!projectType) errors["项目类型"] = "请选择项目类型"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  if (isLoading) {
    return (
      <div className="w-full py-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">正在加载评审方案数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/auxiliary?tab=reviewWorksheet" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">编辑评审方案</h1>
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
                保存更新
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* 成功对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              更新成功
            </DialogTitle>
            <DialogDescription>
              评审方案已成功更新。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="outline" onClick={handleContinueEdit}>
              继续编辑
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