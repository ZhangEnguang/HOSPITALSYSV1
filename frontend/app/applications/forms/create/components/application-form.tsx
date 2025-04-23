import React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

import { applicationSchema, defaultValues } from "../config/form-config"
import { CompletionNotice } from "./completion-notice"

// 添加表单验证schema
const formSchema = z.object({
  title: z.string().min(2, "标题至少需要2个字符").max(100, "标题不能超过100个字符"),
  batch: z.string({ required_error: "请选择申报批次" }),
  category: z.string({ required_error: "请选择申报类别" }),
  description: z.string().min(10, "描述至少需要10个字符").max(500, "描述不能超过500个字符"),
  
  // 申请人信息
  applicantName: z.string().min(2, "姓名至少需要2个字符"),
  department: z.string().min(2, "部门名称至少需要2个字符"),
  phone: z
    .string()
    .min(11, "请输入有效的电话号码")
    .regex(/^1[3-9]\d{9}$/, "请输入有效的手机号码"),
  email: z.string().email("请输入有效的电子邮件地址"),
  
  // 项目信息
  projectName: z.string().min(2, "项目名称至少需要2个字符").max(100, "项目名称不能超过100个字符"),
  budget: z
    .string()
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "预算必须是大于0的数字",
    }),
  startDate: z.date({ required_error: "请选择开始日期" }),
  endDate: z
    .date({ required_error: "请选择结束日期" })
    .refine(date => date > new Date(), {
      message: "结束日期必须晚于今天",
    }),
  
  // 附加信息
  additionalInfo: z.string().max(1000, "附加信息不能超过1000个字符").optional(),
})

// 批次选项
const batchOptions = [
  { label: "2024年第一批", value: "2024-1" },
  { label: "2024年第二批", value: "2024-2" },
  { label: "2024年第三批", value: "2024-3" },
]

// 类别选项
const categoryOptions = [
  { label: "科研项目", value: "research" },
  { label: "教学项目", value: "teaching" },
  { label: "基础设施", value: "infrastructure" },
  { label: "其他项目", value: "others" },
]

export function ApplicationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isCompleted, setIsCompleted] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      batch: "",
      category: "",
      description: "",
      applicantName: "",
      department: "",
      phone: "",
      email: "",
      projectName: "",
      budget: "",
      additionalInfo: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // 这里可以添加API调用来提交表单数据
      console.log("表单提交数据:", values)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 显示完成通知
      setIsCompleted(true)
    } catch (error) {
      console.error("提交失败:", error)
      toast({
        variant: "destructive",
        title: "提交失败",
        description: "申报提交过程中出现错误，请稍后重试。",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCompleted) {
    return <CompletionNotice />
  }

  return (
    <div className="mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">申报表单</h3>
          <p className="text-sm text-muted-foreground">
            请填写以下表单完成项目申报，带 * 的字段为必填项
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">基本信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>申报标题 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入申报标题" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>申报批次 *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择申报批次" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {batchOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>申报类别 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择申报类别" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>申报描述 *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="请简要描述申报项目的主要内容和目标"
                        className="min-h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 申请人信息 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">申请人信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="applicantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>申请人姓名 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入申请人姓名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>所在部门 *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择所在部门" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cs">计算机科学系</SelectItem>
                          <SelectItem value="math">数学系</SelectItem>
                          <SelectItem value="physics">物理系</SelectItem>
                          <SelectItem value="chemistry">化学系</SelectItem>
                          <SelectItem value="biology">生物系</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>联系电话 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入联系电话" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>电子邮箱 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入电子邮箱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 项目信息 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">项目信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>项目名称 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入项目名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>项目预算 (元) *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入项目预算" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>开始日期 *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: zhCN })
                              ) : (
                                <span>请选择日期</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>结束日期 *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: zhCN })
                              ) : (
                                <span>请选择日期</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues("startDate")
                              return startDate && date < startDate
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
            </div>

            {/* 附加信息 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">附加信息</h4>
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>其他补充说明</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="如有其他需要说明的内容，请在此补充"
                        className="min-h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>非必填项，可以提供其他相关信息</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "提交中..." : "提交申报"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 