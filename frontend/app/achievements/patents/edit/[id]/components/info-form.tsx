"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"

// 基本信息表单验证模式
const basicInfoSchema = z.object({
  patentName: z
    .string()
    .min(2, { message: "专利名称至少需要2个字符" })
    .max(100, { message: "专利名称不能超过100个字符" }),
  patentType: z.string().min(1, { message: "请选择专利类型" }),
  applicationNumber: z.string().min(1, { message: "请填写申请号" }),
  applicationDate: z.date({ required_error: "请选择申请日期" }),
  publicationNumber: z.string().optional(),
  publicationDate: z.date().optional(),
  authorUnit: z.string().min(1, { message: "请填写授权单位" }),
  status: z.string().min(1, { message: "请选择专利状态" }),
  description: z.string().optional(),
})

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>

interface InfoFormProps {
  initialData?: BasicInfoFormData
  onSubmit: (data: BasicInfoFormData) => void
}

export function InfoForm({ initialData, onSubmit }: InfoFormProps) {
  // 使用 react-hook-form 和 zod 验证
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData || {
      patentName: "",
      patentType: "",
      applicationNumber: "",
      applicationDate: undefined,
      publicationNumber: "",
      publicationDate: undefined,
      authorUnit: "",
      status: "",
      description: "",
    },
  })

  // 表单提交
  const handleSubmit = (data: BasicInfoFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>专利名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入专利名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>专利类型</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择专利类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="invention">发明专利</SelectItem>
                    <SelectItem value="utility">实用新型专利</SelectItem>
                    <SelectItem value="design">外观设计专利</SelectItem>
                    <SelectItem value="software">软件著作权</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>申请号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入申请号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>申请日期</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="请选择申请日期"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>公开号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入公开号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>公开日期</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="请选择公开日期"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>授权单位</FormLabel>
                <FormControl>
                  <Input placeholder="请输入授权单位" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>专利状态</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择专利状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">申请中</SelectItem>
                    <SelectItem value="published">已公开</SelectItem>
                    <SelectItem value="granted">已授权</SelectItem>
                    <SelectItem value="rejected">已驳回</SelectItem>
                    <SelectItem value="abandoned">已放弃</SelectItem>
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
              <FormLabel>专利描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入专利描述"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            下一步
          </button>
        </div>
      </form>
    </Form>
  )
} 