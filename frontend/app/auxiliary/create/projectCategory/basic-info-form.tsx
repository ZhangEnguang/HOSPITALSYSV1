"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// 表单校验规则
const basicInfoSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  code: z.string().min(1, "编码不能为空"),
  level: z.string().min(1, "请选择级别"),
  category: z.string().min(1, "请选择分类"),
  isEnabled: z.boolean().default(true),
  remarks: z.string().optional(),
})

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>

// 级别选项
const LEVEL_OPTIONS = [
  { value: "1", label: "一级" },
  { value: "2", label: "二级" },
  { value: "3", label: "三级" },
]

// 分类选项
const CATEGORY_OPTIONS = [
  { value: "1", label: "纵向科研项目" },
  { value: "2", label: "横向科研项目" },
  { value: "3", label: "教学项目" },
  { value: "4", label: "其它项目" },
]

interface BasicInfoFormProps {
  defaultValues?: Partial<BasicInfoFormValues>
  onSubmit: (values: BasicInfoFormValues) => void
}

export function BasicInfoForm({ defaultValues, onSubmit }: BasicInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      code: "",
      level: "",
      category: "",
      isEnabled: true,
      remarks: "",
      ...defaultValues,
    },
  })

  const handleSubmit = async (values: BasicInfoFormValues) => {
    setIsLoading(true)
    try {
      await onSubmit(values)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入项目分类名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">编码</FormLabel>
                <FormControl>
                  <Input placeholder="请输入项目分类编码" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">级别</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择级别" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEVEL_OPTIONS.map((option) => (
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">分类</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择分类" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
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
            name="isEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base">启用状态</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">备注</FormLabel>
              <FormControl>
                <Input placeholder="请输入备注信息（选填）" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "提交中..." : "下一步"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 