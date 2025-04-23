"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Steps } from "../../../../../components/steps"
import { Card, CardContent } from "@/components/ui/card"

// 引入各个步骤组件
import { StepBasicInfo } from "./form-steps/step-basic-info"
import { StepAuthorInfo } from "./form-steps/step-author-info"
import { StepEvaluationInfo } from "./form-steps/step-evaluation-info"
import { StepDocuments } from "./form-steps/step-documents"
import { StepCompletion } from "./form-steps/step-completion"

const formSchema = z.object({
  // 基本信息
  title: z.string().min(1, "成果标题不能为空"),
  type: z.string().min(1, "成果类型不能为空"),
  evaluationOrg: z.string().min(1, "鉴定单位不能为空"),
  evaluationDate: z.string().min(1, "鉴定日期不能为空"),
  certificateNo: z.string().min(1, "证书编号不能为空"),
  level: z.string().min(1, "鉴定级别不能为空"),
  category: z.string().min(1, "学科类别不能为空"),
  projectSource: z.string().optional(),
  
  // 完成人信息
  firstCompleter: z.string().min(1, "第一完成人不能为空"),
  secondCompleter: z.string().optional(),
  otherCompleters: z.string().optional(),
  contribution: z.string().min(1, "贡献说明不能为空"),
  rankingConfirmed: z.boolean(),
  
  // 鉴定信息
  summary: z.string().min(1, "鉴定简介不能为空"),
  expertNames: z.string().min(1, "专家姓名不能为空"),
  expertTitles: z.string().min(1, "专家职称不能为空"),
  expertUnits: z.string().min(1, "专家单位不能为空"),
  isPassed: z.string().min(1, "是否通过不能为空"),
  
  // 文档信息
  files: z.array(z.any()).optional()
})

export type EvaluatedAchievementsFormValues = z.infer<typeof formSchema>

type EvaluatedAchievementsFormProps = {
  initialData: any
  mode: "create" | "edit"
}

export function EvaluatedAchievementsForm({
  initialData,
  mode
}: EvaluatedAchievementsFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const form = useForm<EvaluatedAchievementsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData
    } : {
      title: "",
      type: "",
      evaluationOrg: "",
      evaluationDate: "",
      certificateNo: "",
      level: "",
      category: "",
      projectSource: "",
      firstCompleter: "",
      secondCompleter: "",
      otherCompleters: "",
      contribution: "",
      rankingConfirmed: false,
      summary: "",
      expertNames: "",
      expertTitles: "",
      expertUnits: "",
      isPassed: "",
      files: []
    }
  })
  
  const steps = [
    { id: 1, name: "基本信息" },
    { id: 2, name: "完成人信息" },
    { id: 3, name: "鉴定信息" },
    { id: 4, name: "文档上传" },
    { id: 5, name: "确认提交" }
  ]
  
  const nextStep = async () => {
    const fields = getFieldsForStep(step)

    const isValid = await form.trigger(fields as any)
    
    if (isValid) {
      setStep((prev) => prev + 1)
    }
  }
  
  const prevStep = () => {
    setStep((prev) => prev - 1)
  }
  
  async function onSubmit(values: EvaluatedAchievementsFormValues) {
    try {
      setLoading(true)
      
      // 在实际项目中应该在这里提交到服务器
      console.log("提交的数据:", values)
      
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      if (mode === "create") {
        toast.success("鉴定成果创建成功")
        router.push("/achievements/evaluated-achievements")
      } else {
        toast.success("鉴定成果更新成功")
        router.push("/achievements/evaluated-achievements")
      }
    } catch (error) {
      console.error(error)
      toast.error("操作失败，请重试")
    } finally {
      setLoading(false)
    }
  }
  
  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["title", "type", "evaluationOrg", "evaluationDate", "certificateNo", "level", "category", "projectSource"]
      case 2:
        return ["firstCompleter", "secondCompleter", "otherCompleters", "contribution", "rankingConfirmed"]
      case 3:
        return ["summary", "expertNames", "expertTitles", "expertUnits", "isPassed"]
      case 4:
        return ["files"]
      default:
        return []
    }
  }
  
  return (
    <div className="space-y-6">
      <Steps steps={steps} currentStep={step} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="p-6">
              {step === 1 && <StepBasicInfo form={form} />}
              {step === 2 && <StepAuthorInfo form={form} />}
              {step === 3 && <StepEvaluationInfo form={form} />}
              {step === 4 && <StepDocuments form={form} />}
              {step === 5 && <StepCompletion formData={form.getValues()} />}
              
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  上一步
                </Button>
                
                {step !== steps.length ? (
                  <Button type="button" onClick={nextStep}>
                    下一步
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading ? "提交中..." : mode === "create" ? "创建鉴定成果" : "更新鉴定成果"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
