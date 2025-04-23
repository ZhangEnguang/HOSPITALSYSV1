"use client"

import { useEffect, useImperativeHandle, forwardRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, InfoIcon, PaperclipIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// 定义基本信息表单验证模式
const basicInfoSchema = z.object({
  评审计划名称: z.string().min(2, {
    message: "评审计划名称至少需要2个字符",
  }),
  评审开始日期: z.date({
    required_error: "请选择评审开始日期",
  }),
  评审结束日期: z.date({
    required_error: "请选择评审结束日期",
  }),
  评审指南: z.string().optional(),
  备注: z.string().optional(),
}).refine(data => {
  // 确保结束日期在开始日期之后
  if (data.评审开始日期 && data.评审结束日期) {
    return data.评审结束日期 >= data.评审开始日期
  }
  return true
}, {
  message: "结束日期必须在开始日期之后",
  path: ["评审结束日期"]
})

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>

interface BatchBasicInfoStepProps {
  formData: any
  updateFormData: (data: any) => void
  onValidationChange: (errors: Record<string, string>) => void
  onStepComplete: () => void
}

export interface BatchBasicInfoStepRef {
  submit: () => Promise<boolean>;
}

export const BatchBasicInfoStep = forwardRef<BatchBasicInfoStepRef, BatchBasicInfoStepProps>(
  function BatchBasicInfoStep({
    formData,
    updateFormData,
    onValidationChange,
    onStepComplete,
  }, ref) {
    // 初始化表单
    const form = useForm<BasicInfoFormValues>({
      resolver: zodResolver(basicInfoSchema),
      defaultValues: {
        评审计划名称: formData.评审计划名称 || "",
        评审开始日期: formData.评审开始日期 ? new Date(formData.评审开始日期) : undefined,
        评审结束日期: formData.评审结束日期 ? new Date(formData.评审结束日期) : undefined,
        评审指南: formData.评审指南 || "",
        备注: formData.备注 || "",
      },
    })

    const [selectedFileName, setSelectedFileName] = useState<string>("");

    // 暴露submit方法给父组件
    useImperativeHandle(ref, () => ({
      async submit() {
        const valid = await form.trigger();
        if (valid) {
          const data = form.getValues();
          updateFormData({
            ...formData,
            ...data,
          });
        }
        return valid;
      }
    }));

    // 在表单验证状态变化时通知父组件
    useEffect(() => {
      const subscription = form.watch(() => {
        onValidationChange(form.formState.errors as Record<string, string>)
      })
      return () => subscription.unsubscribe()
    }, [form, onValidationChange])

    // 表单提交处理
    function onSubmit(data: BasicInfoFormValues) {
      updateFormData({
        ...formData,
        ...data,
      })
      onStepComplete()
    }

    // 文件处理
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFileName(file.name);
        form.setValue("评审指南", file.name);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <div className="text-blue-500">
            <InfoIcon className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">评审基本信息</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
              <FormField
                control={form.control}
                name="评审计划名称"
                render={({ field }) => (
                  <div className="md:col-span-2 space-y-2">
                    <FormItem>
                      <FormLabel className="flex items-center">
                        评审计划名称
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="请输入评审计划名称" {...field} />
                      </FormControl>
                      <FormDescription>
                        给本次评审指定一个明确的名称
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />

              <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="评审开始日期"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-2">
                      <FormLabel className="flex items-center">
                        评审开始日期
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd", { locale: zhCN })
                              ) : (
                                <span>选择开始日期</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={zhCN}
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="评审结束日期"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-2">
                      <FormLabel className="flex items-center">
                        评审结束日期
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd", { locale: zhCN })
                              ) : (
                                <span>选择结束日期</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={zhCN}
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues("评审开始日期")
                              return startDate ? date < startDate : date < new Date(new Date().setHours(0, 0, 0, 0))
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="评审指南"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 space-y-2">
                    <FormLabel>评审指南</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <Label htmlFor="reviewGuideAttachment" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50">
                              <Upload className="h-4 w-4" />
                              <span>上传文档</span>
                            </div>
                            <input 
                              id="reviewGuideAttachment" 
                              type="file" 
                              className="hidden" 
                              onChange={handleFileChange} 
                            />
                          </Label>
                          <span className="text-sm text-muted-foreground">支持上传PDF、Word等文档格式</span>
                        </div>
                        {selectedFileName && (
                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                            <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedFileName}</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="备注"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 space-y-2">
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="请输入备注信息"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      其他需要说明的事项
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    )
  }
) 