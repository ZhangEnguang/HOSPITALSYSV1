"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// 表单校验架构
export const basicInfoSchema = z.object({
  name: z.string().min(2, { message: "用章类型名称至少需要2个字符" }),
  code: z.string().min(2, { message: "类型代码至少需要2个字符" }),
  category: z.string().min(1, { message: "请选择业务分类" }),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
})

// 导出表单值类型
export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>

// 表单属性类型
interface BasicInfoFormProps {
  data?: Partial<BasicInfoFormValues>
  onUpdate?: (data: BasicInfoFormValues) => void
}

export default function BasicInfoForm({
  data = {},
  onUpdate,
}: BasicInfoFormProps) {
  // 业务分类选项
  const categories = [
    { value: "contract", label: "合同类" },
    { value: "finance", label: "财务类" },
    { value: "official", label: "公文类" },
    { value: "certificate", label: "证明类" },
    { value: "other", label: "其他" },
  ]

  // 表单默认值
  const defaultValues: Partial<BasicInfoFormValues> = {
    name: "",
    code: "",
    category: "",
    description: "",
    status: "active",
    ...data,
  }

  // 初始化表单
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues,
  })

  // 监听表单值变化并更新父组件
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (onUpdate) {
        onUpdate(value as BasicInfoFormValues)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, onUpdate])

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用章类型名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入用章类型名称" {...field} />
                </FormControl>
                <FormDescription>
                  输入一个清晰的用章类型名称
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>类型代码</FormLabel>
                <FormControl>
                  <Input placeholder="请输入类型代码" {...field} />
                </FormControl>
                <FormDescription>
                  输入一个唯一的类型代码，用于系统识别
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>业务分类</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择业务分类" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  选择该用章类型所属的业务分类
                </FormDescription>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="inactive">禁用</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  设置该用章类型的状态
                </FormDescription>
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
                  placeholder="请输入用章类型的详细描述"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                对该用章类型的详细描述和使用场景说明
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
} 