"use client"

import { useEffect, useImperativeHandle, forwardRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, ChevronsUpDown, User, Users, Settings, ClipboardList, ListChecks, GitMerge } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// 模拟数据 - 实际应用中应该从API获取
const reviewTypes = [
  { value: "regular", label: "常规评审" },
  { value: "special", label: "专项评审" },
  { value: "followup", label: "跟踪评审" },
]

const reviewPlans = [
  { 
    value: "plan1", 
    label: "教学评审方案A", 
    description: "适用于教学质量评估，包含教学大纲、教案、课件等评审项目",
    items: ["教学大纲", "教案", "课件", "教学视频"]
  },
  { 
    value: "plan2", 
    label: "科研项目评审方案B", 
    description: "适用于科研项目评估，包含项目申请书、研究方法、预期成果等评审项目",
    items: ["项目申请书", "研究方法", "预期成果", "经费预算"]
  },
  { 
    value: "plan3", 
    label: "课程设计评审方案C", 
    description: "适用于课程设计评估，包含课程目标、教学内容、考核方式等评审项目",
    items: ["课程目标", "教学内容", "考核方式", "教学资源"]
  },
  { 
    value: "plan4", 
    label: "实验指导评审方案D", 
    description: "适用于实验教学评估，包含实验指导书、实验设备、实验报告等评审项目",
    items: ["实验指导书", "实验设备", "实验报告", "安全措施"]
  },
]

const mockReviewers = [
  { value: "user1", label: "张三" },
  { value: "user2", label: "李四" },
  { value: "user3", label: "王五" },
  { value: "user4", label: "赵六" },
  { value: "user5", label: "钱七" },
]

const mockReviewItems = [
  { id: "item1", name: "教学大纲", required: true },
  { id: "item2", name: "教案", required: true },
  { id: "item3", name: "考试试卷", required: false },
  { id: "item4", name: "课件", required: false },
  { id: "item5", name: "实验指导书", required: false },
]

const reviewFlowOptions = [
  { value: "sequential", label: "顺序评审" },
  { value: "parallel", label: "并行评审" },
  { value: "hybrid", label: "混合评审" },
]

// 验证模式
const reviewConfigSchema = z.object({
  // 评审标准配置
  reviewPlan: z.string({
    required_error: "请选择评审方案",
  }),
  
  // 评审规则配置
  reviewType: z.string().optional(),
  reviewerIds: z.array(z.string()).optional(),
  reviewItems: z.array(z.string()).optional(),
  groupReview: z.boolean().optional(),
  
  // 评审流程配置
  reviewFlow: z.string().optional(),
  minReviewers: z.string().optional(),
  isBlindReview: z.boolean().optional(),
  
  // 专家分配配置
  expertAssignMethod: z.string().optional(),
  maxProjectsPerExpert: z.string().optional(),
  expertsPerProject: z.string().optional(),
  
  // 专家回避配置
  avoidCooperators: z.boolean().optional(),
  avoidSameUnit: z.boolean().optional(),
})

export type ReviewConfigFormValues = z.infer<typeof reviewConfigSchema>

interface ReviewConfigStepProps {
  formData: any
  updateFormData: (data: any) => void
  onValidationChange: (errors: Record<string, string>) => void
  onStepComplete: () => void
  onPrevStep: () => void
}

export interface ReviewConfigStepRef {
  submit: () => Promise<boolean>;
}

export const ReviewConfigStep = forwardRef<ReviewConfigStepRef, ReviewConfigStepProps>(
  function ReviewConfigStep({
    formData,
    updateFormData,
    onValidationChange,
    onStepComplete,
    onPrevStep,
  }, ref) {
    // 初始化表单
    const form = useForm<ReviewConfigFormValues>({
      resolver: zodResolver(reviewConfigSchema),
      defaultValues: {
        reviewPlan: formData.reviewPlan || "",
        reviewType: formData.reviewType || "",
        reviewerIds: formData.reviewerIds || [],
        reviewItems: formData.reviewItems || [],
        groupReview: formData.groupReview || false,
        reviewFlow: formData.reviewFlow || "",
        minReviewers: formData.minReviewers || "1",
        isBlindReview: formData.isBlindReview || false,
        
        // 新增字段默认值
        expertAssignMethod: formData.expertAssignMethod || "auto",
        maxProjectsPerExpert: formData.maxProjectsPerExpert || "5",
        expertsPerProject: formData.expertsPerProject || "3",
        avoidCooperators: formData.avoidCooperators || false,
        avoidSameUnit: formData.avoidSameUnit || false,
      },
    })

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
    function onSubmit(data: ReviewConfigFormValues) {
      updateFormData({
        ...formData,
        ...data,
      })
      onStepComplete()
    }

    return (
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 第一区域：评审标准配置 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                <div className="text-blue-500">
                  <ListChecks className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium">评审方案配置</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-md">
                <FormField
                  control={form.control}
                  name="reviewPlan"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormDescription>
                        选择一个预设的评审方案作为评审标准
                      </FormDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviewPlans.map((plan) => (
                          <div key={plan.value} onClick={() => field.onChange(plan.value)}>
                            <FormControl>
                              <div
                                className={cn(
                                  "flex cursor-pointer rounded-lg border border p-4 transition-colors",
                                  field.value === plan.value 
                                    ? "border-primary bg-blue-50" 
                                    : "border-gray-200 hover:bg-muted"
                                )}
                              >
                                <div className="flex w-full items-start space-x-4">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className={cn(
                                      "h-4 w-4 rounded-full border flex items-center justify-center",
                                      field.value === plan.value 
                                        ? "border-primary" 
                                        : "border-gray-300"
                                    )}>
                                      {field.value === plan.value && (
                                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="text-sm font-medium">{plan.label}</div>
                                    <div className="text-sm text-muted-foreground">{plan.description}</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {plan.items.map((item, i) => (
                                        <Badge key={i} variant="outline" className="text-xs py-0 px-1">{item}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </FormControl>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 第二区域：评审规则配置 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                <div className="text-blue-500">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium">评审规则配置</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">           
                <FormField
                  control={form.control}
                  name="isBlindReview"
                  render={({ field }) => (
                    <div className="space-y-2 md:col-span-2">
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0  rounded-md border p-4">
                      <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                      </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>启用盲审模式</FormLabel>
                          <FormDescription>
                            盲审模式下评审人员无法看到被评审对象的身份信息
                          </FormDescription>
                        </div>
                      </FormItem>
                    </div>
                  )}
                />
                
                {/* 专家分配方式 */}
                <div className="md:col-span-2 pt-2">
                  <h4 className="text-sm font-medium mb-2">专家分配设置</h4>
                  <div className="border rounded-md p-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="expertAssignMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>专家指派方式</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择专家指派方式" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="auto">自动分配</SelectItem>
                              <SelectItem value="manual">手动分配</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            选择专家分配给评审项目的方式
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* 仅在自动分配模式下显示的配置项 */}
                    {form.watch("expertAssignMethod") === "auto" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="maxProjectsPerExpert"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>专家评审上限</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    placeholder="每位专家最多评审项目数" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  每位专家最多可评审的项目数量
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="expertsPerProject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>项目专家数</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    placeholder="每个项目分配的专家数" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  每个项目分配的专家人数
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* 专家回避设置 */}
                <div className="md:col-span-2 pt-2">
                  <h4 className="text-sm font-medium mb-2">专家回避设置</h4>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="avoidCooperators"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>排除合作者</FormLabel>
                              <FormDescription>
                                自动排除与被评审对象有合作关系的专家
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="avoidSameUnit"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>排除同单位</FormLabel>
                              <FormDescription>
                                自动排除与被评审对象属于同一单位的专家
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </Form>
      </div>
    )
  }
) 