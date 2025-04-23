"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  code: z.string().min(1, "级别编号不能为空"),
  name: z.string().min(1, "级别名称不能为空"),
  paperType: z.string().min(1, "请选择论文类型"),
  description: z.string().optional(),
  status: z.string().default("启用"),
})

export type BasicInfoFormValues = z.infer<typeof formSchema>

interface BasicInfoFormProps {
  data: any
  onUpdate: (data: BasicInfoFormValues) => void
  validationErrors?: Record<string, boolean>
}

export default function BasicInfoForm({
  data,
  onUpdate,
  validationErrors = {},
}: BasicInfoFormProps) {
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: data?.code || "",
      name: data?.name || "",
      paperType: data?.paperType || "",
      description: data?.description || "",
      status: data?.status || "启用",
    },
    mode: "onChange",
  })

  const { formState } = form
  
  useEffect(() => {
    // 当表单状态变化时，通知父组件
    if (formState.isDirty) {
      onUpdate(form.getValues())
    }
  }, [formState.isDirty, form, onUpdate])

  function handleSubmit(data: BasicInfoFormValues) {
    onUpdate(data)
  }

  // 论文类型选项
  const paperTypeOptions = [
    { value: "科技论文", label: "科技论文" },
    { value: "社科论文", label: "社科论文" },
    { value: "工程技术论文", label: "工程技术论文" },
    { value: "通用论文", label: "通用论文" },
    { value: "其他", label: "其他" },
  ]

  // 状态选项
  const statusOptions = [
    { value: "启用", label: "启用" },
    { value: "停用", label: "停用" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>级别编号 <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="请输入级别编号（如T1、C1等）" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>级别名称 <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="请输入级别名称" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paperType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>论文类型 <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择论文类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paperTypeOptions.map((option) => (
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((option) => (
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="请输入级别描述（选填）"
                  className="resize-none h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
} 